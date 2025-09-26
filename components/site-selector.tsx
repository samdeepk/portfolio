"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Users, Building2, Briefcase, TrendingUp, ExternalLink, Globe, LinkIcon } from "lucide-react"
import Link from "next/link"
import { portfolioData } from "@/lib/data"
import { AnimatedCounter } from "@/components/ui/animated-counter"

interface EntityConfig {
  id: string
  name: string
  description: string
  theme: string
  icon: React.ReactNode
  stats: {
    projects: number
    people: number
    companies: number
  }
  quickLinks: Array<{
    label: string
    href: string
    external?: boolean
  }>
}

const entityConfigs: EntityConfig[] = [
  {
    id: "srd",
    name: "SRD Innovation Fund",
    description: "Venture capital and innovation funding",
    theme: "Investment",
    icon: <TrendingUp className="h-6 w-6" />,
    stats: {
      projects: portfolioData.filter((p) => p.entity === "srd").length,
      people: new Set(portfolioData.filter((p) => p.entity === "srd").map((p) => p.person)).size,
      companies: new Set(portfolioData.filter((p) => p.entity === "srd").map((p) => p.company)).size,
    },
    quickLinks: [
      { label: "Portfolio", href: "/?entity=srd" },
      { label: "Domain Access", href: "https://srd.fund", external: true },
    ],
  },
  {
    id: "sanskrut-corp",
    name: "Sanskrut Corp",
    description: "Corporate solutions and consulting",
    theme: "Corporate",
    icon: <Building2 className="h-6 w-6" />,
    stats: {
      projects: portfolioData.filter((p) => p.entity === "sanskrut-corp").length,
      people: new Set(portfolioData.filter((p) => p.entity === "sanskrut-corp").map((p) => p.person)).size,
      companies: new Set(portfolioData.filter((p) => p.entity === "sanskrut-corp").map((p) => p.company)).size,
    },
    quickLinks: [
      { label: "Portfolio", href: "/?entity=sanskrut-corp" },
      { label: "Domain Access", href: "https://corp.sanskrut.in", external: true },
    ],
  },
  {
    id: "sanskrut-enterprises",
    name: "Sanskrut Enterprises",
    description: "Business development and operations",
    theme: "Enterprise",
    icon: <Briefcase className="h-6 w-6" />,
    stats: {
      projects: portfolioData.filter((p) => p.entity === "sanskrut-enterprises").length,
      people: new Set(portfolioData.filter((p) => p.entity === "sanskrut-enterprises").map((p) => p.person)).size,
      companies: new Set(portfolioData.filter((p) => p.entity === "sanskrut-enterprises").map((p) => p.company)).size,
    },
    quickLinks: [
      { label: "Portfolio", href: "/?entity=sanskrut-enterprises" },
      { label: "Domain Access", href: "https://ent.sanskrut.in", external: true },
    ],
  },
  {
    id: "sandeep",
    name: "Sandeep Koduri",
    description: "Technology leader and entrepreneur",
    theme: "Personal",
    icon: <Users className="h-6 w-6" />,
    stats: {
      projects: portfolioData.filter((p) => p.person === "Sandeep Koduri").length,
      people: 1,
      companies: new Set(portfolioData.filter((p) => p.person === "Sandeep Koduri").map((p) => p.company)).size,
    },
    quickLinks: [
      { label: "Portfolio", href: "/?site=sandeep" },
      { label: "Domain Access", href: "https://sandeepkoduri.com", external: true },
    ],
  },
]

export function SiteSelector() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEntities = useMemo(() => {
    if (!searchTerm) return entityConfigs
    return entityConfigs.filter(
      (entity) =>
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.theme.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const totalStats = useMemo(() => {
    return entityConfigs.reduce(
      (acc, entity) => ({
        projects: acc.projects + entity.stats.projects,
        people: acc.people + entity.stats.people,
        companies: acc.companies + entity.stats.companies,
      }),
      { projects: 0, people: 0, companies: 0 },
    )
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Portfolio Ecosystem</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore our multi-site portfolio system with custom domains and URL parameters
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search sites and portfolios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glow-effect"
              />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center glow-effect slide-up stagger-1">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                <AnimatedCounter end={totalStats.projects} />
              </div>
              <p className="text-muted-foreground">Total Projects</p>
            </CardContent>
          </Card>
          <Card className="text-center glow-effect slide-up stagger-2">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                <AnimatedCounter end={totalStats.people} />
              </div>
              <p className="text-muted-foreground">People</p>
            </CardContent>
          </Card>
          <Card className="text-center glow-effect slide-up stagger-3">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                <AnimatedCounter end={totalStats.companies} />
              </div>
              <p className="text-muted-foreground">Companies</p>
            </CardContent>
          </Card>
        </div>

        {/* Entity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEntities.map((entity, index) => (
            <Card key={entity.id} className={`glow-effect slide-up stagger-${index + 1}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">{entity.icon}</div>
                    <div>
                      <CardTitle className="gradient-text">{entity.name}</CardTitle>
                      <CardDescription>{entity.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="glow-effect">
                    {entity.theme}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      <AnimatedCounter end={entity.stats.projects} />
                    </div>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      <AnimatedCounter end={entity.stats.people} />
                    </div>
                    <p className="text-xs text-muted-foreground">People</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      <AnimatedCounter end={entity.stats.companies} />
                    </div>
                    <p className="text-xs text-muted-foreground">Companies</p>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-2">
                  {entity.quickLinks.map((link, linkIndex) => (
                    <div key={linkIndex}>
                      {link.external ? (
                        <Button variant="outline" size="sm" asChild className="glow-effect bg-transparent">
                          <a href={link.href} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-3 w-3 mr-1" />
                            {link.label}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" asChild className="glow-effect bg-transparent">
                          <Link href={link.href}>
                            <LinkIcon className="h-3 w-3 mr-1" />
                            {link.label}
                          </Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredEntities.length === 0 && (
          <div className="text-center py-12 fade-in">
            <p className="text-muted-foreground text-lg">No sites found matching your search.</p>
            <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4 glow-effect">
              Clear Search
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-border fade-in">
          <p className="text-muted-foreground">Navigate using URL parameters (?site=sandeep) or custom domains</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Badge variant="outline">?site=sandeep</Badge>
            <Badge variant="outline">?entity=srd</Badge>
            <Badge variant="outline">sandeepkoduri.com</Badge>
            <Badge variant="outline">srd.fund</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
