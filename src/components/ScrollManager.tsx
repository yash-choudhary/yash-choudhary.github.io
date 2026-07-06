import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the element referenced by the URL hash (e.g. /#projects) after
 * navigation, or to the top when there is no hash. Needed because React Router
 * doesn't handle in-page anchors on route changes.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Content renders synchronously once loaded, but wait a frame for layout.
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
