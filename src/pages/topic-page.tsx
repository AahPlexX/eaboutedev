import { useEffect, useState } from "react";
import { ArrowLeft, Clock3, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { TopicNarration } from "@/components/topics/topic-narration";
import { TopicSectionView } from "@/components/topics/topic-section";
import { TopicToc } from "@/components/topics/topic-toc";
import { TopicVisualPanel } from "@/components/topics/topic-visual";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { loadCatalog } from "@/lib/catalog-loader";
import { getTopicDocumentTitle, SITE_TITLE } from "@/lib/document-title";
import { loadTopic } from "@/lib/topic-loader";
import type { TopicCatalogEntry, TopicDocument } from "@/types/content";
import { NotFoundPage } from "@/pages/not-found-page";

export function TopicPage() {
  const { slug = "" } = useParams();
  const [topic, setTopic] = useState<TopicDocument>();
  const [relatedTopics, setRelatedTopics] = useState<TopicCatalogEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    globalThis.document.title = SITE_TITLE;
    loadTopic(slug)
      .then((loadedTopic) => {
        if (!active) return;
        if (!loadedTopic) { setStatus("missing"); return; }
        setTopic(loadedTopic);
        setStatus("ready");
        globalThis.document.title = getTopicDocumentTitle(loadedTopic.title);
      })
      .catch(() => active && setStatus("error"));
    return () => { active = false; globalThis.document.title = SITE_TITLE; };
  }, [slug]);

  useEffect(() => {
    let active = true;
    setRelatedTopics([]);
    if (status !== "ready" || !topic || topic.related.length === 0) return () => { active = false; };
    loadCatalog()
      .then((catalog) => {
        if (!active) return;
        setRelatedTopics(topic.related.map((relatedSlug) => catalog.find((entry) => entry.slug === relatedSlug)).filter((entry): entry is TopicCatalogEntry => Boolean(entry)));
      })
      .catch(() => active && setRelatedTopics([]));
    return () => { active = false; };
  }, [status, topic]);

  if (status === "missing") return <NotFoundPage />;
  if (status === "error") return <ErrorState />;
  if (status !== "ready" || !topic) return <TopicSkeleton />;

  return (
    <article className="topic-page" style={{ "--topic-accent": topic.accent } as React.CSSProperties}>
      <header className="topic-orientation" aria-label="Topic overview">
        <div className="shell">
          <Link to="/topics" className="topic-back-link"><ArrowLeft aria-hidden="true" /> All topics</Link>
          <div className="topic-orientation-grid">
            <div className="topic-orientation-copy">
              <div className="topic-meta" aria-label="Topic metadata">
                <Badge>{topic.category}</Badge>
                <Badge variant="outline">{topic.level}</Badge>
                <Badge variant="outline"><Clock3 className="me-1 size-3" aria-hidden="true" /> {topic.estimatedMinutes} min</Badge>
              </div>
              <p className="topic-kicker">{topic.eyebrow}</p>
              <h1>{topic.title}</h1>
              <p className="topic-summary">{topic.summary}</p>

              <div className="topic-learning-map">
                <section aria-labelledby="topic-outcomes-title">
                  <h2 id="topic-outcomes-title">By the end, you will be able to</h2>
                  <ul>{topic.learningOutcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
                </section>
                <section aria-labelledby="topic-prerequisites-title">
                  <h2 id="topic-prerequisites-title">Helpful before this guide</h2>
                  <ul>{topic.prerequisites.map((prerequisite) => <li key={prerequisite}>{prerequisite}</li>)}</ul>
                </section>
              </div>
            </div>
            <div className="topic-orientation-visual"><TopicVisualPanel visual={topic.heroVisual} accent={topic.accent} /></div>
          </div>
        </div>
      </header>

      <div className="shell topic-workspace">
        <aside className="topic-workspace-rail"><TopicToc sections={topic.sections} /></aside>
        <main className="topic-content" id="topic-content">
          <div className="topic-mobile-map"><TopicToc sections={topic.sections} /></div>
          <TopicNarration topic={topic} />
          <div className="topic-learning-sequence">
            {topic.sections.map((section) => <TopicSectionView section={section} accent={topic.accent} key={section.id} />)}
          </div>
          <div className="topic-reference-zone" aria-label="Topic references and next steps">
            <Glossary topic={topic} />
            <Sources topic={topic} />
            {relatedTopics.length > 0 && (
              <section className="topic-section topic-related-section">
                <header className="topic-reading-column"><p className="eyebrow">Continue learning</p><h2>Related topics</h2></header>
                <div className="concept-grid topic-related-grid">
                  {relatedTopics.map((related) => <Card className="p-5" key={related.slug}><h3 className="font-bold"><Link className="text-link" to={`/topics/${related.slug}`}>{related.title}</Link></h3><p className="mt-2 text-sm text-muted-foreground">{related.summary}</p></Card>)}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </article>
  );
}

function Glossary({ topic }: { topic: TopicDocument }) {
  return <section className="topic-section" id="glossary"><header className="topic-reading-column"><p className="eyebrow">Plain-language glossary</p><h2>Words you have already met in this guide</h2><p>Use this as a quick reminder. The guide introduces these terms in context before they appear here.</p></header><dl className="glossary-grid">{topic.glossary.map((entry) => <div key={entry.term}><dt>{entry.term}</dt><dd>{entry.definition}</dd></div>)}</dl></section>;
}

function Sources({ topic }: { topic: TopicDocument }) {
  return <section className="topic-section" id="sources"><header className="topic-reading-column"><p className="eyebrow">Primary references</p><h2>Verify and go deeper</h2><p>These links point to standards bodies, official project documentation, or official platform documentation.</p></header><ul className="source-list">{topic.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink aria-hidden="true" /></a><small>Accessed {source.accessed}</small></li>)}</ul></section>;
}

function TopicSkeleton() {
  return <div className="shell section-block" aria-live="polite"><div className="skeleton h-6 w-32" /><div className="skeleton mt-6 h-16 max-w-3xl" /><div className="skeleton mt-4 h-24 max-w-2xl" /><div className="skeleton mt-12 h-80" /><span className="sr-only">Loading topic</span></div>;
}

function ErrorState() {
  return <div className="shell empty-state my-16"><h1>This topic could not be loaded</h1><p>Refresh the page or return to the catalog.</p><Link className="text-link" to="/topics">Browse all topics</Link></div>;
}
