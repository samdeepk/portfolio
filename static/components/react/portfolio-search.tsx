"use client"

import { useState, useCallback, useMemo } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { portfolioData } from "@/lib/data"

interface PortfolioSearchProps {
  onFilterChange: (filters: {
    searchQuery: string
    type: string
    theme: string
  }) => void
  initialFilters?: {
    searchQuery?: string
    type?: string
    theme?: string
  }
}

export function PortfolioSearch({ onFilterChange, initialFilters = {} }: PortfolioSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || "")
  const [selectedType, setSelectedType] = useState(initialFilters.type || "all")
  const [selectedTheme, setSelectedTheme] = useState(initialFilters.theme || "all")
  const [showFilters, setShowFilters] = useState(false)

  // Get available filter options
  const filterOptions = useMemo(() => {
    const types = [...new Set(portfolioData.map((item) => item.type))]
    const themes = [...new Set(portfolioData.map((item) => item.theme))]
    return { types, themes }
  }, [])

  // Debounced search
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
      onFilterChange({
        searchQuery: value,
        type: selectedType,
        theme: selectedTheme,
      })
    },
    [selectedType, selectedTheme, onFilterChange],
  )

  const handleTypeChange = useCallback(
    (value: string) => {
      setSelectedType(value)
      onFilterChange({
        searchQuery,
        type: value,
        theme: selectedTheme,
      })
    },
    [searchQuery, selectedTheme, onFilterChange],
  )

  const handleThemeChange = useCallback(
    (value: string) => {
      setSelectedTheme(value)
      onFilterChange({
        searchQuery,
        type: selectedType,
        theme: value,
      })
    },
    [searchQuery, selectedType, onFilterChange],
  )

  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedTheme("all")
    onFilterChange({
      searchQuery: "",
      type: "all",
      theme: "all",
    })
  }, [onFilterChange])

  const hasActiveFilters = searchQuery || selectedType !== "all" || selectedTheme !== "all"

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects, companies, or people..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearchChange("")}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {[searchQuery, selectedType !== "all", selectedTheme !== "all"].filter(Boolean).length}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {filterOptions.types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Theme</label>
            <Select value={selectedTheme} onValueChange={handleThemeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All themes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All themes</SelectItem>
                {filterOptions.themes.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearchChange("")} />
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {selectedType}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleTypeChange("all")} />
            </Badge>
          )}
          {selectedTheme !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Theme: {selectedTheme}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleThemeChange("all")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
