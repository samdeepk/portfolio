import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getDomainConfig, getSiteConfig } from "./lib/domain-config"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "localhost:3000"
  const url = request.nextUrl.clone()
  const siteParam = url.searchParams.get("site")

  const domainConfig = getDomainConfig(host)

  // If accessing via custom domain AND no site parameter, add the domain's site parameter
  if (domainConfig.siteId !== "selector" && !siteParam) {
    url.searchParams.set("site", domainConfig.siteId)
    return NextResponse.rewrite(url)
  }

  // If accessing via URL parameter, validate the site parameter
  if (siteParam) {
    const siteConfig = getSiteConfig(siteParam)
    if (!siteConfig || siteConfig.siteId === "selector") {
      // Invalid site parameter, redirect to selector
      url.searchParams.delete("site")
      return NextResponse.redirect(url)
    }
  }

  // For the main selector site with no parameters, ensure clean URL
  if (domainConfig.siteId === "selector" && !siteParam) {
    // Clean URL, no changes needed
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
