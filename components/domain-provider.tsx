"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { DomainConfig } from "@/lib/domain-config"

interface DomainContextType {
  siteId: string
  siteName: string
  primaryColor: string
  secondaryColor: string
  favicon: string
  ogImage: string
  customCSS?: string
}

const DomainContext = createContext<DomainContextType | null>(null)

interface DomainProviderProps {
  children: ReactNode
  config?: DomainConfig
}

export function DomainProvider({ children, config }: DomainProviderProps) {
  // Provide default config if none is provided
  const defaultConfig: DomainContextType = {
    siteId: "selector",
    siteName: "Portfolio Ecosystem",
    primaryColor: "slate",
    secondaryColor: "gray",
    favicon: "/favicon.ico",
    ogImage: "/og-image.png",
  }

  const contextValue = config
    ? {
        siteId: config.siteId,
        siteName: config.siteName,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        favicon: config.favicon,
        ogImage: config.ogImage,
        customCSS: config.customCSS,
      }
    : defaultConfig

  return <DomainContext.Provider value={contextValue}>{children}</DomainContext.Provider>
}

export function useDomain(): DomainContextType {
  const context = useContext(DomainContext)

  // Return default config if context is not available
  if (!context) {
    return {
      siteId: "selector",
      siteName: "Portfolio Ecosystem",
      primaryColor: "slate",
      secondaryColor: "gray",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    }
  }

  return context
}
