import { ArrowRight, BookOpenCheck, Layers3, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { TopicCard } from "@/components/topics/topic-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { topicBootstrap } from "@/generated/topic-bootstrap";

export function HomePage() {
  const { featuredTopics: featured, topicCount } = topicBootstrap;

  return (
    <>
      <section className="hero-section">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Learn the system, not isolated definitions</p>
            <h1>Understand web development without needing the jargon first.</h1>
            <p className="hero-lede">
              Start with something concrete, see how the pieces connect, then learn the real technical terms, code,
              trade-offs, debugging methods, and production decisions. Nothing important is skipped just to make a guide feel easy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/topics/how-the-web-works">Start with how the web works <ArrowRight aria-hidden="true" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/topics">Browse all topics</Link></Button>
            </div>
            <dl className="hero-stats">
              <div><dt>Start clear</dt><dd>No topic vocabulary is assumed at the beginning.</dd></div>
              <div><dt>Stay connected</dt><dd>Each new idea builds on something already explained.</dd></div>
              <div><dt>Go deep</dt><dd>Keep reading into real code, failures, trade-offs, and production use.</dd></div>
            </dl>
          </div>
          <HeroMap />
        </div>
      </section>

      <section className="shell section-block" aria-labelledby="start-heading">
        <header className="section-heading">
          <p className="eyebrow">Choose a useful question</p>
          <h2 id="start-heading">Learn one part, while seeing where it belongs in the whole system</h2>
          <p>If you are unsure where to begin, start with How the Web Works. Otherwise, open the topic that matches what you are trying to understand right now.</p>
        </header>
        <div className="topic-grid">
          {featured.map((topic) => <TopicCard topic={topic} key={topic.slug} />)}
        </div>
        {topicCount > featured.length && (
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline"><Link to="/topics">Browse all {topicCount} topics</Link></Button>
          </div>
        )}
      </section>

      <section className="border-y border-border bg-card">
        <div className="shell section-block">
          <header className="section-heading">
            <p className="eyebrow">How each guide teaches</p>
            <h2>Get to the full concept without fighting the explanation</h2>
          </header>
          <div className="feature-grid">
            <Feature icon={Search} title="Ask naturally" body="Search for the word, problem, or question you have. You do not need to know the official term first." />
            <Feature icon={Layers3} title="See what happens" body="Concrete examples and visuals establish the mental model before the explanation becomes more technical." />
            <Feature icon={BookOpenCheck} title="Learn the real terms" body="Technical vocabulary is introduced where it becomes useful, with its meaning explained in context and reinforced in the glossary." />
            <Feature icon={Sparkles} title="Keep going" body="The same guide continues into code, trade-offs, failure modes, debugging, and real production decisions instead of stopping at basics." />
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
  const nodes = [
    { label: "Browser", detail: "You enter an address and ask for a page." },
    { label: "Network", detail: "The request travels to the right destination." },
    { label: "Server", detail: "Software receives the request and decides what to do." },
    { label: "API", detail: "The server may ask other software for data or an action." },
    { label: "Database", detail: "Stored information can be read or changed." },
  ];

  return (
    <figure className="hero-map" aria-label="A simplified web request moving from a browser toward stored data">
      <figcaption>Follow one request through the system.</figcaption>
      <div className="hero-map-track">
        {nodes.map((node, index) => (
          <div className="hero-map-node-wrap" key={node.label}>
            <div className="hero-map-node">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="grid max-w-[18rem] gap-0.5 text-end">
                <strong>{node.label}</strong>
                <small className="text-xs leading-snug text-muted-foreground">{node.detail}</small>
              </div>
            </div>
            {index < nodes.length - 1 && <i aria-hidden="true" />}
          </div>
        ))}
      </div>
      <p>The answer travels back toward the browser, which turns the returned files and data into what you see and use.</p>
    </figure>
  );
}
