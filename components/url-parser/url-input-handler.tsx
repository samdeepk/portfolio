"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Globe,
  Search,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  History,
  Bookmark,
  Copy,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { parseUrlInput, type ParsedUrlResult } from "@/lib/url-parser"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface UrlInputHandlerProps {
  onNavigate?: (result: ParsedUrlResult) => void
  className?: string
}

export function UrlInputHandler({ onNavigate, className }: UrlInputHandlerProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [parseResult, setParseResult] = useState<ParsedUrlResult | null>(null)
  const [recentInputs, setRecentInputs] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Load recent inputs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recent-url-inputs")
    if (stored) {
      try {
        setRecentInputs(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to parse recent inputs:", error)
      }
    }
  }, [])

  // Generate suggestions based on input
  const generateSuggestions = useCallback((value: string) => {
    if (!value) return []

    const commonSites = [
      "srd.fund",
      "corp.sanskrut.in",
      "ent.sanskrut.in",
      "sandeepkoduri.com",
      "/?site=srd",
      "/?site=sanskrut-corp",
      "/?site=sanskrut-enterprises",
      "/?site=sandeep",
      "/profile/spacex",
      "/profile/groq",
      "/person/sandeep",
      "/person/dheeraj",
    ]

    return commonSites.filter((site) => site.toLowerCase().includes(value.toLowerCase())).slice(0, 5)
  }, [])

  // Parse input in real-time
  useEffect(() => {
    if (input.trim()) {
      const result = parseUrlInput(input.trim())
      setParseResult(result)
      setSuggestions(generateSuggestions(input))
    } else {
      setParseResult(null)
      setSuggestions([])
    }
  }, [input, generateSuggestions])

  const handleSubmit = async (inputValue?: string) => {
    const valueToProcess = inputValue || input
    if (!valueToProcess.trim()) return

    setIsLoading(true)

    try {
      const result = parseUrlInput(valueToProcess.trim())

      // Add to recent inputs
      const newRecentInputs = [valueToProcess, ...recentInputs.filter((item) => item !== valueToProcess)].slice(0, 10)
      setRecentInputs(newRecentInputs)
      localStorage.setItem("recent-url-inputs", JSON.stringify(newRecentInputs))

      if (result.isValid) {
        toast({
          title: "Navigation successful!",
          description: `Redirecting to ${result.displayName}`,
        })

        // Call onNavigate callback if provided
        if (onNavigate) {
          onNavigate(result)
        }

        // Navigate based on result type
        if (result.isExternal) {
          window.open(result.finalUrl, "_blank", "noopener,noreferrer")
        } else {
          router.push(result.finalUrl)
        }
      } else {
        toast({
          title: "Invalid URL or path",
          description: result.error || "Please check your input and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Navigation failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setIsFocused(false)
    setTimeout(() => handleSubmit(suggestion), 100)
  }

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "URL copied!",
        description: "Current page URL copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy URL to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Smart URL Navigator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter a domain, URL path, or site identifier to navigate anywhere in the portfolio ecosystem
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Input */}
        <div className="relative">
          <div className={cn("relative transition-all duration-300", isFocused && "transform scale-[1.02]")}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter domain (srd.fund), path (/profile/spacex), or site (srd)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={handleKeyDown}
              className={cn(
                "pl-10 pr-24 h-12 text-base transition-all duration-300",
                isFocused && "ring-2 ring-primary/20 border-primary/50",
                parseResult?.isValid && "border-green-500/50",
                parseResult && !parseResult.isValid && "border-red-500/50",
              )}
              disabled={isLoading}
            />

            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCurrentUrl}
                className="h-8 w-8 p-0"
                title="Copy current URL"
              >
                <Copy className="h-3 w-3" />
              </Button>

              <Button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="h-8 px-3"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Go
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Live Suggestions */}
          {isFocused && (suggestions.length > 0 || recentInputs.length > 0) && (
            <Card className="absolute top-full left-0 right-0 z-50 mt-2 shadow-lg border animate-in slide-in-from-top-2 duration-200">
              <CardContent className="p-3 space-y-3">
                {suggestions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Suggestions</span>
                    </div>
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => selectSuggestion(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors flex items-center justify-between group"
                        >
                          <span className="font-mono">{suggestion}</span>
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {recentInputs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <History className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Recent</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recentInputs.slice(0, 5).map((recent, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                          onClick={() => selectSuggestion(recent)}
                        >
                          {recent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Parse Result Display */}
        {parseResult && (
          <div className="space-y-3 animate-in slide-in-from-bottom duration-300">
            {parseResult.isValid ? (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Valid destination found!</span>
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        {parseResult.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Destination:</span>
                        <div className="font-mono text-xs bg-white/50 dark:bg-black/20 p-2 rounded mt-1">
                          {parseResult.displayName}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium">Final URL:</span>
                        <div className="font-mono text-xs bg-white/50 dark:bg-black/20 p-2 rounded mt-1 flex items-center justify-between">
                          <span className="truncate">{parseResult.finalUrl}</span>
                          {parseResult.isExternal && <ExternalLink className="h-3 w-3 ml-2 shrink-0" />}
                        </div>
                      </div>
                    </div>

                    {parseResult.metadata && Object.keys(parseResult.metadata).length > 0 && (
                      <div>
                        <span className="font-medium">Details:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(parseResult.metadata).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <div className="space-y-2">
                    <span className="font-medium">Invalid input detected</span>
                    <p className="text-sm">{parseResult.error}</p>

                    {parseResult.suggestions && parseResult.suggestions.length > 0 && (
                      <div>
                        <span className="font-medium text-sm">Did you mean:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {parseResult.suggestions.map((suggestion, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                              onClick={() => selectSuggestion(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Quick Access Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Quick Access
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "SRD Fund", value: "srd.fund", type: "domain" },
              { label: "Sanskrut Corp", value: "corp.sanskrut.in", type: "domain" },
              { label: "SpaceX Profile", value: "/profile/spacex", type: "path" },
              { label: "Sandeep's Page", value: "/?site=sandeep", type: "parameter" },
            ].map((item, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => selectSuggestion(item.value)}
                className="justify-start text-xs h-auto py-2 px-3"
              >
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-muted-foreground font-mono text-xs">{item.value}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-lg">
          <p className="font-medium">Supported input formats:</p>
          <ul className="space-y-1 ml-4">
            <li>
              • <span className="font-mono">srd.fund</span> - Direct domain access
            </li>
            <li>
              • <span className="font-mono">/profile/spacex</span> - Internal path navigation
            </li>
            <li>
              • <span className="font-mono">?site=srd</span> - Site parameter access
            </li>
            <li>
              • <span className="font-mono">srd</span> - Site identifier shorthand
            </li>
            <li>
              • <span className="font-mono">https://example.com</span> - Full URLs (external)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
