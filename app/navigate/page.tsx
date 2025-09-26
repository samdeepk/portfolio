"use client"

import { useState } from "react"
import { Navigation, ArrowRight, Globe, LinkIcon, ExternalLink, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { URLNavigatorWidget } from "@/components/navigation/url-navigator-widget"

export default function NavigatePage() {
  const [showWidget, setShowWidget] = useState(true)

  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Smart Parsing",
      description: "Automatically detects and validates different input formats",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Multi-Format Support",
      description: "Handles domains, parameters, paths, and external URLs",
    },
    {
      icon: <LinkIcon className="h-5 w-5" />,
      title: "Fuzzy Matching",
      description: "Provides intelligent suggestions for invalid inputs",
    },
    {
      icon: <ArrowRight className="h-5 w-5" />,
      title: "Quick Navigation",
      description: "One-click access to common destinations",
    },
  ]

  const examples = [
    {
      input: "srd.fund",
      type: "Domain",
      description: "Direct domain access",
      badge: "External",
    },
    {
      input: "/?site=sanskrut-corp",
      type: "Parameter",
      description: "Site parameter routing",
      badge: "Internal",
    },
    {
      input: "/profile/spacex",
      type: "Path",
      description: "Internal path navigation",
      badge: "Internal",
    },
    {
      input: "srd",
      type: "Shorthand",
      description: "Quick site identifier",
      badge: "Smart",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Smart Navigation</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-in slide-in-from-top duration-700">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Navigation className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Smart Navigation System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Navigate anywhere with intelligent URL parsing, fuzzy matching, and multi-format support
          </p>
        </div>

        {/* Interactive Widget */}
        <div className="mb-12 animate-in slide-in-from-bottom duration-700 delay-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Try It Out</h2>
            <Button variant="outline" onClick={() => setShowWidget(!showWidget)}>
              {showWidget ? "Hide" : "Show"} Widget
            </Button>
          </div>

          {showWidget && (
            <div className="animate-in slide-in-from-top duration-300">
              <URLNavigatorWidget />
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-12 animate-in slide-in-from-bottom duration-700 delay-400">
          <h2 className="text-2xl font-semibold mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center animate-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    {feature.icon}
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
        <div className="mb-12 animate-in slide-in-from-bottom duration-700 delay-600">
          <h2 className="text-2xl font-semibold mb-6 text-center">Supported Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((example, index) => (
              <Card
                key={index}
                className="animate-in slide-in-from-left duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{example.input}</code>
                    <Badge variant="outline">{example.badge}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{example.type}</p>
                      <p className="text-xs text-muted-foreground">{example.description}</p>
                    </div>
                    {example.badge === "External" ? (
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* How It Works */}
        <div className="text-center animate-in slide-in-from-bottom duration-700 delay-800">
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                1
              </div>
              <h3 className="font-semibold">Input Detection</h3>
              <p className="text-sm text-muted-foreground">
                Automatically identifies the input format and validates syntax
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                2
              </div>
              <h3 className="font-semibold">Smart Matching</h3>
              <p className="text-sm text-muted-foreground">
                Uses fuzzy matching to provide suggestions for invalid inputs
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                3
              </div>
              <h3 className="font-semibold">Seamless Navigation</h3>
              <p className="text-sm text-muted-foreground">Routes to the correct destination with appropriate method</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
