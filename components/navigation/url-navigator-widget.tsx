"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  X,
  ExternalLink,
  Globe,
  LinkIcon,
  ArrowRight,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { parseURL, type ParsedURL } from "@/lib/url-parser"
import { useRouter } from "next/navigation"

interface URLNavigatorWidgetProps {
  onClose: () => void
}

export function URLNavigatorWidget({ onClose }: URLNavigatorWidgetProps) {
  const [input, setInput] = useState("")
  const [parsedResult, setParsedResult] = useState<ParsedURL | null>(null)
  const [recentInputs, setRecentInputs] = useState<string[]>([])
  const [isNavigating, setIsNavigating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load recent inputs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("url-navigator-recent")
    if (stored) {
      try {
        setRecentInputs(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse recent inputs:", e)
      }
    }
  }, [])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
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

  const saveToRecent = (url: string) => {
    const updated = [url, ...recentInputs.filter((r) => r !== url)].slice(0, 5)
    setRecentInputs(updated)
    localStorage.setItem("url-navigator-recent", JSON.stringify(updated))
  }

  const handleNavigate = async () => {
    if (!parsedResult || !parsedResult.isValid) return

    setIsNavigating(true)
    saveToRecent(input.trim())

    try {
      if (parsedResult.isExternal) {
        window.open(parsedResult.finalUrl, "_blank", "noopener,noreferrer")
      } else {
        router.push(parsedResult.finalUrl)
        onClose()
      }
    } catch (error) {
      console.error("Navigation failed:", error)
    } finally {
      setIsNavigating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && parsedResult?.isValid) {
      handleNavigate()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  const quickLinks = [
    { label: "SRD Fund", url: "srd.fund", description: "Investment portfolio" },
    { label: "Sanskrut Corp", url: "corp.sanskrut.in", description: "Corporate site" },
    { label: "Enterprises", url: "ent.sanskrut.in", description: "Business ventures" },
    { label: "Sandeep", url: "sandeepkoduri.com", description: "Personal portfolio" },
  ]

  const getStatusIcon = () => {
    if (!parsedResult) return <Search className="h-4 w-4 text-muted-foreground" />
    if (parsedResult.isValid) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <AlertCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusColor = () => {
    if (!parsedResult) return "border-border"
    if (parsedResult.isValid) return "border-green-500/50"
    return "border-red-500/50"
  }

  return (
    <Card className="card-enhanced max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Smart Navigation</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className={`relative border-2 rounded-lg transition-colors ${getStatusColor()}`}>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{getStatusIcon()}</div>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter URL, domain, or site name..."
              className="pl-10 pr-4 py-3 text-base border-0 focus:ring-0 bg-transparent"
            />
          </div>

          {/* Parsing Result */}
          {parsedResult && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant={parsedResult.isValid ? "default" : "destructive"} className="text-xs">
                    {parsedResult.type}
                  </Badge>
                  {parsedResult.isExternal && (
                    <Badge variant="outline" className="text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      External
                    </Badge>
                  )}
                  {parsedResult.accessMethod && (
                    <Badge variant="outline" className="text-xs">
                      {parsedResult.accessMethod === "parameter" ? (
                        <LinkIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <Globe className="h-3 w-3 mr-1" />
                      )}
                      {parsedResult.accessMethod}
                    </Badge>
                  )}
                </div>
                {parsedResult.isValid && (
                  <Button onClick={handleNavigate} disabled={isNavigating} size="sm" className="glow-accent">
                    {isNavigating ? "Navigating..." : "Navigate"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>

              {parsedResult.isValid ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Destination:</strong> {parsedResult.finalUrl}
                  </p>
                  {parsedResult.suggestions && parsedResult.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Alternative suggestions:</p>
                      <div className="flex flex-wrap gap-1">
                        {parsedResult.suggestions.slice(0, 3).map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setInput(suggestion)}
                            className="text-xs h-6"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-red-400">{parsedResult.error || "Invalid URL format"}</p>
                  {parsedResult.suggestions && parsedResult.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Did you mean:</p>
                      <div className="flex flex-wrap gap-1">
                        {parsedResult.suggestions.slice(0, 3).map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setInput(suggestion)}
                            className="text-xs h-6"
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
          )}

          {/* Quick Links */}
          {!input && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <Button
                    key={link.url}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(link.url)}
                    className="justify-start h-auto p-3 hover:bg-primary/5"
                  >
                    <div className="text-left">
                      <div className="font-medium text-xs">{link.label}</div>
                      <div className="text-xs text-muted-foreground">{link.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Inputs */}
          {!input && recentInputs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Recent
              </h4>
              <div className="flex flex-wrap gap-1">
                {recentInputs.map((recent, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInput(recent)}
                    className="text-xs h-6 px-2 hover:bg-primary/10"
                  >
                    {recent}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/30">
            <p>
              <strong>Examples:</strong>
            </p>
            <p>
              • Domain: <code className="bg-muted/50 px-1 rounded">srd.fund</code>
            </p>
            <p>
              • Parameter: <code className="bg-muted/50 px-1 rounded">?site=sandeep</code>
            </p>
            <p>
              • Site name: <code className="bg-muted/50 px-1 rounded">sanskrut corp</code>
            </p>
            <p>
              • External: <code className="bg-muted/50 px-1 rounded">https://example.com</code>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
