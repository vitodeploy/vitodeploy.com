"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BookOpenIcon, HeartIcon, CloudIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background — uses radial-gradient instead of blurred divs to avoid banding */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.55 0.15 264 / 8%), transparent)",
            "radial-gradient(ellipse 40% 40% at 10% 40%, oklch(0.6 0.12 280 / 5%), transparent)",
            "radial-gradient(ellipse 40% 35% at 90% 45%, oklch(0.55 0.15 264 / 5%), transparent)",
          ].join(", "),
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.55 0.15 264 / 12%), transparent)",
            "radial-gradient(ellipse 40% 40% at 10% 40%, oklch(0.6 0.12 280 / 8%), transparent)",
            "radial-gradient(ellipse 40% 35% at 90% 45%, oklch(0.55 0.15 264 / 8%), transparent)",
          ].join(", "),
        }}
      />

      {/* Grid pattern overlay */}
      <div className="grid-pattern pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      {/* Noise texture */}
      <div className="noise-overlay pointer-events-none absolute inset-0 -z-10" />

      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 border-indigo-200/50 bg-indigo-50/50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300"
            >
              Open-Source &middot; Free &middot; Self-Hosted
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Server management
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-400 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300">
              made simple
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Deploy and manage your servers and applications without a hassle.
            Provision servers, manage databases, deploy sites, and more — all
            from a clean, self-hosted dashboard.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                asChild
                className="bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Link href="/docs/getting-started/introduction">
                  <BookOpenIcon className="mr-2 size-4" />
                  Documentation
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href="https://github.com/sponsors/saeedvaziry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HeartIcon className="mr-2 size-4 text-pink-500" />
                  Sponsor
                </a>
              </Button>
            </div>
            <a
              href="https://vitodeploy.waitlio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <CloudIcon className="size-4" />
              Join the Cloud Waitlist
            </a>
          </motion.div>
        </div>

        {/* Screenshot */}
        <motion.div
          className="relative mx-auto mt-16 max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <Image
              src="/img/overview-light.png"
              alt="VitoDeploy Dashboard"
              width={1200}
              height={675}
              className="block w-full dark:hidden"
              priority
            />
            <Image
              src="/img/overview-dark.png"
              alt="VitoDeploy Dashboard"
              width={1200}
              height={675}
              className="hidden w-full dark:block"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
