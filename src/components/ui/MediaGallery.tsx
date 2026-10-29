import { ChevronLeft, ChevronRight, ExternalLink, FileText } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { MediaItem } from '@/types/content';
import { cn } from '@/lib/cn';
import { publicUrl } from '@/lib/paths';
import { Dialog } from './Dialog';
import { SmartImage } from './SmartImage';

const isDocument = (m: MediaItem) => m.kind === 'document' || /\.pdf($|\?)/i.test(m.src);

const kindLabel: Record<string, string> = {
  certificate: 'Certificate',
  diagram: 'Diagram',
  document: 'Document',
  cover: 'Cover',
  image: 'Image',
};

/** Thumbnails that open a full-size viewer. PDFs get an embedded preview with an "open" fallback. */
export function MediaGallery({ items, className }: { items: MediaItem[]; className?: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  if (!items.length) return null;
  const current = index !== null ? items[index] : null;
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length));

  return (
    <>
      <ul className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', className)}>
        {items.map((m, i) => (
          <li key={m.src + i}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group block w-full overflow-hidden rounded-xl border border-line bg-surface text-left transition-colors hover:border-muted/60"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-sunken">
                {isDocument(m) ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted">
                    <FileText size={28} aria-hidden="true" />
                    <span className="text-sm">PDF document</span>
                  </div>
                ) : (
                  <SmartImage src={m.src} alt={m.alt} fit="contain" className="h-full w-full p-3 transition-transform duration-300 group-hover:scale-[1.02]" />
                )}
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-2 text-sm">
                <span className="truncate">{m.caption ?? m.alt}</span>
                <span className="shrink-0 text-xs text-muted">{kindLabel[m.kind ?? 'image']}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={current !== null} onClose={close} label={current?.caption ?? current?.alt ?? 'Media viewer'} className="w-[min(64rem,calc(100vw-2rem))]">
        {current && (
          <figure className="flex flex-col">
            <div className="flex min-h-[40vh] items-center justify-center bg-sunken p-4 pt-14 sm:p-8 sm:pt-14">
              {isDocument(current) ? (
                <object data={publicUrl(current.src)} type="application/pdf" className="h-[70vh] w-full rounded-lg" aria-label={current.alt}>
                  <p className="text-sm text-muted">
                    This browser can't preview PDFs here.{' '}
                    <a className="link" href={publicUrl(current.src)} target="_blank" rel="noopener noreferrer">
                      Open the document
                    </a>
                    .
                  </p>
                </object>
              ) : (
                <SmartImage src={current.src} alt={current.alt} fit="contain" className="max-h-[70vh] w-full" />
              )}
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm">
              <span>{current.caption ?? current.alt}</span>
              <span className="flex items-center gap-1">
                {items.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label="Previous item" className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sunken">
                      <ChevronLeft size={18} aria-hidden="true" />
                    </button>
                    <span className="px-1 text-xs text-muted">
                      {index! + 1} of {items.length}
                    </span>
                    <button type="button" onClick={() => step(1)} aria-label="Next item" className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-sunken">
                      <ChevronRight size={18} aria-hidden="true" />
                    </button>
                  </>
                )}
                <a href={publicUrl(current.src)} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-muted hover:bg-sunken hover:text-ink">
                  <ExternalLink size={15} aria-hidden="true" />
                  Open original
                </a>
              </span>
            </figcaption>
          </figure>
        )}
      </Dialog>
    </>
  );
}
