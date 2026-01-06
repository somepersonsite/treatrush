const BASE = (import.meta.env.VITE_API_URL || "/api").trim();
export const API_BASE = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;

export type Bundle = {
  id: string;
  productId: string;
  size: string;
  packCount: number;
  price: number;
};

export type DeliveryArea = {
  id: string;
  city: string;
  name: string;
  charge: number;
  active: boolean;
};

export async function fetchBundles(): Promise<Bundle[]> {
  const res = await fetch(`${API_BASE}/bundles`);
  if (!res.ok) throw new Error(`Failed to fetch bundles: ${res.status}`);
  return res.json();
}

export async function fetchDeliveryAreas(activeOnly = true): Promise<DeliveryArea[]> {
  const url = new URL(`${API_BASE}/delivery-areas`, window.location.origin);
  if (activeOnly) url.searchParams.set("active", "true");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch delivery areas: ${res.status}`);
  return res.json();
}

export async function createOrder(input: {
  bundleId: string;
  customerName: string;
  phone: string;
  address: string;
  areaId?: string;
  deliveryCharge?: number;
  captchaToken?: string;
}): Promise<{ order: unknown; payment: unknown }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (input.captchaToken) headers["X-Captcha-Token"] = input.captchaToken;
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Failed to create order: ${res.status}`);
  }
  return res.json();
}
