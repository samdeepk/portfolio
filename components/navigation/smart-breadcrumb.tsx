"use client"

import { ChevronRight, Home, Globe, LinkIcon, User, Building } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
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
  const isLocalhost = domainConfig.domain === "localhost:3000" || domainConfig.domain.includes("vusercontent.net")

  // Build breadcrumb items
  const breadcrumbItems = []

  // Root item
  if (isLocalhost) {
    breadcrumbItems.push({
      label: "All Sites",
      href: "/",
      icon: Home,
      current: pathname === "/" && !siteParam,
    })
  }

  // Site item
  if (siteParam || !isLocalhost) {
    breadcrumbItems.push({
      label: site.name,
      href: siteParam ? `/?site=${siteParam}` : "/",
      icon: site.theme === "personal" ? User : Building,
      current: pathname === "/" && !!siteParam,
      badge: isParameterAccess ? "Parameter" : isDomainAccess ? "Domain" : null,
      badgeIcon: isParameterAccess ? LinkIcon : isDomainAccess ? Globe : null,
    })
  }

  // Path segments
  const pathSegments = pathname.split("/").filter(Boolean)
  pathSegments.forEach((segment, index) => {
    const isLast = index === pathSegments.length - 1
    const href = "/" + pathSegments.slice(0, index + 1).join("/") + (siteParam ? `?site=${siteParam}` : "")

    let label = segment
    let icon = null

    // Customize labels and icons based on segment
    if (segment === "profile") {
      label = "Profiles"
      icon = Building
    } else if (segment === "person") {
      label = "People"
      icon = User
    } else if (segment === "navigate") {
      label = "Navigation"
      icon = Globe
    } else {
      // Capitalize and format segment
      label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    }

    breadcrumbItems.push({
      label,
      href,
      icon,
      current: isLast,
    })
  })

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-1">
          {index > 0 && <ChevronRight className="h-3 w-3" />}

          <div className="flex items-center space-x-1">
            {item.current ? (
              <div className="flex items-center space-x-1 text-foreground font-medium">
                {item.icon && <item.icon className="h-3 w-3" />}
                <span>{item.label}</span>
                {item.badge && item.badgeIcon && (
                  <Badge variant="outline" className="text-xs ml-1">
                    <item.badgeIcon className="h-2 w-2 mr-1" />
                    {item.badge}
                  </Badge>
                )}
              </div>
            ) : (
              <Link href={item.href} className="flex items-center space-x-1 hover:text-foreground transition-colors">
                {item.icon && <item.icon className="h-3 w-3" />}
                <span>{item.label}</span>
                {item.badge && item.badgeIcon && (
                  <Badge variant="outline" className="text-xs ml-1">
                    <item.badgeIcon className="h-2 w-2 mr-1" />
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )}
          </div>
        </div>
      ))}
    </nav>
  )
}
