
export interface ParsedUrlResult {
  isValid: boolean
  type: "domain" | "path" | "parameter" | "site-id" | "external" | "invalid"
  originalInput: string
  finalUrl: string
  displayName: string
  isExternal: boolean
  error?: string
  suggestions?: string[]
  metadata?: Record<string, any>
}

// Known domains and their configurations
const KNOWN_DOMAINS = {
  "srd.fund": {
    name: "SRD Innovation Fund",
    siteId: "srd",
    description: "Investment portfolio and startup showcase",
  },
  "corp.sanskrut.in": {
    name: "Sanskrut Corp",
    siteId: "sanskrut-corp",
    description: "Incubation platform and early-stage ventures",
  },
  "ent.sanskrut.in": {
    name: "Sanskrut Enterprises",
    siteId: "sanskrut-enterprises",
    description: "Hospitality and real estate portfolio",
  },
  "sandeepkoduri.com": {
    name: "Sandeep",
    siteId: "sandeep",
    description: "Personal portfolio and professional timeline",
  },
}

// Known site IDs
const SITE_IDS = {
  srd: "SRD Innovation Fund",
  "sanskrut-corp": "Sanskrut Corp",
  "sanskrut-enterprises": "Sanskrut Enterprises",
  sandeep: "Sandeep Personal Portfolio",
}

// Known internal paths
const KNOWN_PATHS = [
  "/profile/spacex",
  "/profile/groq",
  "/profile/perplexity",
  "/profile/xai",
  "/person/sandeep",
  "/person/dheeraj",
  "/person/praveen",
]

export function parseUrlInput(input: string): ParsedUrlResult {
  const trimmedInput = input.trim().toLowerCase()

  if (!trimmedInput) {
    return {
      isValid: false,
      type: "invalid",
      originalInput: input,
      finalUrl: "",
      displayName: "",
      isExternal: false,
      error: "Input cannot be empty",
      suggestions: ["srd.fund", "/?site=srd", "/profile/spacex"],
    }
  }

  // 1. Check if it's a full URL (external)
  if (isValidUrl(trimmedInput)) {
    const url = new URL(trimmedInput)
    const domain = url.hostname.toLowerCase()

    // Check if it's one of our known domains
    if (KNOWN_DOMAINS[domain as keyof typeof KNOWN_DOMAINS]) {
      const config = KNOWN_DOMAINS[domain as keyof typeof KNOWN_DOMAINS]
      return {
        isValid: true,
        type: "domain",
        originalInput: input,
        finalUrl: trimmedInput,
        displayName: config.name,
        isExternal: true,
        metadata: {
          domain,
          description: config.description,
          siteId: config.siteId,
        },
      }
    }

    // External URL
    return {
      isValid: true,
      type: "external",
      originalInput: input,
      finalUrl: trimmedInput,
      displayName: `External: ${domain}`,
      isExternal: true,
      metadata: { domain },
    }
  }

  // 2. Check if it's a known domain (without protocol)
  const domainMatch = Object.keys(KNOWN_DOMAINS).find(
    (domain) => trimmedInput === domain || trimmedInput === domain.replace("www.", ""),
  )

  if (domainMatch) {
    const config = KNOWN_DOMAINS[domainMatch as keyof typeof KNOWN_DOMAINS]
    return {
      isValid: true,
      type: "domain",
      originalInput: input,
      finalUrl: `https://${domainMatch}`,
      displayName: config.name,
      isExternal: true,
      metadata: {
        domain: domainMatch,
        description: config.description,
        siteId: config.siteId,
      },
    }
  }

  // 3. Check if it's a site parameter format
  if (trimmedInput.startsWith("?site=") || trimmedInput.startsWith("/?site=")) {
    const siteParam = trimmedInput.replace(/^\/?/, "").replace("?site=", "")

    if (SITE_IDS[siteParam as keyof typeof SITE_IDS]) {
      return {
        isValid: true,
        type: "parameter",
        originalInput: input,
        finalUrl: `/?site=${siteParam}`,
        displayName: SITE_IDS[siteParam as keyof typeof SITE_IDS],
        isExternal: false,
        metadata: { siteId: siteParam },
      }
    }

    return {
      isValid: false,
      type: "invalid",
      originalInput: input,
      finalUrl: "",
      displayName: "",
      isExternal: false,
      error: `Unknown site identifier: ${siteParam}`,
      suggestions: Object.keys(SITE_IDS).map((id) => `/?site=${id}`),
    }
  }

  // 4. Check if it's a direct site ID
  if (SITE_IDS[trimmedInput as keyof typeof SITE_IDS]) {
    return {
      isValid: true,
      type: "site-id",
      originalInput: input,
      finalUrl: `/?site=${trimmedInput}`,
      displayName: SITE_IDS[trimmedInput as keyof typeof SITE_IDS],
      isExternal: false,
      metadata: { siteId: trimmedInput },
    }
  }

  // 5. Check if it's an internal path
  if (trimmedInput.startsWith("/")) {
    // Exact match
    if (KNOWN_PATHS.includes(trimmedInput)) {
      const pathParts = trimmedInput.split("/")
      const displayName = pathParts[pathParts.length - 1].replace("-", " ")

      return {
        isValid: true,
        type: "path",
        originalInput: input,
        finalUrl: trimmedInput,
        displayName: `${pathParts[1]}: ${displayName}`,
        isExternal: false,
        metadata: {
          pathType: pathParts[1],
          identifier: pathParts[2],
        },
      }
    }

    // Fuzzy match for paths
    const similarPaths = KNOWN_PATHS.filter(
      (path) =>
        path.toLowerCase().includes(trimmedInput.slice(1)) ||
        levenshteinDistance(path.toLowerCase(), trimmedInput) <= 2,
    )

    if (similarPaths.length > 0) {
      return {
        isValid: false,
        type: "invalid",
        originalInput: input,
        finalUrl: "",
        displayName: "",
        isExternal: false,
        error: `Path not found: ${trimmedInput}`,
        suggestions: similarPaths,
      }
    }

    // Generic path validation
    if (isValidPath(trimmedInput)) {
      return {
        isValid: true,
        type: "path",
        originalInput: input,
        finalUrl: trimmedInput,
        displayName: `Internal path: ${trimmedInput}`,
        isExternal: false,
        metadata: { pathType: "generic" },
      }
    }
  }

  // 6. Fuzzy matching for suggestions
  const allOptions = [...Object.keys(KNOWN_DOMAINS), ...Object.keys(SITE_IDS), ...KNOWN_PATHS]

  const suggestions = allOptions
    .filter(
      (option) =>
        option.toLowerCase().includes(trimmedInput) || levenshteinDistance(option.toLowerCase(), trimmedInput) <= 3,
    )
    .slice(0, 5)

  return {
    isValid: false,
    type: "invalid",
    originalInput: input,
    finalUrl: "",
    displayName: "",
    isExternal: false,
    error: `No matching destination found for: ${input}`,
    suggestions: suggestions.length > 0 ? suggestions : ["srd.fund", "/?site=srd", "/profile/spacex"],
  }
}

// Helper functions
function isValidUrl(string: string): boolean {
  // A more strict check for a full URL
  if (!string.startsWith("http://") && !string.startsWith("https://")) {
    return false
  }
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

function isValidPath(path: string): boolean {
  // Basic path validation
  return path.startsWith("/") && path.length > 1 && !path.includes("..") && /^\/[a-zA-Z0-9\-_/]*$/.test(path)
}

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

// Export utility functions for external use
export { isValidUrl, isValidPath, levenshteinDistance }
