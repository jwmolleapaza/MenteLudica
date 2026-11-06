'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ArrowRight, MessageCircle, X } from 'lucide-react';
import { useCartStore } from '@/modules/cart/cart-store';
import { useAdminStore } from '@/modules/admin/admin-store';
import { formatCurrencyPEN, buildWhatsAppUrl } from '@/lib/utils';

/**
 * Módulo de Recuperación de Carritos Abandonados (Sección 15 del Prompt Maestro).
 * Cuando el usuario tiene artículos pendientes en su carrito y navega fuera de /carrito o /checkout,
 * le permite retomar su compra con un clic o enviarse el resumen a WhatsApp con cupón de bienvenida.
 */
export function AbandonedCartRecoveryBar() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const whatsappNumber = useAdminStore(
    (state) => state.businessConfig.whatsappNumber
  );
  const [dismissed, setDismissed] = useState(false);

  if (
    dismissed ||
    items.length === 0 ||
    pathname === '/carrito' ||
    pathname === '/checkout' ||
    pathname.startsWith('/admin')
  ) {
    return null;
  }

  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + (i.unitPrice + i.customizationFee) * i.quantity,
    0
  );

  const whatsappRecoveryUrl = buildWhatsAppUrl(
    whatsappNumber,
    `Hola MenteLúdica, tengo un carrito pendiente por ${formatCurrencyPEN(subtotal)} (${items.map((i) => `${i.quantity}x ${i.name} [${i.sku}]`).join(', ')}) y deseo finalizar mi compra.`
  );

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm bg-brand-navy text-white rounded-2xl border border-white/15 p-4 shadow-premium-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-accent text-white flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-brand-beige">
              Tienes {totalUnits} {totalUnits === 1 ? 'producto' : 'productos'}{' '}
              en espera
            </div>
            <div className="text-[11px] text-brand-neutral-200">
              Subtotal acumulado: <strong>{formatCurrencyPEN(subtotal)}</strong>{' '}
              · Usa <strong>BIENVENIDA10</strong>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-white/60 hover:text-white p-1"
          aria-label="Ocultar recordatorio de carrito"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href="/checkout"
          className="flex-1 h-9 px-3 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
        >
          Retomar Compra
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <a
          href={whatsappRecoveryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 px-3 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

