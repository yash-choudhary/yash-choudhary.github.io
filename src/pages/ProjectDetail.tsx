import { Link, useParams } from "react-router-dom";
import { useContent } from "../lib/content";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Markdown from "../components/Markdown";
import NotFound from "./NotFound";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { projects } = useContent();
  const project = projects.items.find((p) => p.slug === slug);

  if (!project) return <NotFound />;

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-28">
        <Link
          to="/#projects"
          className="font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          ← back to projects
        </Link>
        <header className="mb-10 mt-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
            {project.kicker}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
            {project.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded bg-accent/10 px-2.5 py-1 font-mono text-xs text-accent">
              {project.metric}
            </span>
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-body transition-colors hover:text-accent"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </header>
        {project.caseStudy ? (
          <Markdown path={project.caseStudy} />
        ) : (
          <p className="prose">{project.summary}</p>
        )}
      </main>
      <Footer />
    </>
  );
}
