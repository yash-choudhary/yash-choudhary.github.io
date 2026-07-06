# How this site works: a portfolio driven entirely by JSON

Most portfolio sites die the same death: the content goes stale because updating it means editing markup. This site is built so that never happens.

## The architecture

The site is a **React + TypeScript** single-page app, but none of the content lives in the components. Everything — my bio, experience, projects, skills, even whether a section appears at all — is streamed at runtime from a content store: a folder of JSON and Markdown files.

```
public/content/
├── site.config.json   ← section toggles, accent color
├── profile.json       ← name, headline, summary, socials
├── experience.json    ← work history
├── projects.json      ← project cards (+ Markdown case studies)
├── skills.json        ← skills, education, highlights
├── now.json           ← what I'm doing right now
└── writing.json       ← this very post
```

On load, the app fetches these files, validates them against **Zod schemas** (so a typo in the JSON fails loudly instead of rendering garbage), and renders whatever it finds.

## Why bother?

1. **Updating the site takes 30 seconds.** New job? Edit `experience.json`. New project? Add an object to `projects.json`. Push, and GitHub Actions redeploys.
2. **Sections are feature-flagged.** `site.config.json` has a toggle per section — I designed all of them, and choose what the public sees.
3. **The content outlives the design.** When I redesign in two years, the data comes with me for free.

It's the same principle behind every good data system: separate the data from its presentation.
