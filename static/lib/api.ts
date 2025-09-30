const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface Node {
  id: string
  kind: string
  slug: string
  title: string
  summary?: string
  bodyMdx?: string
  bodyPlain?: string
  tags: string[]
  seo?: Record<string, any>
  metadata?: Record<string, any>
  status: 'draft' | 'in_review' | 'published'
  publishedAt?: string
  updatedAt: string
}

export interface SearchResult {
  id: string
  title: string
  summary: string
  kind: string
  slug: string
  tags: string[]
  score: number
}

export interface AskResult {
  answer: string
  citations: Array<{
    id: string
    title: string
    url: string
    snippet: string
  }>
  sources: SearchResult[]
}

class ApiClient {
  private baseUrl: string
  private token?: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { error: errorData.error || `HTTP ${response.status}` }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' }
    }
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name: string) {
    return this.request<{ user: any; token: string }>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  // Content
  async searchNodes(params: {
    q?: string
    tags?: string[]
    kind?: string[]
    site?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams()
    
    if (params.q) searchParams.set('q', params.q)
    if (params.tags) params.tags.forEach(tag => searchParams.append('tags', tag))
    if (params.kind) params.kind.forEach(kind => searchParams.append('kind', kind))
    if (params.site) searchParams.set('site', params.site)
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.offset) searchParams.set('offset', params.offset.toString())

    return this.request<{
      results: SearchResult[]
      total: number
      hasMore: boolean
    }>(`/v1/search/list?${searchParams}`)
  }

  async getNode(id: string) {
    return this.request<{ node: Node }>(`/v1/content/preview/${id}`)
  }

  async askQuestion(q: string, tags?: string[], site?: string) {
    return this.request<AskResult>('/v1/search/ask', {
      method: 'POST',
      body: JSON.stringify({ q, tags, site }),
    })
  }

  async getRelatedNodes(id: string, limit = 5) {
    return this.request<{ results: SearchResult[] }>(`/v1/search/related/${id}?limit=${limit}`)
  }

  async getTags(limit = 20, facet?: string) {
    const params = new URLSearchParams({ limit: limit.toString() })
    if (facet) params.set('facet', facet)
    
    return this.request<{
      results: Array<{
        slug: string
        label: string
        facet?: string
        count: number
      }>
    }>(`/v1/search/tags?${params}`)
  }

  // Content management (authenticated)
  async proposeContent(prompt: string, kind?: string) {
    return this.request<{
      suggestion: {
        kind: string
        title: string
        slug: string
        summary: string
        tags: string[]
        missingFields: string[]
      }
    }>('/v1/content/propose', {
      method: 'POST',
      body: JSON.stringify({ prompt, kind }),
    })
  }

  async upsertContent(data: Partial<Node>) {
    return this.request<{ node: Node; created: boolean }>('/v1/content/upsert', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async publishContent(id: string) {
    return this.request<{ node: Node; published: boolean }>(`/v1/content/publish/${id}`, {
      method: 'POST',
    })
  }
}

export const api = new ApiClient()

// Helper functions for static generation
export async function getStaticNodes(params: {
  kind?: string[]
  tags?: string[]
  limit?: number
} = {}) {
  const response = await api.searchNodes({
    ...params,
    limit: params.limit || 100
  })
  
  return response.data?.results || []
}

export async function getNodeBySlug(kind: string, slug: string): Promise<Node | null> {
  // In a real implementation, you'd have a direct slug lookup endpoint
  const response = await api.searchNodes({
    kind: [kind],
    limit: 1
  })
  
  const node = response.data?.results.find(n => n.slug === slug)
  if (!node) return null
  
  const nodeResponse = await api.getNode(node.id)
  return nodeResponse.data?.node || null
}