"use client"

import { useState, useCallback, useEffect } from "react"
import { Search, Filter, X, Sparkles, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { portfolioData } from "@/lib/data"
import { cn } from "@/lib/utils"

interface EnhancedSearchProps {
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

export function EnhancedSearch({ onFilterChange, initialFilters = {} }: EnhancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || "")
  const [selectedType, setSelectedType] = useState(initialFilters.type || "all")
  const [selectedTheme, setSelectedTheme] = useState(initialFilters.theme || "all")
  const [showFilters, setShowFilters] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)

  // Get filter options
  const filterOptions = {
    types: [...new Set(portfolioData.map((item) => item.type))],
    themes: [...new Set(portfolioData.map((item) => item.theme))],
  }

  // Generate search suggestions
  const generateSuggestions = useCallback((query: string) => {
    if (!query) return []

    const allTerms = [
      ...portfolioData.map((item) => item.name),
      ...portfolioData.flatMap((item) => item.associations),
      ...filterOptions.types,
      ...filterOptions.themes,
    ]

    return allTerms.filter((term) => term.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        searchQuery,
        type: selectedType,
        theme: selectedTheme,
      })

      if (searchQuery) {
        setSuggestions(generateSuggestions(searchQuery))
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedType, selectedTheme, onFilterChange, generateSuggestions])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleSearchSubmit = (query: string) => {
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)])
    }
    setIsFocused(false)
  }

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion)
    handleSearchSubmit(suggestion)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedTheme("all")
    onFilterChange({
      searchQuery: "",
      type: "all",
      theme: "all",
    })
  }

  const hasActiveFilters = searchQuery || selectedType !== "all" || selectedTheme !== "all"

  return (
    <div className="space-y-4">
      {/* Enhanced Search Bar */}
      <div className="relative">
        <div className={cn("relative transition-all duration-300", isFocused && "transform scale-[1.02]")}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, companies, or people..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit(searchQuery)
              }
            }}
            className={cn(
              "pl-10 pr-10 transition-all duration-300",
              isFocused && "ring-2 ring-primary/20 border-primary/50",
            )}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSearchChange("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search Suggestions */}
        {isFocused && (suggestions.length > 0 || recentSearches.length > 0) && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-2 shadow-lg border">
            <CardContent className="p-3 space-y-3">
              {suggestions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Suggestions</span>
                  </div>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Recent</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recentSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => selectSuggestion(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {[searchQuery, selectedType !== "all", selectedTheme !== "all"].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
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
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-300">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1 animate-in fade-in duration-300">
              Search: "{searchQuery}"
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                onClick={() => handleSearchChange("")}
              />
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1 animate-in fade-in duration-300">
              Type: {selectedType}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                onClick={() => setSelectedType("all")}
              />
            </Badge>
          )}
          {selectedTheme !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1 animate-in fade-in duration-300">
              Theme: {selectedTheme}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                onClick={() => setSelectedTheme("all")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
