// Identity and contact details shown across the site.
import portraitCutout from '../assets/portrait-cutout.png';
import aboutPortrait from '../assets/about-portrait.png';

// Source: the CV. Public contact details only — never add a phone number,
// a home address or referees' details here.

export interface ProfileLink {
  label: string;
  url: string;
  /** Short handle shown next to the label, e.g. "in/username". */
  handle: string;
  icon: 'linkedin' | 'github' | 'scholar' | 'orcid' | 'researchgate' | 'mail' | 'link';
}

export interface Profile {
  name: string;
  /** Short form used in the header and footer. */
  shortName: string;
  monogram: string;
  /** Primary professional label (page titles, social cards). */
  headline: string;
  /** The supporting line under the name in the hero. */
  focus: string;
  /** Hero introduction — 2–3 sentences. */
  intro: string;
  /** Default meta description. */
  description: string;
  location: string;
  email: string;
  links: ProfileLink[];
  /**
   * What you're looking for, shown in the hero, About, Contact and the contact
   * band. Set to null to hide it everywhere.
   */
  availability: null | {
    /** Full sentence-style label, e.g. "Open to industry roles". */
    label: string;
    /** Compact form for small badges. */
    short: string;
  };
  /** Path inside /public, or null to hide every CV download button. */
  cv: { path: string; label: string; updated: string } | null;
  /** Hero portrait (transparent cut-out) — null shows the abstract diagram instead. */
  portrait: null | { src: ImageMetadata; alt: string };
  /** About-section photo (transparent cut-out) — null falls back to the hero portrait. */
  aboutPortrait: null | { src: ImageMetadata; alt: string };
  interests: string[];
}

export const profile: Profile = {
  name: 'Syeda Maliha Tabassum',
  shortName: 'Maliha Tabassum',
  monogram: 'SMT',
  headline: 'Computer Science Graduate · AI, Software & Infrastructure',
  focus: 'AI, software and infrastructure that solve practical problems',
  intro:
    'I turn technical skills into working solutions for real organisations — from automating power-infrastructure monitoring at Grameenphone to building a full-stack healthcare platform and machine-learning pipelines for health data.',
  description:
    'Syeda Maliha Tabassum — computer science graduate (BRAC University, Highest Distinction, CGPA 3.93) with industry experience at Grameenphone, building AI, software and infrastructure solutions. Open to industry roles.',
  location: 'Dhaka, Bangladesh',
  email: 'syeda.maliha.tabassum1@g.bracu.ac.bd',
  // Profiles shown on the site: LinkedIn only (owner's choice).
  links: [
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/syeda-maliha-tabassum19',
      handle: 'in/syeda-maliha-tabassum19',
      icon: 'linkedin',
    },
  ],
  availability: {
    label: 'Open to industry roles in AI, software and technology',
    short: 'Open to industry roles',
  },
  // No CV download until an industry résumé is supplied. See CONTENT_TODO.md.
  cv: null,
  // Generated from "Formal picture in suit.jpg" by scripts/make-portrait-cutout.py.
  portrait: { src: portraitCutout, alt: 'Syeda Maliha Tabassum, in a navy suit, smiling' },
  // Generated from "890187627_…_n.jpg" by scripts/make-portrait-cutout.py.
  aboutPortrait: {
    src: aboutPortrait,
    alt: 'Syeda Maliha Tabassum in a beige checked blazer and coral shirt, smiling',
  },
  interests: [
    'Artificial Intelligence',
    'Machine Learning',
    'Software Development',
    'Network Infrastructure',
    'Automation',
    'Embedded Systems',
    'Health Technology',
  ],
};
