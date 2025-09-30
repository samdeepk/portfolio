import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { searchService, SearchFilters } from '../lib/search'
import { prisma } from '../lib/database'

const SearchSchema = z.object({
  q: z.string().optional(),
  tags: z.array(z.string()).optional(),
  kind: z.array(z.string()).optional(),
  site: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
})

const AskSchema = z.object({
  q: z.string().min(1),
  tags: z.array(z.string()).optional(),
  site: z.string().optional(),
  context: z.string().optional()
})

export const searchRoutes: FastifyPluginAsync = async (fastify) => {
  // Search nodes
  fastify.get('/list', {
    schema: {
      querystring: SearchSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  summary: { type: 'string' },
                  kind: { type: 'string' },
                  slug: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  score: { type: 'number' }
                }
              }
            },
            total: { type: 'number' },
            hasMore: { type: 'boolean' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const params = request.query as z.infer<typeof SearchSchema>
    
    const filters: SearchFilters = {
      tags: params.tags,
      kind: params.kind,
      site: params.site,
      status: 'published'
    }
    
    try {
      let results
      if (params.q) {
        // Use search service for text search
        results = await searchService.searchNodes(params.q, filters, params.limit)
      } else {
        // Direct database query for listing
        const nodes = await prisma.node.findMany({
          where: {
            status: 'PUBLISHED',
            ...(filters.kind && { kind: { in: filters.kind.map(k => k.toUpperCase()) as any } }),
            ...(filters.tags && {
              tags: {
                some: {
                  tagSlug: { in: filters.tags }
                }
              }
            })
          },
          include: {
            tags: {
              include: { tag: true }
            }
          },
          orderBy: { publishedAt: 'desc' },
          take: params.limit,
          skip: params.offset
        })
        
        results = nodes.map(node => ({
          id: node.id,
          title: node.title,
          summary: node.summary || '',
          kind: node.kind.toLowerCase(),
          slug: node.slug,
          tags: node.tags.map(t => t.tag.slug),
          score: 1.0
        }))
      }
      
      return {
        results,
        total: results.length,
        hasMore: results.length === params.limit
      }
    } catch (error) {
      console.error('Search failed:', error)
      reply.code(500).send({ error: 'Search failed' })
    }
  })

  // Ask question (RAG)
  fastify.post('/ask', {
    schema: {
      body: AskSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            answer: { type: 'string' },
            citations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  url: { type: 'string' },
                  snippet: { type: 'string' }
                }
              }
            },
            sources: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  summary: { type: 'string' },
                  kind: { type: 'string' },
                  slug: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  score: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { q, tags, site, context } = request.body as z.infer<typeof AskSchema>
    
    const filters: SearchFilters = {
      tags,
      site,
      status: 'published'
    }
    
    try {
      const result = await searchService.ask(q, filters)
      return result
    } catch (error) {
      console.error('Ask failed:', error)
      reply.code(500).send({ error: 'Failed to process question' })
    }
  })

  // Get related content
  fastify.get('/related/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 5 }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { limit = 5 } = request.query as { limit?: number }
    
    try {
      // Get the source node
      const sourceNode = await prisma.node.findUnique({
        where: { id },
        include: {
          tags: {
            include: { tag: true }
          }
        }
      })
      
      if (!sourceNode) {
        reply.code(404).send({ error: 'Node not found' })
        return
      }
      
      // Find related nodes by shared tags
      const tagSlugs = sourceNode.tags.map(t => t.tag.slug)
      
      const relatedNodes = await prisma.node.findMany({
        where: {
          id: { not: id },
          status: 'PUBLISHED',
          tags: {
            some: {
              tagSlug: { in: tagSlugs }
            }
          }
        },
        include: {
          tags: {
            include: { tag: true }
          }
        },
        take: limit,
        orderBy: { publishedAt: 'desc' }
      })
      
      const results = relatedNodes.map(node => ({
        id: node.id,
        title: node.title,
        summary: node.summary || '',
        kind: node.kind.toLowerCase(),
        slug: node.slug,
        tags: node.tags.map(t => t.tag.slug),
        sharedTags: node.tags.filter(t => tagSlugs.includes(t.tag.slug)).length
      }))
      
      // Sort by number of shared tags
      results.sort((a, b) => b.sharedTags - a.sharedTags)
      
      return { results }
    } catch (error) {
      console.error('Related search failed:', error)
      reply.code(500).send({ error: 'Failed to find related content' })
    }
  })

  // Get popular tags
  fastify.get('/tags', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 20 },
          facet: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { limit = 20, facet } = request.query as { limit?: number; facet?: string }
    
    try {
      const tags = await prisma.tag.findMany({
        where: facet ? { facet: facet.toUpperCase() as any } : {},
        include: {
          nodes: {
            where: {
              node: { status: 'PUBLISHED' }
            }
          }
        },
        take: limit
      })
      
      const results = tags
        .map(tag => ({
          slug: tag.slug,
          label: tag.label,
          facet: tag.facet?.toLowerCase(),
          count: tag.nodes.length
        }))
        .filter(tag => tag.count > 0)
        .sort((a, b) => b.count - a.count)
      
      return { results }
    } catch (error) {
      console.error('Tags query failed:', error)
      reply.code(500).send({ error: 'Failed to get tags' })
    }
  })
}