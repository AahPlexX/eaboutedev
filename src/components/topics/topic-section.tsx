import { InlineContent } from "@/components/topics/inline-content";
import { ContentBlockView } from "@/components/topics/content-block";
import { TopicVisualPanel } from "@/components/topics/topic-visual";
import type { TopicSection } from "@/types/content";

export function TopicSectionView({ section, accent }: { section: TopicSection; accent: string }) {
  return (
    <section id={section.id} className="topic-section scroll-mt-28">
      <header className="topic-reading-column">
        <p className="eyebrow">Section</p>
        <h2>{section.title}</h2>
        <p><InlineContent value={section.summary} /></p>
      </header>
      {section.visual && <TopicVisualPanel visual={section.visual} accent={accent} />}
      <div className="content-stack">
        {section.blocks.map((block, index) => <ContentBlockView key={`${section.id}-${block.type}-${index}`} block={block} />)}
      </div>
    </section>
  );
}
