import { motion } from "framer-motion";
import { useContent } from "../lib/content";
import ParticleField from "./ParticleField";

export default function Hero() {
  const { profile, config } = useContent();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {config.features.particles && <ParticleField />}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />
      <div className="relative mx-auto w-full max-w-5xl px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="cursor-blink mb-5 font-mono text-sm text-accent">
            &gt; {profile.logLine}
          </p>
          <h1 className="heading text-5xl text-ink md:text-7xl">{profile.name}</h1>
          <h2 className="heading mt-3 text-2xl text-muted md:text-4xl">
            {profile.headline}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">{profile.tagline}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-theme bg-accent px-5 py-2.5 font-mono text-sm font-medium text-bg transition-opacity hover:opacity-85"
            >
              View Resume
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="rounded-theme border border-line px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
          </div>
          <div className="mt-10 flex gap-6">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        aria-hidden
      >
        scroll ↓
      </motion.div>
    </section>
  );
}
