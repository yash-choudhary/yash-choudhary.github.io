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
import ThemePicker from "./components/ThemePicker";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import WritingDetail from "./pages/WritingDetail";
import NotFound from "./pages/NotFound";

const STORAGE_PREFIX = "yc-theme-";

function readStored(key: "preset" | "style"): string | null {
  try {
    return localStorage.getItem(STORAGE_PREFIX + key);
  } catch {
    // Private browsing or blocked storage — fall back to the config default.
    return null;
  }
}

function writeStored(key: "preset" | "style", value: string) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, value);
  } catch {
    /* ignore */
  }
}

export default function App() {
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  // A visitor's own theme choice, remembered across visits. Until they pick
  // one, site.config.json decides what they see.
  const [preset, setPreset] = useState<string | null>(() => readStored("preset"));
  const [style, setStyle] = useState<string | null>(() => readStored("style"));

  useEffect(() => {
    loadContent()
      .then(setContent)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  // A stored choice can go stale if a preset is renamed or removed from the
  // config, so only honour it while it still exists.
  const resolvedPreset =
    content && preset && preset in content.config.theme.presets ? preset : undefined;
  const resolvedStyle =
    content && style && style in content.config.theme.styles ? style : undefined;

  useEffect(() => {
    if (!content) return;
    const vars = themeVariables(
      activePalette(content.config, resolvedPreset),
      activeStyle(content.config, resolvedStyle),
    );
    for (const [name, value] of Object.entries(vars)) {
      document.documentElement.style.setProperty(name, value);
    }
    document.title = content.config.meta.title;
  }, [content, resolvedPreset, resolvedStyle]);

  const theme = useMemo(
    () => ({
      preset: resolvedPreset ?? content?.config.theme.preset ?? "",
      style: resolvedStyle ?? content?.config.theme.style ?? "",
      setPreset: (next: string) => {
        setPreset(next);
        writeStored("preset", next);
      },
      setStyle: (next: string) => {
        setStyle(next);
        writeStored("style", next);
      },
    }),
    [resolvedPreset, resolvedStyle, content],
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
          {content.config.features.themePicker && <ThemePicker />}
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
