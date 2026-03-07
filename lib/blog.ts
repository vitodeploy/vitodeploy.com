import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"

const BLOG_DIR = path.join(process.cwd(), "content/blog")

export interface BlogAuthor {
  name: string
  title: string
  url: string
  image_url: string
  socials: {
    x?: string
    github?: string
  }
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  authors: BlogAuthor[]
  tags: string[]
  excerpt: string
  content: string
  readingTime: string
}

const AUTHORS: Record<string, BlogAuthor> = {
  saeedvaziry: {
    name: "Saeed Vaziry",
    title: "Software Engineer",
    url: "https://github.com/saeedvaziry",
    image_url: "https://github.com/saeedvaziry.png",
    socials: {
      x: "saeed_vz",
      github: "saeedvaziry",
    },
  },
}

function extractExcerpt(content: string): string {
  // Remove import statements
  const cleaned = content.replace(/^import\s+.*$/gm, "").trim()

  // Remove truncate markers
  const withoutTruncate = cleaned
    .replace(/\{\/\*\s*truncate\s*\*\/\}/g, "")
    .replace(/<!--\s*truncate\s*-->/g, "")
    .trim()

  // Get first paragraph of text
  const lines = withoutTruncate
    .split("\n")
    .filter(
      (l) =>
        l.trim() &&
        !l.startsWith("#") &&
        !l.startsWith("<") &&
        !l.startsWith("import")
    )
  return lines[0] || ""
}

export function getAllPosts(): BlogPost[] {
  const entries = fs.readdirSync(BLOG_DIR)
  const posts: BlogPost[] = []

  for (const entry of entries) {
    if (entry === "authors.yml") continue

    const entryPath = path.join(BLOG_DIR, entry)
    const stat = fs.statSync(entryPath)

    let rawContent: string
    let slug: string
    let dateStr: string

    if (stat.isDirectory()) {
      // Look for index.mdx or index.md
      const indexFile = ["index.mdx", "index.md"].find((f) =>
        fs.existsSync(path.join(entryPath, f))
      )
      if (!indexFile) continue
      rawContent = fs.readFileSync(path.join(entryPath, indexFile), "utf-8")
      // Extract date and slug from folder name: 2025-03-30-create-a-server
      const match = entry.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/)
      if (!match) continue
      dateStr = match[1]
      slug = match[2]
    } else if (entry.endsWith(".mdx") || entry.endsWith(".md")) {
      rawContent = fs.readFileSync(entryPath, "utf-8")
      const match = entry.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(mdx?|md)$/)
      if (!match) continue
      dateStr = match[1]
      slug = match[2]
    } else {
      continue
    }

    const { data, content } = matter(rawContent)

    const authorIds: string[] = data.authors || []
    const blogAuthors = authorIds
      .map((id: string) => AUTHORS[id])
      .filter(Boolean)

    posts.push({
      slug: data.slug || slug,
      title: data.title || slug,
      date: dateStr,
      authors: blogAuthors,
      tags: data.tags || [],
      excerpt: extractExcerpt(content),
      content,
      readingTime: readingTime(content).text,
    })
  }

  // Sort by date descending
  posts.sort((a, b) => b.date.localeCompare(a.date))
  return posts
}

export function getPost(slug: string): BlogPost | null {
  const posts = getAllPosts()
  return posts.find((p) => p.slug === slug) || null
}
