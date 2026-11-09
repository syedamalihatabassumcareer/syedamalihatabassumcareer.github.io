# Syeda Maliha Tabassum — Career Portfolio

Industry-facing portfolio site, written for recruiters and hiring managers. Static
[Astro](https://astro.build) + TypeScript, hosted on GitHub Pages. No server, database,
tracking or API keys.

- **One scrolling page, ordered for recruiters:** Home `#home` → About & Core capabilities
  `#about` → Experience `#experience` → Projects & impact `#projects` → Education & Awards
  `#education` / `#recognition` → Publications `#research` → Contact `#contact`.
- **Projects show impact:** each project has a challenge, what was built, and "Why it
  matters" lines (business value / social impact) with related UN Sustainable Development
  Goals — set in the `impact` field of `src/content/projects/<id>.md`. Impact lines describe
  what the work was built to do; never add numbers or outcomes the source doesn't state.
- **Design:** light-first, in Grameenphone's brand blues (#19AAF8 / #0078CF) with green
  (#1ABE51) as the second accent, and a dark theme on the toggle. Lato type, subtle reveals,
  and no motion for visitors who prefer reduced motion.
- **Features:** light/dark theme (remembers the choice), project category filters,
  copy email, click-to-load video demos, image gallery with lightbox. The CV download is
  off until an industry résumé is added (see "Update the CV").

---

## 1. Run it on your computer

### Requirements

- **Node.js 22.23.4 or newer — Node 24 LTS recommended.** Check with `node --version`
  (this computer has Node 24.22.2, which is fine).

### Commands

Run these in the project folder (`G:\My portfolio`):

| Command           | What it does                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| `npm install`     | Install dependencies (first time, or after changing `package.json`).      |
| `npm run dev`     | Start the live preview at <http://localhost:4321/> — updates as you edit. |
| `npm run build`   | Build the production site into `dist/`.                                   |
| `npm run preview` | Serve the built `dist/` at <http://localhost:4321/> to check it.          |
| `npm run check`   | Type-check all code and content.                                          |
| `npm test`        | Test the last build (links, base path, privacy, publication status).      |
| `npm run verify`  | Build for **both** GitHub Pages URL shapes and run all tests on each.     |

Stop a running server with `Ctrl + C`.

> Astro's command-line tool sends anonymous usage statistics by default. To turn that off on
> your machine, run `npx astro telemetry disable` once. (The deployed website itself contains
> no analytics or trackers.)

---

## 2. Edit the content

All facts live in content files — you never need to touch the page code to update them.
Every file is validated when you run `npm run dev`/`build`; a missing or misspelt field stops
the build with a message naming the file.

| To change…                                   | Edit                                                                                     |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Name, headline, intro, email, profile links  | `src/data/profile.ts`                                                                    |
| A publication / manuscript / ongoing project | `src/content/research/<id>.md`                                                           |
| A project case study                         | `src/content/projects/<id>.md`                                                           |
| Jobs, research and teaching roles            | `src/data/experience.json`                                                               |
| Degrees and results                          | `src/data/education.json`                                                                |
| English test scores (IELTS)                  | `src/data/language-tests.ts`                                                             |
| Awards and competitions                      | `src/data/awards.json`                                                                   |
| Skills and where they were used              | `src/data/skills.json`                                                                   |
| Topic, category and status names             | `src/data/taxonomy.ts`                                                                   |
| Top-bar sections (labels, order)             | `src/data/navigation.ts`                                                                 |
| About section text                           | `src/components/sections/About.astro`                                                    |
| Layout of any section                        | `src/components/sections/<Section>.astro` (order in `src/pages/index.astro`)            |
| "Open to industry roles" line                 | `availability` in `src/data/profile.ts` (`null` hides it everywhere)                     |
| Colours, fonts, spacing                      | `src/styles/global.css` (colours), `astro.config.mjs` (fonts)                             |

The file name becomes the entry's link on the page: `src/content/research/camdet.md` →
`#research-camdet`, and `src/content/projects/weheal.md` → `#project-weheal`.

### Add a research entry

Create `src/content/research/my-paper.md`:

```markdown
---
title: Full Paper Title
shortTitle: Shorter title for lists and links   # optional
status: under-review          # published | accepted | under-review | in-progress
type: journal-article         # conference-paper | journal-article | systematic-review | research-project
topics: [reliable-ai, health] # ids from src/data/taxonomy.ts
summary: One or two sentences describing the work.
submittedTo: Journal Name     # under-review only — this is NOT an acceptance
featured: false               # true = may appear on the home page
order: 5                      # position within its status group
---

Optional longer description in Markdown (shown on the entry's own page).
```

The build **refuses** inconsistent status data — for example a DOI on unpublished work, a
`venue` on an under-review manuscript, or BibTeX without a full published record. When a
paper is published, change `status: published` and add `venue`, `venueShort`, `year`,
`authors` (complete, in order), `publisher`, `pages`, `doi`, `citation` and, optionally,
`bibtex`. See `src/content/research/gesture-virtual-keyboard-mouse.md` as the model.

### Add a project, screenshots, diagrams or a video

Copy an existing file in `src/content/projects/`. Media is optional and only shown when it
exists:

1. Put images in `src/assets/projects/<project-id>/` (PNG/JPG/WebP — Astro optimises them).
2. Reference them in the project's front matter. `cover` is the image on the project card
   (16:9 works best); without one, the card shows an abstract decorative graphic. `media`
   items appear inside the "Explore project" panel:

```yaml
cover:
  src: ../../assets/projects/aruco-service-bot/demo-frame.jpg
  alt: The service bot on a grey floor with a gripper arm and a printed ArUco marker
  credit: Frame from the demo video published by Reshad Ul Karim   # optional
media:
  - type: image
    src: ../../assets/projects/aruco-service-bot/robot.jpg
    alt: The service bot driving over gravel toward an ArUco marker
    caption: Field test on mixed terrain        # optional
  - type: youtube
    videoId: WJUcASlT_to                         # the part after watch?v=
    title: Service bot demo
    hostedBy: Reshad Ul Karim                    # if it's on someone else's channel
  - type: video                                  # a video file hosted with the site
    src: media/projects/voltscope/oscilloscope-and-leds.mp4   # file in public/media/…
    poster: ../../assets/projects/voltscope/poster-oscilloscope.jpg
    title: VoltScope running
    orientation: portrait                        # for phone-recorded vertical clips
```

Images get a gallery with an accessible lightbox. YouTube videos use a privacy-friendly player
that loads nothing from YouTube until the visitor presses Play. Video files never autoplay and
are only downloaded when played. Keep them small: compress before adding, e.g.
`ffmpeg -i in.mp4 -an -vf scale=720:-2 -c:v libx264 -crf 26 -movflags +faststart out.mp4`
(`-an` removes the sound).

**Dates and course.** `start`/`end` (YYYY-MM) are optional. When only the term is known, use
`period: Spring 2024`; projects without either simply show no date. `course: CSE423 · Computer
Graphics` appears in the project's panel.

**Animated card scenes.** Instead of a `cover`, a project can show a code-drawn, animated 3D
scene on its card with `scene:` — `arena` (Rakkhosh Must Die), `wearable` (health monitor),
`robot` (PathGuard), `network` (healthcare network), `terminal` (ProCV), `clinic` (WeHeal) or
`match` (Matrimonial Hub). Real photos and
screenshots stay in `media` and appear in the panel's gallery. The scenes live in
`src/components/covers/` (and `GameCover.astro`); motion stops for visitors who prefer reduced
motion.

Credit collaborators in `credits:` and mark links on someone else's account with `hostedBy:`.
Anything written below the closing `---` (for example a `## My role` section) appears in the
project's panel.

### Recognition: highlight card, certificates, photos and links

Awards live in `src/data/awards.json`. An award with `"featured": true` is shown as the large
highlight card on the left (laurel badge, year · category pill, the result as its title); it stays
in view while the list scrolls. Every other award is a compact row in the glass panel beside it.
All of them can carry a certificate, a photo and links.

**Certificate.** Add a `document` with a Google Drive share link:

```json
{
  "id": "deans-vc-list",
  "title": "Dean’s List and Vice Chancellor’s List",
  "document": { "url": "https://drive.google.com/file/d/FILE_ID/view?usp=sharing" },
  ...
}
```

The award then shows **View certificate** (an in-page preview, with **Open in Google Drive**
for downloading) and **Open in Drive** (goes straight to the file). In Drive, set sharing to
**Anyone with the link → Viewer**, or visitors will see an access error. Optional:
`"label": "View letter"` changes the button text.

**Photos.** Save photos in `src/assets/awards/` and list them with alt text:

```json
"photos": [
  { "file": "urc-2025-team.jpg", "alt": "The team standing in a line …" },
  { "file": "urc-2025-rover.jpg", "alt": "The rover on desert terrain …" }
]
```

(A single photo named after the award's `id`, e.g. `excelerate.jpg`, with `"photoAlt"`, also
works.) On the highlight card the photos fill the bottom; in the list the first one appears as a
thumbnail. Clicking opens a larger preview in the page.

**Links.** `"role": { "experience": "mongoltori-mars-rover", "label": "Rover team role" }` links
to an Experience entry on this page. `"links": [{ "label": "Results", "url": "https://…",
"kind": "website" }]` adds external links (opened in a new tab).

**Highlight card extras.** `"badge": "8th"` (7 characters at most) goes inside the laurel;
`"team": "BRACU Mongol Tori"` adds "with …" to the subtitle. `"date"` may be `"2025"` when the
month isn't known.

### Photos for an Experience entry

Put them in `src/assets/experience/<experience id>/` and list them in
`src/data/experience.json`:

```json
"photos": [
  { "file": "team.jpg", "alt": "Five NEXTERN interns …" }
]
```

They appear as a row of thumbnails under the entry; clicking opens a viewer with previous/next.

### Change your photos

Two transparent cut-outs are used:

| Where | File | Made from |
| --- | --- | --- |
| Hero (top of page) | `src/assets/portrait-cutout.png` | `Formal picture in suit.jpg` |
| About (on the arch, in colour) | `src/assets/about-portrait.png` | `890187627_…_n.jpg` |

`scripts/make-portrait-cutout.py` removes the background with an AI matting model
(BiRefNet-portrait, which handles hair precisely), cleans the background's colour out of the
hair edges, and fades the bottom edge. With `--no-enhance` (used for the hero) the photo's own
colours and detail are left exactly as they are; without it, a gentle sharpen/contrast boost is
applied. Its tools stay out of the project in a throwaway Python environment:

```bash
python -m venv .venv-photo
.venv-photo\Scripts\pip install "rembg[cpu]" opencv-python-headless
.venv-photo\Scripts\python scripts/make-portrait-cutout.py "Formal picture in suit.jpg" src/assets/portrait-cutout.png --max-width 1600 --fade 0.16 --no-enhance
.venv-photo\Scripts\python scripts/make-portrait-cutout.py "my-about-photo.jpg" src/assets/about-portrait.png --max-width 1100 --fade 0.08
```

The first run downloads the model (about 900 MB). Any background works. Alt text for both
photos is in `src/data/profile.ts` (`portrait`, `aboutPortrait`). `.venv-photo/` is
git-ignored.

### Profile links (LinkedIn, GitHub, Google Scholar, ORCID, ResearchGate)

Add an entry to `links` in `src/data/profile.ts`:

```ts
{ label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=…', handle: 'Google Scholar', icon: 'scholar' },
```

Icons available: `linkedin`, `github`, `scholar`, `orcid`, `researchgate`, `mail`, `link`. Links
appear in the hero, footer and Contact automatically; Scholar, ORCID and ResearchGate also appear
on the Research card in About.

### Update the CV

The public CV is `public/cv/Syeda-Maliha-Tabassum-CV.pdf` — a **redacted** copy without your
phone number or referees. Never put the original CV in `public/`. To regenerate it from a new
CV (needs Python with `pip install pymupdf`):

```bash
python scripts/make-public-cv.py "Maliha_Updated_Resume___PHD.pdf" public/cv/Syeda-Maliha-Tabassum-CV.pdf
```

The script removes phone-number lines and the whole REFERENCES section, then verifies the
result and stops with an error if anything private remains. Open the PDF to check it looks
right. To hide all CV buttons instead, set `cv: null` in `src/data/profile.ts`.

### Write articles (optional)

Add Markdown files to `src/content/writing/`:

```markdown
---
title: What calibration tells you that accuracy doesn't
description: One-sentence summary for the list and search engines.
published: 2026-11-01
tags: [calibration]
draft: false
---

Your article…
```

The `/writing/` page and the "Writing" navigation link appear automatically once at least
one non-draft post exists. With no posts, no Writing pages are built. (You'll see one harmless
build warning, "No files found … writing", until then.)

### Social sharing image

`public/og/default.png` is the preview image shown when the site is shared. It's generated
from `scripts/social-card.html` — instructions are at the top of that file.

---

## 3. Deploy to GitHub Pages

You'll need a free GitHub account. Below, replace **`<username>`** with your GitHub username
and **`<repository>`** with the repository name you choose. Nothing here has been published
yet.

### Choose your address

| Repository name          | Site address                                 |
| ------------------------ | -------------------------------------------- |
| `<username>.github.io`   | `https://<username>.github.io/` (recommended) |
| anything else, e.g. `portfolio` | `https://<username>.github.io/portfolio/` |

**You don't need to change any configuration for either option.** The deploy workflow asks
GitHub for the real address and base path at build time and passes them in
(`SITE_URL`/`BASE_PATH`). These feed `site.config.mjs`, the single place they are defined.
Every link, asset, the CV download, canonical URL and sitemap use them.

### Step by step

1. **Create the repository.** On github.com click **+ → New repository**. Name it
   `<username>.github.io` (or e.g. `portfolio`). Choose **Public** (GitHub Pages on a free plan
   needs a public repository). Don't add a README or .gitignore — this project has them.
2. **Commit and push the source.** In a terminal in this folder:

   ```bash
   git init
   git add .
   git status            # check: Maliha_Updated_Resume___PHD.pdf must NOT be listed
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<username>/<repository>.git
   git push -u origin main
   ```

   The private original CV is excluded by `.gitignore`; `git status` lets you confirm it.
   (GitHub Desktop also works: *Add local repository* → this folder → *Publish repository*.)
3. **Turn on Pages.** In the repository: **Settings → Pages → Build and deployment →
   Source: GitHub Actions**.
4. **Watch the deployment.** Open the **Actions** tab. The *Deploy to GitHub Pages* workflow
   runs on every push to `main` (re-run it from the Actions tab with **Run workflow** if it
   started before step 3). It type-checks, builds, runs the tests, then deploys. A green tick
   means it's live.
5. **Find your URL.** Click the finished run → the **deploy** job shows the link, as does
   **Settings → Pages** ("Your site is live at …").

### Updating the site later

Edit content, check it with `npm run dev`, then:

```bash
git add .
git commit -m "Add new publication"
git push
```

Every push to `main` rebuilds and redeploys automatically (about 1–2 minutes).

### Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| Site shows the README or a blank page | Settings → Pages → Source must be **GitHub Actions**, not "Deploy from a branch". |
| Page loads without styling, images or fonts (project site) | An asset path is missing the base path. Always build links with `withBase()` from `src/lib/url.ts`. `npm run verify` catches this. |
| 404 on a page that should exist | Internal links must end with `/` (e.g. `research/camdet/`). Check the content file name matches the link. |
| Workflow fails at "Install dependencies" | Commit `package-lock.json` along with `package.json`. |
| Workflow fails at "Build" with a content error | The message names the file and field — fix the front matter or JSON there. |
| Workflow fails at "deploy" with a permissions error | Settings → Pages source must be GitHub Actions; for organisation repos, Pages must be allowed in the organisation settings. |
| Old version still showing | Wait a minute and hard-refresh (`Ctrl + F5`); check the latest Actions run succeeded. |

**Custom domain later?** Add it in Settings → Pages → Custom domain. The workflow picks up
the new address automatically on the next deploy.

### Testing a project-site build locally (Windows note)

`npm run verify` already builds and tests the `/<repository>/` shape for you. If you set
`BASE_PATH` by hand in **Git Bash**, prefix the command with `MSYS_NO_PATHCONV=1`. Otherwise
Git Bash rewrites `/portfolio` into a Windows path. PowerShell is unaffected:
`$env:BASE_PATH='/portfolio'; npm run build`.

---

## 4. How it's organised

```
.github/workflows/deploy.yml  GitHub Pages build + deploy
site.config.mjs               Site URL and base path (one place)
astro.config.mjs              Astro settings, fonts (Lato, JetBrains Mono), sitemap
public/                       Files copied as-is: CV, favicon, social image
scripts/                      CV redaction, social card template, verify script
src/assets/                   Images that Astro optimises (project photos, portrait)
src/content/                  Research, projects, writing (Markdown)
src/data/                     Profile, experience, education, awards, skills, vocabularies
src/content.config.ts         Schemas that validate all content
src/components/sections/      The page sections: Hero, About (+ skills), Research, Projects,
                              Experience, Education (& recognition), Contact
src/components/               Reusable pieces (research row, filters, citation, video…)
src/layouts/BaseLayout.astro  <head>, header, footer, theme script
src/pages/index.astro         The single page
src/pages/…                   Redirects for old URLs, 404, optional Writing
src/scripts/                  Small client-side scripts (theme, menu, expanders, filters)
src/styles/global.css         Design tokens and shared styles
tests/                        Build-output tests (node:test, no extra dependencies)
CONTENT_TODO.md               Missing information and editorial decisions to review
CLAUDE.md                     Conventions for editing this project with Claude Code
```

