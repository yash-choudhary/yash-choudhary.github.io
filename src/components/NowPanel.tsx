import { useContent } from "../lib/content";
import Section from "./Section";

export default function NowPanel({ index }: { index: number }) {
  const { now } = useContent();

  return (
    <Section id="now" index={index} title="Now">
      <div className="surface p-6 md:p-8">
        <p className="mb-6 font-mono text-xs text-muted">
          <span className="text-accent">$</span> cat now.json{" "}
          <span className="float-right">last updated: {now.updated}</span>
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {now.entries.map((entry) => (
            <div key={entry.label}>
              <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
                {entry.label}
              </h3>
              <p className="text-[15px] leading-relaxed">{entry.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
