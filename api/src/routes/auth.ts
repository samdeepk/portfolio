import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

// Simple in-memory user store for demo
// In production, use a proper database
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  role: string
  createdAt: Date
}> = []

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Register
  fastify.post('/register', {
    schema: {
      body: RegisterSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' }
              }
            },
            token: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { email, password, name } = request.body as z.infer<typeof RegisterSchema>
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      reply.code(400).send({ error: 'User already exists' })
      return
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const user = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      name,
      role: 'editor',
      createdAt: new Date()
    }
    
    users.push(user)
    
    // Generate JWT
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    })
    
    reply.code(201).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    })
  })

  // Login
  fastify.post('/login', {
    schema: {
      body: LoginSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' }
              }
            },
            token: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body as z.infer<typeof LoginSchema>
    
    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      reply.code(401).send({ error: 'Invalid credentials' })
      return
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      reply.code(401).send({ error: 'Invalid credentials' })
      return
    }
    
    // Generate JWT
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    })
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    }
  })

  // Get current user
  fastify.get('/me', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const userId = (request as any).user.id
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      reply.code(404).send({ error: 'User not found' })
      return
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    }
  })

  // Refresh token
  fastify.post('/refresh', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const user = (request as any).user
    
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    })
    
    return { token }
  })
}