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
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to manage your servers
          </h2>
          <p className="mt-4 text-muted-foreground">
            A comprehensive set of tools for server provisioning, application
            deployment, and infrastructure management.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {feature.icon}
              </div>
              <h3 className="mt-3 font-medium">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
