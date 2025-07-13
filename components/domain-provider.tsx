"use client"

import type React from "react"

import { createContext, useContext } from "react"
import type { DomainConfig } from "@/lib/domain-config"

const DomainContext = createContext<DomainConfig | null>(null)

export function DomainProvider({
  children,
  config,
}: {
  children: React.ReactNode
  config: DomainConfig
}) {
  return <DomainContext.Provider value={config}>{children}</DomainContext.Provider>
}

export function useDomain() {
  const context = useContext(DomainContext)
  if (!context) {
    throw new Error("useDomain must be used within a DomainProvider")
  }
  return context
}
