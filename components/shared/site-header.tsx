"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Moon, Sun, ExternalLink, Globe, LinkIcon, Copy } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Site {
  id: string
  name: string
  theme: string
}

interface SiteHeaderProps {
  site: Site
}

export function SiteHeader({ site }: SiteHeaderProps) {
  const { theme, setTheme } = useTheme()
  const searchParams = useSearchParams()
  const siteParam = searchParams.get("site")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [currentDomain, setCurrentDomain] = useState<string>("localhost")
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDomain(window.location.hostname || "localhost")
    }
  }, [])

  // Determine if we're accessing via domain or parameter
  const isParameterAccess = !!siteParam
  const isDomainAccess = !isParameterAccess && currentDomain !== "localhost"
  const showAllSitesLink =
    currentDomain === "localhost" ||
    (currentDomain && currentDomain.includes && currentDomain.includes("vusercontent.net"))

  const copyCurrentUrl = async () => {
    try {
      const currentUrl = typeof window !== "undefined" ? window.location.href : ""
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl)
        setCopiedUrl(currentUrl)
        toast({
          title: "URL Copied!",
          description: "Current page URL copied to clipboard",
        })
        setTimeout(() => setCopiedUrl(null), 2000)
      }
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
                <Button variant="ghost" size="sm" className="glow-effect">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  All Sites
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center glow-effect">
                  <span className="text-primary-foreground font-bold text-sm">
                    {site?.name ? site.name.charAt(0) : "P"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isParameterAccess && (
                    <Badge variant="outline" className="text-xs">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      Parameter
                    </Badge>
                  )}
                  {isDomainAccess && (
                    <Badge variant="outline" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      Domain
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">{currentDomain}</span>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold gradient-text">{site?.name || "Portfolio"}</h1>
              {site?.theme && (
                <Badge variant="secondary" className="glow-effect">
                  {site.theme}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Access Method Toggle */}
            {!showAllSitesLink && (
              <div className="hidden md:flex items-center space-x-1 mr-4">
                <Button variant="ghost" size="sm" onClick={copyCurrentUrl} className="text-xs glow-effect">
                  <Copy
                    className={`h-3 w-3 mr-1 ${
                      copiedUrl === (typeof window !== "undefined" ? window.location.href : "") ? "text-green-400" : ""
                    }`}
                  />
                  Copy URL
                </Button>

                {/* Alternative access method */}
                {site?.id && site.id in siteUrls && (
                  <>
                    {isParameterAccess ? (
                      <Button variant="ghost" size="sm" asChild className="glow-effect">
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
                      <Button variant="ghost" size="sm" asChild className="glow-effect">
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

            {/* Cross-site navigation for custom domains */}
            {!showAllSitesLink && (
              <div className="hidden lg:flex items-center space-x-1 mr-4">
                <Button variant="ghost" size="sm" asChild className="glow-effect">
                  <a href="https://srd.fund" target="_blank" rel="noopener noreferrer">
                    SRD
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild className="glow-effect">
                  <a href="https://corp.sanskrut.in" target="_blank" rel="noopener noreferrer">
                    Corp
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild className="glow-effect">
                  <a href="https://ent.sanskrut.in" target="_blank" rel="noopener noreferrer">
                    Enterprises
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild className="glow-effect">
                  <a href="https://sandeepkoduri.com" target="_blank" rel="noopener noreferrer">
                    Sandeep
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="glow-effect"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
