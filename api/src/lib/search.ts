import { Client } from 'typesense'
import OpenAI from 'openai'

export const typesense = new Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST || 'localhost',
    port: parseInt(process.env.TYPESENSE_PORT || '8108'),
    protocol: process.env.TYPESENSE_PROTOCOL || 'http'
  }],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 2
})

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface SearchFilters {
  tags?: string[]
  kind?: string[]
  site?: string
  status?: string
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

export class SearchService {
  async indexNode(node: any) {
    const document = {
      id: node.id,
      title: node.title,
      summary: node.summary || '',
      content: node.bodyPlain || '',
      kind: node.kind,
      slug: node.slug,
      tags: node.tags?.map((t: any) => t.tag.slug) || [],
      status: node.status,
      published_at: node.publishedAt ? Math.floor(new Date(node.publishedAt).getTime() / 1000) : 0
    }

    try {
      await typesense.collections('nodes').documents().upsert(document)
    } catch (error) {
      console.error('Failed to index node:', error)
    }
  }

  async searchNodes(query: string, filters: SearchFilters = {}, limit = 20): Promise<SearchResult[]> {
    const searchParams: any = {
      q: query || '*',
      query_by: 'title,summary,content',
      filter_by: this.buildFilterString(filters),
      sort_by: 'published_at:desc',
      per_page: limit
    }

    try {
      const results = await typesense.collections('nodes').documents().search(searchParams)
      
      return results.hits?.map((hit: any) => ({
        id: hit.document.id,
        title: hit.document.title,
        summary: hit.document.summary,
        kind: hit.document.kind,
        slug: hit.document.slug,
        tags: hit.document.tags,
        score: hit.text_match_info?.score || 0
      })) || []
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  }

  async vectorSearch(query: string, filters: SearchFilters = {}, limit = 10): Promise<SearchResult[]> {
    try {
      // Generate embedding for query
      const embedding = await this.generateEmbedding(query)
      
      // This would use pgvector in a real implementation
      // For now, return empty array as placeholder
      return []
    } catch (error) {
      console.error('Vector search failed:', error)
      return []
    }
  }

  async ask(query: string, filters: SearchFilters = {}): Promise<AskResult> {
    try {
      // Hybrid search: keyword + vector
      const keywordResults = await this.searchNodes(query, filters, 10)
      const vectorResults = await this.vectorSearch(query, filters, 5)
      
      // Combine and deduplicate results
      const allResults = [...keywordResults, ...vectorResults]
      const uniqueResults = allResults.filter((result, index, self) => 
        index === self.findIndex(r => r.id === result.id)
      )

      // Generate answer using top results
      const context = uniqueResults.slice(0, 5).map(r => 
        `Title: ${r.title}\nSummary: ${r.summary}`
      ).join('\n\n')

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that answers questions based on the provided context. Always cite your sources and be accurate.'
          },
          {
            role: 'user',
            content: `Context:\n${context}\n\nQuestion: ${query}\n\nPlease provide a comprehensive answer based on the context above.`
          }
        ],
        temperature: 0.1
      })

      const answer = completion.choices[0]?.message?.content || 'I could not generate an answer.'

      return {
        answer,
        citations: uniqueResults.slice(0, 3).map(r => ({
          id: r.id,
          title: r.title,
          url: `/${r.kind}/${r.slug}`,
          snippet: r.summary
        })),
        sources: uniqueResults
      }
    } catch (error) {
      console.error('Ask failed:', error)
      return {
        answer: 'I encountered an error while processing your question.',
        citations: [],
        sources: []
      }
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    })
    
    return response.data[0].embedding
  }

  private buildFilterString(filters: SearchFilters): string {
    const conditions: string[] = []
    
    if (filters.tags?.length) {
      conditions.push(`tags:=[${filters.tags.join(',')}]`)
    }
    
    if (filters.kind?.length) {
      conditions.push(`kind:=[${filters.kind.join(',')}]`)
    }
    
    if (filters.status) {
      conditions.push(`status:=${filters.status}`)
    }
    
    return conditions.join(' && ')
  }
}

export const searchService = new SearchService()