"use client"

import { useState } from "react"
import { ArrowLeft, ExternalLink, Users, Tag, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useSearchParams } from "next/navigation"
import { portfolioData, entityConfigs } from "@/lib/data"
import { TimelineView } from "@/components/timeline-view"
import { RelatedProjects } from "@/components/related-projects"

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const { theme, setTheme } = useTheme()
  const searchParams = useSearchParams()
  const fromEntity = searchParams.get("from")

  const item = portfolioData.find((p) => p.id === params.id)

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <Link href={fromEntity ? `/?entity=${fromEntity}` : "/"}>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {fromEntity ? entityConfigs[fromEntity as keyof typeof entityConfigs]?.name : "Home"}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const backUrl = fromEntity ? `/?entity=${fromEntity}` : "/"
  const backLabel = fromEntity ? entityConfigs[fromEntity as keyof typeof entityConfigs]?.name : "Home"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={backUrl}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to {backLabel}
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">{item.name}</h1>
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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
              <p className="text-xl text-muted-foreground mb-6">{item.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="default" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {item.type}
                </Badge>
                <Badge variant="secondary">{item.theme}</Badge>
                {item.percentage && <Badge variant="outline">{item.percentage}% Stake</Badge>}
              </div>

              {item.website && (
                <Button asChild className="mb-4">
                  <a href={item.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>

            <Card className="lg:w-80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Associated People
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {item.associations.map((person, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{person}</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/?entity=${person.toLowerCase().replace(" ", "-")}`}>View Portfolio</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Type</h4>
                    <p className="text-muted-foreground">{item.type}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Theme</h4>
                    <p className="text-muted-foreground">{item.theme}</p>
                  </div>
                  {item.percentage && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Stake</h4>
                        <p className="text-muted-foreground">{item.percentage}%</p>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Status</h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Team Size</span>
                      <span className="font-semibold">{item.associations.length} people</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-semibold">{item.type}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Focus Area</span>
                      <span className="font-semibold">{item.theme}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <TimelineView item={item} />
          </TabsContent>

          <TabsContent value="related" className="mt-6">
            <RelatedProjects currentItem={item} fromEntity={fromEntity} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
