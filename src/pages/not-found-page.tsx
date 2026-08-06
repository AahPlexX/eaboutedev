import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="shell empty-state my-[clamp(3rem,10vw,8rem)]">
      <p className="eyebrow">404 · Route not found</p>
      <h1>This page is not part of the guide.</h1>
      <p>Use the topic catalog or global search to find the closest documented concept.</p>
      <Button asChild><Link to="/topics"><ArrowLeft aria-hidden="true" /> Browse all topics</Link></Button>
    </section>
  );
}
