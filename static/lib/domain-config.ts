export interface DomainConfig {
  domain: string
  siteName: string
  tagline: string
  description: string
  logo: string
  favicon: string
  ogImage: string
  primaryColor: string
  secondaryColor: string
  includeTags: string[]
  excludeTags: string[]
  customCSS?: string
  navigation: Array<{
    label: string
    href: string
    external?: boolean
  }>
  footer: {
    copyright: string
    links: Array<{
      label: string
      href: string
      external?: boolean
    }>
  }
  seo: {
    titleTemplate: string
    defaultTitle: string
    defaultDescription: string
  }
}

const configs: Record<string, DomainConfig> = {
  'srd.fund': {
    domain: 'srd.fund',
    siteName: 'SRD Fund',
    tagline: 'Strategic Investment & Advisory',
    description: 'SRD Fund provides strategic investment and advisory services to innovative companies.',
    logo: '/logos/srd-logo.svg',
    favicon: '/favicons/srd-favicon.ico',
    ogImage: '/og/srd-og.jpg',
    primaryColor: '#1a365d',
    secondaryColor: '#2d3748',
    includeTags: ['investment', 'fintech', 'advisory'],
    excludeTags: ['personal'],
    navigation: [
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Team', href: '/team' },
      { label: 'Insights', href: '/insights' },
      { label: 'Contact', href: '/contact' }
    ],
    footer: {
      copyright: '© 2024 SRD Fund. All rights reserved.',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' }
      ]
    },
    seo: {
      titleTemplate: '%s | SRD Fund',
      defaultTitle: 'SRD Fund - Strategic Investment & Advisory',
      defaultDescription: 'SRD Fund provides strategic investment and advisory services to innovative companies.'
    }
  },
  'sanskrutcorp.com': {
    domain: 'sanskrutcorp.com',
    siteName: 'Sanskrut Corp',
    tagline: 'Corporate Excellence & Innovation',
    description: 'Sanskrut Corp delivers innovative solutions and corporate excellence across industries.',
    logo: '/logos/sanskrut-logo.svg',
    favicon: '/favicons/sanskrut-favicon.ico',
    ogImage: '/og/sanskrut-og.jpg',
    primaryColor: '#2b6cb0',
    secondaryColor: '#3182ce',
    includeTags: ['corporate', 'innovation', 'solutions'],
    excludeTags: ['personal', 'investment'],
    navigation: [
      { label: 'Solutions', href: '/solutions' },
      { label: 'Industries', href: '/industries' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' }
    ],
    footer: {
      copyright: '© 2024 Sanskrut Corp. All rights reserved.',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Careers', href: '/careers' }
      ]
    },
    seo: {
      titleTemplate: '%s | Sanskrut Corp',
      defaultTitle: 'Sanskrut Corp - Corporate Excellence & Innovation',
      defaultDescription: 'Sanskrut Corp delivers innovative solutions and corporate excellence across industries.'
    }
  },
  'sandeep.com': {
    domain: 'sandeep.com',
    siteName: 'Sandeep Raut',
    tagline: 'Entrepreneur & Investor',
    description: 'Personal website of Sandeep Raut - entrepreneur, investor, and technology leader.',
    logo: '/logos/sandeep-logo.svg',
    favicon: '/favicons/sandeep-favicon.ico',
    ogImage: '/og/sandeep-og.jpg',
    primaryColor: '#1a202c',
    secondaryColor: '#2d3748',
    includeTags: ['personal', 'entrepreneurship', 'technology'],
    excludeTags: [],
    navigation: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Writing', href: '/writing' },
      { label: 'Speaking', href: '/speaking' },
      { label: 'Contact', href: '/contact' }
    ],
    footer: {
      copyright: '© 2024 Sandeep Raut. All rights reserved.',
      links: [
        { label: 'LinkedIn', href: 'https://linkedin.com/in/sandeep-raut', external: true },
        { label: 'Twitter', href: 'https://twitter.com/sandeep_raut', external: true },
        { label: 'GitHub', href: 'https://github.com/sandeep-raut', external: true }
      ]
    },
    seo: {
      titleTemplate: '%s | Sandeep Raut',
      defaultTitle: 'Sandeep Raut - Entrepreneur & Investor',
      defaultDescription: 'Personal website of Sandeep Raut - entrepreneur, investor, and technology leader.'
    }
  }
}

// Default config for localhost and unknown domains
const defaultConfig: DomainConfig = {
  domain: 'localhost:3000',
  siteName: 'Portfolio Platform',
  tagline: 'Multi-Brand Portfolio System',
  description: 'A multi-tenant portfolio platform showcasing projects, articles, and expertise.',
  logo: '/logos/default-logo.svg',
  favicon: '/favicon.ico',
  ogImage: '/og-default.jpg',
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',
  includeTags: [],
  excludeTags: [],
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Articles', href: '/articles' },
    { label: 'About', href: '/about' }
  ],
  footer: {
    copyright: '© 2024 Portfolio Platform. All rights reserved.',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' }
    ]
  },
  seo: {
    titleTemplate: '%s | Portfolio Platform',
    defaultTitle: 'Portfolio Platform - Multi-Brand Portfolio System',
    defaultDescription: 'A multi-tenant portfolio platform showcasing projects, articles, and expertise.'
  }
}

export function getActiveConfig(host: string, siteParam?: string): DomainConfig {
  // If site parameter is provided, use it to override domain detection
  if (siteParam && configs[siteParam]) {
    return configs[siteParam]
  }
  
  // Extract domain from host (remove port if present)
  const domain = host.split(':')[0]
  
  // Return config for domain or default
  return configs[domain] || defaultConfig
}

export function getAllDomains(): string[] {
  return Object.keys(configs)
}

export function getConfigByDomain(domain: string): DomainConfig | null {
  return configs[domain] || null
}