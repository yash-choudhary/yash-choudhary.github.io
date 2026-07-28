# Session context — Yash Choudhary portfolio website

Handoff summary from the Claude Code session (2026-07-06) that built and deployed this site. Read this to resume work in any new session.

## Who Yash is

- Software engineer, 4.5 yrs in fintech/IoT (Enovate IT Outsourcing, Icertis — India). Now in Dublin doing an **MSc Business Analytics at UCD Smurfit** (Sep 2025–Aug 2026, 1.1 expected). Targeting **data/ML, BI, and product roles** — the site's primary audience is data/ML recruiters.
- GitHub `yash-choudhary` · LinkedIn `linkedin.com/in/yash-here` · Kaggle `yashchoudhary` · email yashc.dev@gmail.com
- Notable: 8th/1800 Kaggle Global Wheat Detection (0.7699 mAP), published CNN diabetic-retinopathy paper (2021), 2× Star Performer at Icertis, SIH 2020 Internals winner.
- Resume source: `/Users/yashchoudhary/Documents/Professional/Resumes/Full time/Yash Choudhary.pdf` (a copy is bundled at `public/Yash_Choudhary_Resume.pdf`).
- His MSBA capstone (separate repo: `~/Documents/Professional/MSBA/Trimester 3/Capstone/Code`) trains transformer models on time-series data.

## The site — status: LIVE

**https://yash-choudhary.github.io/** — deployed 2026-07-06 as "Version 2026" (git tag `version-2026`).

- Project root: `/Users/yashchoudhary/Documents/Personal/Portfolio Website/`
- Repo: `yash-choudhary/yash-choudhary.github.io`, branch `main` (now default). The **old 2024 site is preserved** on `master` and `coming-soon` branches — do not delete.
- Deploys automatically on push to `main` via `.github/workflows/deploy.yml` (build → copy `dist/index.html` → `dist/404.html` for SPA fallback → deploy-pages).

## Design decisions (agreed with Yash)

- Style: originally dark minimal (Brittany Chiang-inspired); **as of 2026-07-06 the default is the herdr.dev-inspired look** — `tokyo-day` palette (paper `#e1e2e7`, navy ink `#1f2f66`, blue accent `#2e7de9`) with the `terminal` style (JetBrains Mono headings at weight 400, `-0.04em` tracking, hairline borders, 6px/2px radii). Inter for body prose.
- Signature twists: **⌘K command palette** (also opens with `/`, and now switches themes/styles live), an **animated particle field**, and a **mouse underglow** in the hero.
- Structure: **single scrolling home page + detail pages** for project case studies (`/projects/:slug`) and blog posts (`/writing/:slug`).
- All 8 sections built (hero, about, experience, projects, skills & education, writing, now, contact); **visibility is config-toggled** — Yash curates what the public sees.
- Inspiration sites reviewed: brittanychiang.com (won), rpg-cv (gamified), saadarqam/sawad (moody), aanandmadhav (editorial, source of the "Now" panel idea).

## Architecture (the part Yash cares about most)

**Everything is data-driven** — his explicit requirement. No content in components; the app fetches `public/content/*` at runtime, validates with Zod (`src/lib/content.ts`), and renders whatever it finds.

- `site.config.json` — master switchboard. **Colour and typography are independent axes**: `theme.preset` picks a palette from `theme.presets` (**22 presets** — the classic editor schemes lifted from herdr.dev plus four originals; `tokyo-day` is the default) and `theme.style` picks a typography/surface treatment from `theme.styles` (`terminal` default, `modern`). Each palette is 8 fields (`appearance` + 7 colours); both axes are applied as CSS custom properties at runtime by `themeVariables()` in `src/lib/content.ts`. Also holds `sections` show/hide toggles, `features` (commandPalette, particles, mouseGlow, themePicker), `meta`.
- `src/components/ThemePicker.tsx` — the bottom-left theme pill (`t` to open, `↑`/`↓` to preview, `esc` to close), grouped Dark/Light with 3-dot swatches and a style toggle. Visitor choice persists in `localStorage` under `yc-theme-*`; a stored key that no longer exists in the config is ignored (see `resolvedPreset` in `App.tsx`). With the picker enabled the command palette shows one "Change theme…" entry instead of listing every theme.
- Components use `.heading`, `.surface`, `.rounded-theme`, `.rounded-chip` (defined in `src/index.css`) instead of hardcoded font-weight/tracking/radius classes — that is what makes the style switch work. Keep using them for new UI.
- `profile.json`, `experience.json`, `projects.json` (+ `content/projects/*.md` case studies), `skills.json`, `now.json`, `writing.json` (+ `content/writing/*.md`).
- Stack: Vite 7, React 19, TypeScript strict, Tailwind CSS 4 (`@tailwindcss/vite`, theme colors reference CSS vars), Framer Motion, React Router (BrowserRouter + 404.html fallback), Zod, marked.
- `vite.config.ts` has `base: "/"` (user-site repo). Node 22 locally.

## Gotchas learned this session

- The `github-pages` **environment protection rules** only allowed `master`/`coming-soon`; `main` had to be added via `POST /repos/.../environments/github-pages/deployment-branch-policies`. Done — but remember if deploys ever fail with "branch not allowed".
- Deep links return HTTP **404 status** but render correctly (SPA fallback) — expected, don't "fix".
- `*.tsbuildinfo` is gitignored (tsc -b artifacts).
- `.claude/launch.json` exists here (`npm run dev`, port 5173) and in the capstone repo (with `--prefix` pointing here) for the preview panel.
- ParticleField takes its accent from the active palette via context (not CSS var read) to avoid a mount race.
- **Yash edits these files between sessions.** Check `git log`/`git status` before rewriting any file wholesale — a `Write` to `site.config.json` once clobbered a `mouseGlow` flag he had added. Prefer targeted edits.

## Open items / natural next steps

- Yash was going to review the live site and request tweaks (wording, colors, section order, new theme presets).
- Content drafted by Claude that he may want to reword: hero tagline, about paragraphs, "Now" entries, the sample blog post (`how-this-site-works.md`), wheat-detection case study.
- Possible future: custom domain, OG image, more case studies (neural style transfer, capstone once finished), real blog posts, Lighthouse/a11y pass.
- Persistent memory of this project also exists in Claude Code's memory dir under the capstone project (`portfolio-website-project.md`, `yash-profile.md`).
