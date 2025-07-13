"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronRight, Home, Globe, LinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useDomain } from "@/components/domain-provider"

interface BreadcrumbItem {
  label: string
  href: string
  isActive: boolean
  icon?: React.ReactNode
  type?: "domain" | "site" | "path" | "page"
}

export function SmartBreadcrumb() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const domainConfig = useDomain()
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])

  useEffect(() => {
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
      const items: BreadcrumbItem[] = []
      const siteParam = searchParams.get("site")
      const entityParam = searchParams.get("entity")

      // Root/Home
      items.push({
        label: "Home",
        href: "/",
        isActive: false,
        icon: <Home className="h-3 w-3" />,
        type: "domain",
      })

      // Domain/Site context
      if (domainConfig.siteId !== "selector") {
        if (siteParam) {
          // URL parameter access
          items.push({
            label: domainConfig.siteName,
            href: `/?site=${siteParam}`,
            isActive: false,
            icon: <LinkIcon className="h-3 w-3" />,
            type: "site",
          })
        } else {
          // Domain access
          items.push({
            label: domainConfig.siteName,
            href: "/",
            isActive: false,
            icon: <Globe className="h-3 w-3" />,
            type: "domain",
          })
        }
      }

      // Entity context
      if (entityParam) {
        items.push({
          label: `Entity: ${entityParam}`,
          href: `/?entity=${entityParam}`,
          isActive: false,
          type: "path",
        })
      }

      // Path segments
      const pathSegments = pathname.split("/").filter(Boolean)
      let currentPath = ""

      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`
        const isLast = index === pathSegments.length - 1

        // Format segment label
        let label = segment.replace(/-/g, " ")
        label = label.charAt(0).toUpperCase() + label.slice(1)

        // Add context for known paths
        if (segment === "profile") {
          label = "Project Profile"
        } else if (segment === "person") {
          label = "Person Profile"
        }

        items.push({
          label,
          href: currentPath + (siteParam ? `?site=${siteParam}` : "") + (entityParam ? `?entity=${entityParam}` : ""),
          isActive: isLast,
          type: "path",
        })
      })

      return items
    }

    setBreadcrumbs(generateBreadcrumbs())
  }, [pathname, searchParams, domainConfig])

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground py-2 animate-in slide-in-from-left duration-300">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-3 w-3 mx-1" />}

          {item.isActive ? (
            <div className="flex items-center gap-1">
              {item.icon}
              <span className="font-medium text-foreground">{item.label}</span>
              {item.type && (
                <Badge variant="outline" className="text-xs ml-1">
                  {item.type}
                </Badge>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn("h-auto p-1 font-normal hover:bg-muted/50 transition-colors", "flex items-center gap-1")}
            >
              <Link href={item.href}>
                {item.icon}
                <span>{item.label}</span>
                {item.type && index === 1 && (
                  <Badge variant="outline" className="text-xs ml-1">
                    {item.type}
                  </Badge>
                )}
              </Link>
            </Button>
          )}
        </div>
      ))}
    </nav>
  )
}
