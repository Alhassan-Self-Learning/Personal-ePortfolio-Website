import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { publicUrl } from '@/lib/paths';

type Variant = 'primary' | 'secondary' | 'ghost';

// One button shape for the whole site: square corners, 44px tall, flat fill.
const base =
  'inline-flex items-center justify-center gap-2 text-base font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';
const variants: Record<Variant, string> = {
  primary: 'h-11 px-5 bg-accent text-accent-ink hover:bg-ink hover:text-bg',
  secondary: 'h-11 px-5 bg-surface text-ink hover:bg-sunken',
  ghost: 'h-11 px-1 text-ink underline decoration-[1.5px] underline-offset-[5px] hover:text-accent',
};

function buttonClass(variant: Variant = 'secondary', className?: string) {
  return cn(base, variants[variant], className);
}

interface LinkButtonProps {
  to: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

/** Internal routes use the router; http(s)/mailto/file links open normally. */
export function LinkButton({ to, variant = 'secondary', className, children, ...rest }: LinkButtonProps & Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  const external = /^(https?:|mailto:|tel:)/.test(to);
  if (external || rest.download !== undefined) {
    return (
      <a
        href={external ? to : publicUrl(to)}
        className={buttonClass(variant, className)}
        {...(external && to.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({ variant = 'secondary', className, ...props }: ComponentPropsWithoutRef<'button'> & { variant?: Variant }) {
  return <button type="button" className={buttonClass(variant, className)} {...props} />;
}

export const IconButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'> & { label: string }>(function IconButton(
  { label, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn('inline-flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-surface active:scale-95', className)}
      {...props}
    >
      {children}
    </button>
  );
});
