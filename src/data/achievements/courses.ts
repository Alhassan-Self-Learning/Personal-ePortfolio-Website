import type { CourseEntry } from '@/types/content';

/** Sample entries — replace with your own courses. */
export const courses: CourseEntry[] = [
  {
    id: 'sample-network-defense-course',
    title: 'Network Defense Essentials',
    provider: 'Example Training Provider',
    status: 'completed',
    date: '2026-06',
    duration: '14 hours',
    sample: true,
    hasCertificate: true,
    summary: 'Sample entry. Firewalls, IDS/IPS, network segmentation and how defenders monitor traffic.',
    outcomes: ['Explain defence-in-depth for a small network', 'Read basic IDS alerts', 'Plan simple segmentation'],
    topics: ['Firewalls', 'IDS/IPS', 'Segmentation', 'VPNs'],
    technologies: ['pfSense', 'Snort'],
    skills: ['networking-fundamentals', 'soc-fundamentals'],
    tags: ['Blue team', 'Networking'],
    media: [{ src: '/samples/certificate.svg', alt: 'Sample course completion certificate', caption: 'Completion certificate (sample)', kind: 'certificate' }],
    related: [{ category: 'labs', id: 'thm-introductory-networking' }],
  },
  {
    id: 'sample-python-security-course',
    title: 'Python for Security Automation',
    provider: 'Example Online Academy',
    status: 'in-progress',
    startDate: '2026-09',
    current: true,
    sample: true,
    summary: 'Sample entry. Writing small Python scripts to parse logs and automate repetitive analyst tasks.',
    topics: ['File and log parsing', 'Regular expressions', 'Working with APIs'],
    technologies: ['Python'],
    skills: ['python', 'log-analysis'],
    tags: ['Automation'],
    related: [{ category: 'projects', id: 'sample-log-triage-tool' }],
  },
];
