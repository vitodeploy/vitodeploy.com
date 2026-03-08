import fs from "fs"
import path from "path"
import matter from "gray-matter"

export { VERSIONS, DEFAULT_VERSION } from "./docs-config"
export type { Version, SidebarItem } from "./docs-config"
import type { Version, SidebarItem } from "./docs-config"

export interface DocMeta {
  title: string
  slug: string
  version: Version
  description?: string
  sidebar_label?: string
}

export interface DocPage {
  meta: DocMeta
  content: string
  slugParts: string[]
}

const CONTENT_DIR = path.join(process.cwd(), "content/docs")

function titleFromId(id: string): string {
  const lastPart = id.split("/").pop() || id
  return lastPart
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function getSidebar(version: Version): SidebarItem[] {
  const sidebars: Record<Version, SidebarItem[]> = {
    "4.x": [
      {
        type: "category",
        label: "Prologue",
        items: [
          { type: "doc", label: "Release Notes", id: "prologue/release-notes" },
          { type: "doc", label: "Upgrade Guide", id: "prologue/upgrade" },
          {
            type: "doc",
            label: "Contribution Guide",
            id: "prologue/contribution-guide",
          },
        ],
      },
      {
        type: "category",
        label: "Getting Started",
        items: [
          {
            type: "doc",
            label: "Introduction",
            id: "getting-started/introduction",
          },
          {
            type: "doc",
            label: "Installation",
            id: "getting-started/installation",
          },
          { type: "doc", label: "Securing", id: "getting-started/securing" },
          {
            type: "doc",
            label: "Configuration",
            id: "getting-started/configuration",
          },
          { type: "doc", label: "Update", id: "getting-started/update" },
        ],
      },
      {
        type: "category",
        label: "Servers",
        items: [
          { type: "doc", label: "Create", id: "servers/create" },
          { type: "doc", label: "Backups", id: "servers/backups" },
          { type: "doc", label: "Database", id: "servers/database" },
          { type: "doc", label: "PHP", id: "servers/php" },
          { type: "doc", label: "Firewall", id: "servers/firewall" },
          { type: "doc", label: "Cron Jobs", id: "servers/cronjobs" },
          { type: "doc", label: "Workers", id: "servers/workers" },
          { type: "doc", label: "SSH Keys", id: "servers/ssh-keys" },
          { type: "doc", label: "Services", id: "servers/services" },
          { type: "doc", label: "Monitoring", id: "servers/monitoring" },
          { type: "doc", label: "Console", id: "servers/console" },
          { type: "doc", label: "Redis", id: "servers/redis" },
          { type: "doc", label: "Settings", id: "servers/settings" },
          { type: "doc", label: "Logs", id: "servers/logs" },
        ],
      },
      {
        type: "category",
        label: "Sites",
        items: [
          { type: "doc", label: "Create", id: "sites/create" },
          { type: "doc", label: "Site Types", id: "sites/site-types" },
          { type: "doc", label: "Application", id: "sites/application" },
          { type: "doc", label: "Commands", id: "sites/commands" },
          { type: "doc", label: "SSL", id: "sites/ssl" },
          { type: "doc", label: "Settings", id: "sites/settings" },
          { type: "doc", label: "Isolation", id: "sites/isolation" },
          { type: "doc", label: "Load Balancer", id: "sites/load-balancer" },
          { type: "doc", label: "Redirects", id: "sites/redirects" },
          {
            type: "doc",
            label: "Modern Deployment",
            id: "sites/modern-deployment",
          },
        ],
      },
      { type: "doc", label: "Scripts", id: "scripts" },
      {
        type: "doc",
        label: "Workflows & Automations",
        id: "workflows",
      },
      { type: "doc", label: "Domains", id: "domains" },
      {
        type: "category",
        label: "Plugins",
        items: [
          { type: "doc", label: "Plugins", id: "plugins" },
          {
            type: "doc",
            label: "Laravel Octane",
            id: "plugins/laravel-octane",
          },
          {
            type: "doc",
            label: "Laravel Reverb",
            id: "plugins/laravel-reverb",
          },
          {
            type: "doc",
            label: "Tiny File Manager",
            id: "plugins/tiny-file-manager",
          },
        ],
      },
      {
        type: "category",
        label: "Settings",
        items: [
          { type: "doc", label: "Profile", id: "settings/profile" },
          { type: "doc", label: "Projects", id: "settings/projects" },
          {
            type: "doc",
            label: "Server Providers",
            id: "settings/server-providers",
          },
          {
            type: "doc",
            label: "Source Controls",
            id: "settings/source-controls",
          },
          {
            type: "doc",
            label: "Notification Channels",
            id: "settings/notification-channels",
          },
          {
            type: "doc",
            label: "Storage Providers",
            id: "settings/storage-providers",
          },
          {
            type: "doc",
            label: "DNS Providers",
            id: "settings/dns-providers",
          },
          { type: "doc", label: "API Keys", id: "settings/api-keys" },
          {
            type: "doc",
            label: "Vito Settings",
            id: "settings/vito-settings",
          },
        ],
      },
      { type: "doc", label: "Diagnoses", id: "diagnoses" },
      { type: "doc", label: "Admin", id: "admin" },
    ],
    "3.x": [
      {
        type: "category",
        label: "Prologue",
        items: [
          { type: "doc", label: "Release Notes", id: "prologue/release-notes" },
          { type: "doc", label: "Upgrade Guide", id: "prologue/upgrade" },
          {
            type: "doc",
            label: "Contribution Guide",
            id: "prologue/contribution-guide",
          },
        ],
      },
      {
        type: "category",
        label: "Getting Started",
        items: [
          {
            type: "doc",
            label: "Introduction",
            id: "getting-started/introduction",
          },
          {
            type: "doc",
            label: "Installation",
            id: "getting-started/installation",
          },
          { type: "doc", label: "Securing", id: "getting-started/securing" },
          {
            type: "doc",
            label: "Configuration",
            id: "getting-started/configuration",
          },
          { type: "doc", label: "Update", id: "getting-started/update" },
        ],
      },
      {
        type: "category",
        label: "Servers",
        items: [
          { type: "doc", label: "Create", id: "servers/create" },
          { type: "doc", label: "Backups", id: "servers/backups" },
          { type: "doc", label: "Database", id: "servers/database" },
          { type: "doc", label: "PHP", id: "servers/php" },
          { type: "doc", label: "Firewall", id: "servers/firewall" },
          { type: "doc", label: "Cron Jobs", id: "servers/cronjobs" },
          { type: "doc", label: "Workers", id: "servers/workers" },
          { type: "doc", label: "SSH Keys", id: "servers/ssh-keys" },
          { type: "doc", label: "Services", id: "servers/services" },
          { type: "doc", label: "Monitoring", id: "servers/monitoring" },
          { type: "doc", label: "Console", id: "servers/console" },
          { type: "doc", label: "Redis", id: "servers/redis" },
          { type: "doc", label: "Settings", id: "servers/settings" },
          { type: "doc", label: "Logs", id: "servers/logs" },
        ],
      },
      {
        type: "category",
        label: "Sites",
        items: [
          { type: "doc", label: "Create", id: "sites/create" },
          { type: "doc", label: "Site Types", id: "sites/site-types" },
          { type: "doc", label: "Application", id: "sites/application" },
          { type: "doc", label: "Commands", id: "sites/commands" },
          { type: "doc", label: "SSL", id: "sites/ssl" },
          { type: "doc", label: "Settings", id: "sites/settings" },
          { type: "doc", label: "Isolation", id: "sites/isolation" },
          { type: "doc", label: "Load Balancer", id: "sites/load-balancer" },
          { type: "doc", label: "Redirects", id: "sites/redirects" },
          {
            type: "doc",
            label: "Modern Deployment",
            id: "sites/modern-deployment",
          },
        ],
      },
      { type: "doc", label: "Scripts", id: "scripts" },
      {
        type: "doc",
        label: "Workflows & Automations",
        id: "workflows",
      },
      { type: "doc", label: "Domains", id: "domains" },
      {
        type: "category",
        label: "Plugins",
        items: [
          { type: "doc", label: "Plugins", id: "plugins" },
          {
            type: "doc",
            label: "Laravel Octane",
            id: "plugins/laravel-octane",
          },
          {
            type: "doc",
            label: "Laravel Reverb",
            id: "plugins/laravel-reverb",
          },
          {
            type: "doc",
            label: "Tiny File Manager",
            id: "plugins/tiny-file-manager",
          },
        ],
      },
      {
        type: "category",
        label: "Settings",
        items: [
          { type: "doc", label: "Profile", id: "settings/profile" },
          { type: "doc", label: "Projects", id: "settings/projects" },
          {
            type: "doc",
            label: "Server Providers",
            id: "settings/server-providers",
          },
          {
            type: "doc",
            label: "Source Controls",
            id: "settings/source-controls",
          },
          {
            type: "doc",
            label: "Notification Channels",
            id: "settings/notification-channels",
          },
          {
            type: "doc",
            label: "Storage Providers",
            id: "settings/storage-providers",
          },
          {
            type: "doc",
            label: "DNS Providers",
            id: "settings/dns-providers",
          },
          { type: "doc", label: "API Keys", id: "settings/api-keys" },
          {
            type: "doc",
            label: "Vito Settings",
            id: "settings/vito-settings",
          },
        ],
      },
      { type: "doc", label: "Diagnoses", id: "diagnoses" },
      { type: "doc", label: "Admin", id: "admin" },
    ],
    "2.x": [
      {
        type: "category",
        label: "Prologue",
        items: [
          { type: "doc", label: "Release Notes", id: "prologue/release-notes" },
          { type: "doc", label: "Upgrade Guide", id: "prologue/upgrade" },
          {
            type: "doc",
            label: "Contribution Guide",
            id: "prologue/contribution-guide",
          },
        ],
      },
      {
        type: "category",
        label: "Getting Started",
        items: [
          {
            type: "doc",
            label: "Introduction",
            id: "getting-started/introduction",
          },
          {
            type: "doc",
            label: "Installation",
            id: "getting-started/installation",
          },
          { type: "doc", label: "Securing", id: "getting-started/securing" },
          {
            type: "doc",
            label: "Configuration",
            id: "getting-started/configuration",
          },
          { type: "doc", label: "Update", id: "getting-started/update" },
        ],
      },
      {
        type: "category",
        label: "Servers",
        items: [
          { type: "doc", label: "Database", id: "servers/database" },
          { type: "doc", label: "PHP", id: "servers/php" },
          { type: "doc", label: "Firewall", id: "servers/firewall" },
          { type: "doc", label: "Cron Jobs", id: "servers/cronjobs" },
          { type: "doc", label: "Workers", id: "servers/workers" },
          { type: "doc", label: "SSH Keys", id: "servers/ssh-keys" },
          { type: "doc", label: "Services", id: "servers/services" },
          { type: "doc", label: "Monitoring", id: "servers/monitoring" },
          { type: "doc", label: "Console", id: "servers/console" },
          { type: "doc", label: "Redis", id: "servers/redis" },
          { type: "doc", label: "Settings", id: "servers/settings" },
          { type: "doc", label: "Logs", id: "servers/logs" },
          { type: "doc", label: "File Manager", id: "servers/file-manager" },
        ],
      },
      {
        type: "category",
        label: "Sites",
        items: [
          { type: "doc", label: "Site Types", id: "sites/site-types" },
          { type: "doc", label: "Application", id: "sites/application" },
          { type: "doc", label: "SSL", id: "sites/ssl" },
          { type: "doc", label: "Settings", id: "sites/settings" },
          { type: "doc", label: "Isolation", id: "sites/isolation" },
          { type: "doc", label: "Load Balancer", id: "sites/load-balancer" },
          { type: "doc", label: "Redirects", id: "sites/redirects" },
        ],
      },
      { type: "doc", label: "Scripts", id: "scripts" },
      {
        type: "category",
        label: "Settings",
        items: [
          { type: "doc", label: "Profile", id: "settings/profile" },
          { type: "doc", label: "Projects", id: "settings/projects" },
          {
            type: "doc",
            label: "Server Providers",
            id: "settings/server-providers",
          },
          {
            type: "doc",
            label: "Source Controls",
            id: "settings/source-controls",
          },
          {
            type: "doc",
            label: "Notification Channels",
            id: "settings/notification-channels",
          },
          {
            type: "doc",
            label: "Storage Providers",
            id: "settings/storage-providers",
          },
        ],
      },
    ],
    "1.x": [
      {
        type: "category",
        label: "Prologue",
        items: [
          { type: "doc", label: "Upgrade Guide", id: "prologue/upgrade" },
          {
            type: "doc",
            label: "Contribution Guide",
            id: "prologue/contribution-guide",
          },
        ],
      },
      {
        type: "category",
        label: "Getting Started",
        items: [
          {
            type: "doc",
            label: "Introduction",
            id: "getting-started/introduction",
          },
          {
            type: "doc",
            label: "Installation",
            id: "getting-started/installation",
          },
          { type: "doc", label: "Securing", id: "getting-started/securing" },
          {
            type: "doc",
            label: "Configuration",
            id: "getting-started/configuration",
          },
          { type: "doc", label: "Update", id: "getting-started/update" },
        ],
      },
      {
        type: "category",
        label: "Servers",
        items: [
          {
            type: "doc",
            label: "Server Providers",
            id: "servers/server-providers",
          },
          { type: "doc", label: "Server Types", id: "servers/server-types" },
          { type: "doc", label: "Database", id: "servers/database" },
          {
            type: "doc",
            label: "Database Backups",
            id: "servers/database-backups",
          },
          { type: "doc", label: "PHP", id: "servers/php" },
          { type: "doc", label: "Firewall", id: "servers/firewall" },
          { type: "doc", label: "Cron Jobs", id: "servers/cronjobs" },
          { type: "doc", label: "SSH Keys", id: "servers/ssh-keys" },
          { type: "doc", label: "Services", id: "servers/services" },
          { type: "doc", label: "Monitoring", id: "servers/monitoring" },
          { type: "doc", label: "Console", id: "servers/console" },
          { type: "doc", label: "Redis", id: "servers/redis" },
          { type: "doc", label: "Settings", id: "servers/settings" },
          { type: "doc", label: "Logs", id: "servers/logs" },
        ],
      },
      {
        type: "category",
        label: "Sites",
        items: [
          { type: "doc", label: "Create Site", id: "sites/create-site" },
          { type: "doc", label: "Application", id: "sites/application" },
          { type: "doc", label: "SSL", id: "sites/ssl" },
          { type: "doc", label: "Queues", id: "sites/queues" },
          { type: "doc", label: "Settings", id: "sites/settings" },
        ],
      },
      { type: "doc", label: "Scripts", id: "scripts" },
      {
        type: "category",
        label: "Settings",
        items: [
          { type: "doc", label: "Profile", id: "settings/profile" },
          { type: "doc", label: "Projects", id: "settings/projects" },
          {
            type: "doc",
            label: "Server Providers",
            id: "settings/server-providers",
          },
          {
            type: "doc",
            label: "Source Controls",
            id: "settings/source-controls",
          },
          {
            type: "doc",
            label: "Notification Channels",
            id: "settings/notification-channels",
          },
          {
            type: "doc",
            label: "Storage Providers",
            id: "settings/storage-providers",
          },
          { type: "doc", label: "Tags", id: "settings/tags" },
        ],
      },
    ],
  }

  return sidebars[version]
}

export function getDocSlugs(version: Version): string[][] {
  const sidebar = getSidebar(version)
  const slugs: string[][] = []

  function traverse(items: SidebarItem[]) {
    for (const item of items) {
      if (item.type === "doc" && item.id) {
        slugs.push(item.id.split("/"))
      }
      if (item.items) {
        traverse(item.items)
      }
    }
  }

  traverse(sidebar)
  return slugs
}

export function getDoc(version: Version, slugParts: string[]): DocPage | null {
  const docId = slugParts.join("/")
  const versionDir = path.join(CONTENT_DIR, version)

  // Try .mdx first, then .md
  const extensions = [".mdx", ".md"]
  let filePath: string | null = null
  let rawContent: string | null = null

  for (const ext of extensions) {
    const candidate = path.join(versionDir, docId + ext)
    if (fs.existsSync(candidate)) {
      filePath = candidate
      rawContent = fs.readFileSync(candidate, "utf-8")
      break
    }
  }

  if (!filePath || !rawContent) return null

  const { data, content } = matter(rawContent)

  // Get the label from sidebar
  const sidebar = getSidebar(version)
  let label = data.title || data.sidebar_label || titleFromId(docId)

  function findLabel(items: SidebarItem[]): string | null {
    for (const item of items) {
      if (item.type === "doc" && item.id === docId) {
        return item.label || null
      }
      if (item.items) {
        const found = findLabel(item.items)
        if (found) return found
      }
    }
    return null
  }

  const sidebarLabel = findLabel(sidebar)
  if (!label && sidebarLabel) label = sidebarLabel

  return {
    meta: {
      title: data.title || label || titleFromId(docId),
      slug: docId,
      version,
      description: data.description,
      sidebar_label: data.sidebar_label,
    },
    content,
    slugParts,
  }
}

export function getAdjacentDocs(
  version: Version,
  slugParts: string[]
): {
  prev: { label: string; slug: string } | null
  next: { label: string; slug: string } | null
} {
  const currentId = slugParts.join("/")
  const allSlugs = getDocSlugs(version)
  const allIds = allSlugs.map((s) => s.join("/"))
  const currentIndex = allIds.indexOf(currentId)

  const sidebar = getSidebar(version)

  function findLabel(items: SidebarItem[], id: string): string {
    for (const item of items) {
      if (item.type === "doc" && item.id === id) {
        return item.label || titleFromId(id)
      }
      if (item.items) {
        const found = findLabel(item.items, id)
        if (found) return found
      }
    }
    return titleFromId(id)
  }

  return {
    prev:
      currentIndex > 0
        ? {
            label: findLabel(sidebar, allIds[currentIndex - 1]),
            slug: allIds[currentIndex - 1],
          }
        : null,
    next:
      currentIndex < allIds.length - 1
        ? {
            label: findLabel(sidebar, allIds[currentIndex + 1]),
            slug: allIds[currentIndex + 1],
          }
        : null,
  }
}
