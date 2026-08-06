import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="shell grid gap-8 py-[clamp(2rem,6vw,4rem)] sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="font-display text-xl font-bold">Everything About Development</p>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
            A visual, plain-language web-development reference designed to remain useful from day one through senior practice.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
          <Link className="text-link" to="/">Home</Link>
          <Link className="text-link" to="/topics">Topics</Link>
          <a className="text-link" href="#main-content">Back to top</a>
        </nav>
      </div>
    </footer>
  );
}
