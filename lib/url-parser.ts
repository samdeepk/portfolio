export interface ParsedURL {
  type: "domain" | "parameter" | "path" | "external" | "site-name" | "unknown"
  isValid: boolean
  isExternal: boolean
  finalUrl: string
  accessMethod?: "domain" | "parameter"
  suggestions?: string[]
  error?: string
}

// Site mappings for fuzzy matching
const siteKeywords = {
  srd: ["srd", "fund", "investment", "srd.fund"],
  "sanskrut-corp": ["sanskrut", "corp", "corporate", "corp.sanskrut.in"],
  "sanskrut-enterprises": ["enterprises", "ent", "business", "ent.sanskrut.in"],
  sandeep: ["sandeep", "koduri", "personal", "sandeepkoduri.com"],
}

const domainMappings = {
  "srd.fund": "srd",
  "corp.sanskrut.in": "sanskrut-corp",
  "ent.sanskrut.in": "sanskrut-enterprises",
  "sandeepkoduri.com": "sandeep",
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null))

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator)
    }
  }

  return matrix[str2.length][str1.length]
}

function findBestMatch(input: string, candidates: string[]): string[] {
  const inputLower = input.toLowerCase()
  const matches = candidates
    .map((candidate) => ({
      candidate,
      distance: levenshteinDistance(inputLower, candidate.toLowerCase()),
      includes: candidate.toLowerCase().includes(inputLower),
    }))
    .filter((match) => match.distance <= 3 || match.includes)
    .sort((a, b) => {
      if (a.includes && !b.includes) return -1
      if (!a.includes && b.includes) return 1
      return a.distance - b.distance
    })
    .map((match) => match.candidate)

  return matches.slice(0, 3)
}

export function parseURL(input: string): ParsedURL {
  const trimmed = input.trim().toLowerCase()

  if (!trimmed) {
    return {
      type: "unknown",
      isValid: false,
      isExternal: false,
      finalUrl: "",
      error: "Empty input",
    }
  }

  // Check for full URLs (external)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed)
      return {
        type: "external",
        isValid: true,
        isExternal: true,
        finalUrl: trimmed,
      }
    } catch {
      return {
        type: "external",
        isValid: false,
        isExternal: true,
        finalUrl: "",
        error: "Invalid URL format",
      }
    }
  }

  // Check for parameter format (?site=...)
  if (trimmed.startsWith("?site=") || trimmed.startsWith("site=")) {
    const siteParam = trimmed.replace(/^\?/, "").replace(/^site=/, "")
    if (siteParam in siteKeywords) {
      return {
        type: "parameter",
        isValid: true,
        isExternal: false,
        finalUrl: `/?site=${siteParam}`,
        accessMethod: "parameter",
      }
    } else {
      const allSites = Object.keys(siteKeywords)
      const suggestions = findBestMatch(siteParam, allSites)
      return {
        type: "parameter",
        isValid: false,
        isExternal: false,
        finalUrl: "",
        error: `Unknown site: ${siteParam}`,
        suggestions: suggestions.map((s) => `?site=${s}`),
      }
    }
  }

  // Check for direct domain matches
  if (trimmed in domainMappings) {
    return {
      type: "domain",
      isValid: true,
      isExternal: true,
      finalUrl: `https://${trimmed}`,
      accessMethod: "domain",
    }
  }

  // Check for domain-like patterns (contains dots)
  if (trimmed.includes(".") && !trimmed.includes(" ")) {
    const cleanDomain = trimmed.replace(/^https?:\/\//, "").replace(/\/$/, "")
    if (cleanDomain in domainMappings) {
      return {
        type: "domain",
        isValid: true,
        isExternal: true,
        finalUrl: `https://${cleanDomain}`,
        accessMethod: "domain",
      }
    } else {
      // Try to find similar domains
      const allDomains = Object.keys(domainMappings)
      const suggestions = findBestMatch(cleanDomain, allDomains)
      return {
        type: "domain",
        isValid: false,
        isExternal: true,
        finalUrl: "",
        error: `Unknown domain: ${cleanDomain}`,
        suggestions: suggestions.length > 0 ? suggestions : [`https://${cleanDomain}`],
      }
    }
  }

  // Check for site name fuzzy matching
  const allKeywords = Object.entries(siteKeywords).flatMap(([siteId, keywords]) =>
    keywords.map((keyword) => ({ keyword, siteId })),
  )

  const keywordMatches = allKeywords.filter(
    ({ keyword }) =>
      keyword.toLowerCase().includes(trimmed) || levenshteinDistance(trimmed, keyword.toLowerCase()) <= 2,
  )

  if (keywordMatches.length > 0) {
    const bestMatch = keywordMatches[0]
    return {
      type: "site-name",
      isValid: true,
      isExternal: false,
      finalUrl: `/?site=${bestMatch.siteId}`,
      accessMethod: "parameter",
      suggestions: keywordMatches.slice(1, 4).map((m) => `?site=${m.siteId}`),
    }
  }

  // Check for path-like patterns
  if (trimmed.startsWith("/")) {
    return {
      type: "path",
      isValid: true,
      isExternal: false,
      finalUrl: trimmed,
    }
  }

  // Fallback: generate suggestions
  const allSuggestions = [
    ...Object.keys(domainMappings),
    ...Object.keys(siteKeywords),
    ...Object.values(siteKeywords).flat(),
  ]

  const suggestions = findBestMatch(trimmed, allSuggestions)

  return {
    type: "unknown",
    isValid: false,
    isExternal: false,
    finalUrl: "",
    error: `Could not parse: ${trimmed}`,
    suggestions: suggestions.slice(0, 5),
  }
}
