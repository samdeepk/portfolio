"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, MapPin, ExternalLink, Map } from "lucide-react"
import { sites, sanskrutEnterprisesProjects } from "@/lib/shared-data"
import { SiteHeader } from "@/components/shared/site-header"

export function SanskrutEnterprisesSite() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const site = sites.sanskrut_enterprises

  const selectedPropertyData = selectedProperty
    ? sanskrutEnterprisesProjects.find((p) => p.id === selectedProperty)
    : null

  const totalPortfolioValue = sanskrutEnterprisesProjects.reduce((sum, project) => sum + (project.ownership || 0), 0)

  const propertiesByLocation = sanskrutEnterprisesProjects.reduce(
    (acc, project) => {
      const location = project.location || "Unknown"
      if (!acc[location]) acc[location] = []
      acc[location].push(project)
      return acc
    },
    {} as Record<string, typeof sanskrutEnterprisesProjects>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
      <SiteHeader site={site} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Home className="h-12 w-12 text-purple-600 mr-4" />
            <h1 className="text-5xl font-bold text-purple-900 dark:text-purple-100">{site.name}</h1>
          </div>
          <p className="text-xl text-purple-700 dark:text-purple-300 mb-6">{site.title}</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{site.description}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{sanskrutEnterprisesProjects.length}</div>
              <div className="text-sm text-muted-foreground">Properties</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{totalPortfolioValue.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Total Ownership</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">$2M+</div>
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="portfolio">Property Portfolio</TabsTrigger>
            <TabsTrigger value="map">Location Map</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sanskrutEnterprisesProjects.map((property) => (
                <Card
                  key={property.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur"
                  onClick={() => setSelectedProperty(property.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{property.category}</Badge>
                      <Badge variant="default">{property.year}</Badge>
                    </div>
                    <CardTitle className="text-xl text-purple-900">{property.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{property.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Ownership</span>
                        <span className="font-semibold text-purple-600">{property.ownership}%</span>
                      </div>
                      {property.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant={property.status === "active" ? "default" : "secondary"}>
                          {property.status}
                        </Badge>
                        {property.website && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={property.website} target="_blank" rel="noopener noreferrer">
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

          <TabsContent value="map">
            <div className="space-y-8">
              <Card className="bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Properties by Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(propertiesByLocation).map(([location, properties]) => (
                      <div key={location}>
                        <h3 className="text-lg font-semibold mb-3 text-purple-800">{location}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {properties.map((property) => (
                            <Card key={property.id} className="border-purple-200">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{property.name}</h4>
                                  <Badge variant="outline">{property.ownership}%</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{property.category}</p>
                                <Badge
                                  variant={property.status === "active" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {property.status}
                                </Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Property Detail Modal */}
        {selectedPropertyData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{selectedPropertyData.name}</CardTitle>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline">{selectedPropertyData.category}</Badge>
                      <Badge variant="default">{selectedPropertyData.year}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedProperty(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{selectedPropertyData.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">Ownership</h4>
                    <p className="text-2xl font-bold text-purple-600">{selectedPropertyData.ownership}%</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Status</h4>
                    <Badge variant={selectedPropertyData.status === "active" ? "default" : "secondary"}>
                      {selectedPropertyData.status}
                    </Badge>
                  </div>
                </div>

                {selectedPropertyData.location && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </h4>
                    <p className="text-muted-foreground">{selectedPropertyData.location}</p>
                  </div>
                )}

                {selectedPropertyData.website && (
                  <Button asChild className="w-full">
                    <a href={selectedPropertyData.website} target="_blank" rel="noopener noreferrer">
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
