import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';

/** Lazy image with a graceful fallback when the file is missing. */
export function SmartImage({ src, alt, className, fit = 'cover' }: { src: string; alt: string; className?: string; fit?: 'cover' | 'contain' }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div role="img" aria-label={`${alt} (image unavailable)`} className={cn('flex flex-col items-center justify-center gap-2 bg-sunken text-xs text-muted', className)}>
        <ImageOff size={20} aria-hidden="true" />
        Image unavailable
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(fit === 'cover' ? 'object-cover' : 'object-contain', className)}
    />
  );
}
