import { useContent } from "../lib/content";
import Section from "./Section";

export default function SkillsEducation({ index }: { index: number }) {
  const { skills } = useContent();

  return (
    <Section id="skills" index={index} title="Skills & Education">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          {skills.groups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border border-line bg-panel px-3 py-1.5 font-mono text-xs text-body transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {skills.education.map((edu) => (
            <div
              key={edu.degree}
              className="rounded-lg border border-line bg-panel p-5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold text-ink">{edu.degree}</h3>
                <p className="shrink-0 font-mono text-[11px] text-muted">
                  {edu.start} — {edu.end}
                </p>
              </div>
              <p className="mt-1 text-sm text-accent">{edu.school}</p>
              <p className="font-mono text-[11px] text-muted">{edu.location}</p>
              <p className="mt-3 text-sm leading-relaxed">{edu.note}</p>
            </div>
          ))}
          <div className="rounded-lg border border-line bg-panel p-5">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
              Highlights
            </h3>
            <ul className="space-y-2">
              {skills.highlights.map((highlight) => (
                <li key={highlight.slice(0, 32)} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-0.5 shrink-0 text-accent" aria-hidden>
                    ★
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
