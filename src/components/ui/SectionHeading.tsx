import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8',
        align === 'center' && 'md:flex-col md:items-center text-center',
        className
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm md:text-base text-brand-neutral-600 mt-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

