
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, ExternalLink, Target } from "lucide-react"
import { sites, srdProjects } from "@/lib/shared-data"
import { SiteHeader } from "@/components/shared/site-header"
import { ProjectTimeline } from "@/components/shared/project-timeline"

export function SRDSite() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const site = sites.srd

  const selectedProjectData = selectedProject ? srdProjects.find((p) => p.id === selectedProject) : null

  const totalInvestment = srdProjects.reduce((sum, project) => sum + (project.ownership || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <SiteHeader site={site} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-5xl font-bold text-blue-900 dark:text-blue-100">{site.name}</h1>
          </div>
          <p className="text-xl text-blue-700 dark:text-blue-300 mb-6">{site.title}</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{site.description}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{srdProjects.length}</div>
              <div className="text-sm text-muted-foreground">Active Investments</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalInvestment.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Total Ownership</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2021</div>
              <div className="text-sm text-muted-foreground">First Investment</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
              <div className="text-sm text-muted-foreground">Sectors</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="timeline">Investment Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {srdProjects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur"
                  onClick={() => setSelectedProject(project.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{project.category}</Badge>
                      <Badge variant="default">{project.year}</Badge>
                    </div>
                    <CardTitle className="text-xl text-blue-900">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.ownership && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Ownership</span>
                          <span className="font-semibold text-blue-600">{project.ownership}%</span>
                        </div>
                      )}
                      {project.fundingRound && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Round</span>
                          <span className="font-semibold">{project.fundingRound}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
                        {project.website && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={project.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <ProjectTimeline projects={srdProjects} />
          </TabsContent>
        </Tabs>

        {/* Project Detail Modal */}
        {selectedProjectData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{selectedProjectData.name}</CardTitle>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline">{selectedProjectData.category}</Badge>
                      <Badge variant="default">{selectedProjectData.year}</Badge>
                      {selectedProjectData.fundingRound && (
                        <Badge variant="secondary">{selectedProjectData.fundingRound}</Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{selectedProjectData.description}</p>

                {selectedProjectData.impact && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Impact
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedProjectData.impact}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {selectedProjectData.ownership && (
                    <div>
                      <h4 className="font-semibold mb-1">Ownership</h4>
                      <p className="text-2xl font-bold text-blue-600">{selectedProjectData.ownership}%</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold mb-1">Status</h4>
                    <Badge variant={selectedProjectData.status === "active" ? "default" : "secondary"}>
                      {selectedProjectData.status}
                    </Badge>
                  </div>
                </div>

                {selectedProjectData.website && (
                  <Button asChild className="w-full">
                    <a href={selectedProjectData.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
