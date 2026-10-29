import { BookOpen } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import type { BookEntry } from '@/types/content';
import { Rating } from '../Rating';
import { BulletList, DetailSection, Paragraphs } from './primitives';

export default function BookDetail({ entry }: { entry: BookEntry }) {
  const cover = entry.media?.find((m) => m.kind === 'cover');
  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-lg border border-line bg-sunken">
          {cover ? (
            <SmartImage src={cover.src} alt={cover.alt} className="h-full w-full" />
          ) : (
            <div className="flex h-full flex-col justify-between bg-cat-books/10 p-3">
              <BookOpen size={18} aria-hidden="true" className="text-cat-books" />
              <p className="font-display text-sm font-semibold leading-tight">{entry.title}</p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <p className="text-lg">by {entry.authors.join(', ')}</p>
          {entry.rating ? <Rating value={entry.rating} /> : <p className="text-sm text-muted">Not rated yet</p>}
          {entry.notes && <Paragraphs text={entry.notes} />}
        </div>
      </div>
      {entry.description && <Paragraphs text={entry.description} />}
      {!!entry.takeaways?.length && (
        <DetailSection title="Key takeaways">
          <BulletList items={entry.takeaways} />
        </DetailSection>
      )}
    </>
  );
}
