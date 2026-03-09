"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { liteClient as algoliasearch } from "algoliasearch/lite"
import {
  InstantSearch,
  useSearchBox,
  useHits,
  useInstantSearch,
} from "react-instantsearch"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  SearchIcon,
  FileTextIcon,
  NewspaperIcon,
  ArrowRightIcon,
  CornerDownLeftIcon,
  LoaderIcon,
} from "lucide-react"

const searchClient = algoliasearch(
  "OSJRVBTWTB",
  "d37bbbcb5d06e88c415a34892ac3d937"
)
const indexName = "vitodeploy"

// Algolia DocSearch record format (populated by Algolia's crawler)
interface DocSearchRecord {
  objectID: string
  url: string
  url_without_anchor: string
  anchor: string
  content: string | null
  type: "lvl0" | "lvl1" | "lvl2" | "lvl3" | "lvl4" | "lvl5" | "lvl6" | "content"
  version?: string[]
  docusaurus_tag?: string
  hierarchy: {
    lvl0: string | null
    lvl1: string | null
    lvl2: string | null
    lvl3: string | null
    lvl4: string | null
    lvl5: string | null
    lvl6: string | null
  }
  _highlightResult?: {
    hierarchy?: {
      lvl0?: { value: string }
      lvl1?: { value: string }
      lvl2?: { value: string }
      lvl3?: { value: string }
      lvl4?: { value: string }
      lvl5?: { value: string }
      lvl6?: { value: string }
    }
    content?: { value: string }
  }
  _snippetResult?: {
    content?: { value: string }
  }
}

// Normalized hit for display
interface SearchHit {
  objectID: string
  title: string
  highlightedTitle: string
  url: string
  displayType: "doc" | "blog"
  version?: string
  category?: string
  snippet?: string
}

/**
 * Convert Algolia highlight markers to HTML <mark> tags.
 */
function formatHighlight(text: string): string {
  return text
    .replace(/__ais-highlight__/g, "<mark>")
    .replace(/__\/ais-highlight__/g, "</mark>")
}

/**
 * Convert a full Algolia DocSearch URL to a relative path.
 * Strips the domain and any trailing anchor for navigation.
 */
function toRelativeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.pathname + parsed.hash
  } catch {
    return url
  }
}

/**
 * Derive a readable title from the DocSearch hierarchy.
 * Uses the deepest non-null level as the title.
 */
function getTitle(hit: DocSearchRecord): string {
  const h = hit.hierarchy
  // Return the deepest heading level available
  return (
    h.lvl6 || h.lvl5 || h.lvl4 || h.lvl3 || h.lvl2 || h.lvl1 || h.lvl0 || ""
  )
}

/**
 * Derive a highlighted title from the DocSearch _highlightResult.
 */
function getHighlightedTitle(hit: DocSearchRecord): string {
  const h = hit._highlightResult?.hierarchy
  if (!h) return getTitle(hit)
  const raw =
    h.lvl6?.value ||
    h.lvl5?.value ||
    h.lvl4?.value ||
    h.lvl3?.value ||
    h.lvl2?.value ||
    h.lvl1?.value ||
    h.lvl0?.value ||
    getTitle(hit)
  return formatHighlight(raw)
}

/**
 * Determine the category (breadcrumb) from the hierarchy.
 * Shows parent levels above the title.
 */
function getCategory(hit: DocSearchRecord): string {
  const h = hit.hierarchy
  const parts: string[] = []
  if (h.lvl0) parts.push(h.lvl0)
  if (h.lvl1) parts.push(h.lvl1)
  // For content-type hits, the category is lvl0 > lvl1
  // For heading-type hits (lvl2+), just show the parents
  return parts.join(" > ")
}

/**
 * Derive the docs version from the URL path.
 * URLs like /docs/2.x/foo → "2.x", /docs/foo → default version (omitted).
 */
