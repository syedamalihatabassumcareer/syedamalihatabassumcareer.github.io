// Site-wide behaviour for the single-page portfolio: theme switch, mobile menu,
// active-section highlighting, sticky-header state, reveals, back-to-top and
// inline expanders (research details, project panels, longer About story).
//
// Everything is progressive enhancement: without JavaScript every panel is
// open and every section readable. All motion respects prefers-reduced-motion.
import { announce } from './announce';
import { navTargetFor } from '@/data/navigation';

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ── Theme ────────────────────────────────────────────────────────────────
function initTheme(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const label = button?.querySelector<HTMLElement>('[data-theme-label]');
  if (!button || !label) return;

  const effective = () => (root.dataset.theme as 'light' | 'dark' | undefined) ?? 'light';

  const sync = () => {
    const now = effective();
    root.dataset.effectiveTheme = now;
    const next = now === 'dark' ? 'light' : 'dark';
    label.textContent = `Switch to ${next} theme`;
    button.title = `Switch to ${next} theme`;
  };

  button.hidden = false;
  sync();

  button.addEventListener('click', () => {
    const next = effective() === 'dark' ? 'light' : 'dark';
    if (!reducedMotion.matches) {
      root.classList.add('theme-switching');
      window.setTimeout(() => root.classList.remove('theme-switching'), 300);
    }
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable — the choice lasts for this page only */
    }
    sync();
    announce(`${next[0].toUpperCase()}${next.slice(1)} theme on`);
  });
}

// ── Mobile menu ──────────────────────────────────────────────────────────
function initMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;
  const outside = [document.querySelector('main'), document.querySelector('.site-footer'), document.querySelector('[data-to-top]')];
  const compact = window.matchMedia('(max-width: 63.99rem)');

  const setOpen = (open: boolean, returnFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('data-open', open);
    outside.forEach((el) => el?.toggleAttribute('inert', open));
    if (open) menu.querySelector<HTMLAnchorElement>('a')?.focus();
    else if (returnFocus) toggle.focus();
  };

  const applyMode = () => {
    toggle.hidden = !compact.matches;
    if (!compact.matches) setOpen(false);
  };

  applyMode();
  compact.addEventListener('change', applyMode);
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.hasAttribute('data-open')) setOpen(false, true);
  });

  menu.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });

  // Keep Tab inside the open menu + toggle button.
  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !menu.hasAttribute('data-open')) return;
    const links = [...menu.querySelectorAll<HTMLAnchorElement>('a')].filter((a) => a.offsetParent !== null);
    if (!event.shiftKey && document.activeElement === links.at(-1)) {
      event.preventDefault();
      toggle.focus();
    }
  });
}

// ── Scroll state: header, back-to-top, active section ────────────────────
function initScroll(): void {
  const toTop = document.querySelector<HTMLAnchorElement>('[data-to-top]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
  const sections = links
    .map((l) => document.getElementById(l.dataset.navLink!))
    .filter((el): el is HTMLElement => Boolean(el));

  const setActive = (id: string | null) => {
    const exact = links.find((l) => l.dataset.navLink === id && l.offsetParent !== null);
    const mapped = id ? links.find((l) => l.dataset.navLink === (navTargetFor[id] ?? id)) : undefined;
    const active = exact ?? mapped;
    for (const link of links) {
      if (link === active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    root.classList.toggle('is-scrolled', y > 8);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header?.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1).toFixed(4) : '0');
    toTop?.classList.toggle('is-shown', y > window.innerHeight * 0.9);

    if (sections.length) {
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = sections.at(-1)!.id;
      setActive(current);
    }
    ticking = false;
  };

  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', update);

  // Move focus to the top of the page for keyboard and screen-reader users.
  toTop?.addEventListener('click', () => {
    window.setTimeout(() => document.querySelector<HTMLElement>('.logo')?.focus({ preventScroll: true }), 0);
  });
}

// ── Reveal on scroll ─────────────────────────────────────────────────────
// Only elements that start below the fold are hidden, and only by this
// script — so nothing is ever invisible when JS is off or fails.
function initReveal(): void {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const items = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  const fold = window.innerHeight * 0.92;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add('reveal-in');
        el.classList.remove('reveal-pending');
        observer.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
  );
  for (const el of items) {
    if (el.getBoundingClientRect().top < fold) continue;
    el.classList.add('reveal-pending');
    observer.observe(el);
  }
}

