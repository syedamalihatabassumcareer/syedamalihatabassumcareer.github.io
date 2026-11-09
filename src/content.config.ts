// Typed content collections. Every content file is validated against these
// schemas at build time, so a typo or a missing required field fails the build
// instead of silently publishing wrong information.
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  awardCategories,
  experienceKinds,
  ids,
  projectCategories,
  researchStatuses,
  researchTopics,
  researchTypes,
} from './data/taxonomy';

/** Month precision dates: "2026-09". */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM, e.g. 2026-09');

const link = z.object({
  label: z.string(),
  /** A full URL, or a file published with the site: "reports/<name>.pdf" (in public/). */
  url: z.union([z.url(), z.string().regex(/^reports\/[\w.-]+\.pdf$/, 'Use a full URL or reports/<file>.pdf')]),
  kind: z.enum(['repository', 'website', 'video', 'report', 'paper', 'doi', 'other']),
  /** Set when the link lives on someone else's account, e.g. "Reshad Ul Karim (collaborator)". */
  hostedBy: z.string().optional(),
});

// ── Research & publications ────────────────────────────────────────────────
const research = defineCollection({
  loader: glob({ base: './src/content/research', pattern: '**/[^_]*.md' }),
  schema: z
    .object({
      title: z.string(),
      shortTitle: z.string().optional(),
      /** Very short name for compact links, e.g. "CAMDet", "LUMENAA". */
      short: z.string().optional(),
      status: z.enum(ids(researchStatuses)),
      type: z.enum(ids(researchTypes)),
      topics: z.array(z.enum(ids(researchTopics))).min(1),
      /** One or two sentences, taken from the CV. Shown in lists and as the page lead. */
      summary: z.string(),
      year: z.number().int().optional(),
      /** Complete author list exactly as published. Leave empty if unknown. */
      authors: z.array(z.string()).default([]),
      /** Where the work appeared (published / accepted only). */
      venue: z.string().optional(),
      /** Short venue label for compact displays, e.g. "JCSSE 2026". */
      venueShort: z.string().optional(),
      /** Where a manuscript is under review. This is NOT an acceptance. */
      submittedTo: z.string().optional(),
      publisher: z.string().optional(),
      pages: z.string().optional(),
      doi: z.string().optional(),
      /** Full reference text used by the "Copy citation" button. */
      citation: z.string().optional(),
      /** Only provide when the bibliographic record is complete. */
      bibtex: z.string().optional(),
      links: z.array(link).default([]),
      featured: z.boolean().default(false),
      /** Lower numbers appear first within the same status group. */
      order: z.number().default(100),
    })
    .superRefine((entry, ctx) => {
      const issue = (message: string) => ctx.addIssue({ code: 'custom', message });
      const isOut = entry.status === 'published' || entry.status === 'accepted';
      if (isOut && (!entry.venue || !entry.year || entry.authors.length === 0)) {
        issue(`"${entry.status}" work needs venue, year and the complete author list.`);
      }
      if (!isOut && entry.venue) {
        issue('Only published/accepted work may have a `venue`. Use `submittedTo` for submissions.');
      }
      if (entry.status === 'under-review' && !entry.submittedTo) {
        issue('Under-review work needs `submittedTo`.');
      }
      if (entry.status !== 'under-review' && entry.submittedTo) {
        issue('`submittedTo` is only for under-review work.');
      }
      if (entry.status !== 'published' && (entry.doi || entry.pages)) {
        issue('A DOI or page range is only valid for published work.');
      }
      if (entry.bibtex && !(entry.status === 'published' && entry.doi && entry.citation)) {
        issue('Offer BibTeX only for published work with a DOI and a full citation.');
      }
    }),
});

// ── Projects ───────────────────────────────────────────────────────────────
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/[^_]*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Very short name for compact links, e.g. "WeHeal". */
      short: z.string().optional(),
      /** One-line description for lists. */
      tagline: z.string(),
      /** Fuller description, taken from the CV. */
      summary: z.string(),
      /** Dates are optional: shown only when documented. */
      start: yearMonth.optional(),
      end: yearMonth.optional(),
      /** Academic term when exact months aren't documented, e.g. "Spring 2024". */
      period: z.string().optional(),
      /** Course the project was built for, e.g. "CSE423 · Computer Graphics". */
      course: z.string().optional(),
      categories: z.array(z.enum(ids(projectCategories))).min(1),
      /** Technologies named in the source material — do not pad this list. */
      technologies: z.array(z.string()).default([]),
      links: z.array(link).default([]),
      /**
       * Animated, code-drawn 3D scene for the project card (decorative). Takes
       * the place of `cover` on the card; real images stay in `media`.
       */
      scene: z.enum(['arena', 'wearable', 'robot', 'network', 'terminal', 'clinic', 'match']).optional(),
      /** Real image shown on the project card (photo, screenshot, video frame). */
      cover: z
        .object({
          src: image(),
          alt: z.string().min(1),
          /** e.g. "Frame from the demo video by Reshad Ul Karim". */
          credit: z.string().optional(),
        })
        .optional(),
      /**
       * Real media only. Images go in src/assets/projects/<project>/ and are
       * optimised automatically; YouTube videos use a click-to-load player.
       */
      media: z
        .array(
          z.discriminatedUnion('type', [
            z.object({
              type: z.literal('image'),
              src: image(),
              alt: z.string().min(1),
              caption: z.string().optional(),
            }),
            z.object({
              /** A video file in public/ (path without the base, e.g. "media/projects/x/demo.mp4"). Never autoplays. */
              type: z.literal('video'),
              src: z.string().regex(/^media\/[\w./-]+\.(mp4|webm)$/),
              poster: image(),
              title: z.string(),
              caption: z.string().optional(),
              /** "portrait" for phone-recorded vertical clips. */
              orientation: z.enum(['landscape', 'portrait']).default('landscape'),
            }),
            z.object({
              type: z.literal('youtube'),
              videoId: z.string().regex(/^[\w-]{11}$/),
              title: z.string(),
              caption: z.string().optional(),
              hostedBy: z.string().optional(),
            }),
          ]),
        )
        .default([]),
      /**
       * Why the project matters, for a business audience. `challenge` is the
       * problem in general terms; each `value` line says what the work was
       * built to do (purpose, not a measured result — never add numbers or
       * outcomes the source doesn't state). `sdgs` lists the UN Sustainable
       * Development Goals the project relates to (1–17).
       */
      impact: z
        .object({
          challenge: z.string(),
          value: z.array(z.object({ kind: z.enum(['business', 'social']), text: z.string() })).min(1),
          sdgs: z.array(z.number().int().min(1).max(17)).default([]),
        })
        .optional(),
      /** Team credits. Only list people documented in the source material. */
      credits: z.array(z.string()).default([]),
      relatedResearch: z.array(reference('research')).default([]),
      featured: z.boolean().default(false),
      order: z.number().default(100),
    }),
});

