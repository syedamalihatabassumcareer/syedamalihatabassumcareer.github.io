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
  /** The competency an assessment centre would call this (a label, not a claim). */
  competency: string;
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
    title: 'People Development',
    summary: 'Helping others learn and grow.',
    competency: 'Coaching & mentoring',
    stat: { value: '250+', label: 'students mentored' },
    tone: 'blue',
    icon: 'users',
    evidence: [
      {
        text: 'As a teaching assistant, helped more than 250 students get to grips with Data Structures — in the lab and one to one.',
        href: '#data-structures-ta',
        label: 'Teaching role',
      },
    ],
  },
  {
    id: 'collaboration',
    title: 'Cross-Functional Collaboration',
    summary: 'Getting things done with people from other functions.',
    competency: 'Stakeholder management',
    tone: 'purple',
    icon: 'agent',
    evidence: [
      {
        text: 'Worked hand in hand with Grameenphone’s Umbrella team to coordinate SMU upgrades nationwide.',
        href: '#grameenphone-nextern',
        label: 'Grameenphone',
      },
      {
        text: 'Joined every NEXTERN in the cohort to shape a proposal on which MyGP app features could realistically be updated.',
        href: '#grameenphone-nextern',
        label: 'Grameenphone',
      },
      {
        text: 'Worked in a special ten-person NEXTERN team to create the presentation and roadshow material for FutureMakers, Grameenphone’s flagship event.',
        href: '#grameenphone-nextern',
        label: 'Grameenphone',
      },
      {
        text: 'Worked alongside the vision, networking and mechanical sub-teams to bring the Mars rover’s systems together.',
        href: '#mongoltori-mars-rover',
        label: 'Rover team',
      },
    ],
  },
  {
    id: 'data-driven',
    title: 'Data-Driven Decision-Making',
    summary: 'Letting evidence, not guesswork, drive the call.',
    competency: 'Analytical thinking',
    stat: { value: 'Top 6', label: 'national Excel competition' },
    tone: 'green',
    icon: 'flask',
    evidence: [
      {
        text: 'Set up automated tracking of rectifier and Li-ion battery rollout in Huawei NetEco, feeding a weekly report.',
        href: '#grameenphone-nextern',
        label: 'Grameenphone',
      },
      {
        text: 'Compared five machine-learning models head to head to find the best predictor of smoking behaviour.',
        href: '#project-smoking-behavior-prediction',
        label: 'Project',
      },
      {
        text: 'Placed in the national top six of the EXCELERATE Excel competition.',
        href: '#recognition',
        label: 'Awards',
      },
    ],
  },
  {
    id: 'digital-change',
    title: 'Digital Transformation',
    summary: 'Using AI and technology to modernise how things work.',
    competency: 'Digital mindset',
    tone: 'blue',
    icon: 'rocket',
    evidence: [
      {
        text: 'Defined what an AI-assisted tool for designing site power at Grameenphone would need to do.',
        href: '#grameenphone-nextern',
        label: 'Grameenphone',
      },
      {
        text: 'Designed WeHeal and saw it go live at weheal.live, putting everyday healthcare services online in one place.',
        href: '#project-weheal',
        label: 'Project',
      },
    ],
  },
  {
    id: 'resilience',
    title: 'Performance Under Pressure',
    summary: 'Competing, and delivering, at a high level.',
    competency: 'Resilience & drive',
    stat: { value: '8th', label: 'of 102 teams worldwide' },
    tone: 'purple',
    icon: 'trophy',
    evidence: [
      {
        text: 'Competed against 102 teams worldwide with BRACU Mongol Tori at URC 2025 — and finished 8th.',
        href: '#recognition',
        label: 'Awards',
      },
      {
        text: 'Took 1st Runner-Up at the CSE471 Project Demonstration and reached the RoboSoccer semi-finals at TRACTION.',
        href: '#recognition',
        label: 'Awards',
      },
    ],
  },
  {
    id: 'communication',
    title: 'Effective Communication',
    summary: 'Explaining complex ideas to any audience.',
    competency: 'Written & verbal communication',
    stat: { value: '7.5', label: 'IELTS overall · CEFR C1' },
    tone: 'green',
    icon: 'globe',
    evidence: [
      {
        text: 'Acted as the go-between for operators sharing Grameenphone’s rectifiers, balancing their needs with Grameenphone’s and recommending support that worked for both.',
        href: '#grameenphone-nextern',
        label: 'Grameenphone',
      },
      {
        text: 'Documented technical work and prepared presentations while coordinating activities in a research team.',
        href: '#dristee-research-assistant',
        label: 'Research role',
      },
      {
        text: 'Shared research in writing as co-author of a peer-reviewed IEEE conference paper (JCSSE 2026).',
        href: '#research',
        label: 'Publications',
      },
    ],
  },
];
