import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DomainProvider } from "@/components/domain-provider"
import { headers } from "next/headers"
import { getActiveConfig } from "@/lib/domain-config"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata({ searchParams }: { searchParams: { site?: string } }): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const config = getActiveConfig(host, searchParams.site)

  return {
    title: config.siteName,
    description: `${config.siteName} - Professional portfolio and business showcase`,
    icons: {
      icon: config.favicon,
    },
    openGraph: {
      title: config.siteName,
      description: `${config.siteName} - Professional portfolio and business showcase`,
      images: [config.ogImage],
      url: `https://${config.domain}`,
    },
    twitter: {
      card: "summary_large_image",
      title: config.siteName,
      description: `${config.siteName} - Professional portfolio and business showcase`,
      images: [config.ogImage],
    },
  }
}

export default async function RootLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode
  searchParams?: { site?: string }
}) {
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const config = getActiveConfig(host, searchParams?.site)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>{config.customCSS && <style dangerouslySetInnerHTML={{ __html: config.customCSS }} />}</head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DomainProvider config={config}>{children}</DomainProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
