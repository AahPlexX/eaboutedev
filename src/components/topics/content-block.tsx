import { AlertTriangle, Check, Info, Lightbulb } from "lucide-react";
import { InlineContent } from "@/components/topics/inline-content";
import { Card } from "@/components/ui/card";
import { flattenRichText } from "@/lib/rich-text";
import type { ContentBlock } from "@/types/content";

export function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="prose-paragraph"><InlineContent value={block.text} /></p>;
    case "steps":
      return (
        <ol className="step-list">
          {block.items.map((item, index) => (
            <li key={`${flattenRichText(item.title)}-${index}`}>
              <span className="step-number">{index + 1}</span>
              <div>
                <strong><InlineContent value={item.title} /></strong>
                <p><InlineContent value={item.explanation} /></p>
                {item.result && <small>Result: <InlineContent value={item.result} /></small>}
              </div>
            </li>
          ))}
        </ol>
      );
    case "cards":
      return (
        <div className="concept-grid">
          {block.items.map((item, index) => (
            <Card key={`${flattenRichText(item.title)}-${index}`} className="p-[clamp(1rem,3cqi,1.4rem)]">
              <h4 className="font-bold"><InlineContent value={item.title} /></h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground"><InlineContent value={item.summary} /></p>
              {item.whenToUse && <p className="mt-3 text-xs"><strong>Use when:</strong> <InlineContent value={item.whenToUse} /></p>}
              {item.avoidWhen && <p className="mt-2 text-xs"><strong>Avoid when:</strong> <InlineContent value={item.avoidWhen} /></p>}
              {item.example && <p className="mt-2 rounded-lg bg-muted p-2 font-mono text-xs"><InlineContent value={item.example} /></p>}
            </Card>
          ))}
        </div>
      );
    case "code":
      return (
        <figure className="code-example">
          <figcaption><span>{block.language}</span><p><InlineContent value={block.explanation} /></p></figcaption>
          <pre tabIndex={0}><code>{block.code}</code></pre>
        </figure>
      );
    case "anatomy":
      return (
        <figure className="syntax-anatomy">
          <figcaption>
            <span>{block.language} · Syntax anatomy</span>
            <h4><InlineContent value={block.title} /></h4>
            <p><InlineContent value={block.caption} /></p>
          </figcaption>
          <pre className="syntax-anatomy-code" tabIndex={0} aria-label={`${flattenRichText(block.title)} syntax`}><code>{block.segments.map((segment, index) => (
            <span className="syntax-anatomy-segment" key={`${flattenRichText(segment.label)}-${index}`}>
              <span aria-hidden="true" className="syntax-anatomy-marker">{index + 1}</span>
              {segment.code}
            </span>
          ))}</code></pre>
          <ol className="syntax-anatomy-map">
            {block.segments.map((segment, index) => (
              <li key={`${flattenRichText(segment.label)}-detail-${index}`}>
                <span className="syntax-anatomy-index" aria-hidden="true">{index + 1}</span>
                <div>
                  <strong><InlineContent value={segment.label} /></strong>
                  <code>{segment.code}</code>
                  <p><InlineContent value={segment.explanation} /></p>
                </div>
              </li>
            ))}
          </ol>
        </figure>
      );
    case "table":
      return (
        <div className="table-scroll" tabIndex={0} role="region" aria-label={flattenRichText(block.caption)}>
          <table>
            <caption><InlineContent value={block.caption} /></caption>
            <thead><tr>{block.columns.map((column, index) => <th scope="col" key={`${flattenRichText(column)}-${index}`}><InlineContent value={column} /></th>)}</tr></thead>
            <tbody>{block.rows.map((row, rowIndex) => <tr key={`row-${rowIndex}`}>{row.map((cell, index) => index === 0 ? <th scope="row" key={`cell-${rowIndex}-${index}`}><InlineContent value={cell} /></th> : <td key={`cell-${rowIndex}-${index}`}><InlineContent value={cell} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    case "callout": {
      const Icon = block.tone === "warning" ? AlertTriangle : block.tone === "tip" ? Lightbulb : Info;
      return (
        <aside className={`callout callout-${block.tone}`}>
          <Icon aria-hidden="true" />
          <div><strong><InlineContent value={block.title} /></strong><p><InlineContent value={block.body} /></p></div>
        </aside>
      );
    }
    case "checklist":
      return <ul className="checklist">{block.items.map((item, index) => <li key={`check-${index}`}><Check aria-hidden="true" /><span><InlineContent value={item} /></span></li>)}</ul>;
    case "checkpoint":
      return (
        <details className="checkpoint">
          <summary>
            <span>Check your understanding</span>
            <strong><InlineContent value={block.prompt} /></strong>
          </summary>
          <div className="checkpoint-answer">
            <p><strong>Answer:</strong> <InlineContent value={block.answer} /></p>
            <p><InlineContent value={block.explanation} /></p>
          </div>
        </details>
      );
  }
}
