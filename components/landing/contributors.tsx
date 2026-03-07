"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

  if (contributors.length === 0) return null

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Contributors</h2>
          <p className="mt-4 text-muted-foreground">
            Built by the community. These amazing people have contributed to
            VitoDeploy.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2">
          {contributors.map((contributor) => (
            <Tooltip key={contributor.id}>
              <TooltipTrigger asChild>
                <a
                  href={`https://github.com/${contributor.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <Image
                    src={contributor.avatar_url}
                    alt={contributor.username}
                    width={44}
                    height={44}
                    className="rounded-full"
                    unoptimized
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{contributor.username}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </section>
  )
}
