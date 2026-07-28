import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContent, useTheme } from "../lib/content";

interface Action {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

export default function CommandPalette() {
  const { config, profile } = useContent();
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const actions = useMemo<Action[]>(() => {
    const sectionLabels: Record<string, string> = {
      about: "About",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills & Education",
      writing: "Writing",
      now: "Now",
      contact: "Contact",
    };
    const goto = Object.entries(sectionLabels)
      .filter(([id]) => config.sections[id as keyof typeof config.sections])
      .map(([id, label]) => ({
        id: `goto-${id}`,
        label: `Go to ${label}`,
        hint: "section",
        run: () => navigate(`/#${id}`),
      }));
    return [
      ...goto,
      {
        id: "resume",
        label: "View resume",
        hint: "pdf",
        run: () => window.open(profile.resumeUrl, "_blank"),
      },
      {
        id: "email",
        label: "Copy email address",
        hint: profile.email,
        run: () => {
          void navigator.clipboard.writeText(profile.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        },
      },
      ...profile.socials.map((s) => ({
        id: `social-${s.label}`,
        label: `Open ${s.label}`,
        hint: "link ↗",
        run: () => window.open(s.url, "_blank"),
      })),
      ...Object.keys(config.theme.presets).map((name) => ({
        id: `theme-${name}`,
        label: `Theme: ${name}`,
        hint: name === theme.preset ? "active" : "palette",
        run: () => theme.setPreset(name),
      })),
      ...Object.keys(config.theme.styles).map((name) => ({
        id: `style-${name}`,
        label: `Style: ${name}`,
        hint: name === theme.style ? "active" : "typography",
        run: () => theme.setStyle(name),
      })),
    ];
  }, [config, profile, navigate, theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [actions, query]);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelected(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inField =
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      } else if (e.key === "/" && !open && !inField) {
        e.preventDefault();
        openPalette();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpenEvent = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, [open, openPalette]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const runAction = (action: Action) => {
    action.run();
    // Keep the palette open for actions you'd want to repeat — copying the
    // email, or flipping through themes to compare them.
    const staysOpen =
      action.id === "email" ||
      action.id.startsWith("theme-") ||
      action.id.startsWith("style-");
    if (!staysOpen) setOpen(false);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      runAction(filtered[selected]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-bg/70 px-4 pt-[18vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="surface w-full max-w-lg overflow-hidden shadow-2xl"
            initial={{ scale: 0.97, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="font-mono text-sm text-accent">&gt;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Type a command…"
                className="w-full bg-transparent py-3.5 font-mono text-sm text-ink outline-none placeholder:text-muted"
              />
              <kbd className="rounded-chip border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                esc
              </kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-4 py-3 font-mono text-sm text-muted">no matches</li>
              )}
              {filtered.map((action, i) => (
                <li key={action.id}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-sm transition-colors ${
                      i === selected ? "bg-accent/10 text-accent" : "text-body"
                    }`}
                    onMouseEnter={() => setSelected(i)}
                    onClick={() => runAction(action)}
                  >
                    <span>
                      {action.id === "email" && copied ? "Copied ✓" : action.label}
                    </span>
                    <span className="text-[11px] text-muted">{action.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
