import React, { Suspense } from 'react';
import { CustomizationStudioClient } from '@/components/customizations/CustomizationStudioClient';

export const metadata = {
  title: 'Estudio de Personalización de Productos y Regalos a Medida',
  description:
    'Personaliza rompecabezas con fotografías, sets arquitectónicos con placa grabada, recuerdos para eventos y regalos corporativos con logotipo en MenteLúdica Arequipa y Perú.',
};

export default function PersonalizarPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-16 text-center text-sm text-brand-neutral-600">
          Cargando Estudio de Personalización MenteLúdica...
        </div>
      }
    >
      <CustomizationStudioClient />
    </Suspense>
  );
}

