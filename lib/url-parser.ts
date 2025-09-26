export interface ParsedURL {
  input: string
  type: "domain" | "parameter" | "path" | "external" | "unknown"
  isValid: boolean
  isExternal: boolean
  destination: string
  finalUrl: string
  error?: string
  suggestions?: string[]
  confidence?: number
  metadata?: {
    site?: string
    domain?: string
    path?: string
  }
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}

// Known sites and their configurations
const KNOWN_SITES = {
  srd: {
    domain: "srd.fund",
    name: "SRD Fund",
    aliases: ["srd", "srd.fund", "srdfund"],
  },
  "sanskrut-corp": {
    domain: "corp.sanskrut.in",
    name: "Sanskrut Corp",
    aliases: ["sanskrut-corp", "corp", "sanskrutcorp", "corp.sanskrut.in"],
  },
  "sanskrut-enterprises": {
    domain: "ent.sanskrut.in",
    name: "Sanskrut Enterprises",
    aliases: ["sanskrut-enterprises", "enterprises", "ent", "ent.sanskrut.in"],
  },
  sandeep: {
    domain: "sandeepkoduri.com",
    name: "Sandeep Koduri",
    aliases: ["sandeep", "sandeepkoduri", "sandeepkoduri.com"],
  },
}

// Known internal paths
const KNOWN_PATHS = ["/profile/spacex", "/profile/groq", "/profile/openai", "/person/sandeep", "/navigate"]

export function parseURL(input: string): ParsedURL {
  const trimmedInput = input.trim().toLowerCase()

  if (!trimmedInput) {
    return {
      input,
      type: "unknown",
      isValid: false,
      isExternal: false,
      destination: "",
      finalUrl: "",
      error: "Please enter a URL or site identifier",
    }
  }

  // Check for external URLs
  if (trimmedInput.startsWith("http://") || trimmedInput.startsWith("https://")) {
    try {
      const url = new URL(trimmedInput)
      return {
        input,
        type: "external",
        isValid: true,
        isExternal: true,
        destination: url.hostname,
        finalUrl: trimmedInput,
        confidence: 1.0,
        metadata: { domain: url.hostname },
      }
    } catch (e) {
      return {
        input,
        type: "external",
        isValid: false,
        isExternal: true,
        destination: "",
        finalUrl: "",
        error: "Invalid URL format",
      }
    }
  }

  // Check for direct domain matches
  for (const [siteId, config] of Object.entries(KNOWN_SITES)) {
    if (config.aliases.includes(trimmedInput)) {
      const confidence = trimmedInput === config.domain ? 1.0 : 0.9
      return {
        input,
        type: "domain",
        isValid: true,
        isExternal: false,
        destination: config.name,
        finalUrl: `/?site=${siteId}`,
        confidence,
        metadata: { site: siteId, domain: config.domain },
      }
    }
  }

  // Check for parameter format (/?site=xxx or ?site=xxx)
  const paramMatch = trimmedInput.match(/^\/?(?:\?site=)?(.+)$/)
  if (paramMatch) {
    const siteParam = paramMatch[1]
    if (KNOWN_SITES[siteParam as keyof typeof KNOWN_SITES]) {
      const config = KNOWN_SITES[siteParam as keyof typeof KNOWN_SITES]
      return {
        input,
        type: "parameter",
        isValid: true,
        isExternal: false,
        destination: config.name,
        finalUrl: `/?site=${siteParam}`,
        confidence: 1.0,
        metadata: { site: siteParam },
      }
    }
  }

  // Check for internal paths
  if (trimmedInput.startsWith("/")) {
    const isKnownPath = KNOWN_PATHS.some(
      (path) => path.toLowerCase().includes(trimmedInput) || trimmedInput.includes(path.toLowerCase()),
    )

    if (isKnownPath || trimmedInput.match(/^\/(?:profile|person)\/[\w-]+$/)) {
      return {
        input,
        type: "path",
        isValid: true,
        isExternal: false,
        destination: `Internal path: ${trimmedInput}`,
        finalUrl: trimmedInput,
        confidence: 0.8,
        metadata: { path: trimmedInput },
      }
    }
  }

  // Fuzzy matching for suggestions
  const allAliases = Object.values(KNOWN_SITES).flatMap((config) => config.aliases)
  const suggestions = allAliases
    .map((alias) => ({
      alias,
      distance: levenshteinDistance(trimmedInput, alias),
    }))
    .filter((item) => item.distance <= 3)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((item) => item.alias)

  return {
    input,
    type: "unknown",
    isValid: false,
    isExternal: false,
    destination: "",
    finalUrl: "",
    error: "Unknown site or invalid format",
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  }
}
