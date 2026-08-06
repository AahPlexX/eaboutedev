import type { TopicSection } from "@/types/content";

export function TopicToc({ sections }: { sections: TopicSection[] }) {
  return (
    <nav aria-label="On this page" className="topic-toc">
      <p>On this page</p>
      <ol>{sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a></li>)}</ol>
    </nav>
  );
}