// ── Experience, education, awards, skills (JSON data files) ────────────────
const experience = defineCollection({
  loader: file('src/data/experience.json'),
  schema: z.object({
    id: z.string(),
    role: z.string(),
    /** Very short name for compact links, e.g. "Data Structures TA". */
    short: z.string().optional(),
    organisation: z.string(),
    unit: z.string().optional(),
    kind: z.enum(ids(experienceKinds)),
    start: yearMonth,
    end: yearMonth.optional(),
    highlights: z.array(z.string()).min(1),
    /** Photos in src/assets/experience/<id>/ (file name + alt text), shown as a gallery. */
    photos: z.array(z.object({ file: z.string(), alt: z.string().min(1), caption: z.string().optional() })).default([]),
    order: z.number().default(100),
  }),
});

const education = defineCollection({
  loader: file('src/data/education.json'),
  schema: z.object({
    id: z.string(),
    qualification: z.string(),
    field: z.string().optional(),
    institution: z.string(),
    start: yearMonth,
    end: yearMonth,
    result: z.object({ label: z.string(), value: z.string(), scale: z.string() }).optional(),
    /** Graduation honours, e.g. "Highest Distinction" (owner-supplied). */
    honours: z.string().optional(),
    order: z.number().default(100),
  }),
});

const awards = defineCollection({
  loader: file('src/data/awards.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    /** e.g. "Top 6 Finalist", "Second Runner-Up" — exactly as documented. */
    result: z.string().optional(),
    organiser: z.string(),
    category: z.enum(ids(awardCategories)),
    start: yearMonth.optional(),
    /** "2025-12", or just the year ("2025") when the month isn't documented. */
    date: z.union([yearMonth, z.string().regex(/^\d{4}$/, 'Use YYYY-MM or YYYY')]),
    /** Shown as the large highlight card beside the list (laurel badge, photo). */
    featured: z.boolean().default(false),
    /** The team the result was achieved with, e.g. "BRACU Mongol Tori". */
    team: z.string().optional(),
    /** Her role on this site connected to the award (links to #<experience id>). */
    role: z
      .object({
        experience: reference('experience'),
        label: z.string(),
      })
      .optional(),
    /** Other public pages about the award (results page, news post …). */
    links: z.array(link).default([]),
    /**
     * Certificate or proof. A Google Drive share link ("…/file/d/<id>/view")
     * opens in an in-page preview; visitors can open it in Drive to download.
     */
    document: z
      .object({
        url: z.url(),
        label: z.string().default('View certificate'),
      })
      .optional(),
    /** Short text inside the laurel badge, e.g. "Top 6". Without it the badge shows an icon. */
    badge: z.string().max(7).optional(),
    /**
     * Alt text for the card photo. The photo itself is a file named after the
     * award's id in src/assets/awards/ (e.g. excelerate.jpg).
     */
    photoAlt: z.string().optional(),
    /** Several photos: files in src/assets/awards/ with alt text. Takes precedence over <id>.jpg. */
    photos: z.array(z.object({ file: z.string(), alt: z.string().min(1) })).default([]),
    order: z.number().default(100),
  }),
});

const evidence = z.object({
  projects: z.array(reference('projects')).default([]),
  research: z.array(reference('research')).default([]),
  experience: z.array(reference('experience')).default([]),
});

const skills = defineCollection({
  loader: file('src/data/skills.json'),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    description: z.string(),
    items: z.array(
      z.object({
        name: z.string(),
        /** Where this skill is visibly used. Leave empty rather than guess. */
        usedIn: evidence.optional(),
      }),
    ),
    order: z.number().default(100),
  }),
});

// ── Writing (optional) ─────────────────────────────────────────────────────
// Add Markdown files to src/content/writing/ to publish articles. The Writing
// page and its navigation link appear automatically once a post exists.
const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { research, projects, experience, education, awards, skills, writing };
