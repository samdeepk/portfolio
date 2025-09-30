# 0002 — User Stories (Epics, Stories, Acceptance Criteria)

> Scope: Multi-tenant corporate portfolio sites with tag-driven views, chat-only CMS, knowledge graph, hybrid search/RAG, and MCP integrations.

---

## Legend
- **Priority (MoSCoW):** M = Must, S = Should, C = Could, W = Won’t (now)
- **AC** = Acceptance Criteria (Gherkin-style)
- **NFR** references non-functional requirements in 0001-high-level-requirements.md

---

## EPIC A — Chat-only Content Creation & Editing

### A1. Create node via chat (Article)
**As a** Content Creator  
**I want** to create an *Article* by describing it in chat  
**So that** I don’t need a CMS UI

- **Priority:** M  
- **AC:**  
  - **Given** I’m authenticated as Editor  
    **When** I send a prompt like “Create article ‘Scaling fintech onboarding’ with 3 sections and CTA”  
    **Then** the system returns a normalized draft with `kind=article`, generated `slug`, `title`, `body_mdx`, and suggested `tags`  
    **And** saves a **draft** revision on `upsert`  
  - **Given** the article is a draft  
    **When** I ask for a preview  
    **Then** I get a unique preview URL (noindex) rendering the MDX

### A2. Create node via chat (Project, Person, Company)
**As a** Content Creator  
**I want** to create *Project/Person/Company* nodes via chat  
**So that** I can maintain relationships for case studies

- **Priority:** M  
- **AC:**  
  - **Given** I propose a Project with title, summary, dates  
    **When** required fields are missing  
    **Then** the system asks for them explicitly and validates values  
  - **Given** I specify a Person/Company by name  
    **When** there are multiple matches  
    **Then** I receive a disambiguation list with confidence scores

### A3. Auto-tagging suggestion
**As a** Content Creator  
**I want** automatic tag suggestions (industry, role, region, keywords)  
**So that** I keep taxonomy consistent

- **Priority:** S  
- **AC:**  
  - **Given** a draft node with `body_mdx`  
    **When** I request “suggest tags”  
    **Then** I get a list of candidate tags with confidence and reasons  
    **And** only whitelisted tags can be applied without approval

### A4. Revisions & diff
**As a** Editor  
**I want** to see differences between revisions  
**So that** I can review changes before publishing

- **Priority:** M  
- **AC:**  
  - **Given** a node with revisions 2 and 3  
    **When** I run `diff`  
    **Then** I see a unified diff of changed fields and body content

### A5. Rollback
**As a** Publisher  
**I want** to rollback to a prior revision  
**So that** I can fix regressions quickly

- **Priority:** S  
- **AC:**  
  - **Given** a published node at version 5  
    **When** I rollback to version 3  
    **Then** version 6 is created matching version 3 content  
    **And** a new publish event is recorded

---

## EPIC B — Publishing Workflow

### B1. Validate & publish
**As a** Publisher  
**I want** validation and a publish command in chat  
**So that** only high-quality content goes live

- **Priority:** M  
- **AC:**  
  - **Given** a draft with missing required fields  
    **When** I attempt to publish  
    **Then** I see validation errors (slug, tags, SEO, alt text)  
  - **Given** validation passes  
    **When** I publish  
    **Then** the node status becomes `published`, `published_at` is set, and indexing + revalidation are triggered

### B2. Reviewers & approvals
**As a** Publisher  
**I want** to assign reviewers in chat  
**So that** content is peer-reviewed before going live

- **Priority:** S  
- **AC:**  
  - **Given** a draft  
    **When** I submit for review with `@reviewer`  
    **Then** reviewer receives a task and can approve/reject with comments  
    **And** publish requires ≥1 approval unless overridden by Admin

---

## EPIC C — Multi-Site, Multi-Brand Theming & Tag Views

### C1. Site configuration (domain → tags/theme)
**As a** Site Admin  
**I want** each domain/subdomain to map to a `Site` with default tags & theme  
**So that** content is curated per brand

- **Priority:** M  
- **AC:**  
  - **Given** a site with `include_tags=["fintech"]`  
    **When** I visit the domain  
    **Then** listings and components default to fintech-tagged content and site theme

### C2. Tag routes & canonicalization
**As a** Visitor  
**I want** pretty tag routes (e.g., `/t/ai+fintech`)  
**So that** I can share filtered views

- **Priority:** M  
- **AC:**  
  - **Given** I navigate to `/t/fintech+ai`  
    **When** tags are out of order or duplicated  
    **Then** I am redirected to canonical `/t/ai+fintech`

### C3. Query-parameter filters (noindex previews)
**As a** Site Admin  
**I want** to preview ad-hoc tag combinations via query params  
**So that** I can QA without polluting SEO

- **Priority:** S  
- **AC:**  
  - **Given** a site default tag `ai`  
    **When** I open `?tags=fintech`  
    **Then** combined filter is applied  
    **And** page includes `noindex` unless combo is whitelisted

---

## EPIC D — Knowledge Graph (Relations)

### D1. Link nodes with edges
**As a** Editor  
**I want** to link Articles ↔ Projects ↔ People/Companies  
**So that** related content appears contextually

- **Priority:** M  
- **AC:**  
  - **Given** an Article and a Company  
    **When** I add an edge `kind=client`  
    **Then** the Company shows under “Client” on the article, and the article appears under the company’s “Case Studies”

### D2. Related content widgets
**As a** Visitor  
**I want** related items based on edges and shared tags  
**So that** I can explore relevant material

