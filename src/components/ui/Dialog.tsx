import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  /** Hide the built-in close button (when the content provides its own). */
  bare?: boolean;
}

/**
 * Accessible modal built on the native <dialog>: focus is trapped and Escape
 * closes it. Clicking the backdrop closes it too. Focus returns to the
 * element that opened it.
 */
export function Dialog({ open, onClose, label, children, className, bare }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement | null;
      d.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClosed = () => {
      document.body.style.overflow = '';
      opener.current?.focus?.();
      onClose();
    };
    d.addEventListener('close', onClosed);
    return () => d.removeEventListener('close', onClosed);
  }, [onClose]);

  useEffect(() => () => void (document.body.style.overflow = ''), []);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      className={cn('m-auto max-h-[90dvh] w-[min(42rem,calc(100vw-2rem))] overflow-visible rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl shadow-black/20', className)}
    >
      {open && (
        <div className="relative max-h-[90dvh] overflow-auto">
          {!bare && (
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-sunken hover:text-ink"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
          {children}
        </div>
      )}
    </dialog>
  );
}
