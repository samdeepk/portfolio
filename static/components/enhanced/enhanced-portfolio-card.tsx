"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Heart, Share2, Bookmark, TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { PortfolioItem } from "@/lib/data"

interface EnhancedPortfolioCardProps {
  item: PortfolioItem
  entity?: string | null
  viewMode?: "grid" | "list"
  showActions?: boolean
}

export function EnhancedPortfolioCard({
  item,
  entity,
  viewMode = "grid",
  showActions = true,
}: EnhancedPortfolioCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { toast } = useToast()

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await navigator.share({
        title: item.name,
        text: item.description,
        url: `/profile/${item.id}${entity ? `?from=${entity}` : ""}`,
      })
    } catch {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.origin + `/profile/${item.id}`)
      toast({
        title: "Link copied!",
        description: "Project link copied to clipboard",
      })
    }
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: `${item.name} ${isBookmarked ? "removed from" : "added to"} your bookmarks`,
    })
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <Link href={`/profile/${item.id}${entity ? `?from=${entity}` : ""}`}>
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 cursor-pointer h-full",
          "hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
          item.color || "bg-gradient-to-br from-yellow-50 to-yellow-100",
          viewMode === "list" && "flex flex-row",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100",
          )}
        />

        {/* Content */}
        <CardHeader className={cn("relative z-10 pb-3", viewMode === "list" && "flex-1")}>
          <div className="flex items-start justify-between">
            <CardTitle className="text-base font-bold text-gray-800 line-clamp-2 group-hover:text-gray-900 transition-colors">
              {item.name}
            </CardTitle>
            <div className="flex items-center gap-1 ml-2 shrink-0">
              {item.percentage && (
                <Badge variant="default" className="text-xs bg-gray-800 text-white">
                  {item.percentage}%
                </Badge>
              )}
              {item.type === "Investment" && <TrendingUp className="h-3 w-3 text-green-600" />}
            </div>
          </div>

          {viewMode === "list" && (
            <CardDescription className="text-sm text-gray-700 line-clamp-2">{item.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent
          className={cn("relative z-10 pt-0", viewMode === "list" && "flex items-center justify-between gap-4 min-w-0")}
        >
          <div className={cn(viewMode === "list" ? "flex items-center gap-4 min-w-0" : "space-y-3")}>
            {/* Badges */}
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs bg-white/70 backdrop-blur-sm">
                {item.type}
              </Badge>
              <Badge variant="outline" className="text-xs bg-white/70 backdrop-blur-sm">
                {item.theme}
              </Badge>
            </div>

            {/* Description for grid view */}
            {viewMode === "grid" && (
              <CardDescription className="text-xs text-gray-700 line-clamp-2">{item.description}</CardDescription>
            )}

            {/* Associations */}
            {item.associations.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.associations.slice(0, 2).map((person, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {person}
                  </Badge>
                ))}
                {item.associations.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{item.associations.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          {showActions && (
            <div
              className={cn(
                "flex items-center gap-1 transition-all duration-300",
                viewMode === "grid"
                  ? isHovered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                  : "opacity-100",
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn("h-8 w-8 p-0 hover:bg-white/20", isLiked && "text-red-500")}
              >
                <Heart className={cn("h-3 w-3", isLiked && "fill-current")} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn("h-8 w-8 p-0 hover:bg-white/20", isBookmarked && "text-blue-500")}
              >
                <Bookmark className={cn("h-3 w-3", isBookmarked && "fill-current")} />
              </Button>

              <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 w-8 p-0 hover:bg-white/20">
                <Share2 className="h-3 w-3" />
              </Button>

              {item.website && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 hover:bg-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={item.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </CardContent>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300" />
      </Card>
    </Link>
  )
}
