"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { type SidebarItem, type Version, docUrl } from "@/lib/docs-config"
import { ChevronRightIcon } from "lucide-react"
import { useCallback, useRef, useState } from "react"

function SidebarCategory({
  item,
  version,
  pathname,
}: {
  item: SidebarItem
  version: Version
  pathname: string
}) {
  const hasActiveChild = item.items?.some((child) => {
    const href = child.id ? docUrl(version, child.id) : ""
    return pathname === href
  })

  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:text-foreground/80"
      >
        <ChevronRightIcon
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            open && "rotate-90"
          )}
        />
        {item.label}
      </button>
      {open && item.items && (
        <div className="ml-3 space-y-0.5 border-l pl-2">
          {item.items.map((child) => (
            <SidebarItemComponent
              key={child.id || child.label}
              item={child}
              version={version}
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarDocLink({
  item,
  version,
  pathname,
}: {
  item: SidebarItem
  version: Version
  pathname: string
}) {
  const href = item.id ? docUrl(version, item.id) : "#"
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "block rounded-md px-2 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {item.label}
    </Link>
  )
}

function SidebarItemComponent({
  item,
  version,
  pathname,
}: {
  item: SidebarItem
  version: Version
  pathname: string
}) {
  if (item.type === "category") {
    return <SidebarCategory item={item} version={version} pathname={pathname} />
  }
  return <SidebarDocLink item={item} version={version} pathname={pathname} />
}

export function DocsSidebar({
  items,
  version,
}: {
  items: SidebarItem[]
  version: Version
}) {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleLinkClick = useCallback(() => {
    if (scrollRef.current) {
      sessionStorage.setItem(
        "docs-sidebar-scroll",
        String(scrollRef.current.scrollTop)
      )
    }
  }, [])

  const restoreScroll = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      scrollRef.current = node
      const saved = sessionStorage.getItem("docs-sidebar-scroll")
      if (saved) {
        node.scrollTop = Number(saved)
      }
    }
  }, [])

  return (
    <div
      ref={restoreScroll}
      className="h-[calc(100vh-3.5rem)] overflow-y-auto py-4 pr-4"
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div className="space-y-2" onClick={handleLinkClick}>
        {items
          .filter((item) => item.type === "category")
          .map((item) => (
            <SidebarItemComponent
              key={item.id || item.label}
              item={item}
              version={version}
              pathname={pathname}
            />
          ))}
        {items.some((item) => item.type === "doc") && (
          <SidebarCategory
            item={{
              type: "category",
              label: "Other",
              items: items.filter((item) => item.type === "doc"),
            }}
            version={version}
            pathname={pathname}
          />
        )}
      </div>
    </div>
  )
}
