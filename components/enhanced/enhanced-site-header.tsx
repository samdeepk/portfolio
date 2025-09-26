"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Moon, Sun, ExternalLink, Globe, LinkIcon, Copy, Navigation } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useDomain } from "@/components/domain-provider"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { SmartBreadcrumb } from "@/components/navigation/smart-breadcrumb"
import { URLNavigatorWidget } from "@/components/navigation/url-navigator-widget"
import type { Site } from "@/lib/shared-data"

interface EnhancedSiteHeaderProps {
  site: Site
}

export function EnhancedSiteHeader({ site }: EnhancedSiteHeaderProps) {
  const { theme, setTheme } = useTheme()
  const domainConfig = useDomain()
  const searchParams = useSearchParams()
  const siteParam = searchParams.get("site")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [showNavigator, setShowNavigator] = useState(false)
  const { toast } = useToast()

  // Determine if we're accessing via domain or parameter
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
    <>
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showAllSitesLink ? (
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10 transition-all duration-200 glow-accent"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    All Sites
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-border/50">
                    <span className="text-primary font-bold text-sm">{site.name.charAt(0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isParameterAccess && (
                      <Badge variant="outline" className="text-xs animate-slide-in-left border-primary/20 bg-primary/5">
                        <LinkIcon className="h-3 w-3 mr-1" />
                        Parameter
                      </Badge>
                    )}
                    {isDomainAccess && (
                      <Badge variant="outline" className="text-xs animate-slide-in-left border-primary/20 bg-primary/5">
                        <Globe className="h-3 w-3 mr-1" />
                        Domain
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded-md">
                      {domainConfig.domain}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-gradient">{site.name}</h1>
                <Badge variant="secondary" className="animate-slide-in-right bg-secondary/50 border-border/50">
                  {site.theme}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* URL Navigator Widget */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNavigator(!showNavigator)}
                className="hidden md:flex hover:bg-primary/10 transition-all duration-200 glow-accent"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Navigate
              </Button>

              {/* Access Method Controls */}
              {!showAllSitesLink && (
                <div className="hidden lg:flex items-center space-x-1 mr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyCurrentUrl}
                    className="text-xs hover:bg-primary/10 transition-all duration-200"
                  >
                    <Copy
                      className={`h-3 w-3 mr-1 transition-colors ${copiedUrl === window.location.href ? "text-green-400" : ""}`}
                    />
                    Copy URL
                  </Button>

                  {/* Alternative access method */}
                  {site.id in siteUrls && (
                    <>
                      {isParameterAccess ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="hover:bg-primary/10 transition-all duration-200"
                        >
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
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="hover:bg-primary/10 transition-all duration-200"
                        >
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
                  <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-all duration-200">
                    <a href="https://srd.fund" target="_blank" rel="noopener noreferrer">
                      SRD
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-all duration-200">
                    <a href="https://corp.sanskrut.in" target="_blank" rel="noopener noreferrer">
                      Corp
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-all duration-200">
                    <a href="https://ent.sanskrut.in" target="_blank" rel="noopener noreferrer">
                      Enterprises
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-all duration-200">
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
                className="hover:bg-primary/10 transition-all duration-200 glow-accent"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="mt-3 pt-3 border-t border-border/30">
            <SmartBreadcrumb site={site} />
          </div>
        </div>
      </header>

      {/* URL Navigator Widget */}
      {showNavigator && (
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm p-4 animate-slide-in-from-top">
          <URLNavigatorWidget onClose={() => setShowNavigator(false)} />
        </div>
      )}
    </>
  )
}
