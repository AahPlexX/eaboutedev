import type { RichText } from "../types/content.ts";

export function flattenRichText(value: RichText): string {
  if (typeof value === "string") return value;
  return value.map((part) => typeof part === "string" ? part : flattenRichText(part.children)).join("");
}

export function isAllowedRichTextHref(href: string): boolean {
  if (!href || href !== href.trim()) return false;
  if (href.startsWith("https://")) return true;
  if (href.startsWith("//")) return false;
  return href.startsWith("/") || href.startsWith("#") || href.startsWith("./") || href.startsWith("../");
}
