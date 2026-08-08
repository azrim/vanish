-- Vanish — Temp Mail Database Schema
-- Run this in Supabase SQL Editor

-- Domain whitelist
CREATE TABLE IF NOT EXISTS domains (
  id        SERIAL PRIMARY KEY,
  domain    TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Temporary email addresses
CREATE TABLE IF NOT EXISTS temp_addresses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address         TEXT UNIQUE NOT NULL,
  domain          TEXT NOT NULL,
  local_part      TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  expires_at      TIMESTAMPTZ DEFAULT (now() + interval '24 hours')
);

-- Incoming messages
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temp_address_id UUID REFERENCES temp_addresses(id) ON DELETE CASCADE,
  from_addr       TEXT NOT NULL,
  subject         TEXT DEFAULT '(no subject)',
  body_text       TEXT,
  body_html       TEXT,
  raw_email       TEXT,
  received_at     TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_temp_addresses_address ON temp_addresses(address);
CREATE INDEX IF NOT EXISTS idx_messages_temp_address ON messages(temp_address_id);
CREATE INDEX IF NOT EXISTS idx_messages_received ON messages(received_at DESC);

-- RLS policies
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE temp_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public read for domains
CREATE POLICY "Public read domains" ON domains FOR SELECT USING (true);

-- Public read/write for temp_addresses (anon access)
CREATE POLICY "Public all temp_addresses" ON temp_addresses FOR ALL USING (true) WITH CHECK (true);

-- Public read/write for messages (anon access)
CREATE POLICY "Public all messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- Insert default domains
INSERT INTO domains (domain, is_active) VALUES
  ('azrim.biz.id', true),
  ('azrim.my.id', true),
  ('scarlett.my.id', true),
  ('solvege.my.id', true),
  ('sukiliar.pro', true)
ON CONFLICT (domain) DO NOTHING;

-- Auto-cleanup expired addresses (run via Supabase cron or pg_cron)
-- Enable pg_cron extension first: CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('cleanup-expired', '0 * * * *', $$
--   DELETE FROM temp_addresses WHERE expires_at < now();
-- $$);
