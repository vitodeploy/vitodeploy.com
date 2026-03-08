"use client"

import { useState } from "react"

export function GenerateAppKey() {
  const [key, setKey] = useState<string | null>(null)

  function generate() {
    const randomBytes = new Uint8Array(32)
    crypto.getRandomValues(randomBytes)
    const base64String = `base64:${btoa(String.fromCharCode(...randomBytes))}`
    setKey(base64String)
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <button
        onClick={generate}
        className="inline-flex h-8 w-fit cursor-pointer items-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition duration-200 hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
      >
        Generate a random APP_KEY
      </button>
      {key && (
        <code className="break-all rounded-md border border-border/60 bg-muted/70 px-2 py-1 font-mono text-xs text-foreground select-all">
          {key}
        </code>
      )}
    </div>
  )
}
