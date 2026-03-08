import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { getAllPosts } from "@/lib/blog"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest news, tutorials, and updates from VitoDeploy.",
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted-foreground">
        Latest news, tutorials, and updates from VitoDeploy.
      </p>

      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-lg border p-6 transition-colors hover:border-foreground/20"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>&middot;</span>
                <span>{post.readingTime}</span>
              </div>

              <h2 className="mt-2 text-xl font-semibold group-hover:text-primary">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-4 flex items-center gap-3">
                {post.authors.map((author) => (
                  <div key={author.name} className="flex items-center gap-2">
                    <Image
                      src={author.image_url}
                      alt={author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                      unoptimized
                    />
                    <span className="text-sm text-muted-foreground">
                      {author.name}
                    </span>
                  </div>
                ))}
              </div>

              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
