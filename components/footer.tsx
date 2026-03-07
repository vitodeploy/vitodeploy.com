import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  docs: {
    title: "Documentation",
    links: [
      { label: "Introduction", href: "/docs/getting-started/introduction" },
      { label: "Installation", href: "/docs/getting-started/installation" },
      { label: "Configuration", href: "/docs/getting-started/configuration" },
      { label: "Servers", href: "/docs/servers/create" },
      { label: "Sites", href: "/docs/sites/create" },
    ],
  },
  community: {
    title: "Community",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/vitodeploy/vito",
        external: true,
      },
      {
        label: "Discord",
        href: "https://discord.gg/uZeeHZZnm5",
        external: true,
      },
      {
        label: "Discussions",
        href: "https://github.com/vitodeploy/vito/discussions",
        external: true,
      },
    ],
  },
  more: {
    title: "More",
    links: [
      { label: "Blog", href: "/blog" },
      {
        label: "Live Demo",
        href: "https://demo.vitodeploy.com",
        external: true,
      },
      {
        label: "Sponsor",
        href: "https://github.com/sponsors/saeedvaziry",
        external: true,
      },
    ],
  },
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/img/logo.svg"
                alt="VitoDeploy"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="font-semibold">VitoDeploy</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Free, open-source, and self-hosted server management tool.
            </p>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VitoDeploy. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
