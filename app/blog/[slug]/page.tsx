import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { getPost, getAllPosts } from "@/lib/blog"
import { renderMDX } from "@/lib/mdx"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    notFound()
  }

  const content = await renderMDX(post.content)

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeftIcon className="mr-2 size-4" />
          Back to Blog
        </Link>
      </Button>

      <header>
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

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          {post.authors.map((author) => (
            <a
              key={author.name}
              href={author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Image
                src={author.image_url}
                alt={author.name}
                width={32}
                height={32}
                className="rounded-full"
                unoptimized
              />
              <div>
                <div className="text-sm font-medium">{author.name}</div>
                <div className="text-xs text-muted-foreground">
                  {author.title}
                </div>
              </div>
            </a>
          ))}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <div className="prose-headings:scroll-mt-20 mt-10">{content}</div>
    </article>
  )
}
