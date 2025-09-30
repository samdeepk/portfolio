"use client"

import { useState, useMemo, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Grid, List, SortAsc, SortDesc } from "lucide-react"
import { EnhancedSearch } from "./enhanced-search"
import { EnhancedPortfolioCard } from "./enhanced-portfolio-card"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { cn } from "@/lib/utils"
import type { PortfolioItem } from "@/lib/data"

interface EnhancedPortfolioGridProps {
  entity?: string | null
  initialData?: PortfolioItem[]
}

export function EnhancedPortfolioGrid({ entity, initialData }: EnhancedPortfolioGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<"name" | "type" | "year">("name")
  const [filters, setFilters] = useState({
    searchQuery: "",
    type: "",
    theme: "",
  })
  const [isPending, startTransition] = useTransition()

  const { data, stats } = usePortfolioData({
    entity,
    ...filters,
  })

  const displayData = initialData || data

  const sortedData = useMemo(() => {
    return [...displayData].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "type":
          comparison = a.type.localeCompare(b.type)
          break
        case "year":
          // Assuming we have year data, fallback to name
          comparison = a.name.localeCompare(b.name)
          break
      }

      return sortOrder === "desc" ? -comparison : comparison
    })
  }, [displayData, sortBy, sortOrder])

  const handleFilterChange = (newFilters: typeof filters) => {
    startTransition(() => {
      setFilters(newFilters)
    })
  }

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Search */}
      <EnhancedSearch onFilterChange={handleFilterChange} initialFilters={filters} />

      {/* Results Header with Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{sortedData.length}</span> {sortedData.length === 1 ? "project" : "projects"}
            {entity && <span className="text-primary"> for {entity}</span>}
          </p>

          {stats.totalProjects > 0 && (
            <div className="flex gap-2 animate-in slide-in-from-left duration-300">
              <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {stats.investments} investments
              </div>
              <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {stats.jobExperiences} experiences
              </div>
            </div>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Controls */}
          <Button variant="outline" size="sm" onClick={toggleSort} className="flex items-center gap-1 bg-transparent">
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            Sort
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1 bg-muted/50">
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
      </div>

      {/* Loading State */}
      {isPending && (
        <div
          className={cn(
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4",
          )}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Portfolio Grid/List */}
      {!isPending && sortedData.length > 0 ? (
        <div
          className={cn(
            "animate-in fade-in duration-500",
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4",
          )}
        >
          {sortedData.map((item, index) => (
            <div
              key={item.id}
              className="animate-in slide-in-from-bottom duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <EnhancedPortfolioCard item={item} entity={entity} viewMode={viewMode} showActions={true} />
            </div>
          ))}
        </div>
      ) : (
        !isPending && (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Grid className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {filters.searchQuery || filters.type || filters.theme
                  ? "No projects match your filters"
                  : "No projects found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {filters.searchQuery || filters.type || filters.theme
                  ? "Try adjusting your search criteria or clearing filters"
                  : "There are no projects to display at the moment"}
              </p>
              {(filters.searchQuery || filters.type || filters.theme) && (
                <Button variant="outline" onClick={() => setFilters({ searchQuery: "", type: "", theme: "" })}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  )
}
