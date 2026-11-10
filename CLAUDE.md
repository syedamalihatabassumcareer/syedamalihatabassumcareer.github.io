# CLAUDE.md — working on this portfolio

Static Astro 7 + TypeScript **career portfolio** for **Syeda Maliha Tabassum**, written for
recruiters and hiring managers, deployed to GitHub Pages from the
`syedamalihatabassumcareer` account. README.md has setup, editing and deployment
instructions; CONTENT_TODO.md lists open content questions.

## Commands

- `npm run dev` — live preview at http://localhost:4321/
- `npm run check` — type-check code and content schemas
- `npm run build` then `npm test` — build and test the output
- `npm run verify` — build for root AND `/portfolio-test/` base paths and test both (run before
  declaring work done)
- Requires Node ≥ 22.23.4 (Node 24 LTS).

## Links and profiles

Only LinkedIn and email are listed as profiles (owner's choice). Don't add other profile,
repository or CV links unless the owner asks for them. Commits use the
`syedamalihatabassumcareer` noreply e-mail.

## Factual-content safeguards (most important)

The owner's CV and information she gives directly are the **only** factual sources.

- **Never invent** metrics, results, impact, deployment claims, users, publication outcomes,
  acceptances, leadership roles, awards, endorsements or team sizes.
- **Leadership is shown through behaviours.** The owner held no formal leadership title;
  `src/data/leadership.ts` only cites documented facts. Never write "led", "managed" or
  "headed" unless she supplies such a role.
- **Impact framing is purpose, not outcome.** The project `impact` lines say what the work was
  built to do and who it serves; they never claim measured results, adoption or savings unless
  the owner supplies them. SDG tags are a relevance mapping, not a claim of impact.
- **Never overstate the owner's contribution.** She is 4th of 6 authors on the JCSSE paper. Don't
  write "led", "managed", "designed the architecture" etc. unless she says so.
- **Publication status is exact.** `under-review` means submitted, not accepted. A submission
  venue goes in `submittedTo`, never `venue`. Don't add DOIs, page numbers, citations or
  BibTeX to unpublished work — the schema in `src/content.config.ts` rejects this.
- **Author lists only for published work.** Don't add co-authors to under-review or
  in-progress entries.
- Repos under `Reshad-Ul-Karim` are a collaborator's; credit them with `hostedBy`, never
  present them as hers.
- **Private data never ships:** no phone numbers, home address, referee names or contacts,
  signatures. `tests/privacy.test.mjs` enforces this.
- **No visitor-facing placeholders** ("coming soon", "lorem", "TBD"). Missing info goes in
  CONTENT_TODO.md and the UI simply omits it.
- **Media only when real:** no stock photos, no fabricated screenshots or portraits.
- **Grameenphone:** the site uses Grameenphone's brand colours, but never its logo, name styling
  or anything that suggests the site is affiliated with or endorsed by Grameenphone.
- When unsure whether something is supported by the source, leave it out and add a question to
  CONTENT_TODO.md.

## Conventions

- **Base path:** every internal link and `/public` asset goes through `withBase()` from
  `src/lib/url.ts`. Never hard-code `/…` hrefs. Page links end with `/`
  (`trailingSlash: 'always'`). Site URL/base live only in `site.config.mjs`.
- **Strictly one page**, aimed at Management Trainee programmes: `#home #about (#skills)
  #leadership #experience #projects #education (#recognition) #research #contact` (ids must match
  `src/data/navigation.ts`). Extra detail goes in inline expanders: research rows
  (`#research-<id>`) and project panels (`#project-<id>`).
- **Expanders:** `button[data-expander-toggle][aria-controls]` + `.expander[data-expander] >
  .expander-inner`. Panels render open (readable without JS); `src/scripts/site.ts` collapses
  them.
- **Visual language:** light-first, Grameenphone blues (`#19AAF8`, `#0078CF`), purple
  (`--purple`) and green (`--green`) accents, layered tinted shadows and coloured card tops, ink `#1A1A1A` on white / pale blue-grey; dark theme only via the
  toggle. Contrast comes from colour-blocking: full-bleed deep-blue `.brand-band` sections
  (hero, Core capabilities, Leadership, Contact, footer) between white ones. `.brand-band`
  sets `color-scheme: dark`, so every `light-dark()` token inside resolves to its on-dark
  value. Section headings are left-aligned and numbered (`SectionHeading` `num`/`kicker`). Accent fills carry `--on-accent` text; accent *text* uses `--accent-text`. Lato +
  JetBrains Mono. Reuse tokens in `src/styles/global.css` instead of one-off colours, and check
  WCAG AA contrast in both themes.
- **Content first:** facts belong in `src/content/**` (Markdown) or `src/data/**`
  (JSON/TS), validated by `src/content.config.ts`. Vocabularies are in `src/data/taxonomy.ts`.
- **JavaScript is progressive enhancement.** Everything must read and navigate with JS off.
- **Motion:** opacity/transform only, everything inside
  `@media (prefers-reduced-motion: no-preference)`. No scroll hijacking or autoplay.
- **CSS minifier quirk:** never put `translate`, `scale` or `rotate` in the same rule as a
  fixed `transform` — the production minifier drops them. `tests/css.test.mjs` checks this.
- **Accessibility:** semantic landmarks, one `<h1>`, visible focus, 44px touch targets,
  `rel="noopener noreferrer"` on `target="_blank"` links.
- **No new dependencies, analytics, trackers, third-party embeds that load before user
  action, forms or databases** without the owner's explicit request.
- **Windows/Git Bash:** prefix commands that set `BASE_PATH=/…` with `MSYS_NO_PATHCONV=1`.

## Don't

- Don't push to GitHub or deploy unless asked.
- Don't delete content entries without being asked; set `featured: false` instead.
