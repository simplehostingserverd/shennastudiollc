import { Serper } from 'serper'

interface SerpResult {
  title: string
  link: string
  snippet: string
  position: number
  domain?: string
}

interface SerpResponse {
  organic_results: SerpResult[]
  related_searches?: Array<{
    query: string
  }>
  knowledge_graph?: {
    title: string
    description: string
  }
}

let serperClient: Serper | null = null

function getSerperClient(): Serper {
  if (!serperClient) {
    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) {
      throw new Error('SERPER_API_KEY environment variable not set')
    }
    serperClient = new Serper({ apiKey })
  }
  return serperClient
}

export async function searchSerper(query: string): Promise<SerpResponse> {
  try {
    const client = getSerperClient()

    const response = await client.search({
      q: query,
      num: 20,
      country: 'us',
      locale: 'en'
    })

    return {
      organic_results: response.organic?.map((result, index) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        position: index + 1,
        domain: new URL(result.link).hostname
      })) || [],
      related_searches: response.relatedSearches?.map((search) => ({
        query: search.query
      })) || [],
      knowledge_graph: response.knowledgeGraph ? {
        title: response.knowledgeGraph.title,
        description: response.knowledgeGraph.description
      } : undefined
    }
  } catch (error) {
    console.error('Serper API error:', error)
    throw error
  }
}

export async function getKeywordSuggestions(keyword: string): Promise<string[]> {
  try {
    const response = await searchSerper(`${keyword} related topics`)

    const suggestions: string[] = []

    // Add related searches
    if (response.related_searches) {
      suggestions.push(...response.related_searches.map(search => search.query))
    }

    // Add people also ask questions (if available in response)
    // Note: This would need to be expanded based on actual API response structure

    return Array.from(new Set(suggestions)) // Remove duplicates
  } catch (error) {
    console.error('Keyword suggestions error:', error)
    return []
  }
}

export async function analyzeCompetition(keyword: string): Promise<{
  competitionLevel: 'Low' | 'Medium' | 'High' | 'Very High'
  topDomains: string[]
  averageDomainAuthority: number
}> {
  try {
    const response = await searchSerper(keyword)
    const results = response.organic_results.slice(0, 10)

    const domains = results.map(result => result.domain || '').filter(Boolean)

    // Simple domain authority estimation (this could be enhanced)
    const domainAuthority = domains.map(domain => {
      // Basic scoring based on domain patterns
      if (domain.includes('.edu') || domain.includes('.gov')) return 90
      if (domain.includes('.org')) return 70
      if (domain.includes('wikipedia.org')) return 100
      if (domain.includes('.com')) return 50
      return 30
    })

    const averageDA = domainAuthority.reduce((sum, da) => sum + da, 0) / domainAuthority.length

    let competitionLevel: 'Low' | 'Medium' | 'High' | 'Very High'
    if (averageDA < 40) competitionLevel = 'Low'
    else if (averageDA < 60) competitionLevel = 'Medium'
    else if (averageDA < 80) competitionLevel = 'High'
    else competitionLevel = 'Very High'

    return {
      competitionLevel,
      topDomains: domains.slice(0, 5),
      averageDomainAuthority: Math.round(averageDA)
    }
  } catch (error) {
    console.error('Competition analysis error:', error)
    return {
      competitionLevel: 'Medium',
      topDomains: [],
      averageDomainAuthority: 50
    }
  }
}