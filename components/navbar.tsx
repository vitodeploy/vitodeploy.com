"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { MenuIcon, MoonIcon, SunIcon, ExternalLinkIcon } from "lucide-react"
import {
  SiGithub,
  SiDiscord,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { SearchDialog, SearchTrigger } from "@/components/search-dialog"

const navLinks: { href: string; label: string; external?: boolean }[] = [
  { href: "/docs/getting-started/introduction", label: "Docs" },
  { href: "/blog", label: "Blog" },
]

const socialLinks = [
  {
    href: "https://github.com/vitodeploy/vito",
    icon: SiGithub,
    label: "GitHub",
  },
  {
    href: "https://discord.gg/uZeeHZZnm5",
    icon: SiDiscord,
    label: "Discord",
  },
  {
    href: "https://x.com/vitodeploy",
    icon: SiX,
    label: "X",
  },
  {
    href: "https://youtube.com/saeedvaziry",
    icon: SiYoutube,
    label: "YouTube",
  },
]

export function Navbar() {
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === "/"

  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isHome])

  return (
    <SearchDialog>
      <header
        className={cn(
          "top-0 z-50 w-full transition-colors",
          isHome ? "fixed" : "sticky",
          isHome && !scrolled
            ? "bg-transparent"
            : "border-b bg-background/80 backdrop-blur-sm"
        )}
      >
        <div className="relative container mx-auto flex h-14 items-center gap-4 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/img/logo.svg"
              alt="VitoDeploy"
              width={28}
              height={28}
              className="rounded"
            />
            <span className="font-semibold">VitoDeploy</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:text-foreground",
                  pathname.startsWith(
                    link.href.startsWith("/docs/")
                      ? "/docs"
                      : link.href.split("?")[0]
                  )
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
                {link.external && <ExternalLinkIcon className="size-3" />}
              </Link>
            ))}
          </nav>

          {/* Search - absolutely centered on desktop */}
          {!isHome && (
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
              <div className="pointer-events-auto w-full max-w-62">
                <SearchTrigger />
              </div>
            </div>
          )}

          <div className="ml-auto flex items-center gap-1">
            {/* Mobile search icon */}
            {!isHome && <SearchTrigger mobile />}
            {/* Social icons - desktop */}
            <div className="hidden items-center md:flex">
              {socialLinks.map((link) => (
                <Button key={link.label} variant="ghost" size="icon-sm" asChild>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <link.icon className="size-4" />
                  </a>
                </Button>
              ))}
            </div>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle theme"
            >
              <SunIcon className="size-4 scale-100 dark:scale-0" />
              <MoonIcon className="absolute size-4 scale-0 dark:scale-100" />
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="md:hidden">
                  <MenuIcon className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-4">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-1.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors",
                        pathname.startsWith(
                          link.href.startsWith("/docs/")
                            ? "/docs"
                            : link.href.split("?")[0]
                        )
                          ? "bg-accent font-medium text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {link.label}
                      {link.external && <ExternalLinkIcon className="size-3" />}
                    </Link>
                  ))}
                  <div className="my-1.5 border-t" />
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <link.icon className="size-4" />
                      {link.label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </SearchDialog>
  )
}
