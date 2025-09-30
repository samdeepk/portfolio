"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ProgressBar } from "@/components/ui/progress-bar"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedStatsCardProps {
  title: string
  value: number
  suffix?: string
  prefix?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  progress?: {
    current: number
    max: number
  }
  icon?: React.ReactNode
  className?: string
}

export function EnhancedStatsCard({
  title,
  value,
  suffix = "",
  prefix = "",
  trend,
  progress,
  icon,
  className,
}: EnhancedStatsCardProps) {
  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300 hover:-translate-y-1", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              {icon}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-primary">
              <AnimatedCounter value={value} prefix={prefix} suffix={suffix} duration={1500} />
            </div>

            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600",
                )}
              >
                {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trend.value}%
              </div>
            )}
          </div>

          {progress && <ProgressBar value={progress.current} max={progress.max} animated className="mt-3" />}
        </div>
      </CardContent>
    </Card>
  )
}
