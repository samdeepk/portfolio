import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const RevalidateSchema = z.object({
  tags: z.array(z.string()).optional(),
  paths: z.array(z.string()).optional()
})

export const systemRoutes: FastifyPluginAsync = async (fastify) => {
  // Health check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime()
    }
  })

  // Revalidate cache
  fastify.post('/revalidate', {
    preHandler: [fastify.authenticate],
    schema: {
      body: RevalidateSchema
    }
  }, async (request, reply) => {
    const { tags, paths } = request.body as z.infer<typeof RevalidateSchema>
    
    try {
      // In a real implementation, this would trigger Next.js ISR revalidation
      // For now, just log the revalidation request
      console.log('Revalidation requested:', { tags, paths })
      
      // TODO: Call Next.js revalidation API
      // await fetch(`${process.env.FRONTEND_URL}/api/revalidate`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.REVALIDATE_TOKEN}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ tags, paths })
      // })
      
      return {
        revalidated: true,
        tags: tags || [],
        paths: paths || [],
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Revalidation failed:', error)
      reply.code(500).send({ error: 'Revalidation failed' })
    }
  })

  // Get system metrics
  fastify.get('/metrics', {
    preHandler: [fastify.authenticate]
  }, async () => {
    const memoryUsage = process.memoryUsage()
    
    return {
      system: {
        uptime: process.uptime(),
        memory: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external
        },
        cpu: process.cpuUsage(),
        nodeVersion: process.version,
        platform: process.platform
      },
      timestamp: new Date().toISOString()
    }
  })

  // Webhook endpoint for external integrations
  fastify.post('/webhook', {
    schema: {
      body: {
        type: 'object',
        properties: {
          event: { type: 'string' },
          data: { type: 'object' }
        },
        required: ['event']
      }
    }
  }, async (request, reply) => {
    const { event, data } = request.body as any
    
    console.log('Webhook received:', { event, data })
    
    // Handle different webhook events
    switch (event) {
      case 'node.published':
        // Trigger indexing, revalidation, etc.
        break
      case 'site.updated':
        // Trigger site-specific revalidation
        break
      default:
        console.log('Unknown webhook event:', event)
    }
    
    return { received: true, event }
  })

  // Configuration endpoint
  fastify.get('/config', async () => {
    return {
      features: {
        search: true,
        vectorSearch: !!process.env.OPENAI_API_KEY,
        multiTenant: true,
        chat: true
      },
      limits: {
        maxFileSize: '10MB',
        maxNodes: 10000,
        maxTags: 1000
      },
      version: '1.0.0'
    }
  })
}