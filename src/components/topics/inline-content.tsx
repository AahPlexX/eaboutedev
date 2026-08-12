import { Fragment, type ReactNode } from "react";
import { isAllowedRichTextHref } from "@/lib/rich-text";
import type { InlineContent as InlineContentPart, InlineSemanticNode, RichText } from "@/types/content";

function renderNode(node: InlineSemanticNode, key: string): ReactNode {
  const children = <InlineContent value={node.children} />;

  switch (node.type) {
    case "dfn":
      return <dfn key={key} data-term={node.term}>{children}</dfn>;
    case "abbr":
      return <abbr key={key} title={node.title}>{children}</abbr>;
    case "code":
      return <code key={key}>{children}</code>;
    case "strong":
      return <strong key={key}>{children}</strong>;
    case "em":
      return <em key={key}>{children}</em>;
    case "a":
      return isAllowedRichTextHref(node.href) ? <a key={key} href={node.href}>{children}</a> : <Fragment key={key}>{children}</Fragment>;
    case "kbd":
      return <kbd key={key}>{children}</kbd>;
    case "samp":
      return <samp key={key}>{children}</samp>;
    case "var":
      return <var key={key}>{children}</var>;
  }
}

function renderPart(part: InlineContentPart, index: number): ReactNode {
  if (typeof part === "string") return <Fragment key={`text-${index}`}>{part}</Fragment>;
  return renderNode(part, `${part.type}-${index}`);
}

export function InlineContent({ value }: { value: RichText }) {
  if (typeof value === "string") return <>{value}</>;
  return <>{value.map(renderPart)}</>;
}
