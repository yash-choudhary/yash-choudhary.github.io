import { Link } from "react-router-dom";
import { useContent } from "../lib/content";
import Section from "./Section";

export default function Writing({ index }: { index: number }) {
  const { writing } = useContent();

  return (
    <Section id="writing" index={index} title="Writing">
      <ol className="space-y-2">
        {writing.items.map((post) => (
          <li key={post.slug}>
            <Link
              to={`/writing/${post.slug}`}
              className="group block rounded-lg border border-transparent p-4 transition-colors hover:border-line hover:bg-panel"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                <p className="shrink-0 font-mono text-xs text-muted">{post.date}</p>
                <div>
                  <h3 className="font-semibold text-ink transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed">{post.summary}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </Section>
  );
}
