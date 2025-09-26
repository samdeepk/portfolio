"use client"

import { ChevronRight, Home, Globe, LinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useDomain } from "@/components/domain-provider"
import type { Site } from "@/lib/shared-data"

interface SmartBreadcrumbProps {
  site: Site
}

export function SmartBreadcrumb({ site }: SmartBreadcrumbProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const domainConfig = useDomain()
  const siteParam = searchParams.get("site")

  // Determine access method
  const isParameterAccess = !!siteParam
  const isDomainAccess = !isParameterAccess && domainConfig.domain !== "localhost:3000"
  const showAllSitesLink = domainConfig.domain === "localhost:3000" || domainConfig.domain.includes("vusercontent.net")

  // Build breadcrumb items
  const breadcrumbItems = []

  // Root level
  if (showAllSitesLink) {
    breadcrumbItems.push({
      label: "All Sites",
      href: "/",
      icon: Home,
    })
  } else {
    breadcrumbItems.push({
      label: site.name,
      href: isParameterAccess ? `/?site=${site.id}` : "/",
      icon: isDomainAccess ? Globe : LinkIcon,
    })
  }

  // Path segments
  const pathSegments = pathname.split("/").filter(Boolean)

  pathSegments.forEach((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

    breadcrumbItems.push({
      label,
      href: isParameterAccess ? `${href}?site=${site.id}` : href,
      icon: null,
    })
  })

  if (breadcrumbItems.length <= 1) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}

          {index === breadcrumbItems.length - 1 ? (
            <div className="flex items-center space-x-1">
              {item.icon && <item.icon className="h-3 w-3" />}
              <span className="font-medium text-foreground">{item.label}</span>
            </div>
          ) : (
            <Button variant="ghost" size="sm" asChild className="h-auto p-1">
              <Link href={item.href} className="flex items-center space-x-1">
                {item.icon && <item.icon className="h-3 w-3" />}
                <span>{item.label}</span>
              </Link>
            </Button>
          )}
        </div>
      ))}

      {/* Access method indicator */}
      <div className="ml-2">
        {isParameterAccess && (
          <Badge variant="outline" className="text-xs">
            <LinkIcon className="h-3 w-3 mr-1" />
            Param
          </Badge>
        )}
        {isDomainAccess && (
          <Badge variant="outline" className="text-xs">
            <Globe className="h-3 w-3 mr-1" />
            Domain
          </Badge>
        )}
      </div>
    </nav>
  )
}
