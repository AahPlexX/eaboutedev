import { Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { GlobalSearch } from "@/components/search/global-search";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell flex min-h-16 items-center gap-3">
        <Link to="/" className="brand-link" aria-label="Everything About Development home">
          <span className="brand-mark" aria-hidden="true">E/DEV</span>
          <span className="hidden min-w-0 leading-tight sm:block">
            <strong className="block truncate text-sm">Everything About</strong>
            <span className="block truncate text-xs text-muted-foreground">Development</span>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="ms-auto hidden items-center gap-1 lg:flex">
          <HeaderLink to="/">Home</HeaderLink>
          <HeaderLink to="/topics">All topics</HeaderLink>
          <a className="nav-link" href="#/topics/the-seven-types-of-databases">Database guide</a>
        </nav>
        <div className="ms-auto min-w-0 flex-1 sm:max-w-[27rem] lg:ms-3"><GlobalSearch /></div>
        <Button asChild variant="ghost" size="icon" className="shrink-0 lg:hidden">
          <Link to="/topics"><Menu aria-hidden="true" /><span className="sr-only">Browse topics</span></Link>
        </Button>
      </div>
    </header>
  );
}

function HeaderLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink to={to} className={({ isActive }) => cn("nav-link", isActive && "bg-accent text-foreground")}>
      {children}
    </NavLink>
  );
}
