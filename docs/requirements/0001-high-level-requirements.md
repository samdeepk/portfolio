# High-Level Requirements

## 1. Purpose
Build a platform to manage **multi-brand portfolio websites** for individuals, companies, and holding companies.  
The system should reuse a single corpus of content nodes (people, companies, projects, articles) and allow each site/domain to display curated views of that corpus.

## 2. Scope
- In scope: content publishing, multi-tenant theming, tag-based filtering, knowledge graph relations, blog/article publishing, chat-only CMS interface, search, and Ask-the-site chat.
- Out of scope: complex financial ERP integrations, email marketing automation (may be added later).

## 3. Business Goals
- Centralize content into a single source of truth.
- Quickly spin up branded corporate/individual websites.
- Support enterprise-grade polish (UI templates, SEO, accessibility).
- Future-proof for LLM/Q&A and MCP integrations.

## 4. User Stories
- As a **content creator**, I want to create/edit articles and projects *via chat*, so I don’t need to log into a CMS UI.  
- As a **site admin**, I want to assign tags and themes to a domain, so the right subset of content shows automatically.  
- As a **visitor**, I want to read case studies, blogs, and profiles on a corporate-branded site, so I can trust the company.  
- As a **system integrator**, I want to query the corpus via MCP tools, so other systems can consume it.

## 5. Functional Requirements
- FR1: The system shall allow creation of nodes (`article`, `blog`, `person`, `company`, `project`, `asset`) via chat.  
- FR2: The system shall support relationships (`edges`) between nodes (contributor, client, owner, mentions).  
- FR3: The system shall allow each site/domain to be configured with tags and themes.  
- FR4: The system shall publish blogs and articles with SEO metadata and JSON-LD.  
- FR5: The system shall expose `/api/ask` for hybrid RAG answers with citations.  

## 6. Non-Functional Requirements
- NFR1: SEO score ≥ 90 (Lighthouse).  
- NFR2: Accessibility WCAG 2.1 AA.  
- NFR3: Response time < 200ms for API (p95).  
- NFR4: Uptime 99.9%.  
- NFR5: Secure JWT auth for APIs.  
- NFR6: All content versioned and auditable.

## 7. Acceptance Criteria
- Two branded sites render distinct views from the same corpus.  
- Content can be created, previewed, and published entirely via chat.  
- `/api/ask` produces citation-rich answers for 10 gold-standard queries.  
