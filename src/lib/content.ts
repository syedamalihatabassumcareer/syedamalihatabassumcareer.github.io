// Sorted, ready-to-render queries over the content collections.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { researchStatuses } from '@/data/taxonomy';
import { byEndDesc } from './format';

export type Research = CollectionEntry<'research'>;
export type Project = CollectionEntry<'projects'>;

const statusRank = Object.fromEntries(researchStatuses.map((s, i) => [s.id, i]));

/** Published first, then accepted, under review, in progress; then by `order`. */
export async function getResearch(): Promise<Research[]> {
  const entries = await getCollection('research');
  return entries.sort(
    (a, b) =>
      statusRank[a.data.status] - statusRank[b.data.status] ||
      a.data.order - b.data.order ||
      a.data.title.localeCompare(b.data.title),
  );
}

export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects');
  return entries.sort((a, b) => a.data.order - b.data.order || byEndDesc(a.data, b.data));
}

export async function getExperience() {
  const entries = await getCollection('experience');
  // Career site: ordered by `order` (industry first), then newest first.
  return entries.sort((a, b) => a.data.order - b.data.order || byEndDesc(a.data, b.data));
}

export async function getEducation() {
  return (await getCollection('education')).sort((a, b) => a.data.order - b.data.order);
}

export async function getAwards() {
  return (await getCollection('awards')).sort((a, b) => a.data.order - b.data.order);
}

export async function getSkills() {
  return (await getCollection('skills')).sort((a, b) => a.data.order - b.data.order);
}

// Checked first so an empty Writing folder doesn't trigger a warning on every page.
const writingFiles = import.meta.glob('../content/writing/**/[^_]*.md');

export async function getWriting() {
  if (Object.keys(writingFiles).length === 0) return [];
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

export interface EvidenceLink {
  label: string;
  href: string;
  kind: 'Project' | 'Research' | 'Experience';
}

type Ref<C extends 'projects' | 'research' | 'experience'> = { collection: C; id: string };

/** Resolve skill evidence references; fails the build if one points nowhere. */
export async function resolveEvidence(usedIn?: {
  projects: Ref<'projects'>[];
  research: Ref<'research'>[];
  experience: Ref<'experience'>[];
}): Promise<EvidenceLink[]> {
  if (!usedIn) return [];
  const out: EvidenceLink[] = [];
  for (const ref of usedIn.projects) {
    const entry = await getEntry(ref);
    if (!entry) throw new Error(`Unknown project reference "${ref.id}" in skills.json`);
    out.push({ label: entry.data.short ?? entry.data.title, href: `#project-${entry.id}`, kind: 'Project' });
  }
  for (const ref of usedIn.research) {
    const entry = await getEntry(ref);
    if (!entry) throw new Error(`Unknown research reference "${ref.id}" in skills.json`);
    out.push({ label: entry.data.short ?? entry.data.shortTitle ?? entry.data.title, href: `#research-${entry.id}`, kind: 'Research' });
  }
  for (const ref of usedIn.experience) {
    const entry = await getEntry(ref);
    if (!entry) throw new Error(`Unknown experience reference "${ref.id}" in skills.json`);
    out.push({ label: entry.data.short ?? `${entry.data.role}, ${entry.data.organisation}`, href: `#${entry.id}`, kind: 'Experience' });
  }
  return out;
}
