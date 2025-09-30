-- db/schema.sql — Postgres 15+ with pgvector
-- Run: psql -f schema.sql

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Core enums (optional; using text in tables for portability)
-- CREATE TYPE node_kind AS ENUM ('article','blog','person','company','project','asset');
-- CREATE TYPE node_status AS ENUM ('draft','in_review','published');

-- NODES
CREATE TABLE IF NOT EXISTS nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind TEXT NOT NULL CHECK (kind IN ('article','blog','person','company','project','asset')),
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9-]{3,}$'),
  title TEXT NOT NULL,
  summary TEXT,
  body_mdx TEXT,
  body_plain TEXT,
  seo JSONB,
  metadata JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','published')),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_kind_slug UNIQUE (kind, slug)
);

-- NODE REVISIONS (immutable snapshots)
CREATE TABLE IF NOT EXISTS node_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  version INT NOT NULL,
  snapshot JSONB NOT NULL,
  author_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_node_version UNIQUE (node_id, version)
);

-- TAGS
CREATE TABLE IF NOT EXISTS tags (
  slug TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  facet TEXT CHECK (facet IN ('industry','role','region','scale','keyword')),
  parent_slug TEXT REFERENCES tags(slug)
);

-- TAGS XREF
CREATE TABLE IF NOT EXISTS tags_xref (
  node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  tag_slug TEXT NOT NULL REFERENCES tags(slug) ON DELETE CASCADE,
  PRIMARY KEY (node_id, tag_slug)
);

-- EDGES
CREATE TABLE IF NOT EXISTS edges (
  src UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  dst UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  weight DOUBLE PRECISION DEFAULT 1.0,
  metadata JSONB,
  PRIMARY KEY (src, dst, kind)
);

-- DOCUMENT CHUNKS (RAG)
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  ord INT NOT NULL,
  content TEXT NOT NULL,
  meta JSONB,
  embedding VECTOR(1536) -- adjust to model dimension
);

-- SITES
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  theme JSONB,
  include_tags TEXT[],
  include_nodes UUID[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SITES XREF (pin/exclude per site)
CREATE TABLE IF NOT EXISTS sites_xref (
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('pin','exclude')),
  PRIMARY KEY (site_id, node_id)
);

-- AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_id UUID,
  action TEXT NOT NULL,
  payload JSONB,
  trace_id TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nodes_published_at ON nodes(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_nodes_metadata_gin ON nodes USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_tags_xref_tag ON tags_xref(tag_slug);
CREATE INDEX IF NOT EXISTS idx_edges_src ON edges(src);
CREATE INDEX IF NOT EXISTS idx_edges_dst ON edges(dst);
CREATE INDEX IF NOT EXISTS idx_chunks_node ON document_chunks(node_id);
CREATE INDEX IF NOT EXISTS idx_sites_domain ON sites(domain);

-- Vector index (tune lists per corpus size)
-- Example: lists=100 (adjust via SET during CREATE INDEX in newer versions)
CREATE INDEX IF NOT EXISTS idx_chunks_embedding_ivfflat ON document_chunks USING ivfflat (embedding vector_cosine_ops);

-- Triggers to auto-increment revision version could be added if desired.
-- Example function for next version:
-- CREATE OR REPLACE FUNCTION next_node_version(n UUID) RETURNS INT AS $$
--   SELECT COALESCE(MAX(version),0)+1 FROM node_revisions WHERE node_id = n;
-- $$ LANGUAGE SQL;

-- SAMPLE SEED (optional)
-- INSERT INTO tags (slug,label,facet) VALUES
-- ('fintech','Fintech','industry'),('ai','AI','industry'),('kyc','KYC','keyword')
-- ON CONFLICT DO NOTHING;
