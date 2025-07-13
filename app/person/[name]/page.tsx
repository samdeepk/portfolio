"use client"

import { ArrowLeft, ExternalLink, Briefcase, TrendingUp, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useTheme } from "next-themes"
import { portfolioData } from "@/lib/data"

export default function PersonPage({ params }: { params: { name: string } }) {
  const { theme, setTheme } = useTheme()
  const personName = params.name.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())

  // Find all projects associated with this person
  const associatedProjects = portfolioData.filter((item) =>
    item.associations.some((person) => person.toLowerCase() === personName.toLowerCase()),
  )

  if (associatedProjects.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Person Not Found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const jobExperiences = associatedProjects.filter((p) => p.type === "Job Experience")
  const investments = associatedProjects.filter((p) => p.type === "Investment")
  const incubations = associatedProjects.filter((p) => p.type === "Incubation")
  const portfolioItems = associatedProjects.filter((p) => p.type === "Portfolio")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">{personName}</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{personName}</h1>
          <p className="text-xl text-muted-foreground mb-6">Portfolio overview and professional timeline</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{associatedProjects.length}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{investments.length}</div>
                <div className="text-sm text-muted-foreground">Investments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{jobExperiences.length}</div>
                <div className="text-sm text-muted-foreground">Job Experiences</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{incubations.length}</div>
                <div className="text-sm text-muted-foreground">Incubations</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Projects by Category */}
        <div className="space-y-8">
          {jobExperiences.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                Job Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobExperiences.map((project) => (
                  <Link key={project.id} href={`/profile/${project.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {project.name}
                          <Badge variant="secondary">{project.theme}</Badge>
                        </CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{project.type}</Badge>
                          {project.website && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {investments.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Investments
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investments.map((project) => (
                  <Link key={project.id} href={`/profile/${project.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {project.name}
                          <div className="flex gap-1">
                            <Badge variant="secondary">{project.theme}</Badge>
                            {project.percentage && <Badge variant="default">{project.percentage}%</Badge>}
                          </div>
                        </CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{project.type}</Badge>
                          {project.website && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {incubations.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Incubations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incubations.map((project) => (
                  <Link key={project.id} href={`/profile/${project.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {project.name}
                          <div className="flex gap-1">
                            <Badge variant="secondary">{project.theme}</Badge>
                            {project.percentage && <Badge variant="default">{project.percentage}%</Badge>}
                          </div>
                        </CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{project.type}</Badge>
                          {project.website && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {portfolioItems.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioItems.map((project) => (
                  <Link key={project.id} href={`/profile/${project.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {project.name}
                          <div className="flex gap-1">
                            <Badge variant="secondary">{project.theme}</Badge>
                            {project.percentage && <Badge variant="default">{project.percentage}%</Badge>}
                          </div>
                        </CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{project.type}</Badge>
                          {project.website && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
