"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { portfolioData } from "@/lib/data"

interface RelatedProjectsProps {
  currentItem: {
    id: string
    name: string
    type: string
    theme: string
    associations: string[]
  }
  fromEntity?: string | null
}

export function RelatedProjects({ currentItem, fromEntity }: RelatedProjectsProps) {
  // Find related projects based on shared associations, type, or theme
  const relatedProjects = portfolioData
    .filter((item) => item.id !== currentItem.id)
    .map((item) => {
      let score = 0

      // Score based on shared associations
      const sharedAssociations = item.associations.filter((person) => currentItem.associations.includes(person))
      score += sharedAssociations.length * 3

      // Score based on same type
      if (item.type === currentItem.type) score += 2

      // Score based on same theme
      if (item.theme === currentItem.theme) score += 1

      return { ...item, score, sharedAssociations }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  if (relatedProjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Related Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No related projects found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedProjects.map((project) => (
          <Card key={project.id} className={`hover:shadow-lg transition-shadow ${project.color || "bg-yellow-200"}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-2 text-gray-800">{project.name}</CardTitle>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="outline" className="bg-white/50">
                      {project.type}
                    </Badge>
                    <Badge variant="outline" className="bg-white/50">
                      {project.theme}
                    </Badge>
                    {project.percentage && (
                      <Badge variant="default" className="bg-gray-800 text-white">
                        {project.percentage}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <CardDescription className="line-clamp-2 text-gray-700">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.sharedAssociations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Shared Connections:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.sharedAssociations.map((person, index) => (
                        <Badge key={index} variant="default" className="text-xs bg-gray-800 text-white">
                          {person}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Relevance Score: {project.score}</div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/profile/${project.id}${fromEntity ? `?from=${fromEntity}` : ""}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
