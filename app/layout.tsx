import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DomainProvider } from "@/components/domain-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portfolio Ecosystem",
  description: "Dynamic multi-site portfolio system",
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
            body {
              background: hsl(210 11% 8%);
              color: hsl(210 11% 98%);
            }
            .noise-overlay::before {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: 
                radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
              background-size: 20px 20px;
              pointer-events: none;
              z-index: -1;
            }
          `,
          }}
        />
      </head>
      <body className={`${inter.className} noise-overlay`}>
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
