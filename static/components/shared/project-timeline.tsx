"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { Project } from "@/lib/shared-data"

interface ProjectTimelineProps {
  projects: Project[]
}

export function ProjectTimeline({ projects }: ProjectTimelineProps) {
  const sortedProjects = [...projects].sort((a, b) => b.year - a.year)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Project Timeline</h2>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

        <div className="space-y-6">
          {sortedProjects.map((project, index) => (
            <div key={project.id} className="relative flex items-start gap-6">
              {/* Timeline dot */}
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background border-primary">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>

              {/* Timeline content */}
              <Card className="flex-1 bg-white/80 backdrop-blur">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{project.year}</Badge>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-3">{project.description}</CardDescription>
                  <div className="flex items-center gap-2">
                    <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
                    {project.ownership && <Badge variant="outline">{project.ownership}% ownership</Badge>}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
