// English-language test results, shown in the About "at a glance" boxes.
// Source: supplied by the owner (2026-11-09): IELTS Academic, taken
// 3 November 2026, overall band 7.5 (CEFR C1), with the four module scores
// shown on request.

export interface LanguageTest {
  id: string;
  name: string;
  /** e.g. "Academic". */
  module?: string;
  /** Test date, "YYYY-MM-DD". */
  date?: string;
  overall: number;
  /** Highest possible band/score, used for the bar lengths. */
  max: number;
  /** CEFR level as stated by the owner. */
  cefr?: string;
  parts: { label: string; score: number }[];
}

export const languageTests: LanguageTest[] = [
  {
    id: 'ielts',
    name: 'IELTS',
    module: 'Academic',
    date: '2026-11-03',
    overall: 7.5,
    max: 9,
    cefr: 'C1',
    parts: [
      { label: 'Listening', score: 8.5 },
      { label: 'Reading', score: 8 },
      { label: 'Speaking', score: 7 },
      { label: 'Writing', score: 6.5 },
    ],
  },
];
