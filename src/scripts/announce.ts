/** Announce a short message to screen readers via the global live region. */
export function announce(message: string): void {
  const region = document.getElementById('announcer');
  if (!region) return;
  region.textContent = '';
  window.setTimeout(() => (region.textContent = message), 50);
}
