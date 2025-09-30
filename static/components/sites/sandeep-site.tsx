"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Briefcase, TrendingUp, Home, Mail, Linkedin, Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import {
  sites,
  sandeepExperience,
  srdProjects,
  sanskrutCorpProjects,
  sanskrutEnterprisesProjects,
} from "@/lib/shared-data"
import { SiteHeader } from "@/components/shared/site-header"

export function SandeepSite() {
  const site = sites.sandeep

  const allProjects = [
    ...srdProjects.map((p) => ({ ...p, source: "SRD Innovation Fund" })),
    ...sanskrutCorpProjects.map((p) => ({ ...p, source: "Sanskrut Corp" })),
    ...sanskrutEnterprisesProjects.map((p) => ({ ...p, source: "Sanskrut Enterprises" })),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
      <SiteHeader site={site} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center mr-6">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold text-orange-900 dark:text-orange-100">{site.name}</h1>
              <p className="text-xl text-orange-700 dark:text-orange-300">{site.title}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">{site.description}</p>

          {/* Contact Links */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button variant="outline" size="sm">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
            <Button variant="outline" size="sm">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{allProjects.length}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
              <div className="text-sm text-muted-foreground">Companies Founded</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
              <div className="text-sm text-muted-foreground">Board Positions</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg leading-relaxed">
                  Technology leader and strategic investor with over 15 years of experience building and scaling
                  innovative companies. Currently serving as Head of Digital Innovation at Roche, where I lead digital
                  transformation initiatives in healthcare and pharmaceutical research.
                </p>
                <p className="leading-relaxed">
                  My journey spans from engineering roles at Google and Meta to founding and investing in breakthrough
                  technologies. Through SRD Innovation Fund, I focus on early-stage investments in AI, aerospace, and
                  transformative technologies. Sanskrut Corp represents my commitment to incubating the next generation
                  of entrepreneurs, while Sanskrut Enterprises manages strategic hospitality and real estate
                  investments.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h3 className="font-semibold mb-3">Core Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">AI & Machine Learning</Badge>
                      <Badge variant="secondary">Digital Transformation</Badge>
                      <Badge variant="secondary">Strategic Investments</Badge>
                      <Badge variant="secondary">Healthcare Technology</Badge>
                      <Badge variant="secondary">Startup Incubation</Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Industries</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Technology</Badge>
                      <Badge variant="outline">Healthcare</Badge>
                      <Badge variant="outline">Aerospace</Badge>
                      <Badge variant="outline">Real Estate</Badge>
                      <Badge variant="outline">Hospitality</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <div className="space-y-6">
              {sandeepExperience.map((exp, index) => (
                <Card key={exp.id} className="bg-white/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{exp.role}</CardTitle>
                        <CardDescription className="text-lg font-semibold">{exp.company}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{exp.period}</Badge>
                        <div className="text-sm text-muted-foreground mt-1">{exp.category}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.slice(0, 9).map((project) => (
                <Card
                  key={`${project.source}-${project.id}`}
                  className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{project.category}</Badge>
                      <Badge variant="secondary" className="text-xs">
                        {project.source}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Year</span>
                        <span className="font-semibold">{project.year}</span>
                      </div>
                      {project.ownership && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Ownership</span>
                          <span className="font-semibold text-orange-600">{project.ownership}%</span>
                        </div>
                      )}
                      <Badge
                        variant={project.status === "active" ? "default" : "secondary"}
                        className="w-full justify-center"
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-blue-900">SRD Innovation Fund</CardTitle>
                      <CardDescription>Investment & Innovation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Private equity investments in breakthrough technologies and innovation-focused startups.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Investments</span>
                      <span className="font-semibold">{srdProjects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Focus</span>
                      <span className="font-semibold">AI, Aerospace</span>
                    </div>
                  </div>
                  <Button asChild className="w-full" size="sm">
                    <Link href="/?site=srd">
                      Explore SRD
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="h-8 w-8 text-green-600" />
                    <div>
                      <CardTitle className="text-green-900">Sanskrut Corp</CardTitle>
                      <CardDescription>Incubation Platform</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supporting early-stage ventures and foundational business experiences since 2013.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Projects</span>
                      <span className="font-semibold">{sanskrutCorpProjects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Phase</span>
                      <span className="font-semibold">2013-2021</span>
                    </div>
                  </div>
                  <Button asChild className="w-full" size="sm">
                    <Link href="/?site=sanskrut-corp">
                      Explore Sanskrut Corp
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Home className="h-8 w-8 text-purple-600" />
                    <div>
                      <CardTitle className="text-purple-900">Sanskrut Enterprises</CardTitle>
                      <CardDescription>Hospitality & Real Estate</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Strategic hospitality investments and premium property portfolio management.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Properties</span>
                      <span className="font-semibold">{sanskrutEnterprisesProjects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Portfolio Value</span>
                      <span className="font-semibold">$2M+</span>
                    </div>
                  </div>
                  <Button asChild className="w-full" size="sm">
                    <Link href="/?site=sanskrut-enterprises">
                      Explore Sanskrut Enterprises
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
