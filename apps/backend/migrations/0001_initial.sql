CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE work_orders (
  id UUID PRIMARY KEY,
  appfolio_id TEXT UNIQUE,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE work_order_notes (
  id UUID PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES work_orders(id),
  body TEXT NOT NULL,
  is_owner_only BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inbound_messages (
  id UUID PRIMARY KEY,
  channel TEXT NOT NULL,
  sender TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY,
  inbound_message_id UUID REFERENCES inbound_messages(id),
  work_order_id UUID REFERENCES work_orders(id),
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE approval_actions (
  id UUID PRIMARY KEY,
  recommendation_id UUID NOT NULL REFERENCES ai_recommendations(id),
  actor_id UUID NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  final_reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  event_type TEXT NOT NULL,
  actor_id UUID,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
