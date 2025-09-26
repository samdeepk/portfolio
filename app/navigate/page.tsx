"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, LinkIcon, ArrowRight, Search, ExternalLink, Zap, Target, Navigation } from "lucide-react"
import { URLNavigatorWidget } from "@/components/navigation/url-navigator-widget"
import { useState } from "react"
import Link from "next/link"

export default function NavigatePage() {
  const [showWidget, setShowWidget] = useState(false)

  const features = [
    {
      icon: Search,
      title: "Smart Parsing",
      description: "Automatically detects and parses various URL formats including domains, parameters, and paths",
    },
    {
      icon: Target,
      title: "Fuzzy Matching",
      description: "Provides intelligent suggestions when inputs don't exactly match known destinations",
    },
    {
      icon: Zap,
      title: "Real-time Validation",
      description: "Instant feedback with visual indicators for valid and invalid inputs",
    },
    {
      icon: Navigation,
      title: "Multiple Access Methods",
      description: "Supports both domain-based and parameter-based navigation seamlessly",
    },
  ]

  const examples = [
    {
      category: "Domain Access",
      icon: Globe,
      items: [
        { input: "srd.fund", description: "Direct domain navigation to SRD Fund" },
        { input: "corp.sanskrut.in", description: "Sanskrut Corp corporate site" },
        { input: "sandeepkoduri.com", description: "Personal portfolio site" },
      ],
    },
    {
      category: "Parameter Routing",
      icon: LinkIcon,
      items: [
        { input: "/?site=srd", description: "Parameter-based site access" },
        { input: "srd", description: "Shorthand site identifier" },
        { input: "sanskrut-enterprises", description: "Full site parameter name" },
      ],
    },
    {
      category: "Internal Paths",
      icon: ArrowRight,
      items: [
        { input: "/profile/spacex", description: "Company profile page" },
        { input: "/person/sandeep", description: "Person profile page" },
        { input: "/navigate", description: "This navigation page" },
      ],
    },
    {
      category: "External URLs",
      icon: ExternalLink,
      items: [
        { input: "https://example.com", description: "External website navigation" },
        { input: "http://company.com", description: "HTTP external links" },
        { input: "https://github.com/user", description: "External service links" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Navigation className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Smart Navigation System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Navigate to any site or content using domains, parameters, paths, or external URLs. Our intelligent parser
            handles multiple formats and provides helpful suggestions.
          </p>

          <Button onClick={() => setShowWidget(true)} size="lg" className="bg-primary hover:bg-primary/90">
            <Search className="mr-2 h-5 w-5" />
            Try Smart Navigation
          </Button>
        </div>

        {/* Navigation Widget */}
        {showWidget && (
          <div className="mb-12 animate-in slide-in-from-top duration-300">
            <URLNavigatorWidget onClose={() => setShowWidget(false)} />
          </div>
        )}

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Supported Input Formats</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {examples.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                      >
                        <Badge variant="outline" className="font-mono text-xs shrink-0 mt-0.5">
                          {item.input}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowRight className="mr-2 h-4 w-4" />
                Back to Site Selector
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/?site=srd">
                <Globe className="mr-2 h-4 w-4" />
                Visit SRD Fund
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile/spacex">
                <ExternalLink className="mr-2 h-4 w-4" />
                View SpaceX Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
