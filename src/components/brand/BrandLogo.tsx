import React from 'react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

/**
 * Logotipo e Isotipo Oficial de MenteLúdica – Aprendizaje y Diversión.
 * Estética: Premium + Minimalista + Creativo.
 * El isotipo combina un cubo isométrico arquitectónico de bloques y encaje de rompecabezas.
 */
export function BrandLogo({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className,
}: BrandLogoProps) {
  const isLight = variant === 'light';

  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={cn('inline-flex items-center gap-3 select-none group', className)}>
      {/* Isotipo Geométrico Lúdico Premium */}
      <div
        className={cn(
          'relative rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm',
          dimensions,
          isLight
            ? 'bg-white/10 border border-white/15'
            : 'bg-brand-navy text-white'
        )}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          aria-hidden="true"
        >
          {/* Cara superior del bloque creativo (Ámbar Cálido) */}
          <path
            d="M20 6L32 13L20 20L8 13L20 6Z"
            fill="#D97706"
          />
          {/* Cara izquierda estructural (Beige Suave) */}
          <path
            d="M8 13L20 20V34L8 27V13Z"
            fill="#F5EFE6"
          />
          {/* Cara derecha de precisión (Teal / Contraste Lúdico) */}
          <path
            d="M32 13L20 20V34L32 27V13Z"
            fill="#0D9488"
          />
          {/* Pin conector superior estilo bloque de construcción */}
          <ellipse cx="20" cy="12.5" rx="3.5" ry="2" fill="#FFFBEB" />
        </svg>
      </div>

      {/* Logotipo Tipográfico */}
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display font-bold tracking-tight',
            titleSizes,
            isLight ? 'text-white' : 'text-brand-navy'
          )}
        >
          Mente<span className="text-brand-accent">Lúdica</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              'text-[10px] font-semibold uppercase tracking-[0.18em] mt-1',
              isLight ? 'text-brand-beige/80' : 'text-brand-neutral-600'
            )}
          >
            Aprendizaje y Diversión
          </span>
        )}
      </div>
    </div>
  );
}

