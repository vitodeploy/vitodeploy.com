import { notFound } from "next/navigation"
import { getSidebar, type Version } from "@/lib/docs"
import { parseDocSlug } from "@/lib/docs-config"
import { DocsSidebar } from "@/components/docs-sidebar"
import { DocsMobileSidebar } from "@/components/docs-mobile-sidebar"

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const { version, docSlug } = parseDocSlug(slug)

  if (docSlug.length === 0) {
    notFound()
  }

  const sidebar = getSidebar(version)

  return (
    <div className="container mx-auto flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 self-start border-r lg:block">
        <DocsSidebar items={sidebar} version={version} />
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile sidebar trigger */}
        <div className="sticky top-14 z-40 border-b bg-background px-4 py-2 lg:hidden">
          <DocsMobileSidebar items={sidebar} version={version} />
        </div>

        {children}
      </div>
    </div>
  )
}
