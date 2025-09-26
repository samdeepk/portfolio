"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, User, Building, TrendingUp, Globe } from "lucide-react"
import Link from "next/link"
import { sites } from "@/lib/shared-data"
import { motion } from "framer-motion"

export function SiteSelector() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-6 text-gradient">Portfolio Network</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our interconnected portfolio system featuring multiple entities, each with their own unique identity
            and specialized focus areas.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {sites.map((site) => {
            const IconComponent =
              site.theme === "personal"
                ? User
                : site.theme === "corporate"
                  ? Building
                  : site.theme === "investment"
                    ? TrendingUp
                    : Globe

            return (
              <motion.div key={site.id} variants={item}>
                <Card className="card-enhanced glow-accent group hover:scale-[1.02] transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold">{site.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {site.theme}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base leading-relaxed">{site.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {site.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button asChild className="flex-1 group-hover:shadow-lg transition-shadow">
                          <Link href={`/?site=${site.id}`}>
                            <Globe className="mr-2 h-4 w-4" />
                            View Portfolio
                          </Link>
                        </Button>

                        {site.externalUrl && (
                          <Button variant="outline" size="icon" asChild className="shrink-0 bg-transparent">
                            <a
                              href={site.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:bg-primary/10"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border/50">
            <Globe className="h-4 w-4" />
            <span>Multi-domain portfolio system with smart navigation</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
