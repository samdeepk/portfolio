"use client"

import type React from "react"
import { createContext, useContext } from "react"

interface DomainConfig {
  domain: string
  siteId: string
  siteName: string
  primaryColor: string
  secondaryColor: string
  favicon: string
  ogImage: string
  customCSS?: string
}

const defaultConfig: DomainConfig = {
  domain: "localhost:3000",
  siteId: "selector",
  siteName: "Portfolio Ecosystem",
  primaryColor: "blue",
  secondaryColor: "indigo",
  favicon: "/favicon.ico",
  ogImage: "/og-image.png",
}

const DomainContext = createContext<DomainConfig>(defaultConfig)

export function DomainProvider({
  children,
  config = defaultConfig,
}: {
  children: React.ReactNode
  config?: DomainConfig
}) {
  return <DomainContext.Provider value={config}>{children}</DomainContext.Provider>
}

export function useDomain() {
  const context = useContext(DomainContext)
  return context || defaultConfig
}
