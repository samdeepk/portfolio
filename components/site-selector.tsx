
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, TrendingUp, Home, User, ExternalLink, Globe, LinkIcon, Copy, Code } from "lucide-react"
import Link from "next/link"
import { sites } from "@/lib/shared-data"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function SiteSelector() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const siteConfigs = [
    {
      ...sites.srd,
      icon: TrendingUp,
      projects: 5,
      highlight: "Latest: xAI (2024)",
      domain: "srd.fund",
      url: "https://srd.fund",
      paramUrl: "/?site=srd",
    },
    {
      ...sites.sanskrut_corp,
      icon: Code,
      projects: 3,
      highlight: "Active: 2013-2021",
      domain: "sanskrutcorp.com",
      url: "https://sanskrutcorp.com",
      paramUrl: "/?site=sanskrut-corp",
    },
    {
      ...sites.sanskrut_enterprises,
      icon: Home,
      projects: 4,
      highlight: "Portfolio Value: $2M+",
      domain: "sanskrutenterprises.com",
      url: "https://sanskrutenterprises.com",
      paramUrl: "/?site=sanskrut-enterprises",
    },
    {
      ...sites.sandeep,
      icon: User,
      projects: 15,
      highlight: "15+ Years Experience",
      domain: "sandeep.com",
      url: "https://sandeep.com",
      paramUrl: "/?site=sandeep",
    },
  ]

  const copyToClipboard = async (url: string, type: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      toast({
        title: "URL Copied!",
        description: `${type} URL copied to clipboard`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Portfolio Ecosystem
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our interconnected network of investments, incubations, hospitality ventures, and professional
            achievements. Access each site via custom domain or URL parameter.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Custom Domains</span>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span>URL Parameters</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {siteConfigs.map((site) => {
            const Icon = site.icon
            return (
              <Card
                key={site.id}
                className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${site.primaryColor}-100 dark:bg-${site.primaryColor}-900/20`}>
                      <Icon className={`h-8 w-8 text-${site.primaryColor}-600`} />
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{site.theme}</Badge>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{site.name}</CardTitle>
                  <CardDescription className="text-base">{site.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Site Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Projects</span>
                        <span className="font-semibold">{site.projects}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Highlight</span>
                        <span className="font-semibold text-right text-xs">{site.highlight}</span>
                      </div>
                    </div>

                    {/* Access Methods */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Access Methods:</h4>

                      {/* Custom Domain */}
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{site.domain}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(site.url, "Domain")}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className={`h-3 w-3 ${copiedUrl === site.url ? "text-green-600" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                            <a href={site.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>

                      {/* URL Parameter */}
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{site.paramUrl}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(window.location.origin + site.paramUrl, "Parameter")}
                            className="h-8 w-8 p-0"
                          >
                            <Copy
                              className={`h-3 w-3 ${copiedUrl === (window.location.origin + site.paramUrl) ? "text-green-600" : ""}`}
                            />
                          </Button>
                          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                            <Link href={site.paramUrl}>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="lg">
                        <Link href={site.paramUrl}>Preview Site</Link>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <a href={site.url} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Access Examples */}
        <div className="text-center mt-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6">Flexible Access Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Custom Domains */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Custom Domains
                  </h4>
                  <div className="text-left space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                      <span className="font-mono">srd.fund</span>
                      <span className="text-muted-foreground">→ Investment Fund</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                      <span className="font-mono">sanskrutcorp.com</span>
                      <span className="text-muted-foreground">→ Incubation</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                      <span className="font-mono">sanskrutenterprises.com</span>
                      <span className="text-muted-foreground">→ Hospitality</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                      <span className="font-mono">sandeep.com</span>
                      <span className="text-muted-foreground">→ Personal</span>
                    </div>
                  </div>
                </div>

                {/* URL Parameters */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    URL Parameters
                  </h4>
                  <div className="text-left space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                      <span className="font-mono">?site=srd</span>
                      <span className="text-muted-foreground">→ Investment Fund</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                      <span className="font-mono">?site=sanskrut-corp</span>
                      <span className="text-muted-foreground">→ Incubation</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                      <span className="font-mono">?site=sanskrut-enterprises</span>
                      <span className="text-muted-foreground">→ Hospitality</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/50 rounded">
                      <span className="font-mono">?site=sandeep</span>
                      <span className="text-muted-foreground">→ Personal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Pro Tip:</strong> URL parameters take precedence over domain routing, making it easy to test
                  and share specific sites regardless of the current domain.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
