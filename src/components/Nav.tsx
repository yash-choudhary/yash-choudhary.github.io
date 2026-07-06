import { Link } from "react-router-dom";
import { useContent } from "../lib/content";

const NAV_ITEMS: { id: keyof ReturnType<typeof useContent>["config"]["sections"]; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const { config, profile } = useContent();
  const items = NAV_ITEMS.filter((item) => config.sections[item.id]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="font-mono text-sm font-medium text-ink">
          <span className="text-accent">~/</span>yash.choudhary
        </Link>
        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-5 md:flex">
            {items.map((item, i) => (
              <Link
                key={item.id}
                to={`/#${item.id}`}
                className="group font-mono text-xs text-body transition-colors hover:text-accent"
              >
                <span className="text-accent">{String(i + 1).padStart(2, "0")}.</span>{" "}
                {item.label}
              </Link>
            ))}
          </div>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-accent/60 px-3 py-1.5 font-mono text-xs text-accent transition-colors hover:bg-accent/10"
          >
            Resume
          </a>
          {config.features.commandPalette && (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="hidden rounded border border-line px-2 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/60 hover:text-accent sm:block"
              aria-label="Open command palette"
            >
              ⌘K
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
