interface ParseResult {
  isValid: boolean
  destination: string
  finalUrl?: string
  isExternal: boolean
  type: "domain" | "parameter" | "path" | "external" | "unknown"
  suggestions?: string[]
  metadata?: {
    site?: string
    domain?: string
    path?: string
  }
}

const KNOWN_SITES = {
  srd: { domain: "srd.fund", name: "SRD Fund" },
  "sanskrut-corp": { domain: "sanskrutcorp.com", name: "Sanskrut Corp" },
  "sanskrut-enterprises": { domain: "sanskrutenterprises.com", name: "Sanskrut Enterprises" },
  sandeep: { domain: "sandeepkoduri.com", name: "Sandeep Koduri" },
}

const KNOWN_DOMAINS = ["srd.fund", "sanskrutcorp.com", "sanskrutenterprises.com", "sandeepkoduri.com"]

const KNOWN_PATHS = ["/profile/spacex", "/profile/groq", "/profile/tesla", "/person/sandeep", "/navigate"]

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

function findSuggestions(input: string): string[] {
  const suggestions: Array<{ text: string; distance: number }> = []

  // Check against known sites
  Object.keys(KNOWN_SITES).forEach((siteId) => {
    const distance = levenshteinDistance(input.toLowerCase(), siteId)
    if (distance <= 2) {
      suggestions.push({ text: siteId, distance })
    }
  })

  // Check against known domains
  KNOWN_DOMAINS.forEach((domain) => {
    const distance = levenshteinDistance(input.toLowerCase(), domain)
    if (distance <= 3) {
      suggestions.push({ text: domain, distance })
    }
  })

  // Check against known paths
  KNOWN_PATHS.forEach((path) => {
    const distance = levenshteinDistance(input.toLowerCase(), path)
    if (distance <= 3) {
      suggestions.push({ text: path, distance })
    }
  })

  return suggestions
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((s) => s.text)
}

export function parseURL(input: string): ParseResult {
  const trimmedInput = input.trim().toLowerCase()

  // Handle empty input
  if (!trimmedInput) {
    return {
      isValid: false,
      destination: "Empty input",
      isExternal: false,
      type: "unknown",
      suggestions: ["srd.fund", "/?site=srd", "/profile/spacex"],
    }
  }

  // Handle full URLs (external)
  if (trimmedInput.startsWith("http://") || trimmedInput.startsWith("https://")) {
    try {
      const url = new URL(trimmedInput)
      return {
        isValid: true,
        destination: url.hostname,
        finalUrl: trimmedInput,
        isExternal: true,
        type: "external",
        metadata: { domain: url.hostname, path: url.pathname },
      }
    } catch {
      return {
        isValid: false,
        destination: "Invalid URL",
        isExternal: false,
        type: "unknown",
        suggestions: findSuggestions(input),
      }
    }
  }

  // Handle domain-like inputs
  if (trimmedInput.includes(".") && !trimmedInput.startsWith("/") && !trimmedInput.includes("?")) {
    const domain = trimmedInput.replace(/^(https?:\/\/)/, "")

    if (KNOWN_DOMAINS.includes(domain)) {
      return {
        isValid: true,
        destination: domain,
        finalUrl: `https://${domain}`,
        isExternal: true,
        type: "domain",
        metadata: { domain },
      }
    }

    // Try as external domain
    return {
      isValid: true,
      destination: domain,
      finalUrl: `https://${domain}`,
      isExternal: true,
      type: "external",
      metadata: { domain },
    }
  }

  // Handle parameter-style inputs
  if (trimmedInput.includes("?site=") || trimmedInput.startsWith("site=")) {
    const siteMatch = trimmedInput.match(/site=([^&]+)/)
    if (siteMatch) {
      const siteId = siteMatch[1]
      if (siteId in KNOWN_SITES) {
        return {
          isValid: true,
          destination: KNOWN_SITES[siteId as keyof typeof KNOWN_SITES].name,
          finalUrl: `/?site=${siteId}`,
          isExternal: false,
          type: "parameter",
          metadata: { site: siteId },
        }
      }
    }
  }

  // Handle path inputs
  if (trimmedInput.startsWith("/")) {
    const isKnownPath = KNOWN_PATHS.some((path) => path.toLowerCase() === trimmedInput)

    return {
      isValid: true,
      destination: trimmedInput,
      finalUrl: trimmedInput,
      isExternal: false,
      type: "path",
      metadata: { path: trimmedInput },
    }
  }

  // Handle site ID inputs
  if (trimmedInput in KNOWN_SITES) {
    const site = KNOWN_SITES[trimmedInput as keyof typeof KNOWN_SITES]
    return {
      isValid: true,
      destination: site.name,
      finalUrl: `/?site=${trimmedInput}`,
      isExternal: false,
      type: "parameter",
      metadata: { site: trimmedInput },
    }
  }

  // No match found
  return {
    isValid: false,
    destination: "Unknown destination",
    isExternal: false,
    type: "unknown",
    suggestions: findSuggestions(input),
  }
}
