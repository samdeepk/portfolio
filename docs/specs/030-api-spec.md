# 030 — ChatCMS & Knowledge Graph API (Human-Readable Spec)

Human-readable summary of the OpenAPI spec (`/openapi/chatcms-api.yaml`).

---

## Overview

The API powers a **chat-only CMS** with publish workflows, a **knowledge graph**, **search**, and **Ask-the-Site** Q&A.

- Base URL: `https://api.example.com`
- Auth: Bearer JWT (`Authorization: Bearer <token>`)
- Entities: Node, Edge, Site, Tag
- Versions: `v1/...`

---

## Content Endpoints

- **Propose** `POST /v1/content/propose` → Normalize prompt into draft + missing fields.  
- **Validate** `POST /v1/content/validate` → Schema/tag/slug checks.  
- **Upsert** `POST /v1/content/upsert` → Create/update draft; new revision.  
- **Preview** `GET /v1/content/preview/{id}` → HTML preview.  
- **Publish** `POST /v1/content/publish/{id}` → Publish node, index + revalidate.  
- **Diff** `POST /v1/content/diff` → Unified diff between revisions.  

---

## Graph Endpoints

- **Add/Upsert Edges** `POST /v1/graph/edges`  
- **Related** `GET /v1/graph/related/{id}` → Related nodes by edge kind/hops  

---

## Search & Ask

- **List** `GET /v1/search/list?q=...&tags=...` → Node listings.  
- **Ask** `POST /v1/search/ask` → Hybrid RAG answer with citations.  

---

## System Endpoints

- **Revalidate** `POST /v1/system/revalidate` → ISR/cache invalidation.  
- **Health** `GET /v1/system/health` → `{ "status":"ok" }`  

---

## Webhooks

On publish, webhook event:
```json
{
  "event": "node.published",
  "id": "uuid",
  "kind": "article",
  "slug": "scaling-fintech-onboarding",
  "tags": ["fintech"]
}
```

---

## Security

- JWT validation  
- TLS required  
- RBAC: Viewer, Editor, Publisher, Admin  
- Visibility: `public|unlisted|private`  

---

## Changelog

- v1.0.0 — Initial release
