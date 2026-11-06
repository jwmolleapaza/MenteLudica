import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-brand-navy text-white hover:bg-brand-navy-light active:bg-brand-navy-dark shadow-sm',
      accent:
        'bg-brand-accent text-white hover:bg-brand-accent-hover shadow-sm',
      secondary:
        'bg-brand-beige text-brand-navy hover:bg-brand-beige-warm',
      outline:
        'border border-brand-navy/20 bg-white text-brand-navy hover:border-brand-navy hover:bg-brand-neutral-50',
      ghost:
        'bg-transparent text-brand-navy hover:bg-brand-neutral-100',
      whatsapp:
        'bg-[#128C7E] text-white hover:bg-[#075E54] shadow-sm',
    };

    const sizes = {
      sm: 'h-9 px-3.5 text-xs rounded-lg gap-1.5',
      md: 'h-11 px-5 text-sm rounded-xl gap-2',
      lg: 'h-13 px-7 py-3.5 text-base rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

