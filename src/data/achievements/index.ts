import type { CategoryKey, EntryByCategory } from '@/types/content';
import { books } from './books';
import { certifications } from './certifications';
import { competitions } from './competitions';
import { courses } from './courses';
import { events } from './events';
import { experience } from './experience';
import { labs } from './labs';
import { programs } from './programs';
import { projects } from './projects';
import { volunteering } from './volunteering';
import { workshops } from './workshops';

/** Raw local content, keyed by category. Read it through src/lib/repository.ts. */
export const rawCollections: { [K in CategoryKey]: EntryByCategory[K][] } = {
  courses,
  certifications,
  projects,
  experience,
  competitions,
  workshops,
  programs,
  books,
  volunteering,
  events,
  labs,
};
