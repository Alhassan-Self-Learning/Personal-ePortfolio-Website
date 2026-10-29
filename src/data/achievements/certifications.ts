import type { CertificationEntry } from '@/types/content';

/**
 * Industry certifications only — course completion certificates belong on the
 * course entry instead. Sample entries below; replace with your own.
 */
export const certifications: CertificationEntry[] = [
  {
    id: 'sample-security-foundations-cert',
    title: 'Security Foundations Certified',
    issuer: 'Example Certification Body',
    status: 'earned',
    level: 'foundational',
    date: '2026-03',
    expires: '2029-03',
    credentialId: 'SAMPLE-0000-0000',
    sample: true,
    summary: 'Sample entry. A foundational certification covering security principles, threats and controls.',
    skills: ['risk-management', 'cryptography', 'networking-fundamentals'],
    tags: ['Foundational'],
    media: [{ src: '/samples/certificate.svg', alt: 'Sample certification document', caption: 'Certificate (sample)', kind: 'certificate' }],
  },
  {
    id: 'sample-soc-analyst-cert',
    title: 'SOC Analyst Associate',
    issuer: 'Example Certification Body',
    status: 'in-progress',
    level: 'associate',
    sample: true,
    summary: 'Sample entry. An analyst-level certification currently being prepared for.',
    skills: ['soc-fundamentals', 'alert-triage', 'log-analysis'],
    tags: ['SOC'],
    related: [{ category: 'labs', id: 'thm-junior-security-analyst-intro' }],
  },
];
