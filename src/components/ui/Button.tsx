import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-[background-color,border-color,color,transform] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50';
const variants: Record<Variant, string> = {
  primary: 'h-10 px-4 bg-accent text-accent-ink hover:bg-accent/90',
  secondary: 'h-10 px-4 border border-line bg-surface text-ink hover:border-muted/60',
  ghost: 'h-9 px-3 text-muted hover:text-ink hover:bg-sunken/60',
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
        href={to}
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
      className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-sunken/70 hover:text-ink', className)}
      {...props}
    >
      {children}
    </button>
  );
});
