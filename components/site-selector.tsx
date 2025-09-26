"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Building, User, Globe, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { sites } from "@/lib/shared-data"

export function SiteSelector() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.theme.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center mb-12 animate-in slide-in-from-top duration-700">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-4xl md:text-6xl font-bold gradient-text">Portfolio Universe</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover a dynamic ecosystem of portfolios, each telling a unique story of innovation, growth, and
              success. Choose your journey below.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto animate-in slide-in-from-bottom duration-700 delay-200">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search portfolios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glow-effect"
              />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-in slide-in-from-bottom duration-700 delay-300">
            <Card className="text-center glow-effect">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{sites.length}</div>
                <div className="text-sm text-muted-foreground">Total Sites</div>
              </CardContent>
            </Card>
            <Card className="text-center glow-effect">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {sites.reduce((acc, site) => acc + site.totalProjects, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </CardContent>
            </Card>
            <Card className="text-center glow-effect">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {sites.reduce((acc, site) => acc + site.companies, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </CardContent>
            </Card>
            <Card className="text-center glow-effect">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {sites.reduce((acc, site) => acc + site.investments, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Investments</div>
              </CardContent>
            </Card>
          </div>

          {/* Site Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map((site, index) => (
              <Card
                key={site.id}
                className="group hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer glow-effect animate-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {site.type === "company" ? (
                        <Building className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{site.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {site.theme}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{site.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-sm font-semibold text-primary">{site.totalProjects}</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-sm font-semibold text-primary">{site.companies}</div>
                      <div className="text-xs text-muted-foreground">Companies</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-sm font-semibold text-primary">{site.investments}</div>
                      <div className="text-xs text-muted-foreground">Investments</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link href={`/?site=${site.id}`} className="flex-1">
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Site
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>

                  {/* Domain Info */}
                  {site.customDomain && (
                    <div className="mt-3 p-2 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground">Custom Domain:</div>
                      <div className="text-sm font-mono text-primary">{site.customDomain}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSites.length === 0 && (
            <div className="text-center py-12 animate-in fade-in duration-500">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No sites found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or browse all available sites.
              </p>
              <Button onClick={() => setSearchTerm("")} variant="outline">
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Portfolio Universe. Built with React, Next.js and Tailwind CSS.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Badge variant="outline">Multi-Site</Badge>
              <Badge variant="outline">Dynamic Routing</Badge>
              <Badge variant="outline">Custom Domains</Badge>
              <Badge variant="outline">URL Parameters</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
