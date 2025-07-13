"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
}

export function AnimatedCounter({ value, duration = 1000, className, suffix = "", prefix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
