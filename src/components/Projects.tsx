import { Link } from "react-router-dom";
import { useContent, type Project } from "../lib/content";
import Section from "./Section";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col rounded-lg border border-line bg-panel p-6 transition-colors hover:border-accent/50">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
          {project.kicker}
        </p>
        <p className="shrink-0 rounded bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent">
          {project.metric}
        </p>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-ink">{project.title}</h3>
      <p className="mt-2 grow text-[15px] leading-relaxed">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="mt-4 flex gap-5 border-t border-line pt-4 font-mono text-xs">
        {project.caseStudy && (
          <Link
            to={`/projects/${project.slug}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            Case study →
          </Link>
        )}
        {project.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="text-body transition-colors hover:text-accent"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </article>
  );
}

export default function Projects({ index }: { index: number }) {
  const { projects } = useContent();
  const featured = projects.items.filter((p) => p.featured);
  const other = projects.items.filter((p) => !p.featured);

  return (
    <Section id="projects" index={index} title="Projects">
      <div className="grid gap-5 md:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      {other.length > 0 && (
        <>
          <h3 className="mb-4 mt-12 font-mono text-sm text-muted">
            &gt; other noteworthy work
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            {other.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </>
      )}
    </Section>
  );
}
