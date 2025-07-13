"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UrlInputHandler } from "@/components/url-parser/url-input-handler"
import { Navigation, Zap, Globe, LinkIcon, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export default function NavigatePage() {
  const { theme, setTheme } = useTheme()

  const examples = [
    {
      category: "Domain Access",
      icon: <Globe className="h-4 w-4" />,
      items: [
        { input: "srd.fund", description: "Direct domain access to SRD Innovation Fund" },
        { input: "sanskrutcorp.com", description: "Sanskrut Corp incubation platform" },
        { input: "sandeep.com", description: "Personal portfolio and timeline" },
      ],
    },
    {
      category: "Site Parameters",
      icon: <LinkIcon className="h-4 w-4" />,
      items: [
        { input: "/?site=srd", description: "Access SRD site via parameter" },
        { input: "?site=sanskrut-enterprises", description: "Hospitality and real estate portfolio" },
        { input: "srd", description: "Shorthand site identifier" },
      ],
    },
    {
      category: "Internal Paths",
      icon: <ArrowRight className="h-4 w-4" />,
      items: [
        { input: "/profile/spacex", description: "SpaceX project profile page" },
        { input: "/person/sandeep", description: "Sandeep's personal page" },
        { input: "/profile/groq", description: "Groq AI hardware company profile" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ← Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Smart URL Navigator
              </h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-in slide-in-from-top duration-700">
          <div className="flex items-center justify-center mb-4">
            <Navigation className="h-12 w-12 text-primary mr-4" />
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Navigate Anywhere, Instantly</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Enter any domain, URL path, or site identifier to navigate seamlessly across the entire portfolio ecosystem.
            Our smart parser understands multiple input formats and provides helpful suggestions.
          </p>
        </div>

        {/* Main URL Input */}
        <div className="mb-16 animate-in slide-in-from-bottom duration-700 delay-200">
          <UrlInputHandler />
        </div>

        {/* Examples Section */}
        <div className="space-y-8 animate-in slide-in-from-bottom duration-700 delay-400">
          <h3 className="text-2xl font-bold text-center mb-8">Supported Input Formats</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examples.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {category.icon}
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{item.input}</code>
                        <Badge variant="outline" className="text-xs">
                          Try it
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom duration-700 delay-600">
          {[
            {
              title: "Smart Parsing",
              description: "Automatically detects input type and format",
              icon: "🧠",
            },
            {
              title: "Fuzzy Matching",
              description: "Finds close matches and suggests corrections",
              icon: "🎯",
            },
            {
              title: "Recent History",
              description: "Quick access to recently visited destinations",
              icon: "⏱️",
            },
            {
              title: "Cross-Platform",
              description: "Works across all devices and browsers",
              icon: "📱",
            },
          ].map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-in slide-in-from-bottom duration-700 delay-800">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Explore?</h3>
              <p className="text-muted-foreground mb-6">
                Start navigating the portfolio ecosystem with intelligent URL parsing and seamless redirects.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/">Explore Portfolio</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/?site=srd">Visit SRD Fund</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
