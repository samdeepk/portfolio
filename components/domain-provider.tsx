"use client"

import type React from "react"
import { createContext, useContext } from "react"

export interface DomainConfig {
  domain: string
  siteId: string
  siteName: string
  theme: string
  primaryColor: string
  favicon: string
  ogImage: string
}

const DomainContext = createContext<DomainConfig | null>(null)

export function DomainProvider({
  children,
  config,
}: {
  children: React.ReactNode
  config?: DomainConfig
}) {
  // Provide a default config if none is provided
  const defaultConfig: DomainConfig = {
    domain: "localhost:3000",
    siteId: "selector",
    siteName: "Portfolio System",
    theme: "default",
    primaryColor: "#000000",
    favicon: "/favicon.ico",
    ogImage: "/placeholder.svg?height=630&width=1200",
  }

  return <DomainContext.Provider value={config || defaultConfig}>{children}</DomainContext.Provider>
}

export function useDomain(): DomainConfig {
  const context = useContext(DomainContext)
  // Return default config instead of throwing error
  if (!context) {
    return {
      domain: "localhost:3000",
      siteId: "selector",
      siteName: "Portfolio System",
      theme: "default",
      primaryColor: "#000000",
      favicon: "/favicon.ico",
      ogImage: "/placeholder.svg?height=630&width=1200",
    }
  }
  return context
}
