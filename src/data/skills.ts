import type { Skill, SkillCategory } from '@/types/content';

/** Display order for skill categories. */
export const skillCategories: SkillCategory[] = [
  'Blue Team & Security Operations',
  'Digital Forensics & Incident Response',
  'Penetration Testing',
  'Cybersecurity',
  'Networking',
  'Operating Systems',
  'Security Tools',
  'Programming',
  'Cloud Security',
  'AI & Automation',
  'Web Development',
  'Databases',
  'Professional Skills',
];

/**
 * Skills are linked to evidence automatically: any achievement whose `skills`
 * array contains a skill id shows up as evidence for that skill.
 */
export const skills: Skill[] = [
  // Blue team
  { id: 'soc-fundamentals', name: 'SOC fundamentals', category: 'Blue Team & Security Operations', description: 'How a security operations centre works: tiers, alert triage, escalation and the analyst workflow.' },
  { id: 'alert-triage', name: 'Alert triage', category: 'Blue Team & Security Operations' },
  { id: 'log-analysis', name: 'Log analysis', category: 'Blue Team & Security Operations' },
  { id: 'risk-management', name: 'Risk management', category: 'Cybersecurity', description: 'Studied as part of the Cybersecurity degree.' },

  // DFIR
  { id: 'incident-response', name: 'Incident response process', category: 'Digital Forensics & Incident Response' },
  { id: 'digital-forensics', name: 'Digital forensics fundamentals', category: 'Digital Forensics & Incident Response' },

  // Offensive
  { id: 'pentest-methodology', name: 'Penetration testing methodology', category: 'Penetration Testing', description: 'Scoping, rules of engagement, and the phases of a test from reconnaissance to reporting.' },
  { id: 'enumeration', name: 'Service enumeration', category: 'Penetration Testing' },
  { id: 'web-app-testing', name: 'Web application testing', category: 'Penetration Testing' },
  { id: 'privilege-escalation', name: 'Linux privilege escalation', category: 'Penetration Testing' },
  { id: 'idor', name: 'Access-control flaws (IDOR)', category: 'Penetration Testing' },
  { id: 'subdomain-enumeration', name: 'Subdomain enumeration', category: 'Penetration Testing' },

  // Core security
  { id: 'cryptography', name: 'Applied cryptography', category: 'Cybersecurity', description: 'Symmetric and asymmetric encryption, hashing, and how they are used in practice.' },
  { id: 'ethical-hacking', name: 'Ethical hacking', category: 'Cybersecurity' },

  // Networking
  { id: 'networking-fundamentals', name: 'Networking fundamentals', category: 'Networking', description: 'OSI and TCP/IP models, addressing, common protocols.' },

  // Operating systems
  { id: 'linux', name: 'Linux command line', category: 'Operating Systems' },
  { id: 'windows', name: 'Windows fundamentals', category: 'Operating Systems' },

  // Tools
  { id: 'nmap', name: 'Nmap', category: 'Security Tools' },
  { id: 'burp-suite', name: 'Burp Suite', category: 'Security Tools' },

  // Professional
  { id: 'technical-writing', name: 'Technical write-ups', category: 'Professional Skills', description: 'Documenting labs and investigations in a consistent, reusable format.' },
  { id: 'teamwork', name: 'Team collaboration', category: 'Professional Skills' },

  // Sample skills — replace or remove
  { id: 'python', name: 'Python', category: 'Programming', sample: true },
  { id: 'bash-scripting', name: 'Bash scripting', category: 'Programming', sample: true },
  { id: 'siem', name: 'SIEM queries', category: 'Security Tools', sample: true },
  { id: 'cloud-iam', name: 'Cloud IAM basics', category: 'Cloud Security', sample: true },
  { id: 'llm-tooling', name: 'LLM-assisted tooling', category: 'AI & Automation', sample: true },
  { id: 'html-css', name: 'HTML & CSS', category: 'Web Development', sample: true },
  { id: 'sql', name: 'SQL', category: 'Databases', sample: true },
];
