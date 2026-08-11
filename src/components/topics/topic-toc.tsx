import type { TopicSection } from "@/types/content";

function TopicLinks({ sections }: { sections: TopicSection[] }) {
  return (
    <ol>
      {sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TopicToc({ sections }: { sections: TopicSection[] }) {
  return (
    <>
      <nav aria-label="On this page" className="topic-toc topic-toc-desktop">
        <p>On this page</p>
        <TopicLinks sections={sections} />
      </nav>

      <details className="topic-toc-mobile">
        <summary>On this page <span>{sections.length} sections</span></summary>
        <nav aria-label="On this page, mobile">
          <TopicLinks sections={sections} />
        </nav>
      </details>
    </>
  );
}
