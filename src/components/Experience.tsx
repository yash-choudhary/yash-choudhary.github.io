import { useContent } from "../lib/content";
import Section from "./Section";

export default function Experience({ index }: { index: number }) {
  const { experience } = useContent();

  return (
    <Section id="experience" index={index} title="Experience">
      <ol className="space-y-10">
        {experience.items.map((job) => (
          <li
            key={`${job.company}-${job.role}`}
            className="grid gap-2 md:grid-cols-[170px_1fr] md:gap-8"
          >
            <p className="pt-0.5 font-mono text-xs leading-5 text-muted">
              {job.start} — {job.end}
            </p>
            <div>
              <h3 className="heading text-ink">
                {job.role} <span className="text-muted">·</span>{" "}
                <span className="text-accent">{job.company}</span>
              </h3>
              <p className="mt-0.5 font-mono text-xs text-muted">{job.location}</p>
              <ul className="mt-3 space-y-2">
                {job.bullets.map((bullet) => (
                  <li key={bullet.slice(0, 32)} className="flex gap-3 text-[15px] leading-relaxed">
                    <span className="mt-1 shrink-0 text-accent" aria-hidden>
                      ▹
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-chip bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
