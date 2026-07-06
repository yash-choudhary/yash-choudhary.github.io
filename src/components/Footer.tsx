import { useContent } from "../lib/content";

export default function Footer() {
  const { config, profile } = useContent();

  return (
    <footer className="border-t border-line/60 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-center">
        <div className="flex gap-6">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        </div>
        <p className="font-mono text-[11px] text-muted">{config.meta.footerNote}</p>
      </div>
    </footer>
  );
}
