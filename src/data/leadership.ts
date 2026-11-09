// "Leadership in action": the qualities a management-trainee / fast-track
// leadership programme selects for, each backed only by documented facts from
// the CV (experience, awards, education, projects). No titles, team sizes or
// outcomes beyond what the source states — the owner held no formal
// leadership title, so the section shows behaviours, not positions.

export interface LeadershipQuality {
  id: string;
  title: string;
  /** One-line description of the quality. */
  summary: string;
  /** Optional headline figure, taken from the content files. */
  stat?: { value: string; label: string };
  /** Colour family for the card. */
  tone: 'blue' | 'purple' | 'green';
  icon: 'users' | 'agent' | 'flask' | 'rocket' | 'trophy' | 'globe';
  /** Documented evidence; `href` is an anchor on the page. */
  evidence: { text: string; href: string; label: string }[];
}

export const leadership: LeadershipQuality[] = [
  {
    id: 'developing-people',
    title: 'Developing people',
    summary: 'Helping others learn and grow.',
    stat: { value: '250+', label: 'students mentored' },
    tone: 'blue',
    icon: 'users',
    evidence: [
      {
        text: 'Mentored 250+ students through lab sessions and individual guidance as a Data Structures teaching assistant.',
        href: '#data-structures-ta',
        label: 'Teaching role',
      },
    ],
  },
  {
    id: 'collaboration',
    title: 'Working across teams',
    summary: 'Getting things done with people from other functions.',
    tone: 'purple',
    icon: 'agent',
    evidence: [
      {
        text: 'Coordinated SMU upgrades with the Umbrella team at Grameenphone.',
        href: '#grameenphone-nextern',
        label: 'Grameenphone',
      },
      {
        text: 'Worked with multidisciplinary teams on the Mars rover’s vision, networking and mechanical systems.',
        href: '#mongoltori-mars-rover',
        label: 'Rover team',
      },
    ],
  },
  {
    id: 'data-driven',
    title: 'Data-driven decisions',
    summary: 'Letting evidence, not guesswork, drive the call.',
    tone: 'green',
    icon: 'flask',
    evidence: [
      {
        text: 'Automated monitoring and weekly reporting for rectifier and Li-ion battery deployment using Huawei NetEco.',
        href: '#grameenphone-nextern',
        label: 'Grameenphone',
      },
      {
        text: 'Evaluated five machine-learning models side by side for smoking-behaviour prediction.',
        href: '#project-smoking-behavior-prediction',
        label: 'Project',
      },
      {
        text: 'Top 6 Finalist in the EXCELERATE National Excel Competition.',
        href: '#recognition',
        label: 'Awards',
      },
    ],
  },
  {
    id: 'digital-change',
    title: 'Driving digital change',
    summary: 'Using AI and technology to modernise how things work.',
    tone: 'blue',
    icon: 'rocket',
    evidence: [
      {
        text: 'Prepared the requirements for an AI-assisted site power design tool at Grameenphone.',
        href: '#grameenphone-nextern',
        label: 'Grameenphone',
      },
      {
        text: 'Built WeHeal, a digital-health platform for telemedicine, prescriptions, lab tests and emergency services — live at weheal.live.',
        href: '#project-weheal',
        label: 'Project',
      },
    ],
  },
  {
    id: 'resilience',
    title: 'Delivering under pressure',
    summary: 'Competing, and delivering, at a high level.',
    stat: { value: '8th', label: 'of 102 teams worldwide' },
    tone: 'purple',
    icon: 'trophy',
    evidence: [
      {
        text: 'Core member of BRACU Mongol Tori, ranked 8th of 102 teams at the University Rover Challenge 2025.',
        href: '#recognition',
        label: 'Awards',
      },
      {
        text: '1st Runner-Up, CSE471 Project Demonstration; Semi-Finalist, RoboSoccer (TRACTION).',
        href: '#recognition',
        label: 'Awards',
      },
    ],
  },
  {
    id: 'communication',
    title: 'Communicating clearly',
    summary: 'Explaining complex ideas to any audience.',
    stat: { value: '7.5', label: 'IELTS overall · CEFR C1' },
    tone: 'green',
    icon: 'globe',
    evidence: [
      {
        text: 'Prepared technical documentation and presentations for a collaborative research team.',
        href: '#dristee-research-assistant',
        label: 'Research role',
      },
      {
        text: 'Co-author of a peer-reviewed IEEE conference paper (JCSSE 2026).',
        href: '#research',
        label: 'Publications',
      },
    ],
  },
];
