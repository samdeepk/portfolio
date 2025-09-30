# ChatCMS API

Multi-tenant portfolio platform with knowledge graph, chat-only CMS, and hybrid search.

## Features

- **Content Management**: Chat-driven content creation and publishing
- **Knowledge Graph**: Relationships between nodes (articles, people, companies, projects)
- **Hybrid Search**: Keyword + vector search with RAG capabilities
- **Multi-tenant**: Support for multiple sites/domains from single corpus
- **RESTful API**: OpenAPI 3.0 documented endpoints

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**:
   ```bash
   # Run the schema.sql file in your PostgreSQL database
   psql -f ../db/schema.sql

   # Generate Prisma client
   npm run generate

   # Run migrations (if using Prisma migrations)
   npm run migrate
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001` with documentation at `/docs`.

## API Endpoints

### Authentication
- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - Login user
- `GET /v1/auth/me` - Get current user

### Content Management
- `POST /v1/content/propose` - AI-powered content suggestion
- `POST /v1/content/validate` - Validate content structure
- `POST /v1/content/upsert` - Create/update content
- `GET /v1/content/preview/:id` - Preview content
- `POST /v1/content/publish/:id` - Publish content
- `POST /v1/content/diff` - Compare revisions

### Knowledge Graph
- `POST /v1/graph/edges` - Add/update relationships
- `GET /v1/graph/related/:id` - Get related nodes
- `GET /v1/graph/edges/:id` - Get node edges
- `GET /v1/graph/stats` - Graph statistics

### Search & Ask
- `GET /v1/search/list` - Search/list nodes
- `POST /v1/search/ask` - Ask questions (RAG)
- `GET /v1/search/related/:id` - Find related content
- `GET /v1/search/tags` - Get popular tags

### System
- `GET /v1/system/health` - Health check
- `POST /v1/system/revalidate` - Trigger cache revalidation
- `GET /v1/system/metrics` - System metrics

## Architecture

The API is built with:
- **Fastify** - Fast, low overhead web framework
- **Prisma** - Type-safe database ORM
- **PostgreSQL + pgvector** - Database with vector search
- **Typesense** - Full-text search engine
- **OpenAI** - Embeddings and chat completion
- **Zod** - Runtime type validation

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Deployment

The API can be deployed to any Node.js hosting platform:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting platform

3. **Run database migrations**:
   ```bash
   npm run migrate
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT