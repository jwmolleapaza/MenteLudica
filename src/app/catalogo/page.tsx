import React, { Suspense } from 'react';
import { CatalogClientView } from '@/components/catalog/CatalogClientView';

export const metadata = {
  title: 'Catálogo de Juegos de Construcción, Rompecabezas, Juegos de Mesa y Personalizados',
  description:
    'Explora las 4 categorías y 29 subcategorías de MenteLúdica en Arequipa y Perú: bloques de construcción compatibles, rompecabezas de madera y personalizados, juegos de mesa y souvenirs.',
};

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-16 text-center text-sm text-brand-neutral-600">
          Cargando catálogo oficial MenteLúdica...
        </div>
      }
    >
      <CatalogClientView />
    </Suspense>
  );
}