function getVersionFromUrl(url: string): string | undefined {
  const match = url.match(/^\/docs\/(\d+\.x)\//)
  if (match) return match[1]
  return undefined
}

/**
 * Convert raw DocSearch records into normalized SearchHit objects,
 * deduplicating by URL (keeping the most relevant hit per page).
 */
function normalizeHits(records: DocSearchRecord[]): SearchHit[] {
  const seen = new Map<string, SearchHit>()

  for (const record of records) {
    const url = toRelativeUrl(record.url)
    const pageUrl = toRelativeUrl(record.url_without_anchor)
    const isBlog = pageUrl.startsWith("/blog/")

    // Use the full URL (with anchor) as key so different sections appear as separate results
    const key = url

    // Prefer heading-level hits over content hits for the same URL
    const existing = seen.get(key)
    if (existing && record.type === "content") continue

    const rawSnippet =
      record._snippetResult?.content?.value ||
      record._highlightResult?.content?.value ||
      record.content ||
      ""
    const snippet = rawSnippet ? formatHighlight(rawSnippet) : ""

    seen.set(key, {
      objectID: record.objectID,
      title: getTitle(record),
      highlightedTitle: getHighlightedTitle(record),
      url,
      displayType: isBlog ? "blog" : "doc",
      version: getVersionFromUrl(pageUrl),
      category: getCategory(record),
      snippet: snippet || undefined,
    })
  }

  return Array.from(seen.values())
}

const quickLinks = [
  {
    label: "Getting Started",
    url: "/docs/getting-started/introduction",
    icon: FileTextIcon,
  },
  {
    label: "Installation",
    url: "/docs/getting-started/installation",
    icon: FileTextIcon,
  },
  {
    label: "Servers",
    url: "/docs/servers/create",
    icon: FileTextIcon,
  },
  {
    label: "Sites",
    url: "/docs/sites/create",
    icon: FileTextIcon,
  },
]

function SearchContent({ onSelect }: { onSelect: (url: string) => void }) {
  const { query, refine } = useSearchBox()
  const { items: rawItems } = useHits<DocSearchRecord>()
  const { status } = useInstantSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState(query)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [prevQuery, setPrevQuery] = useState(query)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Normalize DocSearch records into our display format
  const items = normalizeHits(rawItems as unknown as DocSearchRecord[])
  const [prevItemsLength, setPrevItemsLength] = useState(items.length)

  const isLoading = status === "loading" || status === "stalled"
  const hasResults = query && items.length > 0

  // Group search results by type
  const docs = items.filter((h) => h.displayType === "doc")
  const blogs = items.filter((h) => h.displayType === "blog")

  // Ordered items matching display order (docs first, then blogs)
  const orderedItems = query ? [...docs, ...blogs] : quickLinks
  const maxIndex = orderedItems.length - 1

  // Reset active index when results change
  if (prevQuery !== query || prevItemsLength !== items.length) {
    setPrevQuery(query)
    setPrevItemsLength(items.length)
    setActiveIndex(-1)
  }

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Scroll active item into view
  useEffect(() => {
    const container = resultsRef.current
    if (!container || activeIndex < 0) return
    const activeEl = container.querySelector(`[data-index="${activeIndex}"]`)
    activeEl?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  function handleChange(value: string) {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => refine(value), 300)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (orderedItems.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, maxIndex))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      onSelect(orderedItems[activeIndex].url)
    }
  }

  return (
    <div onKeyDown={handleKeyDown}>
      {/* Search input */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search docs and blog..."
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
          ESC
        </kbd>
      </div>

      {/* Results area */}
      {!query ? (
        <div ref={resultsRef} className="px-4 py-8">
          <div className="mb-6 flex flex-col items-center text-muted-foreground">
            <SearchIcon className="mb-2 size-6 opacity-20" />
            <p className="text-sm">Search docs and blog posts</p>
          </div>
          <div className="space-y-1.5">
            <p className="px-2 text-xs font-medium text-muted-foreground">
              Quick links
            </p>
            {quickLinks.map((link, idx) => (
              <button
                key={link.url}
                data-index={idx}
                onClick={() => onSelect(link.url)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  idx === activeIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <link.icon className="size-4 shrink-0 text-muted-foreground" />
                {link.label}
                {idx === activeIndex && (
                  <CornerDownLeftIcon className="ml-auto size-3 shrink-0 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
          <SearchIcon className="mb-3 size-6 opacity-20" />
          <p className="text-sm font-medium">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-xs">
            Try different keywords or check spelling
          </p>
        </div>
      ) : (
        <SearchResultsList
          docs={docs}
          blogs={blogs}
          activeIndex={activeIndex}
          resultsRef={resultsRef}
          onSelect={onSelect}
          onHover={setActiveIndex}
        />
      )}

      {/* Footer */}
      {(hasResults || !query) && (
        <div className="flex items-center justify-end gap-3 border-t px-3 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <CornerDownLeftIcon className="size-3" /> to select
          </span>
          <span className="flex items-center gap-1">
            <ArrowRightIcon className="size-3 rotate-[-90deg]" />
            <ArrowRightIcon className="size-3 rotate-90" /> to navigate
          </span>
        </div>
      )}
    </div>
  )
}

function SearchResultsList({
  docs,
  blogs,
  activeIndex,
  resultsRef,
  onSelect,
  onHover,
}: {
  docs: SearchHit[]
  blogs: SearchHit[]
  activeIndex: number
  resultsRef: React.RefObject<HTMLDivElement | null>
  onSelect: (url: string) => void
  onHover: (index: number) => void
}) {
  let globalIndex = 0

  return (
    <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto p-2">
      {docs.length > 0 && (
        <div>
          <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Documentation
          </div>
          {docs.map((hit) => {
            const idx = globalIndex++
            return (
              <HitItem
                key={hit.objectID}
                hit={hit}
                isActive={idx === activeIndex}
                index={idx}
                onSelect={onSelect}
                onHover={onHover}
              />
            )
          })}
        </div>
      )}
      {blogs.length > 0 && (
        <div>
          <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Blog
          </div>
          {blogs.map((hit) => {
            const idx = globalIndex++
            return (
              <HitItem
                key={hit.objectID}
                hit={hit}
                isActive={idx === activeIndex}
                index={idx}
                onSelect={onSelect}
                onHover={onHover}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function HitItem({
  hit,
  isActive,
  index,
  onSelect,
  onHover,
}: {
  hit: SearchHit
  isActive: boolean
  index: number
  onSelect: (url: string) => void
  onHover: (index: number) => void
}) {
  return (
    <button
      data-index={index}
      onClick={() => onSelect(hit.url)}
      onMouseEnter={() => onHover(index)}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "text-foreground"
      )}
    >
      <div className="mt-0.5 shrink-0">
        {hit.displayType === "doc" ? (
          <FileTextIcon className="size-4 text-muted-foreground" />
        ) : (
          <NewspaperIcon className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="truncate text-sm font-medium"
          dangerouslySetInnerHTML={{
            __html: hit.highlightedTitle,
          }}
        />
        {hit.snippet && (
          <div
            className="mt-0.5 line-clamp-1 text-xs text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: hit.snippet }}
          />
        )}
        <div className="mt-1 flex items-center gap-2">
          {hit.version && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              v{hit.version}
            </span>
          )}
          {hit.category && (
            <span className="text-[10px] text-muted-foreground">
              {hit.category}
            </span>
          )}
        </div>
      </div>
      {isActive && (
        <CornerDownLeftIcon className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
      )}
    </button>
  )
}

export function SearchTrigger({ mobile }: { mobile?: boolean } = {}) {
  const { setOpen } = useSearchDialog()

  if (mobile) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
        aria-label="Search"
      >
        <SearchIcon className="size-4" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="flex h-9 w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <SearchIcon className="size-4 shrink-0" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="shrink-0 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium">
        {typeof navigator !== "undefined" && navigator.platform?.includes("Mac")
          ? "\u2318K"
          : "Ctrl+K"}
      </kbd>
    </button>
  )
}

const SearchDialogContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

function useSearchDialog() {
  const ctx = React.useContext(SearchDialogContext)
  if (!ctx) throw new Error("useSearchDialog must be used within SearchDialog")
  return ctx
}

export function SearchDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = useCallback(
    (url: string) => {
      setOpen(false)
      router.push(url)
    },
    [router]
  )

  return (
    <SearchDialogContext.Provider value={{ open, setOpen }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="gap-0 overflow-hidden p-0 sm:max-w-lg"
        >
          <DialogTitle className="sr-only">Search</DialogTitle>
          <InstantSearch searchClient={searchClient} indexName={indexName}>
            <SearchContent onSelect={handleSelect} />
          </InstantSearch>
        </DialogContent>
      </Dialog>
    </SearchDialogContext.Provider>
  )
}
