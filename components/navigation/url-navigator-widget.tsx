"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, ExternalLink, Globe, LinkIcon, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { parseURL, type ParsedURL } from "@/lib/url-parser"

interface URLNavigatorWidgetProps {
  onClose?: () => void
  className?: string
}

export function URLNavigatorWidget({ onClose, className }: URLNavigatorWidgetProps) {
  const [input, setInput] = useState("")
  const [parsedResult, setParsedResult] = useState<ParsedURL | null>(null)
  const [recentInputs, setRecentInputs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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

  // Parse URL when input changes
  useEffect(() => {
    if (input.trim()) {
      setIsLoading(true)
      const result = parseURL(input.trim())
      setParsedResult(result)
      setIsLoading(false)
    } else {
      setParsedResult(null)
    }
  }, [input])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleNavigate = (url?: string) => {
    const targetUrl = url || parsedResult?.finalUrl
    if (!targetUrl) return

    // Save to recent inputs
    const newRecent = [input, ...recentInputs.filter((r) => r !== input)].slice(0, 5)
    setRecentInputs(newRecent)
    localStorage.setItem("url-navigator-recent", JSON.stringify(newRecent))

    // Navigate
    if (targetUrl.startsWith("http")) {
      window.open(targetUrl, "_blank")
    } else {
      router.push(targetUrl)
    }

    onClose?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && parsedResult?.isValid) {
      handleNavigate()
    } else if (e.key === "Escape") {
      onClose?.()
    }
  }

  const quickLinks = [
    { label: "SRD Fund", url: "/?site=srd", description: "Investment portfolio" },
    { label: "Sanskrut Corp", url: "/?site=sanskrut-corp", description: "Corporate ventures" },
    { label: "Sanskrut Enterprises", url: "/?site=sanskrut-enterprises", description: "Real estate portfolio" },
    { label: "Sandeep", url: "/?site=sandeep", description: "Personal portfolio" },
  ]

  const exampleFormats = ["srd.fund", "/?site=sanskrut-corp", "/profile/spacex", "https://example.com"]

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Smart Navigation
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input */}
        <div className="relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter domain, URL, or site parameter..."
            className="pr-10"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {/* Parsed Result */}
        {parsedResult && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={parsedResult.isValid ? "default" : "destructive"}>
                  {parsedResult.isValid ? "Valid" : "Invalid"}
                </Badge>
                <Badge variant="outline">{parsedResult.type}</Badge>
                {parsedResult.confidence && (
                  <Badge variant="secondary">{Math.round(parsedResult.confidence * 100)}% match</Badge>
                )}
              </div>
              {parsedResult.isValid && (
                <Button size="sm" onClick={() => handleNavigate()}>
                  Navigate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            {parsedResult.isValid ? (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {parsedResult.isExternal ? (
                    <ExternalLink className="h-4 w-4" />
                  ) : parsedResult.type === "domain" ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                  <span className="font-medium">{parsedResult.finalUrl}</span>
                </div>
                {parsedResult.metadata && <p className="text-sm text-muted-foreground">{parsedResult.metadata}</p>}
              </div>
            ) : (
              <div className="p-3 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive">{parsedResult.error}</p>
                {parsedResult.suggestions && parsedResult.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Did you mean:</p>
                    <div className="flex flex-wrap gap-1">
                      {parsedResult.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setInput(suggestion)}
                          className="h-6 text-xs"
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

        <Separator />

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-medium mb-2">Quick Links</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <Button
                key={link.url}
                variant="outline"
                size="sm"
                onClick={() => handleNavigate(link.url)}
                className="justify-start h-auto p-2"
              >
                <div className="text-left">
                  <div className="font-medium text-xs">{link.label}</div>
                  <div className="text-xs text-muted-foreground">{link.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Inputs */}
        {recentInputs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Recent
            </h4>
            <div className="flex flex-wrap gap-1">
              {recentInputs.map((recent, index) => (
                <Button key={index} variant="ghost" size="sm" onClick={() => setInput(recent)} className="h-6 text-xs">
                  {recent}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Example Formats */}
        <div>
          <h4 className="text-sm font-medium mb-2">Example Formats</h4>
          <div className="flex flex-wrap gap-1">
            {exampleFormats.map((example, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setInput(example)}
                className="h-6 text-xs font-mono"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="text-xs text-muted-foreground">
          <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> to navigate •{" "}
          <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> to close
        </div>
      </CardContent>
    </Card>
  )
}
