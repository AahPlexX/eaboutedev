import { Outlet } from "react-router-dom";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function AppShell() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}><Outlet /></main>
      <SiteFooter />
    </div>
  );
}
