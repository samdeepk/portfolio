"use client"

import { useMemo } from "react"
import { portfolioData, entityConfigs } from "@/lib/data"
import type { PortfolioItem } from "@/lib/data"

interface UsePortfolioDataProps {
  entity?: string | null
  type?: string
  theme?: string
  searchQuery?: string
}

export function usePortfolioData({ entity, type, theme, searchQuery }: UsePortfolioDataProps = {}) {
  const filteredData = useMemo(() => {
    let data = portfolioData

    // Filter by entity (person/company)
    if (entity) {
      const entityName = entityConfigs[entity as keyof typeof entityConfigs]?.name
      if (entityName) {
        data = data.filter((item) =>
          item.associations.some(
            (person) =>
              person.toLowerCase() === entityName.toLowerCase() || person.toLowerCase() === entity.toLowerCase(),
          ),
        )
      }
    }

    // Filter by type
    if (type) {
      data = data.filter((item) => item.type === type)
    }

    // Filter by theme
    if (theme) {
      data = data.filter((item) => item.theme === theme)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.associations.some((person) => person.toLowerCase().includes(query)),
      )
    }

    return data
  }, [entity, type, theme, searchQuery])

  const stats = useMemo(() => {
    const totalProjects = filteredData.length
    const activeProjects = filteredData.filter((item) => item.type !== "Job Experience").length
    const investments = filteredData.filter((item) => item.type === "Investment").length
    const jobExperiences = filteredData.filter((item) => item.type === "Job Experience").length

    const themes = [...new Set(filteredData.map((item) => item.theme))]
    const types = [...new Set(filteredData.map((item) => item.type))]

    return {
      totalProjects,
      activeProjects,
      investments,
      jobExperiences,
      themes,
      types,
    }
  }, [filteredData])

  const groupedByType = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = []
        }
        acc[item.type].push(item)
        return acc
      },
      {} as Record<string, PortfolioItem[]>,
    )
  }, [filteredData])

  const groupedByTheme = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        if (!acc[item.theme]) {
          acc[item.theme] = []
        }
        acc[item.theme].push(item)
        return acc
      },
      {} as Record<string, PortfolioItem[]>,
    )
  }, [filteredData])

  return {
    data: filteredData,
    stats,
    groupedByType,
    groupedByTheme,
  }
}
