"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Moon, Sun, ExternalLink, Globe, LinkIcon, Copy } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useDomain } from "@/components/domain-provider"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { SmartBreadcrumb } from "@/components/navigation/smart-breadcrumb"
import { UrlNavigatorWidget } from "@/components/navigation/url-navigator-widget"
import type { Site } from "@/lib/shared-data"

interface EnhancedSiteHeaderProps {
  site: Site
  showBreadcrumbs?: boolean
  showNavigator?: boolean
}

export function EnhancedSiteHeader({ site, showBreadcrumbs = true, showNavigator = true }: EnhancedSiteHeaderProps) {
  const { theme, setTheme } = useTheme()
  const domainConfig = useDomain()
  const searchParams = useSearchParams()
  const siteParam = searchParams.get("site")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const { toast } = useToast()

  // Determine access method
  const isParameterAccess = !!siteParam
  const isDomainAccess = !isParameterAccess && domainConfig.domain !== "localhost:3000"
  const showAllSitesLink = domainConfig.domain === "localhost:3000" || domainConfig.domain.includes("vusercontent.net")

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiedUrl(window.location.href)
      toast({
        title: "URL Copied!",
        description: "Current page URL copied to clipboard",
      })
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy URL to clipboard",
        variant: "destructive",
      })
    }
  }

  const siteUrls = {
    srd: { domain: "https://srd.fund", param: "/?site=srd" },
    "sanskrut-corp": { domain: "https://corp.sanskrut.in", param: "/?site=sanskrut-corp" },
    "sanskrut-enterprises": { domain: "https://ent.sanskrut.in", param: "/?site=sanskrut-enterprises" },
    sandeep: { domain: "https://sandeepkoduri.com", param: "/?site=sandeep" },
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showAllSitesLink ? (
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  All Sites
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">{site.name.charAt(0)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isParameterAccess && (
                    <Badge variant="outline" className="text-xs animate-in slide-in-from-left duration-300">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      Parameter
                    </Badge>
                  )}
                  {isDomainAccess && (
                    <Badge variant="outline" className="text-xs animate-in slide-in-from-left duration-300">
                      <Globe className="h-3 w-3 mr-1" />
                      Domain
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground font-mono">{domainConfig.domain}</span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {site.name}
              </h1>
              <Badge variant="secondary" className="animate-in slide-in-from-right duration-300">
                {site.theme}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* URL Navigator Widget */}
            {showNavigator && <UrlNavigatorWidget className="hidden md:flex" />}

            {/* Access Method Controls */}
            {!showAllSitesLink && (
              <div className="hidden lg:flex items-center space-x-1 mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCurrentUrl}
                  className="text-xs hover:bg-primary/10 transition-colors"
                >
                  <Copy className={`h-3 w-3 mr-1 ${copiedUrl === window.location.href ? "text-green-600" : ""}`} />
                  Copy URL
                </Button>

                {/* Alternative access method */}
                {site.id in siteUrls && (
                  <>
                    {isParameterAccess ? (
                      <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-colors">
                        <a
                          href={siteUrls[site.id as keyof typeof siteUrls].domain}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          Domain
                        </a>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-colors">
                        <Link href={siteUrls[site.id as keyof typeof siteUrls].param}>
                          <LinkIcon className="h-3 w-3 mr-1" />
                          Parameter
                        </Link>
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Cross-site navigation */}
            {!showAllSitesLink && (
              <div className="hidden xl:flex items-center space-x-1 mr-2">
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-colors">
                  <a href="https://srd.fund" target="_blank" rel="noopener noreferrer">
                    SRD
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-colors">
                  <a href="https://corp.sanskrut.in" target="_blank" rel="noopener noreferrer">
                    Corp
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-colors">
                  <a href="https://ent.sanskrut.in" target="_blank" rel="noopener noreferrer">
                    Enterprises
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-colors">
                  <a href="https://sandeepkoduri.com" target="_blank" rel="noopener noreferrer">
                    Sandeep
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-primary/10 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="mt-2 border-t pt-2">
            <SmartBreadcrumb />
          </div>
        )}
      </div>
    </header>
  )
}
