import type { Ref } from '@/types/content';

/**
 * Central personal configuration. Edit this file first.
 *
 * Values set to `null` are treated as "not configured": the UI hides the
 * related button or link instead of showing a broken one. In development a
 * setup checklist (bottom-left) lists anything still unconfigured.
 */
export const site = {
  /**
   * Public URL of the deployed site, without trailing slash, including any
   * sub-folder. Used for canonical URLs, sitemap.xml and the social preview image.
   */
  url: 'https://alhassan-self-learning.github.io/Personal-ePortfolio-Website' as string | null,

  /**
   * Sub-folder the site is served from, with leading and trailing slashes.
   * GitHub Pages project sites live under '/<repo-name>/'. Use '/' for
   * Netlify, Vercel, a custom domain, or a '<username>.github.io' repo.
   */
  basePath: '/Personal-ePortfolio-Website/',

  profile: {
    fullName: 'Your Full Name',
    /** Shorter name or handle used in the header and footer. */
    displayName: 'IX_Special',
    /** Two letters drawn in the monogram and favicon. */
    monogram: 'IX',
    headline: 'Cybersecurity student working toward security operations and DFIR',
    university: 'German University of Technology in Oman (GUtech)',
    degree: "Bachelor's degree in Cybersecurity",
    specialization: 'Cybersecurity',
    academicStatus: 'Final-year student',
    shortBio:
      'Final-year Cybersecurity student at GUtech in Oman. I focus on security operations, digital forensics and incident response, and I learn by doing: hands-on labs, CTFs and a write-up for everything I work through.',
    longBio: [
      "I'm a final-year Cybersecurity student at the German University of Technology in Oman. My coursework has centred on SOC operations, ethical hacking, applied cryptography, computer networks and risk management.",
      'Outside the classroom I build skills on TryHackMe, Hack The Box, PortSwigger Web Security Academy and picoCTF, and work through structured labs such as SEED Labs. I write up what I learn and keep it in a personal knowledge base, so every topic I study leaves something behind I can come back to.',
      "My first goal is a SOC Analyst role. From there I want to grow into digital forensics and incident response, the part of security where you work out what actually happened.",
    ],
    careerInterests: [
      'Security operations (SOC)',
      'Digital forensics and incident response',
      'Ethical hacking',
      'Applied cryptography',
      'Risk management',
    ],
    /**
     * Portrait with a transparent background (it stands in front of the
     * homepage band). null shows the monogram instead.
     */
    profileImage: '/media/portrait.webp' as string | null,
    /** Small square crop of the same photograph, used beside the contact links. */
    profileImageSquare: '/media/portrait-square.webp' as string | null,
    /** Close-ups of the massar embroidery from the same photograph. */
    detailImages: [
      { src: '/media/massar-detail.webp', alt: 'Close-up of the embroidered massar from the portrait above' },
      { src: '/media/massar-closeup.webp', alt: 'Detail of the paisley and flower embroidery on the massar' },
    ],
    /** e.g. '/cv.pdf' in /public. null hides the download button. */
    cvPath: null as string | null,
    /** Public contact email. null hides email links. */
    email: null as string | null,
    /** Optional public location. null hides it. */
    location: 'Oman' as string | null,
    /** Shown on the Contact page. */
    availability: 'Open to SOC analyst internships and graduate roles.',
  },

  /** Where you are now and where you're heading — shown on the About page. */
  path: [
    { label: 'Now', title: 'Final-year Cybersecurity student', detail: 'GUtech, Oman' },
    { label: 'First role', title: 'SOC Analyst', detail: 'Monitoring, triage and alert investigation' },
    { label: 'Growth', title: 'Digital Forensics & Incident Response', detail: 'Investigation, evidence handling and response' },
  ],

  /** Records shown in the homepage "Featured" section, in this order. */
  featured: [
    { category: 'projects', id: 'ethical-hacking-assessment' },
    { category: 'labs', id: 'thm-soc-role-blue-team' },
    { category: 'labs', id: 'thm-simple-ctf' },
    { category: 'projects', id: 'sample-log-triage-tool' },
  ] as Ref[],

  content: {
    /** Set to false to hide every record marked `sample: true`. */
    showSampleData: true,
  },

  theme: {
    /** 'system' follows the visitor's OS setting until they choose. */
    default: 'system' as 'light' | 'dark' | 'system',
  },
};

export type SiteConfig = typeof site;
