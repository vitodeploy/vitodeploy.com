"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { HeartIcon } from "lucide-react"

interface Contributor {
  id: number
  username: string
  contributions: number
  avatar_url: string
}

interface CacheData {
  contributors: Contributor[]
  timestamp: number
}

const CACHE_KEY = "vitodeploy_contributors"
const CACHE_DURATION = 60 * 60 * 1000

export function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const getCachedData = (): CacheData | null => {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (!cached) return null
        const parsed = JSON.parse(cached)
        if (
          !parsed ||
          !Array.isArray(parsed.contributors) ||
          typeof parsed.timestamp !== "number"
        )
          return null
        return parsed
      } catch {
        return null
      }
    }

    const fetchContributors = async () => {
      const cachedData = getCachedData()
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        setContributors(cachedData.contributors)
        return
      }

      try {
        const res = await fetch(
          "https://api.github.com/repos/vitodeploy/vito/contributors"
        )
        const data = await res.json()
        if (!Array.isArray(data)) return

        const mapped: Contributor[] = data
          .filter((u: Record<string, unknown>) => u.login)
          .map((u: Record<string, unknown>) => ({
            id: u.id as number,
            username: u.login as string,
            contributions: u.contributions as number,
            avatar_url: u.avatar_url as string,
          }))

        setContributors(mapped)
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ contributors: mapped, timestamp: Date.now() })
        )
      } catch {
        // Silently fail
      }
    }

    fetchContributors()
  }, [])

  // Intersection observer for entrance animation - depends on contributors loading
  useEffect(() => {
    if (contributors.length === 0) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [contributors.length])

  if (contributors.length === 0) return null

  return (
    <section ref={sectionRef} className="relative py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Built by{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              amazing people
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            These contributors make VitoDeploy possible. Join us on GitHub and
            be part of the community.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3">
          {contributors.map((contributor, i) => (
            <Tooltip key={contributor.id}>
              <TooltipTrigger asChild>
                <a
                  href={`https://github.com/${contributor.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group relative transition-all duration-500",
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  )}
                  style={{
                    transitionDelay: isVisible ? `${i * 40}ms` : "0ms",
                  }}
                >
                  <div className="relative">
                    <Image
                      src={contributor.avatar_url}
                      alt={contributor.username}
                      width={48}
                      height={48}
                      className="rounded-full ring-2 ring-transparent transition-all duration-300 group-hover:scale-110 group-hover:ring-indigo-400/50 dark:group-hover:ring-indigo-500/50"
                      unoptimized
                    />
                  </div>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{contributor.username}</p>
                <p className="text-xs text-muted-foreground">
                  {contributor.contributions} contributions
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Contribute CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://github.com/vitodeploy/vito"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-4 py-2 text-sm text-indigo-700 transition-colors hover:bg-indigo-100/50 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/15"
          >
            <HeartIcon className="size-3.5" />
            Become a contributor
          </a>
        </div>
      </div>
    </section>
  )
}
