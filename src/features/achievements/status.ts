import type { Tone } from '@/components/ui/Badge';
import { formatDate, isPast } from '@/lib/dates';
import type { CertificationEntry, EventRole } from '@/types/content';

export interface StatusInfo {
  label: string;
  tone: Tone;
}

export const progressStatus: Record<string, StatusInfo> = {
  completed: { label: 'Completed', tone: 'positive' },
  'in-progress': { label: 'In progress', tone: 'progress' },
  planned: { label: 'Planned', tone: 'planned' },
  archived: { label: 'Archived', tone: 'neutral' },
  withdrawn: { label: 'Withdrawn', tone: 'neutral' },
  earned: { label: 'Earned', tone: 'positive' },
  'want-to-read': { label: 'Want to read', tone: 'planned' },
  reading: { label: 'Currently reading', tone: 'progress' },
  'on-hold': { label: 'On hold', tone: 'neutral' },
};

export function certValidity(c: CertificationEntry): StatusInfo & { expired: boolean } {
  if (c.status === 'in-progress') return { label: 'In progress', tone: 'progress', expired: false };
  if (c.status === 'planned') return { label: 'Planned', tone: 'planned', expired: false };
  if (c.expires && isPast(c.expires)) return { label: 'Expired', tone: 'warning', expired: true };
  if (c.expires) return { label: `Valid until ${formatDate(c.expires)}`, tone: 'positive', expired: false };
  return { label: 'Valid, no expiry', tone: 'positive', expired: false };
}

export const eventRoleLabel: Record<EventRole, string> = {
  attendee: 'Attendee',
  speaker: 'Speaker',
  presenter: 'Presenter',
  exhibitor: 'Exhibitor',
  volunteer: 'Volunteer',
  organizer: 'Organiser',
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
