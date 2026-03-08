"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  MenuIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
} from "lucide-react"
import {
  SiGithub,
  SiDiscord,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons"
import { useTheme } from "next-themes"
import {
  VERSIONS,
  DEFAULT_VERSION,
  type Version,
  docUrl,
} from "@/lib/docs-config"
import { useEffect, useState } from "react"

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

  // Detect current version from path
  // Non-default versions have the version in the URL: /docs/2.x/...
  // Default version has no prefix: /docs/getting-started/...
  const versionMatch = pathname.match(/^\/docs\/(\d+\.x)/)
  const matchedVersion = versionMatch?.[1] as Version | undefined
  const currentVersion: Version =
    matchedVersion && VERSIONS.includes(matchedVersion)
      ? matchedVersion
      : DEFAULT_VERSION

  return (
    <header className={cn("top-0 z-50 w-full transition-colors", isHome ? "fixed" : "sticky", isHome && !scrolled ? "bg-transparent" : "border-b bg-background/80 backdrop-blur-sm")}>
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
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
                pathname.startsWith(link.href.startsWith("/docs/") ? "/docs" : link.href.split("?")[0])
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
              {link.external && <ExternalLinkIcon className="size-3" />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {/* Version dropdown - only visible on docs pages */}
          {pathname.startsWith("/docs") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  v{currentVersion}
                  <ChevronDownIcon className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {VERSIONS.map((v) => (
                  <DropdownMenuItem key={v} asChild>
                    <Link
                      href={docUrl(v, "getting-started/introduction")}
                      className={cn(v === currentVersion && "font-medium")}
                    >
                      v{v}
                      {v === DEFAULT_VERSION && " (latest)"}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground",
                      pathname.startsWith(link.href.startsWith("/docs/") ? "/docs" : link.href.split("?")[0])
                        ? "font-medium text-indigo-600 dark:text-indigo-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                    {link.external && <ExternalLinkIcon className="size-3" />}
                  </Link>
                ))}
                <div className="my-2 border-t" />
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
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
  )
}
