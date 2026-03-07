import { visit } from "unist-util-visit"
import type { Root } from "mdast"
import type { Node } from "unist"

const CALLOUT_TYPES = new Set(["info", "tip", "warning", "danger"])

interface DirectiveNode extends Node {
  type: "containerDirective"
  name: string
  data?: Record<string, unknown>
}

/**
 * Remark plugin that transforms container directives like:
 *
 *   :::warning
 *   Some content here
 *   :::
 *
 * into <Callout type="warning">...</Callout> JSX elements.
 *
 * Requires `remark-directive` to run before this plugin.
 */
export function remarkCallout() {
  return (tree: Root) => {
    visit(tree, "containerDirective", (_node: Node) => {
      const node = _node as DirectiveNode
      if (!CALLOUT_TYPES.has(node.name)) return

      const data = (node.data ||= {})
      data.hName = "Callout"
      data.hProperties = { type: node.name }
    })
  }
}