// ── Inline expanders ─────────────────────────────────────────────────────
// Markup: button[data-expander-toggle][aria-controls=ID] + .expander#ID[data-expander]
// Optional: [data-expander-hide] removes the collapsed panel from layout
// (project panels); [data-expander-group] lets one panel open at a time;
// button[data-expander-close=ID] closes and returns focus to the trigger.
function initExpanders(): void {
  const panels = [...document.querySelectorAll<HTMLElement>('[data-expander]')];
  if (!panels.length) return;
  root.classList.add('js-expanders');

  const togglesFor = (panel: HTMLElement) =>
    [...document.querySelectorAll<HTMLButtonElement>(`[data-expander-toggle][aria-controls="${panel.id}"]`)];
  const isOpen = (panel: HTMLElement) => !panel.hasAttribute('data-collapsed');
  const hideTimers = new WeakMap<HTMLElement, number>();

  const setOpen = (panel: HTMLElement, open: boolean, animate = true) => {
    const hide = panel.hasAttribute('data-expander-hide');
    window.clearTimeout(hideTimers.get(panel));
    for (const toggle of togglesFor(panel)) {
      toggle.setAttribute('aria-expanded', String(open));
      const label = toggle.querySelector<HTMLElement>('[data-label-open]');
      if (label) label.textContent = open ? label.dataset.labelOpen! : label.dataset.labelClosed!;
    }
    if (open) {
      // One open panel per group (projects).
      const group = panel.closest('[data-expander-group]');
      if (group) {
        for (const other of group.querySelectorAll<HTMLElement>('[data-expander]')) {
          if (other !== panel && isOpen(other)) setOpen(other, false, false);
        }
      }
      if (hide) {
        panel.hidden = false;
        if (animate && !reducedMotion.matches) void panel.offsetHeight; // start from the collapsed state
      }
      panel.removeAttribute('data-collapsed');
    } else {
      panel.setAttribute('data-collapsed', '');
      if (hide) {
        const delay = animate && !reducedMotion.matches ? 340 : 0;
        hideTimers.set(
          panel,
          window.setTimeout(() => {
            if (panel.hasAttribute('data-collapsed')) panel.hidden = true;
          }, delay),
        );
      }
    }
  };

  // Which panel does an *entry* hash belong to? Only individual entries
  // (#research-<id>, #project-<id>) or panels themselves open automatically —
  // section anchors like #about or #research never do.
  const panelFor = (target: Element | null): HTMLElement | null => {
    if (!target) return null;
    if (target.hasAttribute('data-expander')) return target as HTMLElement;
    const owned = (target as HTMLElement).dataset?.panel;
    if (owned) return document.getElementById(owned);
    if (target.matches('[data-filter-item]')) return target.querySelector<HTMLElement>('[data-expander]');
    return target.closest<HTMLElement>('[data-expander]');
  };

  // Collapse everything except a panel the URL points at.
  const initial = location.hash ? panelFor(document.getElementById(decodeURIComponent(location.hash.slice(1)))) : null;
  for (const panel of panels) {
    for (const toggle of togglesFor(panel)) toggle.hidden = false;
    setOpen(panel, panel === initial, false);
  }

  document.addEventListener('click', (event) => {
    const toggle = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-expander-toggle]');
    if (toggle) {
      const panel = document.getElementById(toggle.getAttribute('aria-controls')!);
      if (panel) setOpen(panel, !isOpen(panel));
      return;
    }
    const close = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-expander-close]');
    if (close) {
      const panel = document.getElementById(close.dataset.expanderClose!);
      if (!panel) return;
      setOpen(panel, false);
      const trigger = togglesFor(panel)[0];
      trigger?.focus({ preventScroll: true });
      trigger?.closest('article, li')?.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
  });

  for (const close of document.querySelectorAll<HTMLButtonElement>('[data-expander-close]')) close.hidden = false;

  // Escape inside an open panel closes it and returns focus to its trigger.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const panel = (document.activeElement as HTMLElement | null)?.closest<HTMLElement>('[data-expander]');
    if (!panel || !isOpen(panel) || !panel.hasAttribute('data-expander-hide')) return;
    setOpen(panel, false);
    togglesFor(panel)[0]?.focus();
  });

  // Deep links: #research-<id> / #project-<id> open the entry and bring it into view.
  const openFromHash = () => {
    const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    const panel = panelFor(target);
    if (!target || !panel) return;
    const filterRoot = target.closest<HTMLElement>('[data-filter-root]');
    if (filterRoot && (target.closest('[hidden]') || target.hidden)) {
      filterRoot.dispatchEvent(new CustomEvent('filters:reset'));
    }
    setOpen(panel, true, false);
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'auto' }));
  };
  window.addEventListener('hashchange', openFromHash);
  if (initial) openFromHash();

  // A filtered-out project closes its open panel.
  document.addEventListener('filters:applied', () => {
    for (const panel of panels) {
      const owner = panel.dataset.owner ? document.getElementById(panel.dataset.owner) : null;
      if (owner?.hidden && isOpen(panel)) setOpen(panel, false, false);
    }
  });
}

