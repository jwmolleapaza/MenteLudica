'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  Truck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useCartStore } from '@/modules/cart/cart-store';
import {
  DEFAULT_SHIPPING_CONFIG,
  calculateConfigurableShipping,
} from '@/config/shipping-settings';
import { DeliveryModality } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyPEN } from '@/lib/utils';

/**
 * Página del Carrito de Compras MenteLúdica (Sección 9 del Prompt Maestro).
 * Permite:
 * - Añadir / modificar cantidades
 * - Eliminar productos
 * - Visualizar variantes y personalizaciones asociadas
 * - Aplicar cupones de descuento (BIENVENIDA10, AREQUIPA15)
 * - Simular modalidad de entrega (Arequipa, Perú o Recojo)
 * - Calcular subtotal, descuentos, envío y total en Soles (PEN)
 */
export default function CartPage() {
  const {
    items,
    appliedCoupon,
    updateQuantity,
    removeItem,
    clearCart,
    applyCouponCode,
    removeCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const [selectedModality, setSelectedModality] =
    useState<DeliveryModality>('LOCAL_DELIVERY_AQP');
  const [selectedDistrict, setSelectedDistrict] = useState(
    DEFAULT_SHIPPING_CONFIG.arequipaDistricts[0].district
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    DEFAULT_SHIPPING_CONFIG.peruDepartments[0].department
  );

  const calculations = useMemo(() => {
    const productsSubtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const customizationSubtotal = items.reduce(
      (sum, item) => sum + item.customizationFee * item.quantity,
      0
    );
    const rawSubtotal = productsSubtotal + customizationSubtotal;

    let discountAmount = 0;
    if (appliedCoupon && rawSubtotal >= appliedCoupon.minPurchase) {
      if (appliedCoupon.discountType === 'PERCENTAGE') {
        discountAmount = (rawSubtotal * appliedCoupon.discountValue) / 100;
      } else {
        discountAmount = appliedCoupon.discountValue;
      }
    }

    const subtotalAfterDiscount = Math.max(0, rawSubtotal - discountAmount);

    const shipping = calculateConfigurableShipping({
      modality: selectedModality,
      district: selectedDistrict,
      department: selectedDepartment,
      subtotalAfterDiscount,
    });

    const total = subtotalAfterDiscount + shipping.cost;

    return {
      productsSubtotal,
      customizationSubtotal,
      rawSubtotal,
      discountAmount,
      shippingCost: shipping.cost,
      shippingLabel: shipping.estimatedLabel,
      isFreeShipping: shipping.isFreeByThreshold,
      total,
    };
  }, [
    items,
    appliedCoupon,
    selectedModality,
    selectedDistrict,
    selectedDepartment,
  ]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCouponCode(couponInput);
    setCouponMessage({ ok: result.ok, text: result.message });
  };

  if (items.length === 0) {
    return (
      <div className="bg-brand-neutral-50 min-h-[70vh] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center bg-white rounded-3xl border border-brand-neutral-200 p-10 md:p-14 shadow-premium space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-beige text-brand-navy flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-brand-accent" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-navy">
            Tu carrito de MenteLúdica está vacío
          </h1>
          <p className="text-sm text-brand-neutral-600 max-w-md mx-auto">
            Explora nuestros juegos de construcción, rompecabezas, juegos de
            mesa o diseña un regalo personalizado único.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/catalogo"
              className="px-6 py-3 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light transition-colors"
            >
              Explorar Catálogo Completo
            </Link>
            <Link
              href="/personalizar"
              className="px-6 py-3 rounded-xl bg-brand-beige text-brand-navy text-xs font-bold hover:bg-brand-beige-warm transition-colors"
            >
              Ir al Estudio de Personalización
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-neutral-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Cabecera del Carrito */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="beige">PASO 1 DE 2 · RESUMEN DE CARRITO</Badge>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mt-2">
              Mi Carrito de Compras ({items.length}{' '}
              {items.length === 1 ? 'línea' : 'líneas'})
            </h1>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Lista de Productos en el Carrito */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const lineTotal =
                (item.unitPrice + item.customizationFee) * item.quantity;

              return (
                <div
                  key={item.key}
                  className="bg-white rounded-2xl border border-brand-neutral-200 p-5 shadow-premium flex flex-col sm:flex-row gap-5 justify-between"
                >
                  <div className="flex gap-4">
                    <Link
                      href={`/producto/${item.slug}`}
                      className="w-24 h-24 rounded-xl overflow-hidden bg-brand-neutral-100 border border-brand-neutral-200 shrink-0"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="space-y-1.5">
                      <Link
                        href={`/producto/${item.slug}`}
                        className="font-display font-bold text-base text-brand-navy hover:text-brand-accent transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-brand-neutral-600">
                        <span className="px-2 py-0.5 rounded bg-brand-neutral-100 font-semibold text-brand-navy">
                          Variante: {item.variantName}
                        </span>
                        <span className="font-mono text-[11px]">
                          SKU: {item.sku}
                        </span>
                      </div>

                      {item.customization && (
                        <div className="mt-2 p-2.5 rounded-xl bg-brand-beige/60 border border-brand-beige-warm text-xs text-brand-navy space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-brand-accent">
                            <Sparkles className="w-3.5 h-3.5" />
                            Personalización Registrada
                          </div>
                          {item.customization.customText && (
                            <p>
                              <strong>Texto / Nombre:</strong>{' '}
                              {item.customization.customText}
                            </p>
                          )}
                          {item.customization.attachmentFileName && (
                            <p>
                              <strong>Archivo adjunto:</strong>{' '}
                              {item.customization.attachmentFileName}
                            </p>
                          )}
                          {item.customization.specialInstructions && (
                            <p>
                              <strong>Instrucciones:</strong>{' '}
                              {item.customization.specialInstructions}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Controles de Cantidad y Subtotal por Línea */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-brand-neutral-100 shrink-0">
                    <div className="text-right">
                      <span className="font-display font-bold text-lg text-brand-navy block">
                        {formatCurrencyPEN(lineTotal)}
                      </span>
                      <span className="text-[11px] text-brand-neutral-600">
                        {formatCurrencyPEN(
                          item.unitPrice + item.customizationFee
                        )}{' '}
                        c/u
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center rounded-xl border border-brand-neutral-200 bg-brand-neutral-50 h-9 px-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                          className="p-1.5 text-brand-navy hover:text-brand-accent"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-xs text-brand-navy">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                          className="p-1.5 text-brand-navy hover:text-brand-accent"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="p-2 rounded-xl text-brand-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Panel Lateral: Cupones, Estimador de Envío y Totales */}
          <aside className="lg:col-span-4 bg-white rounded-3xl border border-brand-neutral-200 p-6 shadow-premium space-y-6">
            <h2 className="font-display text-lg font-bold text-brand-navy">
              Resumen de tu Pedido
            </h2>

            {/* Aplicación de Cupones */}
            <div className="space-y-2 pt-2 border-t border-brand-neutral-100">
              <label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-accent" />
                Cupón de descuento
              </label>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div>
                    <strong>{appliedCoupon.code}</strong> activo
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Ej. BIENVENIDA10"
                    className="flex-1 h-10 px-3 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs uppercase text-brand-navy focus:outline-none focus:border-brand-navy"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="h-10">
                    Aplicar
                  </Button>
                </form>
              )}

              {couponMessage && (
                <p
                  className={`text-[11px] flex items-center gap-1 ${
                    couponMessage.ok ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {couponMessage.ok ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Estimador de Envío Configurable (Sección 11) */}
            <div className="space-y-3 pt-3 border-t border-brand-neutral-100">
              <label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-accent" />
                Modalidad de entrega
              </label>

              <select
                value={selectedModality}
                onChange={(e) =>
                  setSelectedModality(e.target.value as DeliveryModality)
                }
                className="w-full h-10 px-3 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs font-semibold text-brand-navy"
              >
                <option value="LOCAL_DELIVERY_AQP">
                  1. Delivery local en Arequipa
                </option>
                <option value="NATIONAL_SHIPPING_PERU">
                  2. Envíos a todo el Perú
                </option>
                <option value="STORE_PICKUP">
                  3. Recojo en punto de entrega (Arequipa)
                </option>
              </select>

              {selectedModality === 'LOCAL_DELIVERY_AQP' && (
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-brand-neutral-200 text-xs text-brand-navy"
                >
                  {DEFAULT_SHIPPING_CONFIG.arequipaDistricts.map((d) => (
                    <option key={d.district} value={d.district}>
                      {d.district} — {formatCurrencyPEN(d.ratePEN)}
                    </option>
                  ))}
                </select>
              )}

              {selectedModality === 'NATIONAL_SHIPPING_PERU' && (
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-brand-neutral-200 text-xs text-brand-navy"
                >
                  {DEFAULT_SHIPPING_CONFIG.peruDepartments.map((d) => (
                    <option key={d.department} value={d.department}>
                      {d.department} — {formatCurrencyPEN(d.ratePEN)}
                    </option>
                  ))}
                </select>
              )}

              <p className="text-[11px] text-brand-neutral-600">
                Tiempo estimado: {calculations.shippingLabel}
              </p>
            </div>

            {/* Desglose Financiero */}
            <dl className="space-y-2.5 pt-3 border-t border-brand-neutral-200 text-xs">
              <div className="flex justify-between">
                <dt className="text-brand-neutral-600">Subtotal productos</dt>
                <dd className="font-semibold text-brand-navy">
                  {formatCurrencyPEN(calculations.productsSubtotal)}
                </dd>
              </div>

              {calculations.customizationSubtotal > 0 && (
                <div className="flex justify-between">
                  <dt className="text-brand-neutral-600">
                    Adicionales de personalización
                  </dt>
                  <dd className="font-semibold text-brand-navy">
                    {formatCurrencyPEN(calculations.customizationSubtotal)}
                  </dd>
                </div>
              )}

              {calculations.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <dt>Descuento por cupón</dt>
                  <dd>-{formatCurrencyPEN(calculations.discountAmount)}</dd>
                </div>
              )}

              <div className="flex justify-between">
                <dt className="text-brand-neutral-600">Costo de envío</dt>
                <dd className="font-semibold text-brand-navy">
                  {calculations.shippingCost === 0
                    ? 'GRATIS'
                    : formatCurrencyPEN(calculations.shippingCost)}
                </dd>
              </div>

              <div className="pt-3 border-t border-brand-neutral-200 flex justify-between items-baseline">
                <dt className="font-display font-bold text-base text-brand-navy">
                  Total a Pagar
                </dt>
                <dd className="font-display font-bold text-2xl text-brand-navy">
                  {formatCurrencyPEN(calculations.total)}
                </dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="w-full h-12 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-premium transition-colors"
            >
              Continuar al Checkout Seguro
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-brand-neutral-600">
              <ShieldCheck className="w-4 h-4 text-brand-accent-teal shrink-0" />
              <span>Compra como invitado o con tu cuenta MenteLúdica</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

