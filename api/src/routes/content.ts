import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/database'
import { searchService } from '../lib/search'

const ProposeSchema = z.object({
  prompt: z.string(),
  kind: z.enum(['article', 'blog', 'person', 'company', 'project', 'asset']).optional()
})

const UpsertSchema = z.object({
  kind: z.enum(['article', 'blog', 'person', 'company', 'project', 'asset']),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().optional(),
  bodyMdx: z.string().optional(),
  bodyPlain: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seo: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional()
})

const ValidateSchema = z.object({
  kind: z.enum(['article', 'blog', 'person', 'company', 'project', 'asset']),
  slug: z.string(),
  title: z.string()
})

export const contentRoutes: FastifyPluginAsync = async (fastify) => {
  // Propose content from natural language
  fastify.post('/propose', {
    preHandler: [fastify.authenticate],
    schema: {
      body: ProposeSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            suggestion: {
              type: 'object',
              properties: {
                kind: { type: 'string' },
                title: { type: 'string' },
                slug: { type: 'string' },
                summary: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                missingFields: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { prompt, kind } = request.body as z.infer<typeof ProposeSchema>
    
    // Simple AI-powered content suggestion
    // In a real implementation, this would use OpenAI or similar
    const suggestion = {
      kind: kind || 'article',
      title: extractTitle(prompt),
      slug: generateSlug(extractTitle(prompt)),
      summary: extractSummary(prompt),
      tags: extractTags(prompt),
      missingFields: ['bodyMdx', 'seo']
    }
    
    return { suggestion }
  })

  // Validate content structure
  fastify.post('/validate', {
    preHandler: [fastify.authenticate],
    schema: {
      body: ValidateSchema
    }
  }, async (request, reply) => {
    const { kind, slug, title } = request.body as z.infer<typeof ValidateSchema>
    
    const errors: string[] = []
    
    // Check slug uniqueness
    const existing = await prisma.node.findFirst({
      where: { kind: kind.toUpperCase() as any, slug }
    })
    
    if (existing) {
      errors.push(`Slug '${slug}' already exists for ${kind}`)
    }
    
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  })

  // Create or update content
  fastify.post('/upsert', {
    preHandler: [fastify.authenticate],
    schema: {
      body: UpsertSchema
    }
  }, async (request, reply) => {
    const data = request.body as z.infer<typeof UpsertSchema>
    
    try {
      // Check if node exists
      const existing = await prisma.node.findFirst({
        where: { kind: data.kind.toUpperCase() as any, slug: data.slug }
      })
      
      let node
      if (existing) {
        // Update existing node
        node = await prisma.node.update({
          where: { id: existing.id },
          data: {
            title: data.title,
            summary: data.summary,
            bodyMdx: data.bodyMdx,
            bodyPlain: data.bodyPlain,
            seo: data.seo,
            metadata: data.metadata,
            updatedAt: new Date()
          }
        })
        
        // Create revision
        const lastRevision = await prisma.nodeRevision.findFirst({
          where: { nodeId: node.id },
          orderBy: { version: 'desc' }
        })
        
        await prisma.nodeRevision.create({
          data: {
            nodeId: node.id,
            version: (lastRevision?.version || 0) + 1,
            snapshot: data as any,
            authorId: (request as any).user?.id
          }
        })
      } else {
        // Create new node
        node = await prisma.node.create({
          data: {
            kind: data.kind.toUpperCase() as any,
            slug: data.slug,
            title: data.title,
            summary: data.summary,
            bodyMdx: data.bodyMdx,
            bodyPlain: data.bodyPlain,
            seo: data.seo,
            metadata: data.metadata
          }
        })
        
        // Create initial revision
        await prisma.nodeRevision.create({
          data: {
            nodeId: node.id,
            version: 1,
            snapshot: data as any,
            authorId: (request as any).user?.id
          }
        })
      }
      
      // Handle tags
      if (data.tags) {
        // Remove existing tags
        await prisma.tagsXref.deleteMany({
          where: { nodeId: node.id }
        })
        
        // Add new tags
        for (const tagSlug of data.tags) {
          // Ensure tag exists
          await prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: { slug: tagSlug, label: tagSlug }
          })
          
          // Link tag to node
          await prisma.tagsXref.create({
            data: {
              nodeId: node.id,
              tagSlug
            }
          })
        }
      }
      
      return { node, created: !existing }
    } catch (error) {
      console.error('Upsert failed:', error)
      reply.code(500).send({ error: 'Failed to upsert content' })
    }
  })

  // Get content preview
  fastify.get('/preview/:id', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    
    const node = await prisma.node.findUnique({
      where: { id },
      include: {
        tags: {
          include: { tag: true }
        }
      }
    })
    
    if (!node) {
      reply.code(404).send({ error: 'Node not found' })
      return
    }
    
    return { node }
  })

  // Publish content
  fastify.post('/publish/:id', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    
    try {
      const node = await prisma.node.update({
        where: { id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date()
        },
        include: {
          tags: {
            include: { tag: true }
          }
        }
      })
      
      // Index for search
      await searchService.indexNode(node)
      
      // TODO: Trigger revalidation webhook
      
      return { node, published: true }
    } catch (error) {
      console.error('Publish failed:', error)
      reply.code(500).send({ error: 'Failed to publish content' })
    }
  })

  // Get content diff between revisions
  fastify.post('/diff', {
    preHandler: [fastify.authenticate],
    schema: {
      body: z.object({
        nodeId: z.string(),
        fromVersion: z.number(),
        toVersion: z.number()
      })
    }
  }, async (request, reply) => {
    const { nodeId, fromVersion, toVersion } = request.body as any
    
    const revisions = await prisma.nodeRevision.findMany({
      where: {
        nodeId,
        version: { in: [fromVersion, toVersion] }
      },
      orderBy: { version: 'asc' }
    })
    
    if (revisions.length !== 2) {
      reply.code(404).send({ error: 'Revisions not found' })
      return
    }
    
    // Simple diff implementation
    const diff = {
      from: revisions[0],
      to: revisions[1],
      changes: generateDiff(revisions[0].snapshot, revisions[1].snapshot)
    }
    
    return { diff }
  })
}

// Helper functions
function extractTitle(prompt: string): string {
  // Simple title extraction - in reality would use AI
  const sentences = prompt.split('.').filter(s => s.trim().length > 0)
  return sentences[0]?.trim().substring(0, 100) || 'Untitled'
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractSummary(prompt: string): string {
  return prompt.substring(0, 200) + (prompt.length > 200 ? '...' : '')
}

function extractTags(prompt: string): string[] {
  // Simple tag extraction - in reality would use AI/NLP
  const commonTags = ['ai', 'fintech', 'technology', 'business', 'startup']
  return commonTags.filter(tag => 
    prompt.toLowerCase().includes(tag)
  ).slice(0, 3)
}

function generateDiff(from: any, to: any): any[] {
  const changes: any[] = []
  
  for (const key in to) {
    if (from[key] !== to[key]) {
      changes.push({
        field: key,
        from: from[key],
        to: to[key]
      })
    }
  }
  
  return changes
}