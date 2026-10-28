import type { EventEntry } from '@/types/content';

/**
 * `role` separates attending from presenting or organising — the UI shows it
 * prominently. Sample entries — replace with your own.
 */
export const events: EventEntry[] = [
  {
    id: 'sample-security-conference',
    title: 'Example Regional Security Conference',
    organizer: 'Example Events',
    kind: 'conference',
    format: 'in-person',
    venue: 'Example convention centre',
    date: '2026-02-10',
    endDate: '2026-02-11',
    role: 'attendee',
    sample: true,
    summary: 'Sample entry. Two days of talks on threat intelligence, SOC automation and cloud security.',
    topics: ['Threat intelligence', 'SOC automation', 'Cloud security'],
    speakers: ['Sample Speaker One', 'Sample Speaker Two'],
    takeaways: ['Detection engineering is becoming a distinct role from SOC analysis.'],
    skills: ['soc-fundamentals'],
    tags: ['Conference'],
  },
  {
    id: 'sample-student-exhibition',
    title: 'Example Student Projects Exhibition',
    organizer: 'Example University',
    kind: 'exhibition',
    format: 'in-person',
    date: '2026-05',
    role: 'exhibitor',
    sample: true,
    summary: 'Sample entry. Presented a project poster and live demo to visitors and faculty.',
    topics: ['Student research', 'Security tooling'],
    skills: ['technical-writing'],
    tags: ['Exhibition'],
    related: [{ category: 'projects', id: 'sample-log-triage-tool' }],
  },
];
