"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Grid, List, ExternalLink } from "lucide-react"
import Link from "next/link"
import { PortfolioSearch } from "./portfolio-search"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import type { PortfolioItem } from "@/lib/data"

interface PortfolioGridProps {
  entity?: string | null
  initialData?: PortfolioItem[]
}

export function PortfolioGrid({ entity, initialData }: PortfolioGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    searchQuery: "",
    type: "",
    theme: "",
  })

  const { data, stats } = usePortfolioData({
    entity,
    ...filters,
  })

  const displayData = initialData || data

  const sortedData = useMemo(() => {
    return [...displayData].sort((a, b) => {
      // Sort by type priority, then by name
      const typePriority = {
        Investment: 1,
        Incubation: 2,
        Portfolio: 3,
        "Job Experience": 4,
        Company: 5,
      }

      const aPriority = typePriority[a.type as keyof typeof typePriority] || 999
      const bPriority = typePriority[b.type as keyof typeof typePriority] || 999

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      return a.name.localeCompare(b.name)
    })
  }, [displayData])

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <PortfolioSearch onFilterChange={setFilters} initialFilters={filters} />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {sortedData.length} {sortedData.length === 1 ? "project" : "projects"}
            {entity && ` for ${entity}`}
          </p>

          {stats.totalProjects > 0 && (
            <div className="flex gap-2">
              <Badge variant="outline">{stats.investments} investments</Badge>
              <Badge variant="outline">{stats.jobExperiences} experiences</Badge>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8 p-0"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Portfolio Grid/List */}
      {sortedData.length > 0 ? (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"
          }
        >
          {sortedData.map((item) => (
            <Link key={item.id} href={`/profile/${item.id}${entity ? `?from=${entity}` : ""}`}>
              <Card
                className={`hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer h-full ${item.color || "bg-yellow-200"} ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                <CardHeader className={viewMode === "list" ? "flex-1 pb-3" : "pb-3"}>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-bold text-gray-800 line-clamp-2">{item.name}</CardTitle>
                    {item.percentage && (
                      <Badge variant="default" className="text-xs bg-gray-800 text-white ml-2 shrink-0">
                        {item.percentage}%
                      </Badge>
                    )}
                  </div>
                  {viewMode === "list" && (
                    <CardDescription className="text-sm text-gray-700">{item.description}</CardDescription>
                  )}
                </CardHeader>

                <CardContent className={`pt-0 ${viewMode === "list" ? "flex items-center gap-4" : ""}`}>
                  <div className={viewMode === "list" ? "flex items-center gap-2" : "space-y-2"}>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs bg-white/50">
                        {item.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-white/50">
                        {item.theme}
                      </Badge>
                    </div>

                    {viewMode === "grid" && (
                      <CardDescription className="text-xs text-gray-700 line-clamp-2">
                        {item.description}
                      </CardDescription>
                    )}

                    {item.website && viewMode === "list" && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            {filters.searchQuery || filters.type || filters.theme
              ? "No projects match your filters"
              : "No projects found"}
          </p>
          {(filters.searchQuery || filters.type || filters.theme) && (
            <Button variant="outline" onClick={() => setFilters({ searchQuery: "", type: "", theme: "" })}>
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
