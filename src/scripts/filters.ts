// Generic list filtering used by the Research and Projects pages.
//
// Markup contract (see FilterControls.astro):
//   [data-filter-root]                 wrapper; data-filter-noun="entry|entries"
//     form[data-filter-controls]       hidden until this script runs
//       fieldset[data-facet="status"]  radio inputs name="status" (value "all" = no filter)
//       [data-facet="topic"] select    …or a <select name="topic"> with the same values
//       input[data-filter-search]      optional free-text search, name="q"
//     [data-filter-count]              live result count
//     [data-filter-group]              optional; hidden when it has no visible items
//       [data-filter-item]             data-<facet>="space separated values"
//                                      data-search="lower-cased searchable text"
//     [data-filter-empty]              shown when nothing matches
//       [data-filter-reset]            clears every filter
//
// The current filters are mirrored in the URL (?status=…&topic=…&q=…), so a
// filtered view can be bookmarked or shared.

function initFilter(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('form[data-filter-controls]');
  if (!form) return;
  const facets = [...form.querySelectorAll<HTMLElement>('[data-facet]')].map((el) => el.dataset.facet!);
  const search = form.querySelector<HTMLInputElement>('[data-filter-search]');
  const items = [...root.querySelectorAll<HTMLElement>('[data-filter-item]')];
  const groups = [...root.querySelectorAll<HTMLElement>('[data-filter-group]')];
  const count = root.querySelector<HTMLElement>('[data-filter-count]');
  const empty = root.querySelector<HTMLElement>('[data-filter-empty]');
  const [singular, plural] = (root.dataset.filterNoun ?? 'item|items').split('|');

  const readState = () => {
    const data = new FormData(form);
    const selected = Object.fromEntries(facets.map((f) => [f, String(data.get(f) ?? 'all')]));
    const query = String(data.get('q') ?? '').trim();
    return { selected, query };
  };

  const apply = (syncUrl = true) => {
    const { selected, query } = readState();
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;

    for (const item of items) {
      const matchesFacets = facets.every((facet) => {
        const wanted = selected[facet];
        return wanted === 'all' || (item.dataset[facet] ?? '').split(' ').includes(wanted);
      });
      const haystack = item.dataset.search ?? item.textContent?.toLowerCase() ?? '';
      const matchesQuery = terms.every((term) => haystack.includes(term));
      item.hidden = !(matchesFacets && matchesQuery);
      if (!item.hidden) visible += 1;
    }

    for (const group of groups) {
      group.hidden = !group.querySelector('[data-filter-item]:not([hidden])');
    }
    if (empty) empty.hidden = visible > 0;
    if (count) {
      const noun = (n: number) => (n === 1 ? singular : plural);
      count.textContent =
        visible === items.length
          ? `Showing all ${items.length} ${noun(items.length)}`
          : `Showing ${visible} of ${items.length} ${noun(items.length)}`;
    }

    if (syncUrl) {
      const url = new URL(window.location.href);
      for (const facet of facets) {
        if (selected[facet] === 'all') url.searchParams.delete(facet);
        else url.searchParams.set(facet, selected[facet]);
      }
      if (query) url.searchParams.set('q', query);
      else url.searchParams.delete('q');
      history.replaceState(history.state, '', url);
    }
    root.dispatchEvent(new CustomEvent('filters:applied', { bubbles: true }));
  };

  // Restore filters from the URL.
  const params = new URLSearchParams(window.location.search);
  for (const facet of facets) {
    const value = params.get(facet);
    if (!value) continue;
    const select = form.querySelector<HTMLSelectElement>(`select[name="${facet}"]`);
    if (select && [...select.options].some((o) => o.value === value)) select.value = value;
    const input = form.querySelector<HTMLInputElement>(`input[name="${facet}"][value="${CSS.escape(value)}"]`);
    if (input) input.checked = true;
  }
  if (search && params.get('q')) search.value = params.get('q')!;

  let debounce: number | undefined;
  form.addEventListener('change', () => apply());
  search?.addEventListener('input', () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => apply(), 200);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    apply();
  });

  for (const reset of root.querySelectorAll<HTMLButtonElement>('[data-filter-reset]')) {
    reset.addEventListener('click', () => {
      form.reset(); // restores the default "all" options and clears search
      apply();
      (search ?? form.querySelector<HTMLInputElement>('input'))?.focus();
    });
  }

  // Other scripts (e.g. deep links to a filtered-out entry) can clear filters.
  root.addEventListener('filters:reset', () => {
    form.reset();
    apply();
  });

  form.hidden = false;
  apply(false);
}

for (const root of document.querySelectorAll<HTMLElement>('[data-filter-root]')) initFilter(root);
