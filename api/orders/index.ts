import type { IncomingMessage, ServerResponse } from "http";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_API_TOKEN,
  CAPTCHA_REQUIRED,
  TURNSTILE_SECRET,
} = process.env;
const supabase = createClient(String(SUPABASE_URL), String(SUPABASE_SERVICE_ROLE_KEY), { db: { schema: "tr_info" } });

function send(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

async function readBody(req: IncomingMessage) {
  return new Promise<unknown>((resolve, reject) => {
    let body = "";
    const MAX = 1024 * 1024;
    req.on("data", (c) => {
      body += c as string;
      if (body.length > MAX) reject(new Error("payload_too_large"));
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

async function verifyCaptcha(token: string | undefined) {
  if (!CAPTCHA_REQUIRED || CAPTCHA_REQUIRED === "false") return { ok: true } as const;
  const t = String(token || "").trim();
  if (!t) return { ok: false, reason: "missing_token" } as const;
  if (!TURNSTILE_SECRET) return { ok: true } as const;
  const body = new URLSearchParams({ secret: String(TURNSTILE_SECRET), response: t }).toString();
  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await resp.json().catch(() => ({}));
  if (resp.ok && data && data.success) return { ok: true } as const;
  return { ok: false, reason: "invalid_token" } as const;
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
  instruction: z.string().max(500).transform((s) => s.trim()).optional(),
});

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const u = new URL(String(req.url), "http://localhost");
  if (req.method === "GET") {
    const token = String(u.searchParams.get("token") || "");
    if (!ADMIN_API_TOKEN) return send(res, 403, { error: "forbidden" });
    const ok = token.length === String(ADMIN_API_TOKEN).length && token === ADMIN_API_TOKEN;
    if (!ok) return send(res, 403, { error: "forbidden" });
    const limit = Math.min(500, Math.max(1, Number(u.searchParams.get("limit") || 50)));
    const { data, error } = await supabase
      .from("orders")
      .select("id,customername,phone,address,bundle,price,deliverycharge,total,status,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return send(res, 500, { error: error.message });
    return send(res, 200, data);
  }
  if (req.method === "POST") {
    const capToken = (req.headers["x-captcha-token"] as string | undefined) || undefined;
    const cap = await verifyCaptcha(capToken);
    if (!cap.ok) return send(res, 400, { error: "captcha_failed", reason: cap.reason });
    let body;
    try {
      body = await readBody(req);
    } catch (e: unknown) {
      const m = (e as { message?: string })?.message;
      if (m === "payload_too_large") return send(res, 413, { error: "payload_too_large" });
      return send(res, 400, { error: "invalid_json" });
    }
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) return send(res, 400, { error: "validation_failed", details: parsed.error.flatten() });
    const { bundleId, customerName, phone, address, areaId, deliveryCharge: dc, instruction } = parsed.data;
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
    const price = Number((bundle as { price: number }).price);
    const total = price + deliveryCharge;
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({ customername: customerName, phone, address, bundle: bundleId, price, deliverycharge: deliveryCharge, total, status: "pending", instruction })
      .select("*")
      .single();
    if (orderErr) return send(res, 500, { error: orderErr.message });
    return send(res, 201, { order });
  }
  res.statusCode = 405;
  res.end("method_not_allowed");
}

