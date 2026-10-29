import type { ProgramEntry } from '@/types/content';

/** Sample entries — replace with your own bootcamps and programmes. */
export const programs: ProgramEntry[] = [
  {
    id: 'sample-blue-team-bootcamp',
    title: 'Blue Team Bootcamp',
    provider: 'Example Cyber Academy',
    status: 'completed',
    startDate: '2026-01',
    endDate: '2026-03',
    duration: '10 weeks',
    format: 'hybrid',
    sample: true,
    summary: 'Sample entry. A ten-week programme on monitoring, detection and first response.',
    modules: ['Security monitoring', 'Log sources and parsing', 'Detection rules', 'Incident handling'],
    objectives: ['Build and tune basic detection rules', 'Run a tabletop incident exercise'],
    technologies: ['SIEM', 'Sysmon', 'Wireshark'],
    exercises: ['Weekly detection challenges', 'Final tabletop exercise'],
    skills: ['siem', 'log-analysis', 'incident-response'],
    tags: ['Blue team'],
    related: [{ category: 'labs', id: 'sample-home-soc-lab' }],
  },
  {
    id: 'sample-cloud-program',
    title: 'Cloud Security Foundations Programme',
    provider: 'Example Cloud Provider',
    status: 'planned',
    format: 'online',
    sample: true,
    summary: 'Sample entry. A planned programme on identity, logging and shared responsibility in the cloud.',
    modules: ['Shared responsibility', 'Identity and access management', 'Cloud logging'],
    skills: ['cloud-iam'],
    tags: ['Cloud'],
  },
];
