/**
 * Content models for the ePortfolio.
 *
 * Every record has a stable `id`. Records point at each other with `Ref`s
 * ({ category, id }) and at skills with skill ids — content is never copied
 * between records. Timeline, featured and "related" views are all derived.
 */

export type CategoryKey =
  | 'courses'
  | 'certifications'
  | 'projects'
  | 'experience'
  | 'competitions'
  | 'workshops'
  | 'programs'
  | 'books'
  | 'volunteering'
  | 'events'
  | 'labs';

export interface Ref {
  category: CategoryKey;
  id: string;
}

/** Partial ISO date: 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD'. Leave undefined when unknown. */
export type PartialDate = string;

export type LinkKind =
  | 'official'
  | 'repository'
  | 'demo'
  | 'verification'
  | 'writeup'
  | 'documentation'
  | 'course'
  | 'other';

export interface LinkItem {
  label: string;
  url: string;
  kind?: LinkKind;
}

export type MediaKind = 'image' | 'diagram' | 'certificate' | 'document' | 'cover';

/** An image or document. Paths are relative to /public (e.g. '/media/cert.pdf'). */
export interface MediaItem {
  src: string;
  alt: string;
  caption?: string;
  kind?: MediaKind;
}

/** Fields shared by every achievement record. */
export interface BaseEntry {
  id: string;
  title: string;
  /** One or two sentences shown on cards and in search. */
  summary: string;
  /** Longer body text. Paragraphs separated by blank lines. */
  description?: string;
  /** Key date: completion, award, event day. */
  date?: PartialDate;
  startDate?: PartialDate;
  endDate?: PartialDate;
  /** Ongoing (no end date yet). */
  current?: boolean;
  tags?: string[];
  /** Skill ids from data/skills.ts. */
  skills?: string[];
  related?: Ref[];
  media?: MediaItem[];
  links?: LinkItem[];
  /** Show on the learning-journey timeline even when "milestones only" is on. */
  milestone?: boolean;
  /** Demonstration content. Hidden when site.content.showSampleData is false. */
  sample?: boolean;
}

export type ProgressStatus = 'completed' | 'in-progress' | 'planned';

export interface CourseEntry extends BaseEntry {
  provider: string;
  status: ProgressStatus;
  duration?: string;
  outcomes?: string[];
  topics?: string[];
  technologies?: string[];
  /** Whether a completion certificate exists, even if the file isn't uploaded. */
  hasCertificate?: boolean;
}

export type CertificationLevel = 'foundational' | 'associate' | 'professional' | 'expert' | 'specialty';

export interface CertificationEntry extends BaseEntry {
  issuer: string;
  status: 'earned' | 'in-progress' | 'planned';
  level?: CertificationLevel;
  /** Expiry date. Leave undefined for certifications that don't expire. */
  expires?: PartialDate;
  credentialId?: string;
  /** Hide the credential ID from the public page while keeping it in data. */
  hideCredentialId?: boolean;
}

export type ProjectType =
  | 'Cybersecurity'
  | 'Security Research'
  | 'Web Development'
  | 'AI'
  | 'Networking'
  | 'Digital Forensics';

export interface ProjectEntry extends BaseEntry {
  type: ProjectType;
  status: ProgressStatus | 'archived';
  context?: string;
  team?: 'solo' | number;
  problem?: string;
  objectives?: string[];
  contribution?: string;
  implementation?: string;
  technologies?: string[];
  features?: string[];
  challenges?: string[];
  results?: string[];
}

export type ExperienceType = 'employment' | 'internship' | 'research' | 'teaching' | 'freelance' | 'other';

export interface ExperienceEntry extends BaseEntry {
  organization: string;
  type: ExperienceType;
  location?: string;
  arrangement?: 'on-site' | 'remote' | 'hybrid';
  responsibilities?: string[];
  contributions?: string[];
  technologies?: string[];
  outcomes?: string[];
}

export interface CompetitionEntry extends BaseEntry {
  organizer: string;
  kind: 'CTF' | 'Hackathon' | 'Cyber range' | 'Quiz' | 'Other';
  format?: string;
  participation: 'individual' | 'team';
  teamName?: string;
  challengeCategories?: string[];
  /** Placement or result as officially published. Leave undefined if none. */
  result?: string;
  highlights?: string[];
}

