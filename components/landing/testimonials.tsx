"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { QuoteIcon } from "lucide-react"
import Image from "next/image"
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons"

const reviews = [
  {
    name: "Mahdi",
    username: "@hazaveh",
    body: "Did you know VitoDeploy is the perfect open source alternative of Laravel Forge?",
    img: "/img/testimonial/hazaveh.jpg",
    url: "https://x.com/hazaveh/status/1706986832192291322",
  },
  {
    name: "Nader Ikladious",
    username: "@NaderIkladious",
    body: "Gotta say using #VitoDeploy to manage server and deployments was indeed the best decision while working on #spur",
    img: "/img/testimonial/NaderIkladious.jpg",
    url: "https://x.com/naderikladious/status/1783878659595460945",
  },
  {
    name: "Marcelo Anjos",
    username: "@geek_marcelo",
    body: "Deploying with Vito Deploy is a game-changer! Fast, reliable, and hassle-free -- exactly what every developer needs.",
    img: "/img/testimonial/geek_marcelo.jpg",
    url: "https://x.com/geek_marcelo/status/1904107374819922190",
  },
  {
    name: "Jorge",
    username: "@heyjorgedev",
    body: "VitoDeploy is one of the few projects I'm really excited about. And it's built with Laravel and htmx.",
    img: "/img/testimonial/heyjorgedev.jpg",
    url: "https://x.com/heyjorgedev/status/1834949411899600924",
  },
  {
    name: "Mason",
    username: "@capten_masin",
    body: "Never heard of VitoDeploy until today, this looks amazing.",
    img: "/img/testimonial/capten_masin.jpg",
    url: "https://x.com/capten_masin/status/1803067560520278527",
  },
  {
    name: "Arun Joseph",
    username: "@thenexido",
    body: "Never heard about VitoDeploy before and it looks interesting.",
    img: "/img/testimonial/thenexido.jpg",
    url: "https://x.com/thenexido/status/1803101943650533795",
  },
  {
    name: "Bernard Sarfo Twumasi",
    username: "@devsarfo",
    body: "After using VitoDeploy for a month, I highly recommend it to all PHP developers. It makes server management simple and hassle-free.",
    img: "/img/testimonial/devsarfo.jpg",
    url: "https://x.com/devsarfo/status/1747629642893144509",
  },
  {
    name: "Muhammad Shafeeq",
    username: "@hmshafeeq",
    body: "Recently tried VitoDeploy, impressed by its features, performance and versatility. Hats off for building such a powerful deployment solution.",
    img: "/img/testimonial/hmshafeeq.jpg",
    url: "https://x.com/hmshafeeq/status/1841098713546039648",
  },
  {
    name: "Wilson Bridgett",
    username: "@_wilsonpb",
    body: "Just discovered #VitoDeploy and have become a fan. I also like the change to SQLite!",
    img: "/img/testimonial/_wilsonpb.jpg",
    url: "https://x.com/_wilsonpb/status/1765912692223594565",
  },
  {
    name: "James Kokou GAGLO",
    username: "@dzamsgaglo",
    body: "Vito is a self-hosted web application that helps you manage your servers and deploy your PHP applications into production without a hassle.",
    img: "/img/testimonial/dzamsgaglo.jpg",
    url: "https://x.com/dzamsgaglo/status/1838577721305071878",
  },
]

// Split reviews into two rows for the marquee
const firstRow = reviews.slice(0, 5)
const secondRow = reviews.slice(5)

function ReviewCard({ name, username, body, img, url }: (typeof reviews)[0]) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block w-[320px] shrink-0 rounded-xl border p-5 transition-all duration-300",
        "bg-card/80 backdrop-blur-sm",
        "hover:border-indigo-300/50 hover:shadow-lg hover:shadow-indigo-500/5",
        "dark:hover:border-indigo-500/30 dark:hover:shadow-indigo-500/10"
      )}
    >
      {/* Subtle gradient accent on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.06]" />

      <div className="relative flex items-start gap-3">
        <Image
          src={img}
          alt={name}
          width={40}
          height={40}
          className="shrink-0 rounded-full ring-2 ring-indigo-100 dark:ring-indigo-500/20"
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{username}</div>
        </div>
        <QuoteIcon className="size-4 shrink-0 text-indigo-300 dark:text-indigo-500/40" />
      </div>
      <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </a>
  )
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: typeof reviews
  reverse?: boolean
}) {
  // Duplicate items for seamless loop
  const duplicated = [...items, ...items]

  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className={cn(
          "flex gap-4",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{ "--marquee-duration": "35s" } as React.CSSProperties}
      >
        {duplicated.map((review, i) => (
          <ReviewCard key={`${review.username}-${i}`} {...review} />
        ))}
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="relative border-t py-20">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-500/8" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Loved by the{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              community
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Discover what developers have to say about their VitoDeploy
            experience.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/vitodeploy/vito/discussions"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiGithub className="mr-2 size-4" />
                Discussions
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://discord.gg/uZeeHZZnm5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiDiscord className="mr-2 size-4" />
                Discord
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Marquee rows - full width */}
      <div className="mt-12 flex flex-col gap-4">
        <MarqueeRow items={firstRow} />
        <MarqueeRow items={secondRow} reverse />
      </div>
    </section>
  )
}
