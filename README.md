# yash-choudhary.github.io

Personal portfolio — a React + TypeScript single-page app where **all content is
streamed at runtime from a JSON/Markdown content store**. Updating the site never
means touching HTML or components: edit a file in `public/content/`, push, done.

## Editing content (the part you'll actually use)

Everything lives in [`public/content/`](public/content/):

| File | Controls |
|---|---|
| `site.config.json` | **Section show/hide toggles**, **theme presets & colors**, command palette & particles on/off, footer note |
| `profile.json` | Name, headline, tagline, hero log-line, about paragraphs, email, socials, resume path |
| `experience.json` | Work history (role, dates, bullets, tags) |
| `projects.json` | Project cards — set `"featured": true` for the top grid, add a `"caseStudy"` path for a full write-up page |
| `skills.json` | Skill groups, education, highlights/awards |
| `now.json` | The "Now" panel — update `updated` and the entries whenever life changes |
| `writing.json` | Blog post index; posts themselves are Markdown in `content/writing/` |

Hide any section from the public site in `site.config.json`:

```json
"sections": { "writing": false, ... }
```

### Theming

Colour and typography are **two independent switches**, so any palette works
with any style:

```json
"theme": { "preset": "tokyo-day", "style": "terminal", ... }
```

- **`preset`** picks a colour palette from `theme.presets` — **22 ship by
  default**: the classic editor schemes (tokyo night/day, catppuccin mocha &
  latte, dracula, nord, gruvbox ± light, one dark/light, solarized ± light,
  kanagawa & lotus, rose pine & dawn, vesper, pure terminal) plus the four
  originals (midnight teal/violet, deep ocean amber, paper light).
- **`style`** picks a typography/surface treatment from `theme.styles`:
  `terminal` (monospace headings at regular weight, tight tracking, hairline
  borders, small radii) or `modern` (bold sans headings, rounder surfaces).

**Adding a theme** — copy any entry in `theme.presets` and change the values:

```json
"my-theme": {
  "appearance": "dark",      // groups it under Dark / Light in the picker
  "accent": "#ff8800",
  "background": "#101014",
  "panel": "#17171d",
  "line": "#2a2a33",
  "headingText": "#f2f2f7",
  "bodyText": "#c7c7d1",
  "mutedText": "#7b7b8a"
}
```

It appears in the picker immediately — no code changes.

**The theme picker** is the pill in the bottom-left corner. Click it or press
`t`, then click a theme or use `↑`/`↓` to preview each one live; `esc` closes.
The bottom row switches the typography style. A visitor's choice is remembered
in `localStorage`, so it survives reloads; until they pick one, they see
whatever `site.config.json` specifies. Turn the whole thing off with
`"features": { "themePicker": false }` — theme commands then move back into the
command palette.

The JSON is validated with Zod on load — a typo shows a clear error screen in
dev instead of silently rendering a broken page.

To update the resume, replace `public/Yash_Choudhary_Resume.pdf`.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and deploys it to GitHub Pages.

One-time setup on the repo (github.com/yash-choudhary/yash-choudhary.github.io):
**Settings → Pages → Source → GitHub Actions**.

Note: `vite.config.ts` has `base: "/"` because this deploys to the user site.
If deploying to a project repo instead, change it to `"/<repo-name>/"`.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · React Router ·
Zod · marked
