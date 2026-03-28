import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkDirective from "remark-directive"
import { remarkCallout } from "./remark-callout"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode, { type Options } from "rehype-pretty-code"
import {
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers"
import { type ReactNode } from "react"
import { mdxComponents } from "@/components/mdx-components"
import { visit } from "unist-util-visit"
import type { Root, Element } from "hast"
import { type Version } from "./docs-config"
import { docUrl } from "./docs-config"
import path from "path"

export interface TocEntry {
  depth: number
  text: string
  id: string
}

/**
 * Extract headings (h2, h3) from raw MDX/markdown source.
 */
export function extractHeadings(source: string): TocEntry[] {
  const headings: TocEntry[] = []
  const lines = source.split("\n")

  for (const line of lines) {
    // Match markdown headings: ## or ### (skip h1 since it's the page title)
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const depth = match[1].length
      const rawText = match[2]
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip markdown links
        .replace(/`([^`]+)`/g, "$1") // strip inline code
        .replace(/\*\*([^*]+)\*\*/g, "$1") // strip bold
        .replace(/\*([^*]+)\*/g, "$1") // strip italic
        .trim()

      const id = rawText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      headings.push({ depth, text: rawText, id })
    }
  }

  return headings
}

/**
 * Rehype plugin that rewrites relative `.md` links to proper doc URLs.
 * e.g. `./services.md#install` → `/docs/servers/services#install`
 */
function rehypeDocLinks(options: { version: Version; docSlug: string[] }) {
  const { version, docSlug } = options
  // Directory of the current doc, e.g. ["servers", "database"] → "servers"
  const currentDir = docSlug.slice(0, -1).join("/")

  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return
      const href = node.properties?.href
      if (typeof href !== "string") return
      if (!href.endsWith(".md") && !href.includes(".md#")) return
      if (href.startsWith("http")) return

      // Split off anchor
      const [filePart, anchor] = href.split("#", 2)

      // Strip .md extension
      const withoutExt = filePart.replace(/\.md$/, "")

      // Resolve relative path against current doc directory
      const resolved = path
        .normalize(path.join(currentDir, withoutExt))
        .replace(/\\/g, "/")

      // Build proper doc URL
      const url = docUrl(version, resolved) + (anchor ? `#${anchor}` : "")
      node.properties!.href = url
    })
  }
}

export async function renderMDX(
  source: string,
  docContext?: { version: Version; docSlug: string[] },
): Promise<ReactNode> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rehypePlugins: any[] = [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "wrap",
        properties: {
          className: ["anchor"],
        },
      },
    ],
    [
      rehypePrettyCode as never,
      {
        theme: {
          dark: "vesper",
          light: "github-light-default",
        },
        keepBackground: false,
        transformers: [
          transformerNotationHighlight(),
          transformerNotationWordHighlight(),
        ],
        onVisitLine(node: { properties: { className?: string[] } }) {
          // Prevent lines from collapsing
          if (node.properties.className === undefined) {
            node.properties.className = []
          }
        },
      } satisfies Options,
    ],
  ]

  if (docContext) {
    rehypePlugins.unshift([rehypeDocLinks, docContext] as never)
  }

  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkDirective, remarkCallout],
        rehypePlugins,
      },
    },
  })

  return content
}
