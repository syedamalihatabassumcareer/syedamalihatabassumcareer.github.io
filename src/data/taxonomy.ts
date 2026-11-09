// Shared vocabularies used by the content schemas, filters and labels.
// Add a new value here first, then use its `id` in content files.

export const researchStatuses = [
  {
    id: 'published',
    label: 'Published',
    note: 'Peer-reviewed and published.',
  },
  {
    id: 'accepted',
    label: 'Accepted',
    note: 'Accepted for publication; not yet in print.',
  },
  {
    id: 'under-review',
    label: 'Under review',
    note: 'Submitted for peer review. A submission venue is not an acceptance.',
  },
  {
    id: 'in-progress',
    label: 'In progress',
    note: 'Ongoing research. Results have not been published.',
  },
] as const;

export type ResearchStatus = (typeof researchStatuses)[number]['id'];

export const researchTopics = [
  {
    id: 'reliable-ai',
    label: 'Reliable & calibrated AI',
    blurb:
      'When a model should commit and when it should abstain — identifiability, calibration, uncertainty and interpretable evaluation.',
  },
  {
    id: 'perception',
    label: 'Vision & 3D perception',
    blurb:
      'Monocular metric 3D detection across cameras, scene geometry, segmentation, pose and spatial–temporal scene understanding.',
  },
  {
    id: 'health',
    label: 'Health & biomedical AI',
    blurb:
      'Functional-connectome classifiers, ultrasound segmentation, non-invasive PCOS screening and a systematic review of fall detection.',
  },
  {
    id: 'assistive',
    label: 'Assistive & agentic systems',
    blurb:
      'Edge–cloud agents that combine vision, language and temporal memory for assistive perception and low-latency decisions.',
  },
  {
    id: 'interaction',
    label: 'Human–computer interaction',
    blurb: 'Vision-based input: hand-gesture keyboard and mouse control with bilingual next-word prediction.',
  },
] as const;

export type ResearchTopic = (typeof researchTopics)[number]['id'];

export const researchTypes = [
  { id: 'conference-paper', label: 'Conference paper' },
  { id: 'journal-article', label: 'Journal article' },
  { id: 'systematic-review', label: 'Systematic review' },
  { id: 'research-project', label: 'Research project' },
] as const;

export const projectCategories = [
  { id: 'robotics', label: 'Robotics & autonomy' },
  { id: 'embedded', label: 'Embedded & sensing' },
  { id: 'machine-learning', label: 'Machine learning' },
  { id: 'health-tech', label: 'Health tech' },
  { id: 'web', label: 'Full-stack web' },
  { id: 'electronics', label: 'Circuits & electronics' },
  { id: 'systems', label: 'Systems & networking' },
  { id: 'graphics', label: 'Graphics & games' },
] as const;

export const experienceKinds = [
  { id: 'industry', label: 'Industry' },
  { id: 'research', label: 'Research' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'engineering-team', label: 'Engineering team' },
] as const;

export const awardCategories = [
  { id: 'academic', label: 'Academic distinction' },
  { id: 'competition', label: 'Competitions' },
  { id: 'personal-development', label: 'Personal development' },
] as const;

type Option = { readonly id: string; readonly label: string };

/** Turn a vocabulary into the tuple shape `z.enum()` needs. */
export function ids<T extends readonly Option[]>(list: T) {
  return list.map((item) => item.id) as unknown as [T[number]['id'], ...T[number]['id'][]];
}

export function labelFor(list: readonly Option[], id: string): string {
  return list.find((item) => item.id === id)?.label ?? id;
}

/** UN Sustainable Development Goals referenced by project `impact.sdgs`. */
export const sdgNames: Record<number, string> = {
  3: 'Good Health and Well-being',
  4: 'Quality Education',
  9: 'Industry, Innovation and Infrastructure',
  10: 'Reduced Inequalities',
  11: 'Sustainable Cities and Communities',
  16: 'Peace, Justice and Strong Institutions',
};
