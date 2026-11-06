import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'navy' | 'beige' | 'accent' | 'teal' | 'success' | 'warning' | 'outline';
  className?: string;
}

export function Badge({
  children,
  variant = 'beige',
  className,
}: BadgeProps) {
  const styles = {
    navy: 'bg-brand-navy text-white',
    beige: 'bg-brand-beige text-brand-navy border border-brand-beige-warm',
    accent: 'bg-brand-accent text-white',
    teal: 'bg-brand-accent-teal/15 text-brand-accent-teal border border-brand-accent-teal/30',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    outline: 'bg-white text-brand-navy border border-brand-neutral-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

