import { useEffect, useState } from "react";
import { marked } from "marked";
import { loadMarkdown } from "../lib/content";

export default function Markdown({ path }: { path: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadMarkdown(path)
      .then((md) => {
        if (!cancelled) setHtml(marked.parse(md, { async: false }));
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (error) return <p className="font-mono text-sm text-red-400">{error}</p>;
  if (html === null)
    return <p className="cursor-blink font-mono text-sm text-muted">&gt; loading…</p>;
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