// ── Decorative animations only run while visible ─────────────────────────
function initAnimVisibility(): void {
  const scenes = [...document.querySelectorAll<HTMLElement>('[data-anim]')];
  if (!scenes.length) return;
  if (!('IntersectionObserver' in window)) {
    scenes.forEach((s) => s.classList.add('is-playing'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-playing', entry.isIntersecting);
    },
    { rootMargin: '100px 0px' },
  );
  scenes.forEach((s) => observer.observe(s));
}

// ── Count-up for the hero stats ──────────────────────────────────────────
// The real value is in the HTML (and in a visually hidden copy for screen
// readers); the visible number counts up once, when the stats come into view.
function initCountUp(): void {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const groups = [...document.querySelectorAll<HTMLElement>('[data-count-group]')];
  const run = (group: HTMLElement) => {
    for (const el of group.querySelectorAll<HTMLElement>('[data-count]')) {
      const match = /^(\d+)(.*)$/.exec(el.dataset.count ?? '');
      if (!match) continue;
      const target = Number(match[1]);
      const suffix = match[2];
      const start = performance.now();
      const duration = 1100 + Math.min(target, 300) * 2;
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${Math.round(target * eased)}${t === 1 ? suffix : ''}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        // Let the bar's entrance animation start first.
        window.setTimeout(() => run(entry.target as HTMLElement), 450);
      }
    },
    { threshold: 0.4 },
  );
  groups.forEach((g) => {
    g.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      if (/^\d/.test(el.dataset.count ?? '')) el.textContent = '0';
    });
    observer.observe(g);
  });
}

// ── Pointer effects (fine pointers only; off for reduced motion) ─────────
// [data-parallax] gets --px/--py (−1…1); [data-tilt] gets --tilt-x/--tilt-y
// on its first child; [data-spotlight] gets --mx/--my in pixels.
function initPointerFx(): void {
  if (reducedMotion.matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const track = (el: HTMLElement, apply: (x: number, y: number, r: DOMRect) => void, reset: () => void) => {
    let frame = 0;
    el.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        apply(e.clientX - r.left, e.clientY - r.top, r);
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      reset();
    });
  };

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) =>
    track(
      el,
      (x, y, r) => {
        el.style.setProperty('--px', ((x / r.width) * 2 - 1).toFixed(3));
        el.style.setProperty('--py', ((y / r.height) * 2 - 1).toFixed(3));
      },
      () => {
        el.style.setProperty('--px', '0');
        el.style.setProperty('--py', '0');
      },
    ),
  );

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;
    track(
      el,
      (x, y, r) => {
        target.style.setProperty('--tilt-y', `${((x / r.width - 0.5) * 12).toFixed(2)}deg`);
        target.style.setProperty('--tilt-x', `${((0.5 - y / r.height) * 10).toFixed(2)}deg`);
      },
      () => {
        target.style.setProperty('--tilt-x', '0deg');
        target.style.setProperty('--tilt-y', '0deg');
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((el) =>
    track(
      el,
      (x, y) => {
        el.style.setProperty('--mx', `${Math.round(x)}px`);
        el.style.setProperty('--my', `${Math.round(y)}px`);
      },
      () => {},
    ),
  );
}

initTheme();
initAnimVisibility();
initMenu();
initScroll();
initReveal();
initExpanders();
initCountUp();
initPointerFx();
