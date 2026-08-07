import { ArrowDown, ArrowRight } from "lucide-react";
import type { TopicVisual } from "@/types/content";

function getNodeMarker(kind: TopicVisual["kind"], index: number) {
  if (kind === "layers") return `L${index + 1}`;
  if (kind === "comparison") return String.fromCharCode(65 + index);
  if (kind === "map") return "•";
  return String(index + 1).padStart(2, "0");
}

export function TopicVisualPanel({ visual, accent }: { visual: TopicVisual; accent: string }) {
  const showDirectionalConnector = visual.kind === "flow" || visual.kind === "cycle";

  return (
    <figure className={`visual-panel visual-panel-${visual.kind}`} style={{ "--topic-accent": accent } as React.CSSProperties}>
      <figcaption>
        <span>{visual.title}</span>
        <small>{visual.caption}</small>
      </figcaption>
      <div className={`visual-nodes visual-${visual.kind}`}>
        {visual.nodes.map((node, index) => (
          <div
            className="visual-node-wrap"
            key={`${node.label}-${node.detail}`}
            style={visual.kind === "layers" ? { "--layer-index": index } as React.CSSProperties : undefined}
          >
            <div className="visual-node">
              <span className="visual-step">{getNodeMarker(visual.kind, index)}</span>
              <strong>{node.label}</strong>
              <p>{node.detail}</p>
            </div>
            {showDirectionalConnector && index < visual.nodes.length - 1 && (
              <span className="visual-arrow" aria-hidden="true">
                <ArrowRight className="wide-arrow" />
                <ArrowDown className="narrow-arrow" />
              </span>
            )}
          </div>
        ))}
      </div>
      {visual.kind === "cycle" && (
        <p className="cycle-repeat">
          <span className="cycle-repeat-mark" aria-hidden="true">↻</span>
          The last stage feeds the next pass through the cycle.
        </p>
      )}
    </figure>
  );
}
