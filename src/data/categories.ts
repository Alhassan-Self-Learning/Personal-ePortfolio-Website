import type { CategoryKey } from '@/types/content';

/**
 * Plain metadata for each achievement category (no React, so build scripts
 * can import it too). Icons, filters and layouts live in
 * src/features/achievements/registry.tsx.
 */
export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  singular: string;
  /** URL path for the category list. Entries live at `${path}/${id}`. */
  path: string;
  description: string;
  /** Text shown when the category has no entries. */
  emptyHint: string;
}

export const categoryOrder: CategoryKey[] = [
  'courses',
  'certifications',
  'projects',
  'experience',
  'competitions',
  'workshops',
  'programs',
  'books',
  'volunteering',
  'events',
  'labs',
];

export const categoryMeta: Record<CategoryKey, CategoryMeta> = {
  courses: {
    key: 'courses',
    label: 'Completed Courses',
    singular: 'Course',
    path: '/achievements/courses',
    description: 'Structured courses, what they covered and what I took from them.',
    emptyHint: 'Add a course to src/data/achievements/courses.ts.',
  },
  certifications: {
    key: 'certifications',
    label: 'Certifications',
    singular: 'Certification',
    path: '/achievements/certifications',
    description: 'Industry certifications with credential details and verification links.',
    emptyHint: 'Add a certification to src/data/achievements/certifications.ts.',
  },
  projects: {
    key: 'projects',
    label: 'Projects',
    singular: 'Project',
    path: '/projects',
    description: 'Things I built or investigated: the problem, my part in it, and the result.',
    emptyHint: 'Add a project to src/data/achievements/projects.ts.',
  },
  experience: {
    key: 'experience',
    label: 'Experience',
    singular: 'Experience',
    path: '/experience',
    description: 'Employment, internships, research and other roles.',
    emptyHint: 'Add a role to src/data/achievements/experience.ts.',
  },
  competitions: {
    key: 'competitions',
    label: 'Competitions & Tournaments',
    singular: 'Competition',
    path: '/achievements/competitions',
    description: 'CTFs and other competitions — with or without a placement.',
    emptyHint: 'Add a competition to src/data/achievements/competitions.ts.',
  },
  workshops: {
    key: 'workshops',
    label: 'Workshops',
    singular: 'Workshop',
    path: '/achievements/workshops',
    description: 'Short, hands-on sessions and what I practised in them.',
    emptyHint: 'Add a workshop to src/data/achievements/workshops.ts.',
  },
  programs: {
    key: 'programs',
    label: 'Bootcamps & Programs',
    singular: 'Program',
    path: '/achievements/programs',
    description: 'Multi-week bootcamps and training programmes, module by module.',
    emptyHint: 'Add a programme to src/data/achievements/programs.ts.',
  },
  books: {
    key: 'books',
    label: 'Books',
    singular: 'Book',
    path: '/achievements/books',
    description: "What I'm reading, have read and want to read, with notes.",
    emptyHint: 'Add a book to src/data/achievements/books.ts.',
  },
  volunteering: {
    key: 'volunteering',
    label: 'Volunteering',
    singular: 'Volunteering role',
    path: '/achievements/volunteering',
    description: 'Time given to communities, clubs and initiatives.',
    emptyHint: 'Add a volunteering role to src/data/achievements/volunteering.ts.',
  },
  events: {
    key: 'events',
    label: 'Events, Exhibitions & Forums',
    singular: 'Event',
    path: '/achievements/events',
    description: 'Conferences, exhibitions and forums — and whether I attended, presented or helped run them.',
    emptyHint: 'Add an event to src/data/achievements/events.ts.',
  },
  labs: {
    key: 'labs',
    label: 'Labs',
    singular: 'Lab',
    path: '/achievements/labs',
    description: 'Hands-on platform labs and independent experiments, with what each one taught me.',
    emptyHint: 'Add a lab to src/data/achievements/labs.ts.',
  },
};

export function entryPath(category: CategoryKey, id: string): string {
  return `${categoryMeta[category].path}/${id}`;
}
