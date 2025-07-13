"use client"

import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useDomain } from "@/components/domain-provider"
import { getSiteConfig } from "@/lib/domain-config"

export function useSiteNavigation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const domainConfig = useDomain()

  const currentSite = searchParams.get("site") || domainConfig.siteId

  const navigateToSite = useCallback(
    (siteId: string, preservePath = false) => {
      const params = new URLSearchParams(searchParams.toString())

      if (siteId === "selector") {
        params.delete("site")
      } else {
        params.set("site", siteId)
      }

      const newPath = preservePath ? pathname : "/"
      const queryString = params.toString()
      const url = queryString ? `${newPath}?${queryString}` : newPath

      router.push(url)
    },
    [router, searchParams, pathname],
  )

  const siteConfig = useMemo(() => {
    return getSiteConfig(currentSite)
  }, [currentSite])

  const isCurrentSite = useCallback(
    (siteId: string) => {
      return currentSite === siteId
    },
    [currentSite],
  )

  const getSiteUrl = useCallback((siteId: string, external = false) => {
    const config = getSiteConfig(siteId)

    if (external && config.domain !== "localhost:3000") {
      return `https://${config.domain}`
    }

    return siteId === "selector" ? "/" : `/?site=${siteId}`
  }, [])

  return {
    currentSite,
    siteConfig,
    navigateToSite,
    isCurrentSite,
    getSiteUrl,
  }
}
