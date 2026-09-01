import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A client-side router keeps the old scroll position on navigation, which
 * makes a product click feel broken (you land halfway down the page).
 * Reset it on every path change.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
