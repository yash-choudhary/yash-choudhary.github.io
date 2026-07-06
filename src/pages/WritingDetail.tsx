import { Link, useParams } from "react-router-dom";
import { useContent } from "../lib/content";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Markdown from "../components/Markdown";
import NotFound from "./NotFound";

export default function WritingDetail() {
  const { slug } = useParams();
  const { writing } = useContent();
  const post = writing.items.find((p) => p.slug === slug);

  if (!post) return <NotFound />;

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-28">
        <Link
          to="/#writing"
          className="font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          ← back to writing
        </Link>
        <p className="mb-8 mt-6 font-mono text-xs text-muted">{post.date}</p>
        <Markdown path={post.file} />
      </main>
      <Footer />
    </>
  );
}
