CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS tr_info;

GRANT USAGE ON SCHEMA tr_info TO anon, authenticated, service_role;
GRANT SELECT ON tr_info.bundles TO anon, authenticated;
GRANT SELECT ON tr_info.delivery_areas TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA tr_info TO service_role;

CREATE TABLE IF NOT EXISTS tr_info.bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  productId text NOT NULL,
  size text NOT NULL,
  packCount integer NOT NULL,
  price numeric(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS tr_info.delivery_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  name text NOT NULL,
  charge numeric(12,2) NOT NULL,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS tr_info.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customerName text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  bundle uuid NOT NULL REFERENCES tr_info.bundles(id),
  price numeric(12,2) NOT NULL,
  deliveryCharge numeric(12,2) NOT NULL,
  total numeric(12,2) NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tr_info.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  orderId uuid NOT NULL REFERENCES tr_info.orders(id),
  amount numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Credentials-only capture table (for early phase lead storage)
CREATE TABLE IF NOT EXISTS tr_info.customer_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customerName text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tr_info.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tr_info.delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tr_info.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tr_info.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tr_info.customer_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY bundles_select_public ON tr_info.bundles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY areas_select_public ON tr_info.delivery_areas FOR SELECT TO anon, authenticated USING (active);

-- Allow client-side inserts of credentials only; no public reads
CREATE POLICY customer_credentials_insert_public ON tr_info.customer_credentials
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE UNIQUE INDEX IF NOT EXISTS bundles_identity_unique ON tr_info.bundles(productId, size, packCount);
ALTER TABLE tr_info.orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending','confirmed','fulfilled','cancelled'));

ALTER TABLE tr_info.payments DROP CONSTRAINT IF EXISTS payments_orderid_fkey;
ALTER TABLE tr_info.payments DROP CONSTRAINT IF EXISTS payments_orderId_fkey;
ALTER TABLE tr_info.payments ADD CONSTRAINT payments_orderid_fkey FOREIGN KEY (orderId) REFERENCES tr_info.orders(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS payments_orderId_idx ON tr_info.payments(orderId);
CREATE INDEX IF NOT EXISTS orders_bundle_idx ON tr_info.orders(bundle);
CREATE INDEX IF NOT EXISTS delivery_areas_active_idx ON tr_info.delivery_areas(active);
CREATE INDEX IF NOT EXISTS customer_credentials_phone_idx ON tr_info.customer_credentials(phone);

CREATE OR REPLACE FUNCTION tr_info.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER orders_touch_updated_at BEFORE UPDATE ON tr_info.orders FOR EACH ROW EXECUTE FUNCTION tr_info.touch_updated_at();
CREATE TRIGGER payments_touch_updated_at BEFORE UPDATE ON tr_info.payments FOR EACH ROW EXECUTE FUNCTION tr_info.touch_updated_at();
