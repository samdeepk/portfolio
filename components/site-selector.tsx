"use client"

import { useState, useMemo } from "react"
import { Search, TrendingUp, Building, User, Briefcase, ArrowRight, Globe, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { portfolioData, entityConfigs } from "@/lib/data"

const sites = [
  {
    id: "srd",
    name: "SRD Innovation Fund",
    description: "Investment fund focused on early-stage technology startups",
    theme: "Investment Fund",
    color: "blue",
    domain: "srd.fund",
    stats: { projects: 8, investments: 8, companies: 0, experiences: 0 },
  },
  {
    id: "sanskrut-corp",
    name: "Sanskrut Corp",
    description: "Corporate ventures and business development initiatives",
    theme: "Corporate Ventures",
    color: "green",
    domain: "corp.sanskrut.in",
    stats: { projects: 6, investments: 2, companies: 3, experiences: 1 },
  },
  {
    id: "sanskrut-enterprises",
    name: "Sanskrut Enterprises",
    description: "Enterprise solutions and technology consulting",
    theme: "Enterprise Solutions",
    color: "purple",
    domain: "ent.sanskrut.in",
    stats: { projects: 4, investments: 1, companies: 2, experiences: 1 },
  },
  {
    id: "sandeep",
    name: "Sandeep Koduri",
    description: "Technology leader and entrepreneur with 15+ years experience",
    theme: "Technology Leader",
    color: "orange",
    domain: "sandeepkoduri.com",
    stats: { projects: 15, investments: 3, companies: 2, experiences: 10 },
  },
]

export function SiteSelector() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSites = useMemo(() => {
    if (!searchQuery) return sites
    return sites.filter(
      (site) =>
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.theme.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  const totalStats = useMemo(() => {
    return {
      totalProjects: portfolioData.length,
      investments: portfolioData.filter((item) => item.type === "Investment").length,
      companies: portfolioData.filter((item) => item.type === "Company").length,
      experiences: portfolioData.filter((item) => item.type === "Job Experience").length,
      incubations: portfolioData.filter((item) => item.type === "Incubation").length,
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">Portfolio Ecosystem</h1>
            <p className="text-muted-foreground">Choose a site to explore or browse all portfolios</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 backdrop-blur-sm border-border/50"
            />
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <Card className="card-enhanced glow-effect">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{totalStats.totalProjects}</div>
              <div className="text-xs text-muted-foreground">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="card-enhanced glow-effect">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{totalStats.investments}</div>
              <div className="text-xs text-muted-foreground">Investments</div>
            </CardContent>
          </Card>
          <Card className="card-enhanced glow-effect">
            <CardContent className="p-4 text-center">
              <Building className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{totalStats.companies}</div>
              <div className="text-xs text-muted-foreground">Companies</div>
            </CardContent>
          </Card>
          <Card className="card-enhanced glow-effect">
            <CardContent className="p-4 text-center">
              <Briefcase className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{totalStats.experiences}</div>
              <div className="text-xs text-muted-foreground">Experiences</div>
            </CardContent>
          </Card>
          <Card className="card-enhanced glow-effect">
            <CardContent className="p-4 text-center">
              <Building className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{totalStats.incubations}</div>
              <div className="text-xs text-muted-foreground">Incubations</div>
            </CardContent>
          </Card>
        </div>

        {/* Sites Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {filteredSites.map((site, index) => (
            <Card
              key={site.id}
              className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer card-enhanced glow-effect animate-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center`}>
                      <span className="text-primary-foreground font-bold">{site.name.charAt(0)}</span>
                    </div>
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors">{site.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {site.theme}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      {site.domain}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{site.description}</p>

                {/* Site Stats */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{site.stats.projects}</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{site.stats.investments}</div>
                    <div className="text-xs text-muted-foreground">Investments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{site.stats.companies}</div>
                    <div className="text-xs text-muted-foreground">Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{site.stats.experiences}</div>
                    <div className="text-xs text-muted-foreground">Experience</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/?site=${site.id}`} className="flex-1">
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Portfolio
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" asChild>
                    <a href={`https://${site.domain}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access to Entities */}
        <div className="animate-in slide-in-from-bottom duration-700 delay-400">
          <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">Quick Access by Person or Company</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(entityConfigs).map(([key, config], index) => (
              <Link key={key} href={`/?entity=${key}`}>
                <Card
                  className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-center card-enhanced glow-effect animate-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                      {key === "srd" || key === "sanskrut-corp" || key === "sanskrut-ent" ? (
                        <Building className="h-8 w-8 mx-auto text-primary" />
                      ) : (
                        <User className="h-8 w-8 mx-auto text-primary" />
                      )}
                    </div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">{config.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{config.theme}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No sites found matching your search</p>
            <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4">
              Clear Search
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Portfolio Ecosystem. Built with React, Next.js and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
