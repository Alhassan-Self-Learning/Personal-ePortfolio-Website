import type { WorkshopEntry } from '@/types/content';

/** Sample entries — replace with your own workshops. */
export const workshops: WorkshopEntry[] = [
  {
    id: 'sample-memory-forensics-workshop',
    title: 'Introduction to Memory Forensics',
    organizer: 'Example Security Society',
    instructor: 'Sample Instructor',
    date: '2026-05-14',
    duration: '3 hours',
    format: 'in-person',
    venue: 'Example campus lab',
    sample: true,
    summary: 'Sample entry. Capturing and analysing a memory image to find a suspicious process.',
    topics: ['Memory acquisition', 'Process listing', 'Network connections from memory'],
    activities: ['Captured a memory image from a lab VM', 'Identified an injected process'],
    skills: ['digital-forensics', 'incident-response'],
    tags: ['DFIR'],
  },
  {
    id: 'sample-secure-coding-workshop',
    title: 'Secure Coding Basics',
    organizer: 'Example Developer Community',
    date: '2026-02-20',
    duration: '2 hours',
    format: 'online',
    sample: true,
    summary: 'Sample entry. Common web vulnerabilities from the developer side, and how to prevent them.',
    topics: ['Input validation', 'SQL injection', 'Access control'],
    skills: ['web-app-testing', 'sql'],
    tags: ['Web'],
  },
];
