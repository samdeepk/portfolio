"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink, Building, User, Globe, Zap } from "lucide-react"
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
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">Portfolio System</h1>
            <p className="text-muted-foreground">Choose a site to explore</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-in slide-in-from-top duration-700">
          <h2 className="text-5xl font-bold mb-4 gradient-text">
            Dynamic Multi-Site
            <br />
            Portfolio System
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our comprehensive portfolio system featuring multiple sites, each with unique themes and content.
            Navigate seamlessly between different portfolios and discover various projects, investments, and
            experiences.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glow-effect"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center glow-effect">
            <CardContent className="p-4">
              <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{sites.length}</div>
              <div className="text-sm text-muted-foreground">Sites</div>
            </CardContent>
          </Card>
          <Card className="text-center glow-effect">
            <CardContent className="p-4">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{sites.reduce((acc, site) => acc + site.companies, 0)}</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </CardContent>
          </Card>
          <Card className="text-center glow-effect">
            <CardContent className="p-4">
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{sites.reduce((acc, site) => acc + site.totalProjects, 0)}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </CardContent>
          </Card>
          <Card className="text-center glow-effect">
            <CardContent className="p-4">
              <User className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{sites.reduce((acc, site) => acc + site.investments, 0)}</div>
              <div className="text-sm text-muted-foreground">Investments</div>
            </CardContent>
          </Card>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site, index) => (
            <Card
              key={site.id}
              className="group hover:shadow-lg transition-all duration-300 hover:scale-105 glow-effect animate-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="group-hover:text-primary transition-colors gradient-text">
                    {site.name}
                  </CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {site.id === "srd" || site.id === "sanskrut-corp" || site.id === "sanskrut-enterprises" ? (
                      <Building className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    {site.theme}
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground">{site.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="font-semibold text-primary">{site.totalProjects}</div>
                    <div className="text-muted-foreground">Projects</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{site.companies}</div>
                    <div className="text-muted-foreground">Companies</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{site.investments}</div>
                    <div className="text-muted-foreground">Investments</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{site.jobExperiences}</div>
                    <div className="text-muted-foreground">Experience</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/?site=${site.id}`} className="flex-1">
                    <Button className="w-full glow-effect">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Site
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <p className="text-lg text-muted-foreground">No sites found matching your search</p>
            <Button onClick={() => setSearchTerm("")} className="mt-4 glow-effect">
              Clear Search
            </Button>
          </div>
        )}

        {/* Navigation Guide */}
        <div className="mt-16 text-center animate-in slide-in-from-bottom duration-700 delay-400">
          <h3 className="text-2xl font-semibold mb-4 gradient-text">Navigation Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="glow-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  URL Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Access sites directly using URL parameters:</p>
                <code className="text-xs bg-muted p-2 rounded block">/?site=sandeep</code>
              </CardContent>
            </Card>
            <Card className="glow-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Custom Domains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Each site can have its own custom domain:</p>
                <code className="text-xs bg-muted p-2 rounded block">sandeep.example.com</code>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Portfolio System. Built with React, Next.js and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
