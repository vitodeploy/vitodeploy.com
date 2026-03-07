export const VERSIONS = ["3.x", "2.x", "1.x"] as const
export const DEFAULT_VERSION = "3.x"

export type Version = (typeof VERSIONS)[number]

export interface SidebarItem {
  type: "category" | "doc"
  label: string
  id?: string
  items?: SidebarItem[]
}

/**
 * Build a URL path for a doc page.
 * Default version omits the version prefix: /docs/getting-started/intro
 * Other versions include it: /docs/2.x/getting-started/intro
 */
export function docUrl(version: Version, slug: string): string {
  if (version === DEFAULT_VERSION) {
    return `/docs/${slug}`
  }
  return `/docs/${version}/${slug}`
}

/**
 * Parse a docs URL slug array into { version, docSlug }.
 * If the first segment is a known non-default version (e.g. "2.x"),
 * it's used as the version and the rest is the doc slug.
 * Otherwise, the entire slug array is treated as a default-version doc path.
 */
export function parseDocSlug(slugParts: string[]): {
  version: Version
  docSlug: string[]
} {
  const first = slugParts[0]
  if (
    first &&
    VERSIONS.includes(first as Version) &&
    first !== DEFAULT_VERSION
  ) {
    return { version: first as Version, docSlug: slugParts.slice(1) }
  }
  // Could also be an explicit default version in the URL (e.g. /docs/3.x/...)
  if (first === DEFAULT_VERSION) {
    return { version: DEFAULT_VERSION, docSlug: slugParts.slice(1) }
  }
  return { version: DEFAULT_VERSION, docSlug: slugParts }
}
