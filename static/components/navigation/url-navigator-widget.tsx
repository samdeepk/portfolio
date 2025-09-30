"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Navigation, Zap } from "lucide-react"
import { UrlInputHandler } from "@/components/url-parser/url-input-handler"
import { cn } from "@/lib/utils"

interface UrlNavigatorWidgetProps {
  className?: string
  variant?: "button" | "inline"
}

export function UrlNavigatorWidget({ className, variant = "button" }: UrlNavigatorWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (variant === "inline") {
    return (
      <div className={cn("w-full", className)}>
        <UrlInputHandler onNavigate={() => setIsOpen(false)} />
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("flex items-center gap-2 bg-transparent", className)}>
          <Navigation className="h-4 w-4" />
          Quick Navigate
          <Zap className="h-3 w-3 text-yellow-500" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[600px] p-0" align="start">
        <Card className="border-0 shadow-none">
          <CardContent className="p-4">
            <UrlInputHandler onNavigate={() => setIsOpen(false)} />
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
