import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DomainProvider } from "@/components/domain-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dynamic Portfolio System",
  description: "A multi-site portfolio system with custom domains and URL parameters",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --background: 210 11% 8%;
              --foreground: 210 11% 98%;
              --card: 210 11% 12%;
              --card-foreground: 210 11% 98%;
              --primary: 210 100% 60%;
              --primary-foreground: 210 11% 8%;
              --secondary: 210 11% 16%;
              --secondary-foreground: 210 11% 98%;
              --muted: 210 11% 16%;
              --muted-foreground: 210 11% 65%;
              --border: 210 11% 20%;
            }
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <DomainProvider>
            {children}
            <Toaster />
          </DomainProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
