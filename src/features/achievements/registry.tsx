/**
 * UI definition for each achievement category: icon, status, card facts,
 * filters, detail facts and the category-specific detail layout.
 */
import {
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  FlaskConical,
  FolderGit2,
  GraduationCap,
  HandHeart,
  Layers,
  Presentation,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { lazy, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';
import { formatDate, formatRange } from '@/lib/dates';
import type { CategoryKey, EntryByCategory } from '@/types/content';
import { capitalize, certValidity, eventRoleLabel, progressStatus, type StatusInfo } from './status';

export interface FilterDef<E> {
  id: string;
  label: string;
  get: (e: E) => string | string[] | undefined;
  format?: (value: string) => string;
}

export interface Fact {
  label: string;
  value: ReactNode;
}

export interface CategoryUI<K extends CategoryKey> {
  icon: LucideIcon;
  /** CSS colour token suffix, e.g. 'labs' → text-cat-labs. */
  color: K;
  status: (e: EntryByCategory[K]) => StatusInfo | null;
  /** By-line shown under the title (provider, issuer, organisation…). */
  byline: (e: EntryByCategory[K]) => string;
  /** Extra short facts on cards (besides the date). */
  cardFacts: (e: EntryByCategory[K]) => string[];
  filters: FilterDef<EntryByCategory[K]>[];
  /** Facts for the detail page side panel. Empty values are skipped. */
  facts: (e: EntryByCategory[K]) => Array<Fact | false | undefined | null>;
  Detail: LazyExoticComponent<ComponentType<{ entry: EntryByCategory[K] }>>;
  /** The detail layout renders media itself instead of the generic evidence section. */
  mediaInDetail?: boolean;
}

type Registry = { [K in CategoryKey]: CategoryUI<K> };

const st = (s?: string) => (s ? progressStatus[s] ?? null : null);
const opt = (label: string, value: ReactNode | undefined | null | false) => (value ? { label, value } : null);
const range = (e: { startDate?: string; endDate?: string; current?: boolean; date?: string }) =>
  e.startDate || e.current ? formatRange(e.startDate, e.endDate, e.current) : formatDate(e.date) || undefined;

export const registry: Registry = {
  courses: {
    icon: GraduationCap,
    color: 'courses',
    status: (e) => st(e.status),
    byline: (e) => e.provider,
    cardFacts: (e) => [e.duration, e.hasCertificate ? 'Certificate' : undefined].filter(Boolean) as string[],
    filters: [
      { id: 'status', label: 'Status', get: (e) => e.status, format: (v) => progressStatus[v]?.label ?? v },
      { id: 'provider', label: 'Provider', get: (e) => e.provider },
      { id: 'topic', label: 'Topic', get: (e) => e.topics },
    ],
    facts: (e) => [
      opt('Provider', e.provider),
      opt(e.status === 'completed' ? 'Completed' : 'Dates', range(e)),
      opt('Duration', e.duration),
      opt('Certificate', e.hasCertificate ? 'Yes' : 'No'),
    ],
    Detail: lazy(() => import('./details/CourseDetail')),
  },
  certifications: {
    icon: Award,
    color: 'certifications',
    status: (e) => certValidity(e),
    byline: (e) => e.issuer,
    cardFacts: (e) => [e.level ? `${capitalize(e.level)} level` : undefined].filter(Boolean) as string[],
    filters: [
      { id: 'validity', label: 'Status', get: (e) => (certValidity(e).expired ? 'Expired' : certValidity(e).tone === 'positive' ? 'Valid' : certValidity(e).label) },
      { id: 'issuer', label: 'Issuer', get: (e) => e.issuer },
      { id: 'level', label: 'Level', get: (e) => e.level, format: capitalize },
    ],
    facts: (e) => [
      opt('Issuer', e.issuer),
      opt('Earned', formatDate(e.date)),
      opt('Expires', e.expires ? formatDate(e.expires) : e.status === 'earned' ? 'Does not expire' : undefined),
      opt('Level', e.level && capitalize(e.level)),
    ],
    Detail: lazy(() => import('./details/CertificationDetail')),
  },
  projects: {
    icon: FolderGit2,
    color: 'projects',
    status: (e) => st(e.status),
    byline: (e) => e.context ?? e.type,
    cardFacts: (e) => [e.type, e.team === 'solo' ? 'Solo' : e.team ? `Team of ${e.team}` : undefined, ...(e.technologies ?? []).slice(0, 2)].filter(Boolean) as string[],
    filters: [
      { id: 'type', label: 'Category', get: (e) => e.type },
      { id: 'status', label: 'Status', get: (e) => e.status, format: (v) => progressStatus[v]?.label ?? v },
      { id: 'tech', label: 'Technology', get: (e) => e.technologies },
    ],
    facts: (e) => [
      opt('Category', e.type),
      opt('Context', e.context),
      opt('Dates', range(e)),
      opt('Team', e.team === 'solo' ? 'Solo project' : e.team ? `${e.team} people` : undefined),
    ],
    Detail: lazy(() => import('./details/ProjectDetail')),
    mediaInDetail: true,
  },
  experience: {
    icon: Briefcase,
    color: 'experience',
    status: (e) => (e.current ? { label: 'Current', tone: 'progress' } : null),
    byline: (e) => e.organization,
    cardFacts: (e) => [capitalize(e.type), e.arrangement && capitalize(e.arrangement), e.location].filter(Boolean) as string[],
    filters: [
      { id: 'type', label: 'Type', get: (e) => e.type, format: capitalize },
      { id: 'arrangement', label: 'Arrangement', get: (e) => e.arrangement, format: capitalize },
      { id: 'current', label: 'Status', get: (e) => (e.current ? 'Current' : 'Past') },
    ],
    facts: (e) => [
      opt('Organisation', e.organization),
      opt('Type', capitalize(e.type)),
      opt('Dates', range(e)),
      opt('Location', e.location),
      opt('Arrangement', e.arrangement && capitalize(e.arrangement)),
    ],
    Detail: lazy(() => import('./details/ExperienceDetail')),
  },
  competitions: {
    icon: Trophy,
    color: 'competitions',
    status: (e) => (e.result ? { label: e.result, tone: 'warning' } : { label: 'Participated', tone: 'neutral' }),
    byline: (e) => e.organizer,
    cardFacts: (e) => [e.kind, e.participation === 'team' ? 'Team' : 'Individual', e.format].filter(Boolean) as string[],
    filters: [
      { id: 'kind', label: 'Type', get: (e) => e.kind },
      { id: 'participation', label: 'Participation', get: (e) => e.participation, format: capitalize },
      { id: 'outcome', label: 'Outcome', get: (e) => (e.result ? 'Placed' : 'Participated') },
    ],
    facts: (e) => [
      opt('Organiser', e.organizer),
      opt('Date', range(e)),
      opt('Format', e.format),
      opt('Team', e.participation === 'team' ? e.teamName ?? 'Yes' : 'Individual entry'),
      opt('Result', e.result ?? 'No placement reported'),
    ],
    Detail: lazy(() => import('./details/CompetitionDetail')),
  },
  workshops: {
    icon: Presentation,
    color: 'workshops',
    status: () => null,
    byline: (e) => e.organizer,
    cardFacts: (e) => [capitalize(e.format), e.duration].filter(Boolean) as string[],
    filters: [
      { id: 'format', label: 'Format', get: (e) => e.format, format: capitalize },
      { id: 'organizer', label: 'Organiser', get: (e) => e.organizer },
      { id: 'topic', label: 'Topic', get: (e) => e.topics },
    ],
    facts: (e) => [
      opt('Organiser', e.organizer),
      opt('Instructor', e.instructor),
      opt('Date', range(e)),
      opt('Duration', e.duration),
      opt('Format', capitalize(e.format)),
      opt('Venue', e.venue),
    ],
    Detail: lazy(() => import('./details/WorkshopDetail')),
  },
  programs: {
    icon: Layers,
    color: 'programs',
    status: (e) => st(e.status),
    byline: (e) => e.provider,
    cardFacts: (e) => [e.duration, capitalize(e.format), e.modules?.length ? `${e.modules.length} modules` : undefined].filter(Boolean) as string[],
    filters: [
      { id: 'status', label: 'Status', get: (e) => e.status, format: (v) => progressStatus[v]?.label ?? v },
      { id: 'format', label: 'Format', get: (e) => e.format, format: capitalize },
      { id: 'provider', label: 'Provider', get: (e) => e.provider },
    ],
    facts: (e) => [
      opt('Provider', e.provider),
      opt('Dates', range(e)),
      opt('Duration', e.duration),
      opt('Format', capitalize(e.format)),
    ],
    Detail: lazy(() => import('./details/ProgramDetail')),
  },
  books: {
    icon: BookOpen,
    color: 'books',
    status: (e) => st(e.status),
    byline: (e) => e.authors.join(', '),
    cardFacts: (e) => [e.subject, e.year ? String(e.year) : undefined].filter(Boolean) as string[],
    filters: [
      { id: 'status', label: 'Reading status', get: (e) => e.status, format: (v) => progressStatus[v]?.label ?? v },
      { id: 'subject', label: 'Subject', get: (e) => e.subject },
    ],
    facts: (e) => [
      opt('Author', e.authors.join(', ')),
      opt('Publisher', e.publisher),
      opt('Published', e.year),
      opt('Subject', e.subject),
      opt('ISBN', e.isbn && <span className="tabular-nums">{e.isbn}</span>),
      opt('Reading', e.startDate || e.endDate ? formatRange(e.startDate, e.endDate, e.status === 'reading') : undefined),
    ],
    Detail: lazy(() => import('./details/BookDetail')),
  },
  volunteering: {
    icon: HandHeart,
    color: 'volunteering',
    status: (e) => (e.current ? { label: 'Current', tone: 'progress' } : null),
    byline: (e) => `${e.role}, ${e.organization}`,
    cardFacts: (e) => [e.location].filter(Boolean) as string[],
    filters: [
      { id: 'organization', label: 'Organisation', get: (e) => e.organization },
      { id: 'role', label: 'Role', get: (e) => e.role },
    ],
    facts: (e) => [opt('Organisation', e.organization), opt('Role', e.role), opt('Dates', range(e)), opt('Location', e.location)],
    Detail: lazy(() => import('./details/VolunteeringDetail')),
  },
  events: {
    icon: CalendarDays,
    color: 'events',
    status: (e) => ({ label: eventRoleLabel[e.role], tone: e.role === 'attendee' ? 'neutral' : 'accent' }),
    byline: (e) => e.organizer,
    cardFacts: (e) => [capitalize(e.kind), capitalize(e.format)],
    filters: [
      { id: 'role', label: 'My role', get: (e) => e.role, format: (v) => eventRoleLabel[v as keyof typeof eventRoleLabel] ?? v },
      { id: 'kind', label: 'Type', get: (e) => e.kind, format: capitalize },
      { id: 'format', label: 'Format', get: (e) => e.format, format: capitalize },
    ],
    facts: (e) => [
      opt('Organiser', e.organizer),
      opt('Date', e.endDate && e.date ? formatRange(e.date, e.endDate) : formatDate(e.date)),
      opt('Type', capitalize(e.kind)),
      opt('Format', capitalize(e.format)),
      opt('Venue', e.venue),
    ],
    Detail: lazy(() => import('./details/EventDetail')),
  },
  labs: {
    icon: FlaskConical,
    color: 'labs',
    status: (e) => st(e.status),
    byline: (e) => (e.kind === 'independent' ? `Independent experiment, ${e.platform}` : e.platform),
    cardFacts: (e) => [e.labCategory, e.difficulty && capitalize(e.difficulty)].filter(Boolean) as string[],
    filters: [
      { id: 'kind', label: 'Type', get: (e) => e.kind, format: (v) => (v === 'platform' ? 'Platform lab' : 'Independent experiment') },
      { id: 'category', label: 'Category', get: (e) => e.labCategory },
      { id: 'platform', label: 'Platform', get: (e) => e.platform },
      { id: 'difficulty', label: 'Difficulty', get: (e) => e.difficulty, format: capitalize },
    ],
    facts: (e) => [
      opt('Platform', e.platform),
      opt('Type', e.kind === 'platform' ? 'Platform lab' : 'Independent experiment'),
      opt('Category', e.labCategory),
      opt('Difficulty', e.difficulty && capitalize(e.difficulty)),
      opt('Completed', formatDate(e.date)),
    ],
    Detail: lazy(() => import('./details/LabDetail')),
  },
};

export function getUI<K extends CategoryKey>(category: K): CategoryUI<K> {
  return registry[category] as unknown as CategoryUI<K>;
}
