"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { X, ArrowRight, Globe, LinkIcon, ExternalLink, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { parseURL } from "@/lib/url-parser"
import { useToast } from "@/hooks/use-toast"

interface URLNavigatorWidgetProps {
  onClose: () => void
}

export function URLNavigatorWidget({ onClose }: URLNavigatorWidgetProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleNavigate = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    try {
      const result = parseURL(input.trim())

      if (result.isValid && result.finalUrl) {
        if (result.isExternal) {
          window.open(result.finalUrl, "_blank", "noopener,noreferrer")
        } else {
          router.push(result.finalUrl)
        }
        onClose()
        toast({
          title: "Navigation Successful",
          description: `Navigated to ${result.destination}`,
        })
      } else {
        toast({
          title: "Invalid Input",
          description: result.suggestions?.[0]
            ? `Did you mean: ${result.suggestions[0]}?`
            : "Please check your input and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Navigation Error",
        description: "An error occurred while navigating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNavigate()
    }
    if (e.key === "Escape") {
      onClose()
    }
  }

  const quickLinks = [
    { label: "SRD Fund", url: "srd.fund", type: "domain" },
    { label: "Sanskrut Corp", url: "sanskrutcorp.com", type: "domain" },
    { label: "Sandeep", url: "sandeepkoduri.com", type: "domain" },
    { label: "SpaceX Profile", url: "/profile/spacex", type: "internal" },
    { label: "Groq Profile", url: "/profile/groq", type: "internal" },
  ]

  const exampleInputs = ["srd.fund", "/?site=sandeep", "/profile/spacex", "sanskrutcorp.com", "https://example.com"]

  return (
    <Card className="w-full max-w-2xl mx-auto">
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

        <div className="space-y-4">
          {/* Input Field */}
          <div className="flex space-x-2">
            <Input
              placeholder="Enter domain, URL, path, or site name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
              autoFocus
            />
            <Button onClick={handleNavigate} disabled={!input.trim() || isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium mb-2">Quick Links</h4>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <Button
                  key={link.url}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(link.url)}
                  className="text-xs"
                >
                  {link.type === "domain" && <Globe className="h-3 w-3 mr-1" />}
                  {link.type === "internal" && <LinkIcon className="h-3 w-3 mr-1" />}
                  {link.type === "external" && <ExternalLink className="h-3 w-3 mr-1" />}
                  {link.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Example Inputs */}
          <div>
            <h4 className="text-sm font-medium mb-2">Example Formats</h4>
            <div className="flex flex-wrap gap-1">
              {exampleInputs.map((example) => (
                <Badge
                  key={example}
                  variant="secondary"
                  className="cursor-pointer text-xs"
                  onClick={() => setInput(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-muted-foreground">
            <p>Supports: domains (srd.fund), parameters (?site=srd), paths (/profile/spacex), and external URLs</p>
            <p className="mt-1">Press Enter to navigate, Escape to close</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
