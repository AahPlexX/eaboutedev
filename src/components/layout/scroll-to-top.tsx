import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in globalThis.history) {
      globalThis.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // "instant" avoids html { scroll-behavior: smooth } delaying the reset mid-navigation.
    const scrollToTop = () => {
      globalThis.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    scrollToTop();
    // Topic routes replace a short skeleton with full content after load; re-assert after paint.
    const frame = globalThis.requestAnimationFrame(scrollToTop);
    return () => globalThis.cancelAnimationFrame(frame);
  }, [pathname, search]);

  return null;
}