export type DeliveryFormat = 'in-person' | 'online' | 'hybrid';

export interface WorkshopEntry extends BaseEntry {
  organizer: string;
  instructor?: string;
  duration?: string;
  format: DeliveryFormat;
  venue?: string;
  topics?: string[];
  activities?: string[];
}

export interface ProgramEntry extends BaseEntry {
  provider: string;
  status: ProgressStatus | 'withdrawn';
  duration?: string;
  format: DeliveryFormat;
  modules?: string[];
  objectives?: string[];
  technologies?: string[];
  exercises?: string[];
}

export interface BookEntry extends BaseEntry {
  authors: string[];
  publisher?: string;
  year?: number;
  subject?: string;
  isbn?: string;
  status: 'want-to-read' | 'reading' | 'completed' | 'on-hold';
  /** Personal rating, 1–5. */
  rating?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  takeaways?: string[];
}

export interface VolunteeringEntry extends BaseEntry {
  organization: string;
  role: string;
  location?: string;
  responsibilities?: string[];
  contributions?: string[];
  /** Measurable outcomes only — leave out when you don't have numbers. */
  outcomes?: string[];
}

export type EventRole = 'attendee' | 'speaker' | 'presenter' | 'exhibitor' | 'volunteer' | 'organizer';

export interface EventEntry extends BaseEntry {
  organizer: string;
  kind: 'conference' | 'exhibition' | 'forum' | 'summit' | 'meetup' | 'other';
  format: DeliveryFormat;
  venue?: string;
  role: EventRole;
  topics?: string[];
  speakers?: string[];
  takeaways?: string[];
}

export type LabCategory =
  | 'Networking'
  | 'Linux/Windows'
  | 'Web Security'
  | 'Penetration Testing'
  | 'Security Operations'
  | 'Digital Forensics'
  | 'Incident Response'
  | 'Cryptography'
  | 'Malware Analysis'
  | 'Cloud Security'
  | 'Security Automation';

export interface LabEntry extends BaseEntry {
  platform: string;
  labCategory: LabCategory;
  /** A platform lab (TryHackMe, HTB…) or your own independent experiment. */
  kind: 'platform' | 'independent';
  status: ProgressStatus;
  difficulty?: 'easy' | 'medium' | 'hard' | 'insane';
  environment?: string;
  tools?: string[];
  objectives?: string[];
  methodology?: string[];
  concepts?: string[];
  observations?: string[];
  notes?: string;
}

export interface EntryByCategory {
  courses: CourseEntry;
  certifications: CertificationEntry;
  projects: ProjectEntry;
  experience: ExperienceEntry;
  competitions: CompetitionEntry;
  workshops: WorkshopEntry;
  programs: ProgramEntry;
  books: BookEntry;
  volunteering: VolunteeringEntry;
  events: EventEntry;
  labs: LabEntry;
}

export type AnyEntry = EntryByCategory[CategoryKey];

/** An entry together with the category it belongs to. */
export interface Located<K extends CategoryKey = CategoryKey> {
  category: K;
  entry: EntryByCategory[K];
}

export type SkillCategory =
  | 'Programming'
  | 'Networking'
  | 'Cybersecurity'
  | 'Blue Team & Security Operations'
  | 'Digital Forensics & Incident Response'
  | 'Penetration Testing'
  | 'Operating Systems'
  | 'Security Tools'
  | 'Cloud Security'
  | 'AI & Automation'
  | 'Web Development'
  | 'Databases'
  | 'Professional Skills';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  sample?: boolean;
}

export type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'instagram'
  | 'x'
  | 'whatsapp'
  | 'youtube'
  | 'telegram'
  | 'discord'
  | 'medium'
  | 'email'
  | 'website'
  | 'tryhackme'
  | 'hackthebox'
  | 'custom';

export interface SocialProfile {
  id: string;
  platform: SocialPlatform;
  /** Display name for the platform (defaults to a built-in label). */
  label?: string;
  /** Full URL. For email use the address in `username`; for WhatsApp use `phone`. */
  url?: string;
  username?: string;
  /** WhatsApp: international format, digits only, e.g. '96890000000'. */
  phone?: string;
  /** WhatsApp: show the number as text. Off by default. */
  showPhone?: boolean;
  order: number;
  visible: boolean;
  featured?: boolean;
}
