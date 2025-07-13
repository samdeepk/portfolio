"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

interface TimelineItem {
  id: string
  name: string
  type: string
  theme: string
  associations: string[]
  description: string
  website?: string
  percentage?: number
}

interface TimelineViewProps {
  item: TimelineItem
}

export function TimelineView({ item }: TimelineViewProps) {
  // Mock timeline data - in a real app, this would come from your data source
  const timelineEvents = [
    {
      date: "2024",
      title: "Current Status",
      description: item.description,
      type: item.type,
      status: "active",
    },
    {
      date: "2023",
      title: "Partnership Established",
      description: `Formed strategic partnership with ${item.associations.join(", ")}`,
      type: "milestone",
      status: "completed",
    },
    {
      date: "2022",
      title: "Initial Investment",
      description: item.percentage ? `Acquired ${item.percentage}% stake` : "Initial engagement",
      type: "investment",
      status: "completed",
    },
    {
      date: "2021",
      title: "Project Inception",
      description: `${item.name} was founded with focus on ${item.theme}`,
      type: "founding",
      status: "completed",
    },
  ]

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
          {timelineEvents.map((event, index) => (
            <div key={index} className="relative flex items-start gap-6">
              {/* Timeline dot */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  event.status === "active" ? "bg-primary border-primary" : "bg-background border-muted-foreground"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    event.status === "active" ? "bg-primary-foreground" : "bg-muted-foreground"
                  }`}
                ></div>
              </div>

              {/* Timeline content */}
              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={event.status === "active" ? "default" : "secondary"}>{event.date}</Badge>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{event.description}</CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Timeline Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Major Milestones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{item.associations.length}</div>
              <div className="text-sm text-muted-foreground">Key People</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3+</div>
              <div className="text-sm text-muted-foreground">Years Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
