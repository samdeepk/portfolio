"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { X, Search, ExternalLink, Globe, LinkIcon, ArrowRight, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { parseURL, type ParsedURL } from "@/lib/url-parser"
import { useToast } from "@/hooks/use-toast"

interface URLNavigatorWidgetProps {
  onClose: () => void
  className?: string
}

export function URLNavigatorWidget({ onClose, className = "" }: URLNavigatorWidgetProps) {
  const [input, setInput] = useState("")
  const [parsedResult, setParsedResult] = useState<ParsedURL | null>(null)
  const [recentInputs, setRecentInputs] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  // Load recent inputs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("url-navigator-recent")
    if (stored) {
      try {
        setRecentInputs(JSON.parse(stored))
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, [])

  // Parse input in real-time
  useEffect(() => {
    if (input.trim()) {
      const result = parseURL(input.trim())
      setParsedResult(result)
    } else {
      setParsedResult(null)
    }
  }, [input])

  const handleNavigate = () => {
    if (!parsedResult || !parsedResult.isValid) {
      toast({
        title: "Invalid Input",
        description: parsedResult?.error || "Please enter a valid URL or site identifier",
        variant: "destructive",
      })
      return
    }

    // Save to recent inputs
    const newRecent = [input, ...recentInputs.filter((item) => item !== input)].slice(0, 5)
    setRecentInputs(newRecent)
    localStorage.setItem("url-navigator-recent", JSON.stringify(newRecent))

    // Navigate
    if (parsedResult.isExternal) {
      window.open(parsedResult.finalUrl, "_blank", "noopener,noreferrer")
    } else {
      router.push(parsedResult.finalUrl)
    }

    toast({
      title: "Navigating...",
      description: `Going to ${parsedResult.destination}`,
    })

    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNavigate()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  const quickLinks = [
    { label: "SRD Fund", value: "srd", description: "Investment fund site" },
    { label: "Sanskrut Corp", value: "sanskrut-corp", description: "Corporate site" },
    { label: "Sanskrut Enterprises", value: "sanskrut-enterprises", description: "Enterprise site" },
    { label: "Sandeep", value: "sandeep", description: "Personal portfolio" },
  ]

  const exampleFormats = [
    { format: "srd.fund", description: "Direct domain access" },
    { format: "/?site=srd", description: "Parameter-based routing" },
    { format: "/profile/spacex", description: "Internal profile page" },
    { format: "https://example.com", description: "External URL" },
  ]

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Smart Navigation</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Input Field */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter domain, site ID, path, or URL..."
              className="pr-20"
              autoFocus
            />
            <Button
              onClick={handleNavigate}
              disabled={!parsedResult?.isValid}
              size="sm"
              className="absolute right-1 top-1 h-8"
            >
              Go
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          {/* Parsing Result */}
          {parsedResult && (
            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {parsedResult.isValid ? (
                    <Badge variant="default" className="text-xs">
                      {parsedResult.isExternal ? (
                        <>
                          <ExternalLink className="h-3 w-3 mr-1" />
                          External
                        </>
                      ) : parsedResult.type === "domain" ? (
                        <>
                          <Globe className="h-3 w-3 mr-1" />
                          Domain
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-3 w-3 mr-1" />
                          Internal
                        </>
                      )}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Invalid
                    </Badge>
                  )}
                </div>
                {parsedResult.confidence && (
                  <span className="text-xs text-muted-foreground">
                    {Math.round(parsedResult.confidence * 100)}% match
                  </span>
                )}
              </div>

              <div className="text-sm">
                {parsedResult.isValid ? (
                  <div>
                    <p className="font-medium">{parsedResult.destination}</p>
                    <p className="text-muted-foreground text-xs mt-1">{parsedResult.finalUrl}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-destructive">{parsedResult.error}</p>
                    {parsedResult.suggestions && parsedResult.suggestions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Did you mean:</p>
                        <div className="flex flex-wrap gap-1">
                          {parsedResult.suggestions.slice(0, 3).map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 bg-transparent"
                              onClick={() => setInput(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium mb-2">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Button
                  key={link.value}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto p-2 bg-transparent"
                  onClick={() => setInput(link.value)}
                >
                  <div>
                    <div className="font-medium text-xs">{link.label}</div>
                    <div className="text-muted-foreground text-xs">{link.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Inputs */}
          {recentInputs.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Recent
              </h4>
              <div className="flex flex-wrap gap-1">
                {recentInputs.map((recent, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => setInput(recent)}
                  >
                    {recent}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Example Formats */}
          <div>
            <h4 className="text-sm font-medium mb-2">Supported Formats</h4>
            <div className="grid grid-cols-1 gap-1">
              {exampleFormats.map((example, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <code className="bg-muted px-2 py-1 rounded font-mono">{example.format}</code>
                  <span className="text-muted-foreground">{example.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
