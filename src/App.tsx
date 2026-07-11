import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { activePalette, ContentContext, loadContent, type Content } from "./lib/content";
import ScrollManager from "./components/ScrollManager";
import CommandPalette from "./components/CommandPalette";
import MouseGlow from "./components/MouseGlow";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import WritingDetail from "./pages/WritingDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent()
      .then(setContent)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    if (!content) return;
    const palette = activePalette(content.config);
    const vars: Record<string, string> = {
      "--accent": palette.accent,
      "--bg": palette.background,
      "--panel": palette.panel,
      "--line": palette.line,
      "--ink": palette.headingText,
      "--body": palette.bodyText,
      "--muted": palette.mutedText,
    };
    for (const [name, value] of Object.entries(vars)) {
      document.documentElement.style.setProperty(name, value);
    }
    document.title = content.config.meta.title;
  }, [content]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-lg rounded-lg border border-line bg-panel p-6 font-mono text-sm">
          <p className="text-red-400">content failed to load</p>
          <p className="mt-2 text-muted">{error}</p>
          <p className="mt-4 text-body">
            Check the JSON files in <span className="text-ink">public/content/</span> for
            syntax errors.
          </p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="cursor-blink font-mono text-sm text-muted">&gt; loading content…</p>
      </div>
    );
  }

  return (
    <ContentContext.Provider value={content}>
      <BrowserRouter>
        <ScrollManager />
        {content.config.features.mouseGlow && <MouseGlow />}
        {content.config.features.commandPalette && <CommandPalette />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/writing/:slug" element={<WritingDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ContentContext.Provider>
  );
}
