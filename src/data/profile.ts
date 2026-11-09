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
  headline: 'AI & Technology Graduate · Aspiring Business Leader',
  focus: 'AI and technology, applied with people and leadership',
  intro:
    'I bring AI and technology together with people to deliver results. From automating power-infrastructure monitoring at Grameenphone to a live digital-health platform and machine-learning models for health data, I apply technology where it solves practical problems.',
  description:
    'Syeda Maliha Tabassum — computer science graduate (BRAC University, Highest Distinction, CGPA 3.93) and former Grameenphone NEXTERN, working across AI and technology. Open to Management Trainee programmes.',
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
    label: 'Open to Management Trainee programmes — technology and techno-commercial tracks',
    short: 'Open to Management Trainee roles',
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
    'Data Analytics',
    'Digital Transformation',
    'Telecom Infrastructure',
    'Automation',
    'Leadership',
    'Health Technology',
  ],
};
