import type { BookEntry } from '@/types/content';

/**
 * Sample reading list. These are real books, marked "want to read" so the
 * page doesn't claim anything — update the status, dates, rating and notes as
 * you read them, then remove `sample: true`.
 */
export const books: BookEntry[] = [
  {
    id: 'practice-of-network-security-monitoring',
    title: 'The Practice of Network Security Monitoring',
    authors: ['Richard Bejtlich'],
    publisher: 'No Starch Press',
    year: 2013,
    subject: 'Security operations',
    status: 'want-to-read',
    sample: true,
    summary: 'How to collect, analyse and escalate network evidence — a classic for anyone heading into a SOC.',
    skills: ['soc-fundamentals', 'networking-fundamentals'],
    tags: ['SOC', 'NSM'],
  },
  {
    id: 'practical-malware-analysis',
    title: 'Practical Malware Analysis',
    authors: ['Michael Sikorski', 'Andrew Honig'],
    publisher: 'No Starch Press',
    year: 2012,
    subject: 'Malware analysis',
    status: 'want-to-read',
    sample: true,
    summary: 'A hands-on guide to static and dynamic malware analysis.',
    skills: ['digital-forensics'],
    tags: ['Malware', 'DFIR'],
  },
  {
    id: 'incident-response-computer-forensics',
    title: 'Incident Response & Computer Forensics',
    authors: ['Jason T. Luttgens', 'Matthew Pepe', 'Kevin Mandia'],
    publisher: 'McGraw-Hill Education',
    year: 2014,
    subject: 'Incident response',
    status: 'want-to-read',
    sample: true,
    summary: 'The incident response lifecycle, from preparation through investigation and remediation.',
    skills: ['incident-response', 'digital-forensics'],
    tags: ['DFIR'],
  },
];
