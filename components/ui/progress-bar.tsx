"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  animated?: boolean
}

export function ProgressBar({ value, max = 100, className, showLabel = false, animated = true }: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const percentage = Math.min((value / max) * 100, 100)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayValue(percentage), 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayValue(percentage)
    }
  }, [percentage, animated])

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <span className="text-sm font-medium text-muted-foreground">
            {value} / {max}
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  )
}
