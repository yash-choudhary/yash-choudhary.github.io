import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  activePalette,
  groupedPresets,
  themeLabel,
  useContent,
  useTheme,
} from "../lib/content";

/** Three-dot preview of a palette: background, accent, heading ink. */
function Swatch({ preset }: { preset: string }) {
  const { config } = useContent();
  const palette = activePalette(config, preset);
  return (
    <span className="flex shrink-0 items-center gap-1" aria-hidden>
      {[palette.background, palette.accent, palette.headingText].map((color, i) => (
        <span
          key={i}
          className="h-2.5 w-2.5 rounded-full border border-line"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}

export default function ThemePicker() {
  const { config } = useContent();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => groupedPresets(config), [config]);
  const styles = useMemo(() => Object.keys(config.theme.styles), [config]);
  const flat = useMemo(() => [...groups.dark, ...groups.light], [groups]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inField =
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (inField || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        // Step through themes with the panel open, previewing each one live.
        e.preventDefault();
        const i = flat.indexOf(theme.preset);
        const next =
          e.key === "ArrowDown"
            ? flat[(i + 1) % flat.length]
            : flat[(i - 1 + flat.length) % flat.length];
        theme.setPreset(next);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-theme-picker", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-theme-picker", onOpenEvent);
    };
  }, [open, flat, theme]);

  // Close when clicking outside the panel or its trigger.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const renderGroup = (label: string, presets: string[]) => (
    <div key={label}>
      <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-wider text-muted">
        {label}
      </p>
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => theme.setPreset(preset)}
          className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left font-mono text-xs transition-colors ${
            preset === theme.preset
              ? "bg-accent/10 text-accent"
              : "text-body hover:bg-accent/5 hover:text-ink"
          }`}
        >
          <Swatch preset={preset} />
          <span className="grow truncate">{themeLabel(preset)}</span>
          {preset === theme.preset && <span aria-hidden>✓</span>}
        </button>
      ))}
    </div>
  );

  return (
    <div ref={panelRef} className="fixed bottom-4 left-4 z-50 print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            className="surface mb-2 w-60 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <span className="font-mono text-[11px] text-ink">theme</span>
              <span className="font-mono text-[10px] text-muted">↑↓ · esc</span>
            </div>
            <div className="max-h-[46vh] overflow-y-auto pb-2">
              {groups.dark.length > 0 && renderGroup("dark", groups.dark)}
              {groups.light.length > 0 && renderGroup("light", groups.light)}
            </div>
            <div className="flex items-center gap-1 border-t border-line px-3 py-2">
              <span className="mr-auto font-mono text-[10px] uppercase tracking-wider text-muted">
                type
              </span>
              {styles.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => theme.setStyle(name)}
                  className={`rounded-chip px-2 py-0.5 font-mono text-[10px] transition-colors ${
                    name === theme.style
                      ? "bg-accent/15 text-accent"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Change theme"
        className="surface flex items-center gap-2 px-2.5 py-1.5 font-mono text-[11px] text-body shadow-lg transition-colors hover:text-accent"
      >
        <Swatch preset={theme.preset} />
        <span className="max-w-[10rem] truncate">{themeLabel(theme.preset)}</span>
        <span className="text-muted">[t]</span>
      </button>
    </div>
  );
}
