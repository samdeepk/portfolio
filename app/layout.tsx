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
  description: "Multi-site portfolio system with custom domains and URL parameters",
  keywords: ["portfolio", "multi-site", "dynamic", "custom domains"],
  authors: [{ name: "Portfolio System" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
              --popover: 210 11% 12%;
              --popover-foreground: 210 11% 98%;
              --primary: 210 11% 98%;
              --primary-foreground: 210 11% 8%;
              --secondary: 210 11% 16%;
              --secondary-foreground: 210 11% 98%;
              --muted: 210 11% 16%;
              --muted-foreground: 210 11% 65%;
              --accent: 210 11% 16%;
              --accent-foreground: 210 11% 98%;
              --destructive: 0 62.8% 30.6%;
              --destructive-foreground: 210 11% 98%;
              --border: 210 11% 20%;
              --input: 210 11% 20%;
              --ring: 210 11% 98%;
              --radius: 0.75rem;
            }
            
            body {
              background: hsl(var(--background));
              color: hsl(var(--foreground));
              position: relative;
            }
            
            body::before {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: 
                radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0);
              background-size: 20px 20px;
              pointer-events: none;
              z-index: -1;
              opacity: 0.3;
            }
            
            .noise-overlay {
              position: relative;
            }
            
            .card {
              background: hsl(var(--card) / 0.8);
              backdrop-filter: blur(8px);
              border: 1px solid hsl(var(--border) / 0.5);
            }
            
            .card:hover {
              background: hsl(var(--card) / 0.9);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
            
            .gradient-text {
              background: linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--foreground) / 0.7));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            
            .glow-effect {
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
            }
            
            .glow-effect:hover {
              box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
            }
            
            /* Custom scrollbar */
            ::-webkit-scrollbar {
              width: 8px;
            }
            
            ::-webkit-scrollbar-track {
              background: hsl(var(--background));
            }
            
            ::-webkit-scrollbar-thumb {
              background: hsl(var(--muted));
              border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: hsl(var(--muted-foreground));
            }
          `,
          }}
        />
      </head>
      <body className={`${inter.className} noise-overlay`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <DomainProvider>
            <div className="min-h-screen bg-background text-foreground">{children}</div>
            <Toaster />
          </DomainProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
