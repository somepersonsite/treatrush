import "dotenv/config";
import http from "http";
import { URL } from "url";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import crypto from "crypto";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PORT, NOTIFY_SMS_FROM, NOTIFY_WHATSAPP_FROM, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, ORIGIN, ADMIN_API_TOKEN, CAPTCHA_REQUIRED, TURNSTILE_SECRET } = process.env;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { db: { schema: "tr_info" } });

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN || "*");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Admin-Token,X-Captcha-Token");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (ORIGIN && ORIGIN !== "*") res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "600");
}

function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    const MAX = 1024 * 1024;
    req.on("data", (c) => {
      body += c;
      if (body.length > MAX) {
        reject(new Error("payload_too_large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const orderSchema = z.object({
  bundleId: z.string().uuid(),
  customerName: z.string().min(1).max(120).transform((s) => s.trim()),
  phone: z
    .string()
    .min(3)
    .max(20)
    .transform((s) => s.trim())
    .refine((s) => /^\+?\d[\d\s\-()]*$/.test(s), "invalid_phone"),
  address: z.string().min(1),
  areaId: z.string().uuid().optional(),
  deliveryCharge: z.number().min(0).optional(),
});

function normalizePhone(p) {
  const s = String(p || "").trim();
  if (!s) return "";
  const d = s.replace(/\D/g, "");
  if (s.startsWith("+92")) return `+${d}`;
  if (d.startsWith("92")) return `+${d}`;
  if (d.startsWith("0")) return `+92${d.slice(1)}`;
  if (d.length >= 10) return `+92${d.slice(-10)}`;
  return `+${d}`;
}

async function fetchWithTimeout(url, opts = {}, ms = 7000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    const r = await fetch(url, { ...opts, signal: c.signal });
    clearTimeout(t);
    return r;
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

const buckets = new Map();
function rateLimit(key, cap = 5, refillMs = 60000) {
  const now = Date.now();
  const b = buckets.get(key) || { tokens: cap, ts: now };
  const refill = Math.floor((now - b.ts) / refillMs);
  if (refill > 0) {
    b.tokens = Math.min(cap, b.tokens + refill);
    b.ts = now;
  }
  if (b.tokens <= 0) return false;
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}

async function verifyCaptchaDetailed(token, remoteip, maxRetries = 3) {
  if (!CAPTCHA_REQUIRED || CAPTCHA_REQUIRED === "false") return { ok: true };
  if (process.env.NODE_ENV !== "production") console.log("Verifying CAPTCHA. Token:", token, "Remote IP:", remoteip);
  const t = String(token || "").trim();
  if (!t) return { ok: false, reason: "missing_token" };
  if (!TURNSTILE_SECRET) return { ok: true };
  const key = crypto.randomUUID();
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const body = new URLSearchParams({ secret: TURNSTILE_SECRET, response: t, idempotency_key: key });
      if (remoteip) body.append("remoteip", String(remoteip));
      const resp = await fetchWithTimeout("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const data = await resp.json().catch(() => ({}));
      if (process.env.NODE_ENV !== "production") console.log("Cloudflare Turnstile API response:", data);
      if (resp.ok && data && data.success) return { ok: true };
      if (attempt === maxRetries) {
        const reason = (data && (data["error-codes"]?.[0] || data.message)) ? (data["error-codes"]?.[0] || data.message) : "invalid_token";
        return { ok: false, reason };
      }
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
    } catch (e) {
      if (attempt === maxRetries) return { ok: false, reason: "verify_error" };
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
    }
  }
  return { ok: false, reason: "verify_error" };
}

async function sendSms(phone, text) {
  const to = normalizePhone(phone);
  if (!to || to.length < 7) return { channel: "sms", status: "skipped" };
  const from = normalizePhone(NOTIFY_SMS_FROM || "+923196850846");
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && from) {
    try {
      const body = new URLSearchParams({ From: from, To: to, Body: text }).toString();
      const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
      const resp = await fetchWithTimeout(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const data = await resp.json().catch(() => ({}));
      if (resp.ok) return { channel: "sms", provider: "twilio", status: "sent", sid: data.sid, from, to, text };
      return { channel: "sms", provider: "twilio", status: "failed", from, to, text, error: data.message || String(resp.status) };
    } catch (e) {
      return { channel: "sms", provider: "twilio", status: "failed", from, to, text };
    }
  }
  return { channel: "sms", provider: "stub", status: "queued", from, to, text };
}

async function sendWhatsApp(phone, text) {
  const to = normalizePhone(phone);
  if (!to || to.length < 7) return { channel: "whatsapp", status: "skipped" };
  const from = normalizePhone(NOTIFY_WHATSAPP_FROM || "+923196850846");
  if (WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID) {
    try {
      const resp = await fetchWithTimeout(`https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: text } }),
      });
      const data = await resp.json().catch(() => ({}));
      const mid = Array.isArray(data.messages) && data.messages.length ? data.messages[0].id : undefined;
      if (resp.ok) return { channel: "whatsapp", provider: "meta", status: "sent", id: mid, from, to, text };
      return { channel: "whatsapp", provider: "meta", status: "failed", from, to, text, error: data.error?.message || String(resp.status) };
    } catch (e) {
      return { channel: "whatsapp", provider: "meta", status: "failed", from, to, text };
    }
  }
  return { channel: "whatsapp", provider: "stub", status: "queued", from, to, text };
}

const server = http.createServer(async (req, res) => {
  setCors(res);
  setSecurityHeaders(res);
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  const url = new URL(req.url, `http://${req.headers.host}`);
  const ipRaw = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").toString();
  const ip = ipRaw.split(",")[0].split(":")[0];
  if (req.method === "GET" && url.pathname === "/api/bundles") {
    const { data, error } = await supabase.from("bundles").select("*");
    if (error) return send(res, 500, { error: error.message });
    return send(res, 200, data);
  }
  if (req.method === "GET" && url.pathname === "/api/delivery-areas") {
    const active = url.searchParams.get("active");
    let query = supabase.from("delivery_areas").select("*");
    if (active === "true") query = query.eq("active", true);
    const { data, error } = await query;
    if (error) return send(res, 500, { error: error.message });
    return send(res, 200, data);
  }
  if (req.method === "GET" && url.pathname.startsWith("/api/orders/")) {
    const orderId = url.pathname.split("/").pop();
    const { data: order, error } = await supabase
      .from("orders")
      .select("id,customername,phone,address,bundle,price,deliverycharge,total,status,created_at")
      .eq("id", orderId)
      .maybeSingle();
    if (error) return send(res, 500, { error: error.message });
    if (!order) return send(res, 404, { error: "not_found" });
    return send(res, 200, order);
  }
  if (req.method === "GET" && url.pathname === "/api/orders") {
    const token = req.headers["x-admin-token"] || url.searchParams.get("token");
    if (!ADMIN_API_TOKEN) return send(res, 403, { error: "forbidden" });
    const t = typeof token === "string" ? token : "";
    const ok = t.length === ADMIN_API_TOKEN.length && crypto.timingSafeEqual(Buffer.from(t), Buffer.from(ADMIN_API_TOKEN));
    if (!ok) return send(res, 403, { error: "forbidden" });
    const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit") || 50)));
    const { data, error } = await supabase
      .from("orders")
      .select("id,customername,phone,address,bundle,price,deliverycharge,total,status,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return send(res, 500, { error: error.message });
    return send(res, 200, data);
  }
  if (req.method === "GET" && url.pathname === "/api/shipping-quote") {
    const bundleId = url.searchParams.get("bundleId");
    const areaId = url.searchParams.get("areaId");
    if (!bundleId) return send(res, 400, { error: "bundle_required" });
    const { data: bundle, error: bErr } = await supabase
      .from("bundles")
      .select("id,price")
      .eq("id", bundleId)
      .maybeSingle();
    if (bErr) return send(res, 500, { error: bErr.message });
    if (!bundle) return send(res, 404, { error: "bundle_not_found" });
    let deliveryCharge = 0;
    if (areaId) {
      const { data: area, error: aErr } = await supabase
        .from("delivery_areas")
        .select("id,charge,active")
        .eq("id", areaId)
        .maybeSingle();
      if (aErr) return send(res, 500, { error: aErr.message });
      if (!area || !area.active) return send(res, 400, { error: "invalid_area" });
      deliveryCharge = Number(area.charge);
    }
    const price = Number(bundle.price);
    const total = price + deliveryCharge;
    return send(res, 200, { price, deliveryCharge, total });
  }
  if (req.method === "POST" && url.pathname === "/api/orders") {
    if (!rateLimit(`orders:${ip}`)) return send(res, 429, { error: "rate_limited" });
    const captchaToken = req.headers["x-captcha-token"];
    const cap = await verifyCaptchaDetailed(captchaToken, ip);
    if (!cap.ok) return send(res, 400, { error: "captcha_failed", reason: cap.reason });
    let body;
    try {
      body = await readBody(req);
    } catch (e) {
      if (e && e.message === "payload_too_large") return send(res, 413, { error: "payload_too_large" });
      return send(res, 400, { error: "invalid_json" });
    }
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) return send(res, 400, { error: "validation_failed", details: parsed.error.flatten() });
    const { bundleId, customerName, phone, address, areaId, deliveryCharge: dc } = parsed.data;
    const { data: bundle, error: bundleErr } = await supabase.from("bundles").select("id,price").eq("id", bundleId).maybeSingle();
    if (bundleErr) return send(res, 500, { error: bundleErr.message });
    if (!bundle) return send(res, 404, { error: "bundle_not_found" });
    let deliveryCharge = 0;
    if (areaId) {
      const { data: area, error: areaErr } = await supabase.from("delivery_areas").select("id,charge,active").eq("id", areaId).maybeSingle();
      if (areaErr) return send(res, 500, { error: areaErr.message });
      if (!area || !area.active) return send(res, 400, { error: "invalid_area" });
      deliveryCharge = Number(area.charge);
    } else if (typeof dc === "number") {
      deliveryCharge = Math.max(0, Number(dc));
    }
    const price = Number(bundle.price);
    const total = price + deliveryCharge;
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({ customername: customerName, phone, address, bundle: bundleId, price, deliverycharge: deliveryCharge, total, status: "pending" })
      .select("*")
      .single();
    if (orderErr) return send(res, 500, { error: orderErr.message });
    // const { data: payment, error: payErr } = await supabase
    //   .from("payments")
    //   .insert({ order_id: order.id, amount: total })
    //   .select("*")
    //   .single();
    // if (payErr) return send(res, 500, { error: payErr.message });
    const msg = `Order ${order.id} confirmed. Total PKR ${total}. Delivery 24-48h.`;
    try {
      await Promise.all([sendSms(phone, msg), sendWhatsApp(phone, msg)]);
    } catch (_) {}
    return send(res, 201, { order });
  }
  /*
  if (req.method === "POST" && url.pathname === "/api/payments/initialize") {
    if (!rateLimit(`payments:${ip}`)) return send(res, 429, { error: "rate_limited" });
    let body;
    try {
      body = await readBody(req);
    } catch (_) {
      return send(res, 400, { error: "invalid_json" });
    }
    const schema = z.object({ orderId: z.string().uuid(), amount: z.number().positive() });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return send(res, 400, { error: "validation_failed", details: parsed.error.flatten() });
    const { orderId, amount } = parsed.data;
    const { data: ord, error: oErr } = await supabase
      .from("orders")
      .select("id,total,status")
      .eq("id", orderId)
      .maybeSingle();
    if (oErr) return send(res, 500, { error: oErr.message });
    if (!ord) return send(res, 404, { error: "order_not_found" });
    const { data: payment, error: pErr } = await supabase
      .from("payments")
      .insert({ order_id: orderId, amount })
      .select("*")
      .single();
    if (pErr) return send(res, 500, { error: pErr.message });
    return send(res, 200, { payment, paymentIntentId: "placeholder_intent", checkoutUrl: "https://example.com/checkout" });
  }
  */
  if (req.method === "POST" && url.pathname === "/api/payments/webhook") {
    let body;
    try {
      body = await readBody(req);
    } catch (e) {
      if (e && e.message === "payload_too_large") return send(res, 413, { error: "payload_too_large" });
      return send(res, 400, { error: "invalid_json" });
    }
    return send(res, 200, { ok: true });
  }
  if (req.method === "POST" && url.pathname === "/api/notifications/order-confirmation") {
    let body;
    try {
      body = await readBody(req);
    } catch (e) {
      if (e && e.message === "payload_too_large") return send(res, 413, { error: "payload_too_large" });
      return send(res, 400, { error: "invalid_json" });
    }
    const schema = z
      .object({ orderId: z.string().uuid().optional(), phone: z.string().min(3).optional(), message: z.string().min(1).optional() })
      .refine((v) => !!v.orderId || (!!v.phone && !!v.message), { message: "provide orderId or phone+message" });
    const parsed = schema.safeParse(body);
    if (!parsed.success) return send(res, 400, { error: "validation_failed", details: parsed.error.flatten() });
    const { orderId, phone, message } = parsed.data;
    let toPhone = phone;
    let text = message;
    if (orderId && (!toPhone || !text)) {
      const { data: ord, error: ordErr } = await supabase
        .from("orders")
        .select("id,phone,total")
        .eq("id", orderId)
        .maybeSingle();
      if (ordErr) return send(res, 500, { error: ordErr.message });
      if (!ord) return send(res, 404, { error: "order_not_found" });
      toPhone = toPhone || ord.phone;
      text = text || `Order ${ord.id} confirmed. Total PKR ${Number(ord.total)}. Delivery 24-48h.`;
    }
    const [sms, wa] = await Promise.all([sendSms(toPhone, text), sendWhatsApp(toPhone, text)]);
    return send(res, 200, { sms, whatsapp: wa });
  }
  return send(res, 404, { error: "not_found" });
});

const port = Number(PORT) || 8787;
server.listen(port);
