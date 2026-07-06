import { createContext, useContext } from "react";
import { z } from "zod";

const linkSchema = z.object({ label: z.string(), url: z.string() });

export const paletteSchema = z.object({
  accent: z.string(),
  background: z.string(),
  panel: z.string(),
  line: z.string(),
  headingText: z.string(),
  bodyText: z.string(),
  mutedText: z.string(),
});

export const siteConfigSchema = z
  .object({
    theme: z.object({
      preset: z.string(),
      presets: z.record(z.string(), paletteSchema),
    }),
    sections: z.object({
      about: z.boolean(),
      experience: z.boolean(),
      projects: z.boolean(),
      skills: z.boolean(),
      writing: z.boolean(),
      now: z.boolean(),
      contact: z.boolean(),
    }),
    features: z.object({
      commandPalette: z.boolean(),
      particles: z.boolean(),
    }),
    meta: z.object({
      title: z.string(),
      footerNote: z.string(),
    }),
  })
  .refine((config) => config.theme.preset in config.theme.presets, {
    message: "theme.preset must be one of the keys in theme.presets",
  });

export type Palette = z.infer<typeof paletteSchema>;

export function activePalette(config: SiteConfig): Palette {
  return config.theme.presets[config.theme.preset];
}

export const profileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  tagline: z.string(),
  logLine: z.string(),
  summary: z.array(z.string()),
  location: z.string(),
  email: z.string(),
  resumeUrl: z.string(),
  socials: z.array(linkSchema),
});

export const experienceSchema = z.object({
  items: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      location: z.string(),
      start: z.string(),
      end: z.string(),
      bullets: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  ),
});

export const projectsSchema = z.object({
  items: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      kicker: z.string(),
      metric: z.string(),
      summary: z.string(),
      tags: z.array(z.string()),
      links: z.array(linkSchema),
      featured: z.boolean(),
      caseStudy: z.string().optional(),
    }),
  ),
});

export const skillsSchema = z.object({
  groups: z.array(z.object({ label: z.string(), items: z.array(z.string()) })),
  education: z.array(
    z.object({
      degree: z.string(),
      school: z.string(),
      location: z.string(),
      start: z.string(),
      end: z.string(),
      note: z.string(),
    }),
  ),
  highlights: z.array(z.string()),
});

export const nowSchema = z.object({
  updated: z.string(),
  entries: z.array(z.object({ label: z.string(), text: z.string() })),
});

export const writingSchema = z.object({
  items: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      date: z.string(),
      summary: z.string(),
      file: z.string(),
    }),
  ),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Projects = z.infer<typeof projectsSchema>;
export type Project = Projects["items"][number];
export type Skills = z.infer<typeof skillsSchema>;
export type Now = z.infer<typeof nowSchema>;
export type Writing = z.infer<typeof writingSchema>;
export type Post = Writing["items"][number];

export interface Content {
  config: SiteConfig;
  profile: Profile;
  experience: Experience;
  projects: Projects;
  skills: Skills;
  now: Now;
  writing: Writing;
}

async function fetchJson(name: string): Promise<unknown> {
  const res = await fetch(`${import.meta.env.BASE_URL}content/${name}`);
  if (!res.ok) throw new Error(`Failed to load content/${name} (HTTP ${res.status})`);
  return res.json();
}

export async function loadContent(): Promise<Content> {
  const [config, profile, experience, projects, skills, now, writing] =
    await Promise.all([
      fetchJson("site.config.json"),
      fetchJson("profile.json"),
      fetchJson("experience.json"),
      fetchJson("projects.json"),
      fetchJson("skills.json"),
      fetchJson("now.json"),
      fetchJson("writing.json"),
    ]);
  return {
    config: siteConfigSchema.parse(config),
    profile: profileSchema.parse(profile),
    experience: experienceSchema.parse(experience),
    projects: projectsSchema.parse(projects),
    skills: skillsSchema.parse(skills),
    now: nowSchema.parse(now),
    writing: writingSchema.parse(writing),
  };
}

export async function loadMarkdown(path: string): Promise<string> {
  const res = await fetch(import.meta.env.BASE_URL + path);
  if (!res.ok) throw new Error(`Failed to load ${path} (HTTP ${res.status})`);
  return res.text();
}

export const ContentContext = createContext<Content | null>(null);

export function useContent(): Content {
  const content = useContext(ContentContext);
  if (!content) throw new Error("useContent called outside ContentContext");
  return content;
}
