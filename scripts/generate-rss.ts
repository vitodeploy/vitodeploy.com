import fs from "fs"
import path from "path"
import matter from "gray-matter"

const BLOG_DIR = path.join(process.cwd(), "content/blog")
const OUT_DIR = path.join(process.cwd(), "out")
const SITE_URL = "https://vitodeploy.com"

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
}

function extractExcerpt(content: string): string {
  const cleaned = content.replace(/^import\s+.*$/gm, "").trim()
  const withoutTruncate = cleaned
    .replace(/\{\/\*\s*truncate\s*\*\/\}/g, "")
    .replace(/<!--\s*truncate\s*-->/g, "")
    .trim()
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

function getAllPosts(): Post[] {
  const entries = fs.readdirSync(BLOG_DIR)
  const posts: Post[] = []

  for (const entry of entries) {
    if (entry === "authors.yml") continue

    const entryPath = path.join(BLOG_DIR, entry)
    const stat = fs.statSync(entryPath)

    let rawContent: string
    let slug: string
    let dateStr: string

    if (stat.isDirectory()) {
      const indexFile = ["index.mdx", "index.md"].find((f) =>
        fs.existsSync(path.join(entryPath, f))
      )
      if (!indexFile) continue
      rawContent = fs.readFileSync(path.join(entryPath, indexFile), "utf-8")
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

    posts.push({
      slug: data.slug || slug,
      title: data.title || slug,
      date: dateStr,
      excerpt: extractExcerpt(content),
    })
  }

  posts.sort((a, b) => b.date.localeCompare(a.date))
  return posts
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function generateRss(posts: Post[]): string {
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VitoDeploy Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Latest news and updates from VitoDeploy</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}

function generateAtom(posts: Post[]): string {
  const entries = posts
    .map(
      (post) => `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${SITE_URL}/blog/${post.slug}"/>
    <id>${SITE_URL}/blog/${post.slug}</id>
    <updated>${post.date}T00:00:00Z</updated>
    <summary>${escapeXml(post.excerpt)}</summary>
  </entry>`
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>VitoDeploy Blog</title>
  <link href="${SITE_URL}/blog"/>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <id>${SITE_URL}/blog</id>
  <updated>${new Date().toISOString()}</updated>
${entries}
</feed>`
}

// Generate feeds
const posts = getAllPosts()

if (!fs.existsSync(OUT_DIR)) {
  console.log("Warning: out/ directory does not exist. Run next build first.")
  process.exit(1)
}

fs.writeFileSync(path.join(OUT_DIR, "rss.xml"), generateRss(posts))
fs.writeFileSync(path.join(OUT_DIR, "atom.xml"), generateAtom(posts))

console.log(`Generated RSS feed (${posts.length} posts) → out/rss.xml`)
console.log(`Generated Atom feed (${posts.length} posts) → out/atom.xml`)
