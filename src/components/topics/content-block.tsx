import { AlertTriangle, Check, Info, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ContentBlock } from "@/types/content";

export function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="prose-paragraph">{block.text}</p>;
    case "steps":
      return (
        <ol className="step-list">
          {block.items.map((item, index) => (
            <li key={item.title}>
              <span className="step-number">{index + 1}</span>
              <div><strong>{item.title}</strong><p>{item.explanation}</p>{item.result && <small>Result: {item.result}</small>}</div>
            </li>
          ))}
        </ol>
      );
    case "cards":
      return (
        <div className="concept-grid">
          {block.items.map((item) => (
            <Card key={item.title} className="p-[clamp(1rem,3cqi,1.4rem)]">
              <h4 className="font-bold">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
              {item.whenToUse && <p className="mt-3 text-xs"><strong>Use when:</strong> {item.whenToUse}</p>}
              {item.avoidWhen && <p className="mt-2 text-xs"><strong>Avoid when:</strong> {item.avoidWhen}</p>}
              {item.example && <p className="mt-2 rounded-lg bg-muted p-2 font-mono text-xs">{item.example}</p>}
            </Card>
          ))}
        </div>
      );
    case "code":
      return (
        <figure className="code-example">
          <figcaption><span>{block.language}</span><p>{block.explanation}</p></figcaption>
          <pre tabIndex={0}><code>{block.code}</code></pre>
        </figure>
      );
    case "anatomy":
      return (
        <figure className="syntax-anatomy">
          <figcaption>
            <span>{block.language} · Syntax anatomy</span>
            <h4>{block.title}</h4>
            <p>{block.caption}</p>
          </figcaption>
          <pre className="syntax-anatomy-code" tabIndex={0} aria-label={`${block.title} syntax`}><code>{block.segments.map((segment, index) => (
            <span className="syntax-anatomy-segment" key={`${segment.label}-${index}`}>
              <span aria-hidden="true" className="syntax-anatomy-marker">{index + 1}</span>
              {segment.code}
            </span>
          ))}</code></pre>
          <ol className="syntax-anatomy-map">
            {block.segments.map((segment, index) => (
              <li key={`${segment.label}-detail-${index}`}>
                <span className="syntax-anatomy-index" aria-hidden="true">{index + 1}</span>
                <div>
                  <strong>{segment.label}</strong>
                  <code>{segment.code}</code>
                  <p>{segment.explanation}</p>
                </div>
              </li>
            ))}
          </ol>
        </figure>
      );
    case "table":
      return (
        <div className="table-scroll" tabIndex={0} role="region" aria-label={block.caption}>
          <table>
            <caption>{block.caption}</caption>
            <thead><tr>{block.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
            <tbody>{block.rows.map((row) => <tr key={row.join("|")}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={`${cell}-${index}`}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    case "callout": {
      const Icon = block.tone === "warning" ? AlertTriangle : block.tone === "tip" ? Lightbulb : Info;
      return (
        <aside className={`callout callout-${block.tone}`}>
          <Icon aria-hidden="true" />
          <div><strong>{block.title}</strong><p>{block.body}</p></div>
        </aside>
      );
    }
    case "checklist":
      return <ul className="checklist">{block.items.map((item) => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}</ul>;
    case "checkpoint":
      return (
        <details className="checkpoint">
          <summary>
            <span>Check your understanding</span>
            <strong>{block.prompt}</strong>
          </summary>
          <div className="checkpoint-answer">
            <p><strong>Answer:</strong> {block.answer}</p>
            <p>{block.explanation}</p>
          </div>
        </details>
      );
  }
}
