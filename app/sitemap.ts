import type { MetadataRoute } from "next"
import { headers } from "next/headers"
import { getDomainConfig } from "@/lib/domain-config"
import { srdProjects, sanskrutCorpProjects, sanskrutEnterprisesProjects } from "@/lib/shared-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const config = getDomainConfig(host)
  const baseUrl = `https://${config.domain}`

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ]

  // Add project-specific routes based on domain
  if (config.siteId === "srd") {
    srdProjects.forEach((project) => {
      routes.push({
        url: `${baseUrl}/project/${project.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })
    })
  } else if (config.siteId === "sanskrut-corp") {
    sanskrutCorpProjects.forEach((project) => {
      routes.push({
        url: `${baseUrl}/project/${project.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })
    })
  } else if (config.siteId === "sanskrut-enterprises") {
    sanskrutEnterprisesProjects.forEach((project) => {
      routes.push({
        url: `${baseUrl}/property/${project.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })
    })
  }

  return routes
}
