import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import {
  getDoc,
  getDocSlugs,
  getAdjacentDocs,
  VERSIONS,
  type Version,
} from "@/lib/docs"
import { DEFAULT_VERSION, parseDocSlug, docUrl } from "@/lib/docs-config"
import { renderMDX, extractHeadings } from "@/lib/mdx"
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableOfContents } from "@/components/table-of-contents"

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const params: { slug: string[] }[] = []

  for (const version of VERSIONS) {
    const slugs = getDocSlugs(version)
    for (const docSlug of slugs) {
      if (version === DEFAULT_VERSION) {
        // Default version: /docs/getting-started/introduction
        params.push({ slug: docSlug })
      } else {
        // Other versions: /docs/2.x/getting-started/introduction
        params.push({ slug: [version, ...docSlug] })
      }
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { version, docSlug } = parseDocSlug(slug)

  const doc = getDoc(version, docSlug)
  if (!doc) return {}

  return {
    title: doc.meta.title,
    description: doc.meta.description,
  }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params
  const { version, docSlug } = parseDocSlug(slug)

  if (docSlug.length === 0) {
    notFound()
  }

  const doc = getDoc(version, docSlug)
  if (!doc) {
    notFound()
  }

  const { prev, next } = getAdjacentDocs(version, docSlug)
  const content = await renderMDX(doc.content)
  const headings = extractHeadings(doc.content)

  const editUrl = `https://github.com/vitodeploy/vitodeploy.com/edit/main/content/docs/${version}/${docSlug.join("/")}.mdx`

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1 px-4 py-8 md:px-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {doc.meta.title}
          </h1>
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <PencilIcon className="size-3.5" />
            <span className="hidden sm:inline">Edit this page</span>
          </a>
        </div>

        <div className="prose-headings:scroll-mt-20 mt-8">{content}</div>

        {/* Prev / Next navigation */}
        <div className="mt-12 flex items-center justify-between border-t pt-6">
          {prev ? (
            <Button variant="ghost" asChild>
              <Link href={docUrl(version, prev.slug)}>
                <ChevronLeftIcon className="mr-2 size-4" />
                {prev.label}
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {next ? (
            <Button variant="ghost" asChild>
              <Link href={docUrl(version, next.slug)}>
                {next.label}
                <ChevronRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </article>

      {/* Table of Contents - right sidebar */}
      {headings.length > 0 && (
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pr-4 xl:block">
          <TableOfContents headings={headings} />
        </aside>
      )}
    </div>
  )
}
