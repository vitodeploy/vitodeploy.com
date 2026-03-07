import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://vitodeploy.com"),
  title: {
    default: "VitoDeploy - Self-Hosted Server Management Tool",
    template: "%s | VitoDeploy",
  },
  description:
    "Free, open-source, and self-hosted server management tool. Deploy your applications without a hassle.",
  openGraph: {
    title: "VitoDeploy",
    description: "Free, open-source, and self-hosted server management tool.",
    url: "https://vitodeploy.com",
    siteName: "VitoDeploy",
    images: [{ url: "/img/social-card.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VitoDeploy",
    description: "Free, open-source, and self-hosted server management tool.",
    images: ["/img/social-card.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
      "application/atom+xml": "/atom.xml",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body>
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
