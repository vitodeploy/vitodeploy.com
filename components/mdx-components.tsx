import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  AlertTriangleIcon,
  InfoIcon,
  LightbulbIcon,
  AlertCircleIcon,
} from "lucide-react"

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "tip" | "warning" | "danger"
  children: React.ReactNode
}) {
  const styles = {
    info: {
      container: "border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10",
      icon: <InfoIcon className="size-5 text-blue-500" />,
      title: "Info",
    },
    tip: {
      container: "border-green-500/30 bg-green-500/5 dark:bg-green-500/10",
      icon: <LightbulbIcon className="size-5 text-green-500" />,
      title: "Tip",
    },
    warning: {
      container: "border-yellow-500/30 bg-yellow-500/5 dark:bg-yellow-500/10",
      icon: <AlertTriangleIcon className="size-5 text-yellow-500" />,
      title: "Warning",
    },
    danger: {
      container: "border-red-500/30 bg-red-500/5 dark:bg-red-500/10",
      icon: <AlertCircleIcon className="size-5 text-red-500" />,
      title: "Danger",
    },
  }

  const style = styles[type]

  return (
    <div className={cn("my-6 rounded-lg border p-4", style.container)}>
      <div className="flex items-center gap-2 font-medium">
        {style.icon}
        <span>{style.title}</span>
      </div>
      <div className="mt-2 text-sm text-muted-foreground [&>p]:mb-0">
        {children}
      </div>
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1
      className="mt-8 scroll-m-20 text-3xl font-bold tracking-tight"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mt-10 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="mt-6 scroll-m-20 text-lg font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="leading-7 [&:not(:first-child)]:mt-4" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http")
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 hover:text-primary/80"
          {...props}
        >
          {children}
        </a>
      )
    }
    return (
      <Link
        href={href || "#"}
        className="text-primary underline underline-offset-4 hover:text-primary/80"
        {...props}
      >
        {children}
      </Link>
    )
  },
  ul: ({ children, ...props }) => (
    <ul className="my-4 ml-6 list-disc [&>li]:mt-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-4 ml-6 list-decimal [&>li]:mt-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-6 border-l-2 pl-6 text-muted-foreground italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
  tr: ({ children, ...props }) => (
    <tr className="m-0 border-t p-0 even:bg-muted/50" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </td>
  ),
  code: ({ children, ...props }) => (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="my-4 overflow-x-auto rounded-lg border bg-muted/50 p-4"
      {...props}
    >
      {children}
    </pre>
  ),
  img: ({ src, alt, ...props }) => {
    if (!src) return null
    if (src.startsWith("http")) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || ""}
          className="my-4 rounded-lg border"
          {...props}
        />
      )
    }
    return (
      <Image
        src={src}
        alt={alt || ""}
        width={800}
        height={400}
        className="my-4 rounded-lg border"
        {...props}
      />
    )
  },
  hr: () => <hr className="my-8 border-border" />,
  // Admonitions / Callouts
  Callout,
}
