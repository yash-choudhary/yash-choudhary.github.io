import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="heading text-3xl text-ink">This page doesn't exist.</h1>
      <Link
        to="/"
        className="rounded-theme border border-line px-5 py-2.5 font-mono text-sm text-body transition-colors hover:border-accent hover:text-accent"
      >
        ← back home
      </Link>
    </main>
  );
}
