import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
}

export default function Section({ id, index, title, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16 md:py-20"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="heading mb-8 flex items-baseline gap-3 text-2xl text-ink">
        <span className="font-mono text-sm font-medium text-accent">
          {String(index).padStart(2, "0")} ·
        </span>
        {title}
        <span className="ml-4 hidden h-px grow bg-line sm:block" aria-hidden />
      </h2>
      {children}
    </motion.section>
  );
}
