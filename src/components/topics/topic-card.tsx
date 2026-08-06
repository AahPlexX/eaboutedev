import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopicCatalogEntry } from "@/types/content";

export function TopicCard({ topic }: { topic: TopicCatalogEntry }) {
  return (
    <article className="topic-card">
      <Card className="group flex h-full flex-col overflow-hidden">
        <div className="topic-card-visual" style={{ "--topic-accent": topic.accent } as React.CSSProperties}>
          <span className="topic-card-icon" aria-hidden="true">{topic.icon}</span>
          <div className="topic-card-lines" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{topic.category}</Badge>
            <Badge variant="outline">{topic.level}</Badge>
          </div>
          <CardTitle>
            <Link className="after:absolute after:inset-0 focus-visible:outline-none" to={`/topics/${topic.slug}`}>
              {topic.title}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{topic.summary}</p>
        </CardContent>
        <CardFooter className="justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock3 className="size-3.5" aria-hidden="true" /> {topic.estimatedMinutes} min</span>
          <span className="flex items-center gap-1 font-semibold text-foreground">Open guide <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" /></span>
        </CardFooter>
      </Card>
    </article>
  );
}
