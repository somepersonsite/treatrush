import type { IncomingMessage, ServerResponse } from "http";
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
const supabase = createClient(String(SUPABASE_URL), String(SUPABASE_SERVICE_ROLE_KEY), { db: { schema: "tr_info" } });

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end("method_not_allowed");
    return;
  }
  const u = new URL(String(req.url), "http://localhost");
  const parts = u.pathname.split("/");
  const id = parts.pop() || parts.pop() || "";
  const { data: order, error } = await supabase
    .from("orders")
    .select("id,customername,phone,address,bundle,price,deliverycharge,total,status,created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error.message }));
    return;
  }
  if (!order) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "not_found" }));
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(order));
}

