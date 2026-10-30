import type { CompetitionEntry } from '@/types/content';

/**
 * Leave `result` undefined unless there is an official placement to report.
 * Sample entries — replace with your own.
 */
export const competitions: CompetitionEntry[] = [
  {
    id: 'sample-national-ctf',
    title: 'Example National Student CTF',
    organizer: 'Example Organiser',
    kind: 'CTF',
    format: 'Jeopardy, 24 hours',
    date: '2026-04',
    participation: 'team',
    teamName: 'Sample Team',
    challengeCategories: ['Web', 'Forensics', 'Cryptography', 'OSINT'],
    sample: true,
    summary: 'Sample entry. A 24-hour jeopardy-style CTF for university teams.',
    highlights: ['Took the lead on forensics challenges', 'Shared notes with the team in a live document'],
    skills: ['digital-forensics', 'cryptography', 'teamwork'],
    tags: ['CTF', 'Team'],
  },
  {
    id: 'sample-picoctf',
    title: 'picoCTF (sample)',
    organizer: 'Carnegie Mellon University',
    kind: 'CTF',
    format: 'Jeopardy, two weeks',
    participation: 'individual',
    sample: true,
    summary: 'Sample entry. Participation without a placement, shown to demonstrate how entries without a result appear.',
    challengeCategories: ['General skills', 'Web exploitation', 'Cryptography'],
    skills: ['linux', 'web-app-testing'],
    tags: ['CTF'],
    links: [{ label: 'picoCTF', url: 'https://picoctf.org', kind: 'official' }],
  },
];
