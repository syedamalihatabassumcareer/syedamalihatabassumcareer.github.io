const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-09" → "Sep 2026" */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-').map(Number);
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
}

/** "Jun 2026 – Sep 2026", "Feb 2025 – May 2025", or a single month. */
export function formatRange(start: string | undefined, end: string | undefined): string {
  if (!start) return end ? formatMonth(end) : '';
  if (!end) return `${formatMonth(start)} – present`;
  if (start === end) return formatMonth(start);
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Sort helper: newest first by "YYYY-MM" (falls back to start). */
export function byEndDesc<T extends { end?: string; start?: string; date?: string }>(a: T, b: T): number {
  const ka = a.end ?? a.date ?? a.start ?? '';
  const kb = b.end ?? b.date ?? b.start ?? '';
  return kb.localeCompare(ka);
}

/** "Sammam Mahdi, …, and Aniqua Nusrat Zereen" */
export function joinNames(names: string[]): string {
  if (names.length <= 2) return names.join(' and ');
  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`;
}
