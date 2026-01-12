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
  const active = u.searchParams.get("active");
  let query = supabase.from("delivery_areas").select("*");
  if (active === "true") query = query.eq("active", true);
  const { data, error } = await query;
  if (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error.message }));
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

