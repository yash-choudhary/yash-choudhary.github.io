import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  activePalette,
  activeStyle,
  ContentContext,
  loadContent,
  ThemeContext,
  themeVariables,
  type Content,
} from "./lib/content";
import ScrollManager from "./components/ScrollManager";
import CommandPalette from "./components/CommandPalette";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import WritingDetail from "./pages/WritingDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Session-only overrides so themes can be previewed from the command
  // palette; site.config.json remains the source of truth on reload.
  const [preset, setPreset] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);

  useEffect(() => {
    loadContent()
      .then(setContent)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    if (!content) return;
    const vars = themeVariables(
      activePalette(content.config, preset ?? undefined),
      activeStyle(content.config, style ?? undefined),
    );
    for (const [name, value] of Object.entries(vars)) {
      document.documentElement.style.setProperty(name, value);
    }
    document.title = content.config.meta.title;
  }, [content, preset, style]);

  const theme = useMemo(
    () => ({
      preset: preset ?? content?.config.theme.preset ?? "",
      style: style ?? content?.config.theme.style ?? "",
      setPreset,
      setStyle,
    }),
    [preset, style, content],
  );

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="surface max-w-lg p-6 font-mono text-sm">
          <p className="text-red-500">content failed to load</p>
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
      <ThemeContext.Provider value={theme}>
        <BrowserRouter>
          <ScrollManager />
          {content.config.features.commandPalette && <CommandPalette />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/writing/:slug" element={<WritingDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeContext.Provider>
    </ContentContext.Provider>
  );
}
