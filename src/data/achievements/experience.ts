import type { ExperienceEntry } from '@/types/content';

/** Sample entries — replace with your own roles. */
export const experience: ExperienceEntry[] = [
  {
    id: 'sample-soc-internship',
    title: 'SOC Intern',
    organization: 'Example Security Operations Centre',
    type: 'internship',
    startDate: '2026-06',
    endDate: '2026-08',
    location: 'Muscat, Oman',
    arrangement: 'on-site',
    sample: true,
    summary: 'Sample entry. Shadowed Tier 1 analysts and helped triage low-severity alerts under supervision.',
    responsibilities: ['Review and classify incoming low-severity alerts', 'Document triage notes in the ticketing system'],
    contributions: ['Wrote a checklist for triaging phishing reports'],
    technologies: ['SIEM', 'Ticketing system'],
    skills: ['alert-triage', 'soc-fundamentals', 'technical-writing'],
    tags: ['SOC'],
  },
  {
    id: 'sample-research-assistant',
    title: 'Undergraduate Research Assistant',
    organization: 'Example University Lab',
    type: 'research',
    startDate: '2026-02',
    current: true,
    arrangement: 'hybrid',
    sample: true,
    summary: 'Sample entry. Supporting a literature review on detection techniques for encrypted traffic.',
    responsibilities: ['Collect and summarise papers', 'Maintain the shared bibliography'],
    skills: ['cryptography', 'technical-writing'],
    tags: ['Research'],
  },
];
