"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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

interface SearchHit {
  objectID: string
  title: string
  url: string
  type: "doc" | "blog"
  version?: string
  category?: string
  tags?: string[]
  date?: string
  excerpt?: string
  _highlightResult?: {
    title?: { value: string }
    content?: { value: string }
  }
  _snippetResult?: {
    content?: { value: string }
  }
}

function SearchInput() {
  const { query, refine } = useSearchBox()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState(query)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleChange(value: string) {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => refine(value), 300)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
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
  )
}

function SearchResults({ onSelect }: { onSelect: (url: string) => void }) {
  const { items } = useHits<SearchHit>()
  const { status } = useInstantSearch()
  const { query } = useSearchBox()
  const [activeIndex, setActiveIndex] = useState(0)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0)
  }, [items.length, query])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, items.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter" && items[activeIndex]) {
        e.preventDefault()
        onSelect(items[activeIndex].url)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [items, activeIndex, onSelect])

  // Scroll active item into view
  useEffect(() => {
    const container = resultsRef.current
    if (!container) return
    const activeEl = container.querySelector(`[data-index="${activeIndex}"]`)
    activeEl?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  if (!query) {
    return (
      <div className="px-4 py-8">
        <div className="mb-6 flex flex-col items-center text-muted-foreground">
          <SearchIcon className="mb-2 size-6 opacity-20" />
          <p className="text-sm">Search docs and blog posts</p>
        </div>
        <div className="space-y-1.5">
          <p className="px-2 text-xs font-medium text-muted-foreground">
            Quick links
          </p>
          {[
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
          ].map((link) => (
            <button
              key={link.url}
              onClick={() => onSelect(link.url)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <link.icon className="size-4 shrink-0 text-muted-foreground" />
              {link.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (status === "loading" || status === "stalled") {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <LoaderIcon className="size-4 animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
        <SearchIcon className="mb-3 size-6 opacity-20" />
        <p className="text-sm font-medium">
          No results for &ldquo;{query}&rdquo;
        </p>
        <p className="mt-1 text-xs">Try different keywords or check spelling</p>
      </div>
    )
  }

  // Group results by type
  const docs = items.filter((h) => h.type === "doc")
  const blogs = items.filter((h) => h.type === "blog")

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
                onHover={setActiveIndex}
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
                onHover={setActiveIndex}
              />
            )
          })}
        </div>
      )}

    </div>
  )
}

function SearchFooter() {
  const { items } = useHits<SearchHit>()
  const { query } = useSearchBox()

  if (!query || items.length === 0) return null

  return (
    <div className="flex items-center justify-end gap-3 border-t px-3 py-2 text-[10px] text-muted-foreground">
      <span className="flex items-center gap-1">
        <CornerDownLeftIcon className="size-3" /> to select
      </span>
      <span className="flex items-center gap-1">
        <ArrowRightIcon className="size-3 rotate-[-90deg]" />
        <ArrowRightIcon className="size-3 rotate-90" /> to navigate
      </span>
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
  const snippet = hit._snippetResult?.content?.value || hit.excerpt || ""

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
        {hit.type === "doc" ? (
          <FileTextIcon className="size-4 text-muted-foreground" />
        ) : (
          <NewspaperIcon className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="truncate text-sm font-medium"
          dangerouslySetInnerHTML={{
            __html: hit._highlightResult?.title?.value || hit.title,
          }}
        />
        {snippet && (
          <div
            className="mt-0.5 line-clamp-1 text-xs text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: snippet }}
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
          {hit.date && (
            <span className="text-[10px] text-muted-foreground">
              {hit.date}
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

export function SearchDialog({ mobile }: { mobile?: boolean } = {}) {
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
    <>
      {mobile ? (
        <button
          onClick={() => setOpen(true)}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
          aria-label="Search"
        >
          <SearchIcon className="size-4" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex h-9 w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <SearchIcon className="size-4 shrink-0" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="shrink-0 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium">
            {typeof navigator !== "undefined" &&
            navigator.platform?.includes("Mac")
              ? "\u2318K"
              : "Ctrl+K"}
          </kbd>
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="gap-0 overflow-hidden p-0 sm:max-w-lg"
        >
          <DialogTitle className="sr-only">Search</DialogTitle>
          <InstantSearch searchClient={searchClient} indexName={indexName}>
            <SearchInput />
            <SearchResults onSelect={handleSelect} />
            <SearchFooter />
          </InstantSearch>
        </DialogContent>
      </Dialog>
    </>
  )
}
