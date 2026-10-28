import { Star } from 'lucide-react';

export function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={15} aria-hidden="true" className={n <= value ? 'fill-cat-certifications text-cat-certifications' : 'text-line'} />
      ))}
    </span>
  );
}
