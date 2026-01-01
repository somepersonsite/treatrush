export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

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
  const res = await fetch(`${API_URL}/api/bundles`);
  if (!res.ok) throw new Error(`Failed to fetch bundles: ${res.status}`);
  return res.json();
}

export async function fetchDeliveryAreas(activeOnly = true): Promise<DeliveryArea[]> {
  const url = new URL(`${API_URL}/api/delivery-areas`);
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
  const res = await fetch(`${API_URL}/api/orders`, {
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
