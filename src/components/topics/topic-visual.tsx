import { ArrowDown, ArrowRight } from "lucide-react";
import type { TopicVisual } from "@/types/content";

export function TopicVisualPanel({ visual, accent }: { visual: TopicVisual; accent: string }) {
  return (
    <figure className="visual-panel" style={{ "--topic-accent": accent } as React.CSSProperties}>
      <figcaption>
        <span>{visual.title}</span>
        <small>{visual.caption}</small>
      </figcaption>
      <div className={`visual-nodes visual-${visual.kind}`}>
        {visual.nodes.map((node, index) => (
          <div className="visual-node-wrap" key={`${node.label}-${node.detail}`}>
            <div className="visual-node">
              <span className="visual-step">{String(index + 1).padStart(2, "0")}</span>
              <strong>{node.label}</strong>
              <p>{node.detail}</p>
            </div>
            {index < visual.nodes.length - 1 && (
              <span className="visual-arrow" aria-hidden="true">
                <ArrowRight className="wide-arrow" />
                <ArrowDown className="narrow-arrow" />
              </span>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}
