import { useContent } from "../lib/content";
import Section from "./Section";

export default function Contact({ index }: { index: number }) {
  const { profile } = useContent();

  return (
    <Section id="contact" index={index} title="Get in touch">
      <div className="max-w-2xl">
        <p className="text-lg leading-relaxed">
          If you're building data-driven products, hiring for data or engineering
          roles, or just want to talk shop — my inbox is open.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-block rounded border border-accent px-7 py-3.5 font-mono text-sm text-accent transition-colors hover:bg-accent/10"
        >
          {profile.email}
        </a>
      </div>
    </Section>
  );
}
