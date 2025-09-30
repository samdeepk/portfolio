import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/database'

const EdgeSchema = z.object({
  src: z.string().uuid(),
  dst: z.string().uuid(),
  kind: z.string(),
  weight: z.number().optional().default(1.0),
  metadata: z.record(z.any()).optional()
})

const EdgesSchema = z.object({
  edges: z.array(EdgeSchema)
})

export const graphRoutes: FastifyPluginAsync = async (fastify) => {
  // Add or update edges
  fastify.post('/edges', {
    preHandler: [fastify.authenticate],
    schema: {
      body: EdgesSchema
    }
  }, async (request, reply) => {
    const { edges } = request.body as z.infer<typeof EdgesSchema>
    
    try {
      const results = []
      
      for (const edge of edges) {
        // Verify both nodes exist
        const [srcNode, dstNode] = await Promise.all([
          prisma.node.findUnique({ where: { id: edge.src } }),
          prisma.node.findUnique({ where: { id: edge.dst } })
        ])
        
        if (!srcNode || !dstNode) {
          reply.code(400).send({ 
            error: `Node not found: ${!srcNode ? edge.src : edge.dst}` 
          })
          return
        }
        
        // Upsert edge
        const result = await prisma.edge.upsert({
          where: {
            src_dst_kind: {
              src: edge.src,
              dst: edge.dst,
              kind: edge.kind
            }
          },
          update: {
            weight: edge.weight,
            metadata: edge.metadata
          },
          create: {
            src: edge.src,
            dst: edge.dst,
            kind: edge.kind,
            weight: edge.weight || 1.0,
            metadata: edge.metadata
          }
        })
        
        results.push(result)
      }
      
      return { edges: results, created: results.length }
    } catch (error) {
      console.error('Edge creation failed:', error)
      reply.code(500).send({ error: 'Failed to create edges' })
    }
  })

  // Get related nodes
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
          kind: { type: 'string' },
          hops: { type: 'number', minimum: 1, maximum: 3, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 50, default: 10 }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { kind, hops = 1, limit = 10 } = request.query as any
    
    try {
      // Verify node exists
      const node = await prisma.node.findUnique({ where: { id } })
      if (!node) {
        reply.code(404).send({ error: 'Node not found' })
        return
      }
      
      // Get related nodes through edges
      const edges = await prisma.edge.findMany({
        where: {
          OR: [
            { src: id, ...(kind && { kind }) },
            { dst: id, ...(kind && { kind }) }
          ]
        },
        include: {
          srcNode: {
            include: {
              tags: {
                include: { tag: true }
              }
            }
          },
          dstNode: {
            include: {
              tags: {
                include: { tag: true }
              }
            }
          }
        },
        take: limit
      })
      
      // Extract related nodes
      const relatedNodes = edges.map(edge => {
        const relatedNode = edge.src === id ? edge.dstNode : edge.srcNode
        return {
          node: {
            id: relatedNode.id,
            kind: relatedNode.kind.toLowerCase(),
            slug: relatedNode.slug,
            title: relatedNode.title,
            summary: relatedNode.summary,
            tags: relatedNode.tags.map(t => t.tag.slug)
          },
          relationship: {
            kind: edge.kind,
            weight: edge.weight,
            direction: edge.src === id ? 'outgoing' : 'incoming',
            metadata: edge.metadata
          }
        }
      })
      
      return { 
        sourceNode: { id, title: node.title },
        relatedNodes,
        totalEdges: edges.length
      }
    } catch (error) {
      console.error('Related nodes query failed:', error)
      reply.code(500).send({ error: 'Failed to get related nodes' })
    }
  })

  // Get node's edges
  fastify.get('/edges/:id', {
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
          direction: { type: 'string', enum: ['incoming', 'outgoing', 'both'], default: 'both' },
          kind: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { direction = 'both', kind } = request.query as any
    
    try {
      const whereConditions: any[] = []
      
      if (direction === 'outgoing' || direction === 'both') {
        whereConditions.push({ src: id, ...(kind && { kind }) })
      }
      
      if (direction === 'incoming' || direction === 'both') {
        whereConditions.push({ dst: id, ...(kind && { kind }) })
      }
      
      const edges = await prisma.edge.findMany({
        where: { OR: whereConditions },
        include: {
          srcNode: { select: { id: true, title: true, kind: true, slug: true } },
          dstNode: { select: { id: true, title: true, kind: true, slug: true } }
        }
      })
      
      return { edges }
    } catch (error) {
      console.error('Edges query failed:', error)
      reply.code(500).send({ error: 'Failed to get edges' })
    }
  })

  // Delete edge
  fastify.delete('/edges', {
    preHandler: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        properties: {
          src: { type: 'string' },
          dst: { type: 'string' },
          kind: { type: 'string' }
        },
        required: ['src', 'dst', 'kind']
      }
    }
  }, async (request, reply) => {
    const { src, dst, kind } = request.body as any
    
    try {
      await prisma.edge.delete({
        where: {
          src_dst_kind: { src, dst, kind }
        }
      })
      
      return { deleted: true }
    } catch (error) {
      console.error('Edge deletion failed:', error)
      reply.code(500).send({ error: 'Failed to delete edge' })
    }
  })

  // Get graph statistics
  fastify.get('/stats', async (request, reply) => {
    try {
      const [nodeCount, edgeCount, tagCount] = await Promise.all([
        prisma.node.count({ where: { status: 'PUBLISHED' } }),
        prisma.edge.count(),
        prisma.tag.count()
      ])
      
      // Get node distribution by kind
      const nodesByKind = await prisma.node.groupBy({
        by: ['kind'],
        where: { status: 'PUBLISHED' },
        _count: { kind: true }
      })
      
      // Get edge distribution by kind
      const edgesByKind = await prisma.edge.groupBy({
        by: ['kind'],
        _count: { kind: true }
      })
      
      return {
        nodes: {
          total: nodeCount,
          byKind: nodesByKind.reduce((acc, item) => {
            acc[item.kind.toLowerCase()] = item._count.kind
            return acc
          }, {} as Record<string, number>)
        },
        edges: {
          total: edgeCount,
          byKind: edgesByKind.reduce((acc, item) => {
            acc[item.kind] = item._count.kind
            return acc
          }, {} as Record<string, number>)
        },
        tags: {
          total: tagCount
        }
      }
    } catch (error) {
      console.error('Stats query failed:', error)
      reply.code(500).send({ error: 'Failed to get graph statistics' })
    }
  })
}