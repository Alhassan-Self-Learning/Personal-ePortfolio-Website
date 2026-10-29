import type { BaseEntry, PartialDate } from '@/types/content';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Parts {
  year: number;
  month?: number;
  day?: number;
}

export function parsePartialDate(value?: PartialDate): Parts | null {
  if (!value) return null;
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value.trim());
  if (!m) return null;
  return { year: Number(m[1]), month: m[2] ? Number(m[2]) : undefined, day: m[3] ? Number(m[3]) : undefined };
}

/** Sortable key 'YYYY-MM-DD' (missing parts become 00). Empty string when unknown. */
export function dateKey(value?: PartialDate): string {
  const p = parsePartialDate(value);
  if (!p) return '';
  const pad = (n?: number) => String(n ?? 0).padStart(2, '0');
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function formatDate(value?: PartialDate): string {
  const p = parsePartialDate(value);
  if (!p) return '';
  if (!p.month) return String(p.year);
  if (!p.day) return `${MONTHS[p.month - 1]} ${p.year}`;
  return `${p.day} ${MONTHS[p.month - 1]} ${p.year}`;
}

export function formatRange(start?: PartialDate, end?: PartialDate, current?: boolean): string {
  const s = formatDate(start);
  const e = current ? 'present' : formatDate(end);
  if (s && e) return s === e ? s : `${s} – ${e}`;
  if (s) return current ? `${s} – present` : s;
  return e === 'present' ? 'Ongoing' : e;
}

export function todayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** The date an entry is sorted and placed on the timeline by. */
export function primaryDateKey(entry: BaseEntry, now = new Date()): string {
  if (entry.date) return dateKey(entry.date);
  if (entry.endDate) return dateKey(entry.endDate);
  if (entry.current) return todayKey(now);
  return dateKey(entry.startDate);
}

/** Human date label for an entry: a range when it has one, otherwise its key date. */
export function entryDateLabel(entry: BaseEntry): string {
  if (entry.startDate || entry.current) {
    const end = entry.endDate ?? (entry.date && entry.date !== entry.startDate ? entry.date : undefined);
    return formatRange(entry.startDate, end, entry.current);
  }
  if (entry.date && entry.endDate) return formatRange(entry.date, entry.endDate);
  return formatDate(entry.date ?? entry.endDate);
}

export function yearOf(key: string): string {
  return key ? key.slice(0, 4) : '';
}

/** True when a partial date is before today (month-precision dates expire at month end). */
export function isPast(value: PartialDate | undefined, now = new Date()): boolean {
  const p = parsePartialDate(value);
  if (!p) return false;
  const end = new Date(Date.UTC(p.year, p.month ? (p.day ? p.month - 1 : p.month) : 12, p.day ?? 0, 23, 59, 59));
  return end.getTime() < now.getTime();
}
