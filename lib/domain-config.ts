export interface DomainConfig {
  domain: string
  siteId: string
  siteName: string
  primaryColor: string
  secondaryColor: string
  favicon: string
  ogImage: string
  customCSS?: string
}

export const domainConfigs: Record<string, DomainConfig> = {
  "srd.fund": {
    domain: "srd.fund",
    siteId: "srd",
    siteName: "SRD Innovation Fund",
    primaryColor: "blue",
    secondaryColor: "indigo",
    favicon: "/favicons/srd-favicon.ico",
    ogImage: "/og-images/srd-og.png",
    customCSS: `
      :root {
        --primary: 219 100% 50%;
        --primary-foreground: 0 0% 98%;
        --secondary: 239 84% 67%;
        --accent: 219 100% 95%;
      }
    `,
  },
  "sanskrutcorp.com": {
    domain: "sanskrutcorp.com",
    siteId: "sanskrut-corp",
    siteName: "Sanskrut Corp",
    primaryColor: "green",
    secondaryColor: "emerald",
    favicon: "/favicons/sanskrut-corp-favicon.ico",
    ogImage: "/og-images/sanskrut-corp-og.png",
    customCSS: `
      :root {
        --primary: 142 76% 36%;
        --primary-foreground: 0 0% 98%;
        --secondary: 151 55% 42%;
        --accent: 142 76% 95%;
      }
    `,
  },
  "sanskrutenterprises.com": {
    domain: "sanskrutenterprises.com",
    siteId: "sanskrut-enterprises",
    siteName: "Sanskrut Enterprises",
    primaryColor: "purple",
    secondaryColor: "violet",
    favicon: "/favicons/sanskrut-enterprises-favicon.ico",
    ogImage: "/og-images/sanskrut-enterprises-og.png",
    customCSS: `
      :root {
        --primary: 262 83% 58%;
        --primary-foreground: 0 0% 98%;
        --secondary: 263 70% 50%;
        --accent: 262 83% 95%;
      }
    `,
  },
  "sandeep.com": {
    domain: "sandeep.com",
    siteId: "sandeep",
    siteName: "Sandeep - Technology Leader",
    primaryColor: "orange",
    secondaryColor: "amber",
    favicon: "/favicons/sandeep-favicon.ico",
    ogImage: "/og-images/sandeep-og.png",
    customCSS: `
      :root {
        --primary: 24 95% 53%;
        --primary-foreground: 0 0% 98%;
        --secondary: 45 93% 47%;
        --accent: 24 95% 95%;
      }
    `,
  },
  "localhost:3000": {
    domain: "localhost:3000",
    siteId: "selector",
    siteName: "Portfolio Ecosystem",
    primaryColor: "slate",
    secondaryColor: "gray",
    favicon: "/favicon.ico",
    ogImage: "/og-image.png",
  },
  "preview-dynamic-multi-page-website-kzmpb837xu3mka676gz7.vusercontent.net": {
    domain: "preview-dynamic-multi-page-website-kzmpb837xu3mka676gz7.vusercontent.net",
    siteId: "selector",
    siteName: "Portfolio Ecosystem",
    primaryColor: "slate",
    secondaryColor: "gray",
    favicon: "/favicon.ico",
    ogImage: "/og-image.png",
  },
}

// Site ID to config mapping for URL parameter access
export const siteIdConfigs: Record<string, DomainConfig> = {
  srd: {
    domain: "srd.fund",
    siteId: "srd",
    siteName: "SRD Innovation Fund",
    primaryColor: "blue",
    secondaryColor: "indigo",
    favicon: "/favicons/srd-favicon.ico",
    ogImage: "/og-images/srd-og.png",
    customCSS: domainConfigs["srd.fund"].customCSS,
  },
  "sanskrut-corp": {
    domain: "sanskrutcorp.com",
    siteId: "sanskrut-corp",
    siteName: "Sanskrut Corp",
    primaryColor: "green",
    secondaryColor: "emerald",
    favicon: "/favicons/sanskrut-corp-favicon.ico",
    ogImage: "/og-images/sanskrut-corp-og.png",
    customCSS: domainConfigs["sanskrutcorp.com"].customCSS,
  },
  "sanskrut-enterprises": {
    domain: "sanskrutenterprises.com",
    siteId: "sanskrut-enterprises",
    siteName: "Sanskrut Enterprises",
    primaryColor: "purple",
    secondaryColor: "violet",
    favicon: "/favicons/sanskrut-enterprises-favicon.ico",
    ogImage: "/og-images/sanskrut-enterprises-og.png",
    customCSS: domainConfigs["sanskrutenterprises.com"].customCSS,
  },
  sandeep: {
    domain: "sandeep.com",
    siteId: "sandeep",
    siteName: "Sandeep - Technology Leader",
    primaryColor: "orange",
    secondaryColor: "amber",
    favicon: "/favicons/sandeep-favicon.ico",
    ogImage: "/og-images/sandeep-og.png",
    customCSS: domainConfigs["sandeep.com"].customCSS,
  },
  selector: {
    domain: "localhost:3000",
    siteId: "selector",
    siteName: "Portfolio Ecosystem",
    primaryColor: "slate",
    secondaryColor: "gray",
    favicon: "/favicon.ico",
    ogImage: "/og-image.png",
  },
}

export function getDomainConfig(host: string): DomainConfig {
  // Remove port for localhost development
  const domain = host.includes("localhost") ? "localhost:3000" : host
  return domainConfigs[domain] || domainConfigs["localhost:3000"]
}

export function getSiteConfig(siteId: string): DomainConfig {
  return siteIdConfigs[siteId] || siteIdConfigs["selector"]
}

export function getSiteIdFromDomain(host: string): string {
  const config = getDomainConfig(host)
  return config.siteId
}

// Get config based on either domain or site parameter
export function getActiveConfig(host: string, siteParam?: string | null): DomainConfig {
  // If site parameter is provided, use it (URL parameter takes precedence)
  if (siteParam && siteIdConfigs[siteParam]) {
    return siteIdConfigs[siteParam]
  }

  // Otherwise, use domain-based config
  return getDomainConfig(host)
}
