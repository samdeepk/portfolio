export interface ParsedURL {
  input: string
  type: "domain" | "parameter" | "path" | "external" | "unknown"
  isValid: boolean
  finalUrl?: string
  isExternal?: boolean
  metadata?: string
  error?: string
  suggestions?: string[]
  confidence?: number
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
const knownSites = {
  srd: {
    domain: "srd.fund",
    param: "/?site=srd",
    description: "SRD Fund - Investment portfolio",
  },
  "sanskrut-corp": {
    domain: "corp.sanskrut.in",
    param: "/?site=sanskrut-corp",
    description: "Sanskrut Corp - Corporate ventures",
  },
  "sanskrut-enterprises": {
    domain: "ent.sanskrut.in",
    param: "/?site=sanskrut-enterprises",
    description: "Sanskrut Enterprises - Real estate portfolio",
  },
  sandeep: {
    domain: "sandeepkoduri.com",
    param: "/?site=sandeep",
    description: "Sandeep Koduri - Personal portfolio",
  },
}

const knownDomains = [
  "srd.fund",
  "corp.sanskrut.in",
  "ent.sanskrut.in",
  "sandeepkoduri.com",
  "sanskrutcorp.com",
  "sanskrutenterprises.com",
]

const knownPaths = ["/profile/", "/person/", "/navigate"]

export function parseURL(input: string): ParsedURL {
  const trimmedInput = input.trim().toLowerCase()

  if (!trimmedInput) {
    return {
      input,
      type: "unknown",
      isValid: false,
      error: "Please enter a URL, domain, or site parameter",
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
        finalUrl: trimmedInput,
        isExternal: true,
        metadata: `External link to ${url.hostname}`,
      }
    } catch {
      return {
        input,
        type: "external",
        isValid: false,
        error: "Invalid URL format",
      }
    }
  }

  // Check for site parameters
  if (trimmedInput.startsWith("/?site=") || trimmedInput.startsWith("?site=")) {
    const siteId = trimmedInput.replace(/^\?/, "").replace("/?site=", "").replace("?site=", "")
    if (siteId in knownSites) {
      return {
        input,
        type: "parameter",
        isValid: true,
        finalUrl: `/?site=${siteId}`,
        metadata: knownSites[siteId as keyof typeof knownSites].description,
        confidence: 1.0,
      }
    } else {
      const suggestions = Object.keys(knownSites).map((site) => `/?site=${site}`)
      return {
        input,
        type: "parameter",
        isValid: false,
        error: "Unknown site parameter",
        suggestions,
      }
    }
  }

  // Check for direct site IDs
  if (trimmedInput in knownSites) {
    return {
      input,
      type: "parameter",
      isValid: true,
      finalUrl: knownSites[trimmedInput as keyof typeof knownSites].param,
      metadata: knownSites[trimmedInput as keyof typeof knownSites].description,
      confidence: 1.0,
    }
  }

  // Check for known domains
  const domainMatch = knownDomains.find(
    (domain) => domain.toLowerCase() === trimmedInput || trimmedInput === domain.replace(/^https?:\/\//, ""),
  )

  if (domainMatch) {
    return {
      input,
      type: "domain",
      isValid: true,
      finalUrl: `https://${domainMatch}`,
      isExternal: true,
      metadata: `Navigate to ${domainMatch}`,
      confidence: 1.0,
    }
  }

  // Check for internal paths
  if (trimmedInput.startsWith("/")) {
    const isKnownPath = knownPaths.some((path) => trimmedInput.startsWith(path))
    if (isKnownPath || trimmedInput === "/") {
      return {
        input,
        type: "path",
        isValid: true,
        finalUrl: trimmedInput,
        metadata: `Internal path: ${trimmedInput}`,
        confidence: 1.0,
      }
    } else {
      return {
        input,
        type: "path",
        isValid: true,
        finalUrl: trimmedInput,
        metadata: `Internal path: ${trimmedInput}`,
        confidence: 0.7,
      }
    }
  }

  // Fuzzy matching for suggestions
  const allOptions = [
    ...Object.keys(knownSites),
    ...knownDomains,
    ...Object.keys(knownSites).map((site) => `/?site=${site}`),
  ]

  const suggestions = allOptions
    .map((option) => ({
      option,
      distance: levenshteinDistance(trimmedInput, option.toLowerCase()),
    }))
    .filter(({ distance }) => distance <= 3)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(({ option }) => option)

  return {
    input,
    type: "unknown",
    isValid: false,
    error: "Unrecognized input format",
    suggestions:
      suggestions.length > 0 ? suggestions : ["srd", "/?site=sanskrut-corp", "/profile/spacex", "https://example.com"],
  }
}
