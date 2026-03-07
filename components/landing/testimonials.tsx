"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MessageCircleIcon } from "lucide-react"
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

function ReviewCard({ name, username, body, img, url }: (typeof reviews)[0]) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block rounded-lg border p-4 transition-colors",
        "bg-card hover:border-foreground/20"
      )}
    >
      <div className="flex items-center gap-3">
        <Image
          src={img}
          alt={name}
          width={36}
          height={36}
          className="rounded-full"
        />
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{username}</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </a>
  )
}

export function Testimonials() {
  return (
    <section className="border-t py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Loved by the community
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

        <div className="mx-auto mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {reviews.map((review) => (
            <div key={review.username} className="mb-4 break-inside-avoid">
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
