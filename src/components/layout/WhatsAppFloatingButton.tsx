'use client';

import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  PackageSearch,
  HelpCircle,
  Building2,
  Headset,
} from 'lucide-react';
import { useAdminStore } from '@/modules/admin/admin-store';
import { env } from '@/config/env';
import { buildWhatsAppUrl } from '@/lib/utils';

/**
 * Botón Flotante de WhatsApp MenteLúdica (Sección 16 del Prompt Maestro).
 * - Conectado dinámicamente al número comercial configurado desde Administración.
 * - Soporta las 5 acciones obligatorias:
 *   1. Consultas sobre productos.
 *   2. Consultas sobre pedidos.
 *   3. Solicitudes de personalización.
 *   4. Cotizaciones (colegios / empresas / eventos).
 *   5. Atención al cliente general.
 */
export function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const configuredPhone = useAdminStore(
    (state) => state.businessConfig.whatsappNumber
  );
  const activePhone = configuredPhone || env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const quickActions = [
    {
      label: '1. Consultas sobre productos y stock',
      icon: HelpCircle,
      message:
        'Hola MenteLúdica, deseo realizar una consulta sobre un producto del catálogo (SKU / disponibilidad).',
    },
    {
      label: '2. Consultas sobre el estado de mi pedido',
      icon: PackageSearch,
      message:
        'Hola MenteLúdica, quisiera consultar el estado de mi pedido con código ML-2026-',
    },
    {
      label: '3. Solicitudes de personalización a medida',
      icon: Sparkles,
      message:
        'Hola MenteLúdica, deseo solicitar un producto personalizado con fotografía, nombre o logotipo.',
    },
    {
      label: '4. Cotizaciones corporativas y colegios',
      icon: Building2,
      message:
        'Hola MenteLúdica, deseo solicitar una cotización por volumen para empresa / institución educativa.',
    },
    {
      label: '5. Atención al cliente y postventa',
      icon: Headset,
      message:
        'Hola MenteLúdica, necesito asistencia de atención al cliente en Arequipa / Perú.',
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-white border border-brand-neutral-200 shadow-premium-lg overflow-hidden">
          <div className="bg-brand-navy p-4 text-white flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-accent">
                WhatsApp Oficial · +{activePhone}
              </div>
              <div className="font-display font-bold text-sm mt-0.5">
                Centro de Atención MenteLúdica Perú
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Cerrar asistente de WhatsApp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-2 bg-brand-neutral-50">
            <p className="text-xs text-brand-neutral-600 mb-2">
              Elige el motivo de tu mensaje preconfigurado:
            </p>
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={buildWhatsAppUrl(activePhone, item.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-brand-neutral-200 hover:border-brand-navy text-xs font-semibold text-brand-navy transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-brand-accent shrink-0" />
                    {item.label}
                  </span>
                  <Send className="w-3.5 h-3.5 text-brand-neutral-600 group-hover:text-brand-navy shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contactar por WhatsApp"
        className="inline-flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white font-semibold text-xs shadow-premium-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">WhatsApp MenteLúdica</span>
      </button>
    </div>
  );
}
