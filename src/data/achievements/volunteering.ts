import type { VolunteeringEntry } from '@/types/content';

/** Sample entries — replace with your own. */
export const volunteering: VolunteeringEntry[] = [
  {
    id: 'sample-cyber-awareness-sessions',
    title: 'Cyber awareness sessions for first-year students',
    organization: 'Example University Cybersecurity Club',
    role: 'Session lead',
    startDate: '2025-10',
    endDate: '2026-04',
    location: 'Example campus',
    sample: true,
    summary: 'Sample entry. Ran short sessions on phishing, passwords and account security for new students.',
    responsibilities: ['Prepare slides and live demos', 'Answer follow-up questions'],
    contributions: ['Created a one-page phishing checklist reused by the club'],
    outcomes: ['Four sessions delivered (sample figure)'],
    skills: ['technical-writing', 'teamwork'],
    tags: ['Awareness', 'Community'],
  },
  {
    id: 'sample-ctf-helper',
    title: 'CTF event helper',
    organization: 'Example Student Society',
    role: 'Volunteer',
    date: '2026-04',
    sample: true,
    summary: 'Sample entry. Helped participants with setup questions during an on-campus CTF.',
    responsibilities: ['Help desk for participant setup issues'],
    skills: ['teamwork'],
    tags: ['CTF', 'Community'],
    related: [{ category: 'competitions', id: 'sample-national-ctf' }],
  },
];
