"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { URLNavigatorWidget } from "@/components/navigation/url-navigator-widget"
import { ArrowLeft, Navigation, Zap, Globe, LinkIcon, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NavigatePage() {
  const [showWidget, setShowWidget] = useState(true)

  const examples = [
    {
      input: "srd.fund",
      type: "Domain",
      description: "Direct domain access",
      icon: <Globe className="h-4 w-4" />,
    },
    {
      input: "?site=sandeep",
      type: "Parameter",
      description: "URL parameter access",
      icon: <LinkIcon className="h-4 w-4" />,
    },
    {
      input: "sanskrut corp",
      type: "Site Name",
      description: "Fuzzy site name matching",
      icon: <Search className="h-4 w-4" />,
    },
    {
      input: "https://example.com",
      type: "External",
      description: "External URL navigation",
      icon: <Globe className="h-4 w-4" />,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sites
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Smart Navigation</h1>
              <p className="text-muted-foreground">Intelligent URL parsing and site navigation</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-secondary/50">
            <Zap className="h-3 w-3 mr-1" />
            Interactive Demo
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation Widget */}
          <div className="lg:col-span-2">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="h-5 w-5 mr-2" />
                  URL Navigator
                </CardTitle>
                <CardDescription>
                  Enter any URL, domain, site name, or parameter to navigate intelligently
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showWidget ? (
                  <URLNavigatorWidget onClose={() => setShowWidget(false)} />
                ) : (
                  <div className="text-center py-8">
                    <Button onClick={() => setShowWidget(true)} className="glow-accent">
                      <Navigation className="h-4 w-4 mr-2" />
                      Open Navigator
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Examples & Features */}
          <div className="space-y-6">
            {/* Input Examples */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg">Input Examples</CardTitle>
                <CardDescription>Try these different input formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      {example.icon}
                      <div>
                        <code className="text-sm font-mono bg-background/50 px-2 py-1 rounded">{example.input}</code>
                        <p className="text-xs text-muted-foreground mt-1">{example.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {example.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Real-time Parsing</p>
                    <p className="text-xs text-muted-foreground">Instant validation and suggestions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Fuzzy Matching</p>
                    <p className="text-xs text-muted-foreground">Smart suggestions for typos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Multi-format Support</p>
                    <p className="text-xs text-muted-foreground">Domains, parameters, site names</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Recent History</p>
                    <p className="text-xs text-muted-foreground">Quick access to recent inputs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Navigate</span>
                  <Badge variant="outline" className="text-xs font-mono">
                    Enter
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Close</span>
                  <Badge variant="outline" className="text-xs font-mono">
                    Escape
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
