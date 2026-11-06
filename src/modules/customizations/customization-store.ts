'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomizationProductionStatus } from '@/types/database';

export const ALLOWED_CUSTOMIZATION_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
] as const;

export const MAX_CUSTOMIZATION_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export interface CustomizationFileMetadata {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  previewDataUrl?: string;
}

export interface CustomizationRequestRecord {
  id: string;
  requestCode: string;
  requestedAt: string;
  productId: string;
  productName: string;
  productSku: string;
  variantId: string;
  variantName: string;
  selectedStyleOption: string;
  customText: string;
  specialInstructions: string;
  attachedFiles: CustomizationFileMetadata[];
  basePrice: number;
  additionalPrice: number;
  finalUnitPrice: number;
  quantity: number;
  productionStatus: CustomizationProductionStatus;
  observations: string;
  designApprovalStatus: 'PENDIENTE' | 'APROBADO_CLIENTE' | 'CAMBIOS_SOLICITADOS';
}

export const CUSTOMIZATION_STATUS_PIPELINE: {
  code: CustomizationProductionStatus;
  label: string;
  description: string;
}[] = [
  {
    code: 'PENDIENTE_REVISION',
    label: '1. Pendiente de revisión',
    description: 'Verificación de resolución de fotografías, logotipos y textos.',
  },
  {
    code: 'EN_DISENO',
    label: '2. En diseño',
    description: 'Maquetación digital, ajuste de color o vectorización láser.',
  },
  {
    code: 'ESPERANDO_APROBACION',
    label: '3. Esperando aprobación',
    description: 'Propuesta enviada al cliente para confirmación antes de producir.',
  },
  {
    code: 'APROBADO',
    label: '4. Aprobado',
    description: 'Diseño validado por el cliente y liberado para taller.',
  },
  {
    code: 'EN_PRODUCCION',
    label: '5. En producción',
    description: 'Corte láser, grabado o impresión fotográfica en proceso.',
  },
  {
    code: 'TERMINADO',
    label: '6. Terminado',
    description: 'Control de calidad superado y empaque especial completado.',
  },
  {
    code: 'ENTREGADO',
    label: '7. Entregado',
    description: 'Entregado al cliente o despachado con seguimiento.',
  },
];

/**
 * Valida formato MIME, extensión y tamaño máximo de un archivo subido para personalización.
 */
export function validateCustomizationFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (
    !ALLOWED_CUSTOMIZATION_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_CUSTOMIZATION_MIME_TYPES)[number]
    )
  ) {
    return {
      valid: false,
      error: `Formato no permitido (${file.type || 'desconocido'}). Solo se aceptan JPG, PNG, WEBP, SVG o PDF.`,
    };
  }

  if (file.size > MAX_CUSTOMIZATION_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `El archivo supera el límite de 15 MB (${sizeMB} MB).`,
    };
  }

  const dangerousPattern = /\.(exe|bat|cmd|sh|js|php|py|dll|msi)$/i;
  if (dangerousPattern.test(file.name)) {
    return {
      valid: false,
      error: 'Nombre de archivo bloqueado por políticas de seguridad.',
    };
  }

  return { valid: true };
}

interface CustomizationStoreState {
  requests: CustomizationRequestRecord[];
  registerRequest: (
    payload: Omit<
      CustomizationRequestRecord,
      'id' | 'requestCode' | 'requestedAt' | 'productionStatus' | 'designApprovalStatus'
    >
  ) => CustomizationRequestRecord;
  updateProductionStatus: (
    id: string,
    status: CustomizationProductionStatus,
    observations?: string
  ) => void;
  approveDesignByCustomer: (id: string) => void;
}

export const useCustomizationStore = create<CustomizationStoreState>()(
  persist(
    (set, get) => ({
      requests: [
        {
          id: 'cust-demo-01',
          requestCode: 'PERS-2026-001',
          requestedAt: new Date().toISOString(),
          productId: 'prod-004',
          productName:
            'Rompecabezas Fotográfico Personalizado en Acabado Mate Antirreflejo',
          productSku: 'ML-ROM-PER-004-500',
          variantId: 'var-004-b',
          variantName: '500 Piezas (48 x 34 cm)',
          selectedStyleOption: 'Caja Rígida con Dedicatoria + Marco Guía',
          customText: 'Familia Paredes Gómez · Arequipa 2026',
          specialInstructions:
            'Centrar la fotografía familiar e incluir la frase en la tapa de la caja.',
          attachedFiles: [
            {
              fileName: 'foto-familiar-arequipa-hd.jpg',
              mimeType: 'image/jpeg',
              sizeBytes: 2450120,
            },
          ],
          basePrice: 87.0,
          additionalPrice: 12.0,
          finalUnitPrice: 99.0,
          quantity: 1,
          productionStatus: 'ESPERANDO_APROBACION',
          observations:
            'Previsualización digital lista para revisión y aprobación del cliente.',
          designApprovalStatus: 'PENDIENTE',
        },
      ],

      registerRequest: (payload) => {
        const seq = (get().requests.length + 2).toString().padStart(3, '0');
        const record: CustomizationRequestRecord = {
          ...payload,
          id: `cust-${Date.now()}`,
          requestCode: `PERS-${new Date().getFullYear()}-${seq}`,
          requestedAt: new Date().toISOString(),
          productionStatus: 'PENDIENTE_REVISION',
          designApprovalStatus: 'PENDIENTE',
        };

        set((state) => ({
          requests: [record, ...state.requests],
        }));

        return record;
      },

      updateProductionStatus: (id, productionStatus, observations) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  productionStatus,
                  observations: observations ?? r.observations,
                }
              : r
          ),
        }));
      },

      approveDesignByCustomer: (id) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  designApprovalStatus: 'APROBADO_CLIENTE',
                  productionStatus: 'APROBADO',
                  observations:
                    'Diseño aprobado por el cliente desde la plataforma. Pasa a taller de producción.',
                }
              : r
          ),
        }));
      },
    }),
    {
      name: 'menteludica-customizations-storage',
    }
  )
);

