import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BookOpenIcon, HeartIcon, CloudIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6">
            Open-Source &middot; Free &middot; Self-Hosted
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Server management
            <br />
            <span className="text-muted-foreground">made simple</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Deploy and manage your servers and applications without a hassle.
            Provision servers, manage databases, deploy sites, and more — all
            from a clean, self-hosted dashboard.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Button size="lg" asChild>
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
          </div>
        </div>

        {/* Screenshot */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/5 dark:shadow-black/30">
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
          {/* Gradient fade at bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </section>
  )
}
