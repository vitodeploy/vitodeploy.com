import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import { type ReactNode } from "react"
import { mdxComponents } from "@/components/mdx-components"

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

export async function renderMDX(source: string): Promise<ReactNode> {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
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
                dark: "github-dark",
                light: "github-light",
              },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  })

  return content
}
