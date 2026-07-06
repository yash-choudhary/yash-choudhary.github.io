import { useContent } from "../lib/content";
import Section from "./Section";

export default function About({ index }: { index: number }) {
  const { profile } = useContent();

  return (
    <Section id="about" index={index} title="About">
      <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
        {profile.summary.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
        <p className="pt-2 font-mono text-sm text-muted">
          <span className="text-accent">location:</span> {profile.location}
        </p>
      </div>
    </Section>
  );
}
