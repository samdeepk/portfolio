
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, MapPin, ExternalLink, Code } from "lucide-react"
import { sites, sanskrutCorpProjects } from "@/lib/shared-data"
import { SiteHeader } from "@/components/shared/site-header"
import { ProjectTimeline } from "@/components/shared/project-timeline"

export function SanskrutCorpSite() {
  const site = sites.sanskrut_corp

  const activeProjects = sanskrutCorpProjects.filter((p) => p.status === "active")
  const completedProjects = sanskrutCorpProjects.filter((p) => p.status === "completed")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <SiteHeader site={site} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Code className="h-12 w-12 text-green-600 mr-4" />
            <h1 className="text-5xl font-bold text-green-900 dark:text-green-100">{site.name}</h1>
          </div>
          <p className="text-xl text-green-700 dark:text-green-300 mb-6">{site.title}</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{site.description}</p>
        </div>

        {/* Incubation Timeline Banner */}
        <Card className="mb-12 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-green-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">Active Incubation Phase</h2>
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className="text-3xl font-bold text-green-600">2013</div>
                <div className="text-sm text-green-700 dark:text-green-300">Started</div>
              </div>
              <div className="h-1 w-16 bg-green-400"></div>
              <div>
                <div className="text-3xl font-bold text-green-600">2021</div>
                <div className="text-sm text-green-700 dark:text-green-300">Matured</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{sanskrutCorpProjects.length}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{activeProjects.length}</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">8</div>
              <div className="text-sm text-muted-foreground">Years Active</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="space-y-8">
              {/* Active Projects */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-800 dark:text-green-200">Active Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{project.category}</Badge>
                          <Badge variant="default" className="bg-green-600">
                            Active
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-green-900">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Year</span>
                            <span className="font-semibold">{project.year}</span>
                          </div>
                          {project.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{project.location}</span>
                            </div>
                          )}
                          {project.website && (
                            <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                              <a href={project.website} target="_blank" rel="noopener noreferrer">
                                Visit Website
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Completed Projects */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-800 dark:text-green-200">Completed Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur opacity-80"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{project.category}</Badge>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                        <CardTitle className="text-xl text-green-900">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Year</span>
                            <span className="font-semibold">{project.year}</span>
                          </div>
                          {project.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{project.location}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <ProjectTimeline projects={sanskrutCorpProjects} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
