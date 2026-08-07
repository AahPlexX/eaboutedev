import { useEffect, useState } from "react";
import { ArrowLeft, Clock3, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
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
        if (!loadedTopic) {
          setStatus("missing");
          return;
        }

        setTopic(loadedTopic);
        setStatus("ready");
        globalThis.document.title = getTopicDocumentTitle(loadedTopic.title);
      })
      .catch(() => active && setStatus("error"));

    return () => {
      active = false;
      globalThis.document.title = SITE_TITLE;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;
    setRelatedTopics([]);
    if (status !== "ready" || !topic || topic.related.length === 0) return () => { active = false; };

    loadCatalog()
      .then((catalog) => {
        if (!active) return;
        const related = topic.related
          .map((relatedSlug) => catalog.find((entry) => entry.slug === relatedSlug))
          .filter((entry): entry is TopicCatalogEntry => Boolean(entry));
        setRelatedTopics(related);
      })
      .catch(() => active && setRelatedTopics([]));

    return () => { active = false; };
  }, [status, topic]);

  if (status === "missing") return <NotFoundPage />;
  if (status === "error") return <ErrorState />;
  if (status !== "ready" || !topic) return <TopicSkeleton />;

  return (
    <article style={{ "--topic-accent": topic.accent } as React.CSSProperties}>
      <header className="topic-hero">
        <div className="shell">
          <Link to="/topics" className="text-link inline-flex items-center gap-2 text-sm"><ArrowLeft aria-hidden="true" /> All topics</Link>
          <div className="topic-hero-grid">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge>{topic.category}</Badge>
                <Badge variant="outline">{topic.level}</Badge>
                <Badge variant="outline"><Clock3 className="me-1 size-3" aria-hidden="true" /> {topic.estimatedMinutes} min</Badge>
              </div>
              <p className="eyebrow mt-6">{topic.eyebrow}</p>
              <h1>{topic.title}</h1>
              <p className="topic-summary">{topic.summary}</p>
              <div className="topic-outcomes">
                <p>By the end, you will be able to:</p>
                <ul>{topic.learningOutcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
              </div>
              <div className="topic-prerequisites">
                <p>Helpful before this guide</p>
                <ul>{topic.prerequisites.map((prerequisite) => <li key={prerequisite}>{prerequisite}</li>)}</ul>
              </div>
            </div>
            <TopicVisualPanel visual={topic.heroVisual} accent={topic.accent} />
          </div>
        </div>
      </header>

      <div className="shell topic-layout">
        <aside><TopicToc sections={topic.sections} /></aside>
        <div className="topic-content">
          {topic.sections.map((section) => <TopicSectionView section={section} accent={topic.accent} key={section.id} />)}
          <Glossary topic={topic} />
          <Sources topic={topic} />
          {relatedTopics.length > 0 && (
            <section className="topic-section">
              <header><p className="eyebrow">Continue learning</p><h2>Related topics</h2></header>
              <div className="concept-grid">
                {relatedTopics.map((related) => (
                  <Card className="p-5" key={related.slug}>
                    <h3 className="font-bold"><Link className="text-link" to={`/topics/${related.slug}`}>{related.title}</Link></h3>
                    <p className="mt-2 text-sm text-muted-foreground">{related.summary}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

function Glossary({ topic }: { topic: TopicDocument }) {
  return (
    <section className="topic-section" id="glossary">
      <header><p className="eyebrow">Plain-language glossary</p><h2>Words you have already met in this guide</h2><p>Use this as a quick reminder. The guide introduces these terms in context before they appear here.</p></header>
      <dl className="glossary-grid">
        {topic.glossary.map((entry) => <div key={entry.term}><dt>{entry.term}</dt><dd>{entry.definition}</dd></div>)}
      </dl>
    </section>
  );
}

function Sources({ topic }: { topic: TopicDocument }) {
  return (
    <section className="topic-section" id="sources">
      <header><p className="eyebrow">Primary references</p><h2>Verify and go deeper</h2><p>These links point to standards bodies, official project documentation, or official platform documentation.</p></header>
      <ul className="source-list">
        {topic.sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink aria-hidden="true" /></a>
            <small>Accessed {source.accessed}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TopicSkeleton() {
  return <div className="shell section-block" aria-live="polite"><div className="skeleton h-6 w-32" /><div className="skeleton mt-6 h-16 max-w-3xl" /><div className="skeleton mt-4 h-24 max-w-2xl" /><div className="skeleton mt-12 h-80" /><span className="sr-only">Loading topic</span></div>;
}

function ErrorState() {
  return <div className="shell empty-state my-16"><h1>This topic could not be loaded</h1><p>Refresh the page or return to the catalog.</p><Link className="text-link" to="/topics">Browse all topics</Link></div>;
}
