"use client"

import { ChevronRight, Home, User, Building, Globe, LinkIcon } from "lucide-react"
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
  const entity = searchParams.get("entity")

  // Determine access method
  const isParameterAccess = !!siteParam
  const isDomainAccess = !isParameterAccess && domainConfig.domain !== "localhost:3000"

  // Build breadcrumb items
  const breadcrumbItems = []

  // Root item
  if (domainConfig.domain === "localhost:3000" || domainConfig.domain.includes("vusercontent.net")) {
    breadcrumbItems.push({
      label: "All Sites",
      href: "/",
      icon: <Home className="h-3 w-3" />,
    })
  } else {
    breadcrumbItems.push({
      label: site.name,
      href: "/",
      icon: <Home className="h-3 w-3" />,
    })
  }

  // Add entity if present
  if (entity) {
    breadcrumbItems.push({
      label: entity.charAt(0).toUpperCase() + entity.slice(1).replace("-", " "),
      href: `/?entity=${entity}`,
      icon:
        entity.includes("corp") || entity.includes("ent") ? (
          <Building className="h-3 w-3" />
        ) : (
          <User className="h-3 w-3" />
        ),
    })
  }

  // Add path segments
  const pathSegments = pathname.split("/").filter(Boolean)
  pathSegments.forEach((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ")

    breadcrumbItems.push({
      label,
      href,
      icon: segment === "profile" ? <User className="h-3 w-3" /> : <Globe className="h-3 w-3" />,
    })
  })

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {/* Access method indicator */}
      <div className="flex items-center space-x-2 mr-3">
        {isParameterAccess && (
          <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5">
            <LinkIcon className="h-3 w-3 mr-1" />
            Parameter
          </Badge>
        )}
        {isDomainAccess && (
          <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5">
            <Globe className="h-3 w-3 mr-1" />
            Domain
          </Badge>
        )}
      </div>

      {/* Breadcrumb items */}
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-1">
          {index > 0 && <ChevronRight className="h-3 w-3 text-border" />}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-7 px-2 text-xs hover:bg-primary/10 transition-all duration-200"
          >
            <Link href={item.href} className="flex items-center space-x-1">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </Button>
        </div>
      ))}
    </nav>
  )
}
