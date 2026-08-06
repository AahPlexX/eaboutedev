import { ArrowRight, BookOpenCheck, Layers3, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { TopicCard } from "@/components/topics/topic-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { topicCatalog } from "@/generated/topic-catalog";
import { HOME_TOPIC_PREVIEW_SIZE } from "@/lib/catalog";

export function HomePage() {
  const featured = topicCatalog.slice(0, HOME_TOPIC_PREVIEW_SIZE);

  return (
    <>
      <section className="hero-section">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">A human-readable web development field guide</p>
            <h1>Understand the web from first principles to production decisions.</h1>
            <p className="hero-lede">
              Search a concept, follow the visual sequence, compare the trade-offs, and leave knowing what happens next.
              Every guide is written for clarity without removing the details experienced developers need.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/topics">Explore every topic <ArrowRight aria-hidden="true" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/topics/the-seven-types-of-databases">Learn database types</Link></Button>
            </div>
            <dl className="hero-stats">
              <div><dt>{topicCatalog.length}</dt><dd>complete launch guides</dd></div>
              <div><dt>5,000</dt><dd>topic-ready architecture</dd></div>
              <div><dt>320px</dt><dd>minimum layout floor</dd></div>
            </dl>
          </div>
          <HeroMap />
        </div>
      </section>

      <section className="shell section-block" aria-labelledby="start-heading">
        <header className="section-heading">
          <p className="eyebrow">Start with the system</p>
          <h2 id="start-heading">Foundational guides that connect instead of competing for attention</h2>
          <p>Each launch topic answers a foundational question and points to the next useful concept.</p>
        </header>
        <div className="topic-grid">
          {featured.map((topic) => <TopicCard topic={topic} key={topic.slug} />)}
        </div>
        {topicCatalog.length > featured.length && (
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline"><Link to="/topics">Browse all {topicCatalog.length} topics</Link></Button>
          </div>
        )}
      </section>

      <section className="border-y border-border bg-card">
        <div className="shell section-block">
          <header className="section-heading">
            <p className="eyebrow">How the library works</p>
            <h2>Read in the order your brain actually needs</h2>
          </header>
          <div className="feature-grid">
            <Feature icon={Search} title="Ask naturally" body="Search expands common abbreviations and related terms, then applies prefix and typo-tolerant matching." />
            <Feature icon={Layers3} title="See the layers" body="Every difficult idea is decomposed into visible steps, relationships, comparisons, and decision points." />
            <Feature icon={BookOpenCheck} title="Verify the source" body="Guides close with a glossary and authoritative documentation links instead of unsupported claims." />
            <Feature icon={Sparkles} title="Keep context" body="Related topics and prerequisites show what comes before and what should come next." />
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ icon: Icon, title, body }: { icon: typeof Search; title: string; body: string }) {
  return (
    <Card className="p-[clamp(1rem,4cqi,1.75rem)]">
      <span className="feature-icon"><Icon aria-hidden="true" /></span>
      <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </Card>
  );
}

function HeroMap() {
  const nodes = ["Browser", "Internet", "Server", "API", "Database"];
  return (
    <figure className="hero-map" aria-label="A simplified web system map from browser to database">
      <figcaption>One request. Five connected systems.</figcaption>
      <div className="hero-map-track">
        {nodes.map((node, index) => (
          <div className="hero-map-node-wrap" key={node}>
            <div className="hero-map-node"><span>{String(index + 1).padStart(2, "0")}</span><strong>{node}</strong></div>
            {index < nodes.length - 1 && <i aria-hidden="true" />}
          </div>
        ))}
      </div>
      <p>Follow the same path in reverse to understand the response.</p>
    </figure>
  );
}