- **Priority:** M  
- **AC:**  
  - **Given** a Project page  
    **When** I scroll to the bottom  
    **Then** I see 3–6 related items (mix of nodes) with clear relation labels

---

## EPIC E — Search & Ask (Hybrid RAG)

### E1. Keyword search with filters
**As a** Visitor  
**I want** instant keyword search with filters (tags, kinds, site)  
**So that** I can find content quickly

- **Priority:** M  
- **AC:**  
  - **Given** I search “onboarding” with `tags=fintech`  
    **When** results load  
    **Then** I see relevant items scored by BM25 and constrained by filters

### E2. Ask-the-site with citations
**As a** Visitor or Internal User  
**I want** to ask questions and get **citation-backed** answers  
**So that** I trust the response

- **Priority:** M  
- **AC:**  
  - **Given** I ask “What results did we achieve for fintech onboarding?”  
    **When** the answer is generated  
    **Then** it includes 2–5 citations with titles, URLs, and snippets  
    **And** all citations resolve to **existing** published pages

### E3. Graph expansion in retrieval
**As a** System  
**I want** to expand top-k nodes by 1–2 hops  
**So that** the answer includes contextually related entities

- **Priority:** S  
- **AC:**  
  - **Given** vector/keyword top-k results  
    **When** expansion is enabled  
    **Then** related People/Companies/Projects are eligible for reranking

---

## EPIC F — Templates, UI Quality & Accessibility

### F1. Enterprise-grade templates
**As a** Brand Owner  
**I want** polished marketing and case-study templates  
**So that** sites look professional

- **Priority:** M  
- **AC:**  
  - **Given** marketing pages  
    **When** audited with Lighthouse  
    **Then** Performance/SEO/Best Practices/Accessibility ≥ 90

### F2. Accessibility
**As a** Visitor with assistive tech  
**I want** compliant components  
**So that** I can navigate and consume content

- **Priority:** M  
- **AC:**  
  - **Given** core flows  
    **When** tested with keyboard and screen readers  
    **Then** focus order, ARIA roles, and contrast meet WCAG 2.1 AA

---

## EPIC G — Admin, RBAC, Observability

### G1. Roles & permissions
**As a** Admin  
**I want** RBAC (Viewer, Editor, Publisher, Admin)  
**So that** content and ops are safe

- **Priority:** M  
- **AC:**  
  - **Given** a Viewer token  
    **When** I call `publish`  
    **Then** I receive 403 Forbidden

### G2. Audit log
**As a** Compliance Officer  
**I want** every write to be audit-logged (actor, tool, diff hash)  
**So that** we have traceability

- **Priority:** M  
- **AC:**  
  - **Given** an upsert  
    **When** it completes  
    **Then** an audit record exists with timestamp, user, and revision IDs

### G3. Metrics & error tracking
**As a** Operator  
**I want** API metrics, logs, traces, and error alerts  
**So that** I can keep the platform healthy

- **Priority:** S  
- **AC:**  
  - **Given** normal traffic  
    **When** I open dashboards  
    **Then** I see p50/p95 latency, error rates, indexer lag, and cache hit rates

---

## EPIC H — MCP & External Integrations

### H1. MCP tools
**As a** Integrator  
**I want** MCP tools for `searchDocuments`, `getNode`, `getRelated`, `ask`  
**So that** agents can consume the corpus

- **Priority:** S  
- **AC:**  
  - **Given** a valid MCP client  
    **When** I call `ask` with a site and tags  
    **Then** I receive an answer and citations restricted to that scope

### H2. Webhooks
**As a** Integrator  
**I want** publish webhooks  
**So that** downstream systems react to new content

- **Priority:** C  
- **AC:**  
  - **Given** a node published event  
    **When** webhook is configured  
    **Then** a signed payload posts to the subscriber endpoint

---

## EPIC I — Performance, SEO, Caching

### I1. ISR revalidation by tag/path
**As a** System  
**I want** to revalidate by tag and path on publish  
**So that** pages refresh fast without full rebuilds

- **Priority:** M  
- **AC:**  
  - **Given** an article with tags `["fintech"]`  
    **When** it’s published  
    **Then** the system calls revalidate for `/t/fintech` and the article path

### I2. Image optimization & CDN
**As a** Visitor  
**I want** fast image loading  
**So that** pages feel snappy

- **Priority:** S  
- **AC:**  
  - **Given** large hero images  
    **When** served in WebP/AVIF with responsive sizes  
    **Then** LCP stays < 2.0s on 4G (NFR)

---

## EPIC J — Security & Compliance

### J1. AuthN/Z
**As a** Security Engineer  
**I want** JWT validation with issuer/audience and RBAC checks  
**So that** APIs are protected

- **Priority:** M  
- **AC:**  
  - **Given** an invalid token  
    **When** I call any protected endpoint  
    **Then** I receive 401 Unauthorized

### J2. Content visibility
**As a** Editor  
**I want** `visibility` flags (`public|unlisted|private`)  
**So that** I can control exposure

- **Priority:** M  
- **AC:**  
  - **Given** a `private` node  
    **When** a public list/ask query runs  
    **Then** the node is excluded

---

## Out-of-Scope (for now)
- Full marketing automation (emails, drip campaigns)
- Advanced analytics attribution modeling
- Deep third-party DXP integrations

---

## Traceability
Every story maps to endpoints and specs in `docs/specs` and `/openapi/chatcms-api.yaml`.  
Update this document as stories are delivered or reprioritized.