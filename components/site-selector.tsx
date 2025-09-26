"use client"

import { useState, useMemo } from "react"
import { Search, Building, User, TrendingUp, Briefcase, ExternalLink, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { entityConfigs } from "@/lib/data"

const siteConfigs = [
  {
    id: "srd",
    name: "SRD Innovation Fund",
    title: "Investing in Tomorrow's Breakthroughs",
    description: "Showcasing high-value private equity investments in innovative, high-growth startups.",
    theme: "Startup Investments",
    primaryColor: "blue",
    stats: { projects: 8, investments: 8, companies: 0, experiences: 0 },
    icon: Building,
  },
  {
    id: "sanskrut-corp",
    name: "Sanskrut Corp",
    title: "Software Consulting & Incubation",
    description: "Expert software consulting services and a platform for incubating early-stage technology ventures.",
    theme: "Software Consulting",
    primaryColor: "green",
    stats: { projects: 5, investments: 0, companies: 2, experiences: 3 },
    icon: Building,
  },
  {
    id: "sanskrut-enterprises",
    name: "Sanskrut Enterprises",
    title: "Hospitality & Real Estate Excellence",
    description: "A curated portfolio of strategic hospitality investments and premium real estate properties.",
    theme: "Hospitality Investments",
    primaryColor: "purple",
    stats: { projects: 6, investments: 4, companies: 2, experiences: 0 },
    icon: Building,
  },
  {
    id: "sandeep",
    name: "Sandeep Koduri",
    title: "Technology Leader & Strategic Investor",
    description: "Bridging innovation, investment, and operational excellence across a diverse portfolio.",
    theme: "Personal Portfolio",
    primaryColor: "orange",
    stats: { projects: 12, investments: 3, companies: 4, experiences: 5 },
    icon: User,
  },
]

export function SiteSelector() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSites = useMemo(() => {
    if (!searchTerm) return siteConfigs
    return siteConfigs.filter(
      (site) =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.theme.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const totalStats = useMemo(() => {
    return siteConfigs.reduce(
      (acc, site) => ({
        projects: acc.projects + site.stats.projects,
        investments: acc.investments + site.stats.investments,
        companies: acc.companies + site.stats.companies,
        experiences: acc.experiences + site.stats.experiences,
      }),
      { projects: 0, investments: 0, companies: 0, experiences: 0 },
    )
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12 animate-in slide-in-from-top duration-700">
            <h1 className="text-5xl font-bold mb-6 gradient-text">Portfolio Ecosystem</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore our comprehensive portfolio system featuring investments, companies, and professional experiences
              across multiple domains and industries.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search portfolios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card/50 border-border/50 focus:bg-card/80 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="card-enhanced text-center animate-in slide-in-from-bottom duration-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{totalStats.projects}</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </CardContent>
            </Card>
            <Card className="card-enhanced text-center animate-in slide-in-from-bottom duration-500 delay-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">{totalStats.investments}</span>
                </div>
                <p className="text-sm text-muted-foreground">Investments</p>
              </CardContent>
            </Card>
            <Card className="card-enhanced text-center animate-in slide-in-from-bottom duration-500 delay-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Building className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-2xl font-bold">{totalStats.companies}</span>
                </div>
                <p className="text-sm text-muted-foreground">Companies</p>
              </CardContent>
            </Card>
            <Card className="card-enhanced text-center animate-in slide-in-from-bottom duration-500 delay-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Briefcase className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-2xl font-bold">{totalStats.experiences}</span>
                </div>
                <p className="text-sm text-muted-foreground">Experiences</p>
              </CardContent>
            </Card>
          </div>

          {/* Site Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {filteredSites.map((site, index) => {
              const IconComponent = site.icon
              return (
                <Card
                  key={site.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer card-enhanced glow-effect animate-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {site.name}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {site.theme}
                          </Badge>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {site.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{site.description}</p>

                    {/* Site Stats */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{site.stats.projects}</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-500">{site.stats.investments}</div>
                        <div className="text-xs text-muted-foreground">Investments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-500">{site.stats.companies}</div>
                        <div className="text-xs text-muted-foreground">Companies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-500">{site.stats.experiences}</div>
                        <div className="text-xs text-muted-foreground">Experience</div>
                      </div>
                    </div>

                    <Link href={`/?site=${site.id}`}>
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Explore Portfolio
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Entity Quick Access */}
          <div className="animate-in slide-in-from-bottom duration-700 delay-400">
            <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">Quick Access by Entity</h3>
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
                      <h4 className="font-semibold group-hover:text-primary transition-colors text-sm">
                        {config.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{config.theme}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {filteredSites.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No portfolios found matching your search.</p>
              <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
