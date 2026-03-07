"use client"

import {
  ChartPieIcon,
  ClockIcon,
  CogIcon,
  CpuIcon,
  DatabaseIcon,
  FlameIcon,
  GlobeIcon,
  KeyIcon,
  LockIcon,
  Package2Icon,
  ServerIcon,
  TerminalIcon,
  WorkflowIcon,
  MousePointerClickIcon,
  PlugIcon,
  CommandIcon,
} from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const features: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "Server",
    description: "Provisions and manages the server",
    icon: <ServerIcon className="size-5" />,
  },
  {
    title: "Database",
    description: "Supports MySQL, MariaDB, and PostgreSQL",
    icon: <DatabaseIcon className="size-5" />,
  },
  {
    title: "Site",
    description: "Deploy PHP applications like Laravel and WordPress",
    icon: <MousePointerClickIcon className="size-5" />,
  },
  {
    title: "Firewall",
    description: "Manage your server's firewall rules",
    icon: <FlameIcon className="size-5" />,
  },
  {
    title: "SSL",
    description: "Custom and Let's Encrypt SSL certificates",
    icon: <LockIcon className="size-5" />,
  },
  {
    title: "Workers",
    description: "Run background workers on your server",
    icon: <CpuIcon className="size-5" />,
  },
  {
    title: "Services",
    description: "Manage server services with ease",
    icon: <CogIcon className="size-5" />,
  },
  {
    title: "SSH Keys",
    description: "Deploy SSH keys to your servers",
    icon: <KeyIcon className="size-5" />,
  },
  {
    title: "Cron Jobs",
    description: "Create and manage scheduled tasks",
    icon: <ClockIcon className="size-5" />,
  },
  {
    title: "Console",
    description: "Run commands directly on your server",
    icon: <TerminalIcon className="size-5" />,
  },
  {
    title: "Monitoring",
    description: "Monitor CPU, memory, and disk usage",
    icon: <ChartPieIcon className="size-5" />,
  },
  {
    title: "Projects",
    description: "Organize servers and invite team members",
    icon: <Package2Icon className="size-5" />,
  },
  {
    title: "Workflows",
    description: "Automate tasks with custom workflows",
    icon: <WorkflowIcon className="size-5" />,
  },
  {
    title: "Domains",
    description: "Manage domains and DNS records",
    icon: <GlobeIcon className="size-5" />,
  },
  {
    title: "Plugins",
    description: "Extend features with plugins",
    icon: <PlugIcon className="size-5" />,
  },
  {
    title: "API",
    description: "Powerful API for integration",
    icon: <CommandIcon className="size-5" />,
  },
]

export function Features() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
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
  }, [])

  return (
    <section ref={sectionRef} className="relative border-t py-20">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-muted/40 via-transparent to-muted/20" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-500/8" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              manage your servers
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A comprehensive set of tools for server provisioning, application
            deployment, and infrastructure management.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-card/80 p-5 backdrop-blur-sm transition-all duration-500",
                "hover:border-indigo-300/50 hover:shadow-lg hover:shadow-indigo-500/5",
                "dark:hover:border-indigo-500/30 dark:hover:shadow-indigo-500/10",
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              )}
              style={{
                transitionDelay: isVisible ? `${i * 50}ms` : "0ms",
              }}
            >
              {/* Hover gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08]" />

              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-400 dark:group-hover:bg-indigo-500 dark:group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="mt-3 font-medium">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
