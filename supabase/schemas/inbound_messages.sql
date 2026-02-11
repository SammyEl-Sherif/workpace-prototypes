-- Declarative Schema for Inbound Messages (SMS/Email)
-- This file defines the desired final state of the inbound_messages table
-- NOTE: update_updated_at_column() is defined in _functions.sql

-- Create enum type for message type
DO $$ BEGIN
  CREATE TYPE public.message_type AS ENUM ('text', 'email');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Inbound messages table: stores SMS and email messages received via webhooks
CREATE TABLE IF NOT EXISTS public.inbound_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.message_type NOT NULL DEFAULT 'text',
  sender_phone_number TEXT,
  sender_email TEXT,
  sender_name TEXT,
  message_body TEXT NOT NULL,
  subject TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pingram_message_id TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT inbound_messages_message_body_not_empty CHECK (char_length(trim(message_body)) > 0),
  CONSTRAINT inbound_messages_sender_required CHECK (
    sender_phone_number IS NOT NULL OR sender_email IS NOT NULL
  )
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_inbound_messages_type ON public.inbound_messages(type);
CREATE INDEX IF NOT EXISTS idx_inbound_messages_received_at ON public.inbound_messages(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_inbound_messages_sender_phone_number ON public.inbound_messages(sender_phone_number);
CREATE INDEX IF NOT EXISTS idx_inbound_messages_sender_email ON public.inbound_messages(sender_email);
CREATE INDEX IF NOT EXISTS idx_inbound_messages_pingram_message_id ON public.inbound_messages(pingram_message_id);

-- Enable Row Level Security
ALTER TABLE public.inbound_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Admins can view all messages, others can view messages sent to their phone/email
-- For now, allow all authenticated users to view all messages (we can refine this later)
DROP POLICY IF EXISTS "Authenticated users can view inbound messages" ON public.inbound_messages;
CREATE POLICY "Authenticated users can view inbound messages"
  ON public.inbound_messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Webhooks can insert messages without authentication (we'll verify webhook signature in the API route)
DROP POLICY IF EXISTS "Service role can insert inbound messages" ON public.inbound_messages;
CREATE POLICY "Service role can insert inbound messages"
  ON public.inbound_messages
  FOR INSERT
  WITH CHECK (true);

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_inbound_messages_updated_at ON public.inbound_messages;
CREATE TRIGGER update_inbound_messages_updated_at
  BEFORE UPDATE ON public.inbound_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
