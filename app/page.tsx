"use client"

import { Suspense, useMemo } from "react"
import { Moon, Sun, User, Building, TrendingUp, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useSearchParams } from "next/navigation"
import { portfolioData, entityConfigs } from "@/lib/data"
import { SRDSite } from "@/components/sites/srd-site"
import { SanskrutCorpSite } from "@/components/sites/sanskrut-corp-site"
import { SanskrutEnterprisesSite } from "@/components/sites/sanskrut-enterprises-site"
import { SandeepSite } from "@/components/sites/sandeep-site"
import { EnhancedPortfolioGrid } from "@/components/enhanced/enhanced-portfolio-grid"
import { EnhancedStatsCard } from "@/components/enhanced/enhanced-stats-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

function PageContent() {
  const searchParams = useSearchParams()
  const { theme, setTheme } = useTheme()
  const site = searchParams.get("site")
  const entity = searchParams.get("entity")

  // Get site from URL parameter
  const currentEntity = entity ? entityConfigs[entity as keyof typeof entityConfigs] : null

  // Calculate stats for enhanced display
  const stats = useMemo(() => {
    const data = currentEntity
      ? portfolioData.filter((item) => item.associations.includes(currentEntity.name))
      : portfolioData
    return {
      totalProjects: data.length,
      investments: data.filter((item) => item.type === "Investment").length,
      jobExperiences: data.filter((item) => item.type === "Job Experience").length,
      incubations: data.filter((item) => item.type === "Incubation").length,
      companies: data.filter((item) => item.type === "Company").length,
    }
  }, [entity])

  // Route based on site parameter
  if (site === "sandeep") {
    return <SandeepSite />
  }

  if (site === "srd" || entity === "srd") {
    return <SRDSite />
  }

  if (site === "sanskrut-corp" || entity === "sanskrut-corp") {
    return <SanskrutCorpSite />
  }

  if (site === "sanskrut-enterprises" || entity === "sanskrut-enterprises") {
    return <SanskrutEnterprisesSite />
  }

  // Default to site selector
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold gradient-text">
                {currentEntity ? currentEntity.name : "Portfolio System"}
              </h1>
              {currentEntity && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 animate-in slide-in-from-left duration-300"
                >
                  {entity === "srd" || entity === "sanskrut-corp" || entity === "sanskrut-enterprises" ? (
                    <Building className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {currentEntity.theme}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-primary/10 transition-colors glow-effect"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12 animate-in slide-in-from-top duration-700">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            {currentEntity ? currentEntity.title : "Discover Projects & Companies"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentEntity
              ? currentEntity.description
              : "Explore our dynamic portfolio of investments, incubations, and professional experiences"}
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <EnhancedStatsCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <EnhancedStatsCard
            title="Investments"
            value={stats.investments}
            icon={<TrendingUp className="h-4 w-4" />}
            className="animate-in slide-in-from-left duration-500 delay-100"
          />
          <EnhancedStatsCard
            title="Job Experiences"
            value={stats.jobExperiences}
            icon={<Briefcase className="h-4 w-4" />}
            className="animate-in slide-in-from-left duration-500 delay-200"
          />
          <EnhancedStatsCard
            title="Companies"
            value={stats.companies}
            icon={<Building className="h-4 w-4" />}
            className="animate-in slide-in-from-left duration-500 delay-300"
          />
        </div>

        {/* Entity Navigation */}
        {!entity && (
          <div className="mb-12 animate-in slide-in-from-bottom duration-700 delay-200">
            <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">Browse by Person or Company</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(entityConfigs).map(([key, config], index) => (
                <Link key={key} href={`/?entity=${key}`}>
                  <Card
                    className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer text-center animate-in slide-in-from-bottom duration-500 glow-effect card-enhanced"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                        {key === "srd" || key === "sanskrut-corp" || key === "sanskrut-enterprises" ? (
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
        )}

        {/* Enhanced Portfolio Grid */}
        <div className="animate-in slide-in-from-bottom duration-700 delay-400">
          <EnhancedPortfolioGrid entity={entity} initialData={portfolioData} />
        </div>

        {portfolioData.length === 0 && (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <p className="text-lg text-muted-foreground">No projects found</p>
            <Link href="/">
              <Button className="mt-4 glow-effect">View All Projects</Button>
            </Link>
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t mt-16 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 {currentEntity ? currentEntity.name : "Portfolio System"}. Built with React, Next.js and Tailwind
              CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PageContent />
    </Suspense>
  )
}
