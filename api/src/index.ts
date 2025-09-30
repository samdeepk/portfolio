import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import multipart from '@fastify/multipart'

import { contentRoutes } from './routes/content'
import { graphRoutes } from './routes/graph'
import { searchRoutes } from './routes/search'
import { systemRoutes } from './routes/system'
import { authRoutes } from './routes/auth'

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
})

// Register plugins
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000']
})

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
})

fastify.register(multipart)

// Swagger documentation
fastify.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'ChatCMS API',
      description: 'Multi-tenant portfolio platform with knowledge graph',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
})

fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  }
})

// Authentication hook
fastify.decorate('authenticate', async function(request: any, reply: any) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
})

// Register routes
fastify.register(authRoutes, { prefix: '/v1/auth' })
fastify.register(contentRoutes, { prefix: '/v1/content' })
fastify.register(graphRoutes, { prefix: '/v1/graph' })
fastify.register(searchRoutes, { prefix: '/v1/search' })
fastify.register(systemRoutes, { prefix: '/v1/system' })

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001')
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`Server listening on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()