'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  UserCheck,
  FileText,
  MapPin,
  MessageCircle,
  ArrowLeft,
  Upload,
} from 'lucide-react';
import { useCartStore } from '@/modules/cart/cart-store';
import { useOrdersStore, OrderRecord } from '@/modules/orders/orders-store';
import { useAdminStore } from '@/modules/admin/admin-store';
import {
  DEFAULT_SHIPPING_CONFIG,
  calculateConfigurableShipping,
} from '@/config/shipping-settings';
import { getAvailablePaymentAdapters } from '@/lib/adapters/payment-gateway.adapter';
import { DeliveryModality, PaymentMethodCode } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyPEN, buildWhatsAppUrl } from '@/lib/utils';
import { env } from '@/config/env';

/**
 * Proceso de Compra / Checkout MenteLúdica (Sección 9, 10 y 11 del Prompt Maestro)
 * - Permite compras como Invitado o como Cliente Registrado
 * - Datos del cliente + DNI opcional (o obligatorio en Factura RUC)
 * - Datos de facturación (Boleta o Factura Electrónica RUC)
 * - Dirección de entrega, distrito, ciudad y referencia de ubicación
 * - 3 Modalidades de entrega (Delivery Arequipa, Envío Nacional Perú, Recojo en Punto)
 * - 9 Métodos de pago (Yape, Plin, Transferencia, Tarjetas, Culqi, Mercado Pago, Niubiz, Contra entrega)
 * - Resumen completo antes de confirmar la compra
 */
export default function CheckoutPage() {
  const { items, appliedCoupon, clearCart } = useCartStore();
  const createOrder = useOrdersStore((state) => state.createOrder);
  const {
    arequipaDistrictRates,
    peruDepartmentRates,
    businessConfig,
  } = useAdminStore();

  const paymentAdapters = useMemo(() => {
    const allAdapters = getAvailablePaymentAdapters();
    return allAdapters.filter(
      (adapter) => businessConfig.enabledPaymentMethods[adapter.code] !== false
    );
  }, [businessConfig.enabledPaymentMethods]);

  const [checkoutMode, setCheckoutMode] = useState<'GUEST' | 'REGISTERED'>(
    'GUEST'
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dniOptional, setDniOptional] = useState('');

  const [billingType, setBillingType] = useState<'BOLETA' | 'FACTURA'>(
    'BOLETA'
  );
  const [rucNumber, setRucNumber] = useState('');
  const [businessName, setBusinessName] = useState('');

  const [deliveryModality, setDeliveryModality] =
    useState<DeliveryModality>('LOCAL_DELIVERY_AQP');
  const [district, setDistrict] = useState(
    DEFAULT_SHIPPING_CONFIG.arequipaDistricts[0].district
  );
  const [department, setDepartment] = useState(
    DEFAULT_SHIPPING_CONFIG.peruDepartments[0].department
  );
  const [city, setCity] = useState('Arequipa');
  const [addressLine, setAddressLine] = useState('');
  const [reference, setReference] = useState('');

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodCode>('YAPE');
  const [operationCode, setOperationCode] = useState('');
  const [voucherFileName, setVoucherFileName] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(
    null
  );

  const selectedAdapter = useMemo(
    () =>
      paymentAdapters.find((a) => a.code === paymentMethod) ||
      paymentAdapters[0],
    [paymentAdapters, paymentMethod]
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const customizationTotal = items.reduce(
      (sum, item) => sum + item.customizationFee * item.quantity,
      0
    );
    const rawTotal = subtotal + customizationTotal;

    let discountAmount = 0;
    if (appliedCoupon && rawTotal >= appliedCoupon.minPurchase) {
      discountAmount =
        appliedCoupon.discountType === 'PERCENTAGE'
          ? (rawTotal * appliedCoupon.discountValue) / 100
          : appliedCoupon.discountValue;
    }

    const afterDiscount = Math.max(0, rawTotal - discountAmount);
    const shipping = calculateConfigurableShipping({
      modality: deliveryModality,
      district,
      department,
      subtotalAfterDiscount: afterDiscount,
      config: {
        ...DEFAULT_SHIPPING_CONFIG,
        freeShippingThresholdPEN: businessConfig.freeShippingThresholdPEN,
        arequipaDistricts: arequipaDistrictRates,
        peruDepartments: peruDepartmentRates,
      },
    });

    return {
      subtotal,
      customizationTotal,
      discountAmount,
      shippingCost: shipping.cost,
      estimatedWindow: shipping.estimatedLabel,
      totalAmount: afterDiscount + shipping.cost,
    };
  }, [
    items,
    appliedCoupon,
    deliveryModality,
    district,
    department,
    businessConfig.freeShippingThresholdPEN,
    arequipaDistrictRates,
    peruDepartmentRates,
  ]);

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const created = createOrder({
      checkoutMode,
      customer: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        documentType: billingType === 'FACTURA' ? 'RUC' : 'DNI',
        documentNumber:
          billingType === 'FACTURA'
            ? rucNumber.trim()
            : dniOptional.trim() || undefined,
      },
      billing: {
        type: billingType,
        rucNumber: billingType === 'FACTURA' ? rucNumber.trim() : undefined,
        businessName:
          billingType === 'FACTURA' ? businessName.trim() : undefined,
      },
      delivery: {
        modality: deliveryModality,
        department:
          deliveryModality === 'LOCAL_DELIVERY_AQP' ||
          deliveryModality === 'STORE_PICKUP'
            ? 'Arequipa'
            : department,
        city:
          deliveryModality === 'LOCAL_DELIVERY_AQP' ||
          deliveryModality === 'STORE_PICKUP'
            ? 'Arequipa'
            : city.trim() || department,
        district:
          deliveryModality === 'STORE_PICKUP'
            ? DEFAULT_SHIPPING_CONFIG.pickupLocation.district
            : district,
        addressLine:
          deliveryModality === 'STORE_PICKUP'
            ? DEFAULT_SHIPPING_CONFIG.pickupLocation.address
            : addressLine.trim(),
        reference:
          deliveryModality === 'STORE_PICKUP'
            ? 'Recojo en Showroom MenteLúdica'
            : reference.trim(),
        estimatedWindow: totals.estimatedWindow,
      },
      payment: {
        method: paymentMethod,
        status: selectedAdapter.requiresVoucherUpload
          ? 'EN_VALIDACION'
          : 'PENDIENTE',
        operationCode: operationCode.trim() || undefined,
        voucherFileName: voucherFileName || undefined,
      },
      items,
      pricing: {
        subtotal: totals.subtotal,
        customizationTotal: totals.customizationTotal,
        discountAmount: totals.discountAmount,
        couponCode: appliedCoupon?.code || null,
        shippingCost: totals.shippingCost,
        totalAmount: totals.totalAmount,
      },
      customerNotes: customerNotes.trim() || undefined,
    });

    setConfirmedOrder(created);
    clearCart();
  };

  // Vista de Orden Confirmada
  if (confirmedOrder) {
    const whatsappOrderMsg = buildWhatsAppUrl(
      env.NEXT_PUBLIC_WHATSAPP_NUMBER,
      `Hola MenteLúdica, acabo de registrar el pedido ${confirmedOrder.orderNumber} a nombre de ${confirmedOrder.customer.fullName} por un total de ${formatCurrencyPEN(confirmedOrder.pricing.totalAmount)}.`
    );

    return (
      <div className="bg-brand-neutral-50 py-14 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 bg-white rounded-3xl border border-brand-neutral-200 p-8 md:p-12 shadow-premium-lg space-y-6">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider">
                Compra Confirmada con Éxito
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-navy">
                Pedido Oficial #{confirmedOrder.orderNumber}
              </h1>
            </div>
          </div>

          <p className="text-sm text-brand-neutral-600 leading-relaxed">
            Gracias por tu compra en <strong>MenteLúdica</strong>,{' '}
            <strong>{confirmedOrder.customer.fullName}</strong>. Hemos
            registrado tu pedido y enviado el resumen a{' '}
            <strong>{confirmedOrder.customer.email}</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs">
            <div>
              <span className="text-brand-neutral-600 block">
                Modalidad de Entrega:
              </span>
              <strong className="text-brand-navy">
                {confirmedOrder.delivery.modality} —{' '}
                {confirmedOrder.delivery.district},{' '}
                {confirmedOrder.delivery.city}
              </strong>
              <p className="text-brand-neutral-600 mt-1">
                {confirmedOrder.delivery.addressLine}
              </p>
            </div>
            <div>
              <span className="text-brand-neutral-600 block">
                Método y Estado de Pago:
              </span>
              <strong className="text-brand-navy">
                {confirmedOrder.payment.method} ({confirmedOrder.payment.status})
              </strong>
              <p className="font-display font-bold text-base text-brand-accent mt-1">
                Total: {formatCurrencyPEN(confirmedOrder.pricing.totalAmount)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={whatsappOrderMsg}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Notificar mi Pedido por WhatsApp
            </a>
            <Link
              href="/mi-cuenta"
              className="px-5 py-3 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light"
            >
              Ver mis pedidos en el Portal del Cliente
            </Link>
            <Link
              href="/catalogo"
              className="px-5 py-3 rounded-xl border border-brand-neutral-200 text-brand-navy text-xs font-semibold"
            >
              Seguir explorando la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-brand-navy">
          No hay productos en el carrito para procesar el checkout
        </h1>
        <Link
          href="/catalogo"
          className="inline-block px-6 py-3 rounded-xl bg-brand-navy text-white text-xs font-bold"
        >
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-neutral-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="accent">PASO 2 DE 2 · CHECKOUT SEGURO</Badge>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mt-2">
              Finalizar Compra en MenteLúdica
            </h1>
          </div>
          <Link
            href="/carrito"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-accent"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al carrito
          </Link>
        </div>

        <form
          onSubmit={handleConfirmPurchase}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Columna Izquierda: Datos del Cliente, Facturación, Entrega y Pago */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Modalidad Invitado vs Cliente Registrado */}
            <section className="bg-white rounded-2xl border border-brand-neutral-200 p-6 shadow-premium space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-brand-navy flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-brand-accent" />
                  1. Datos del Cliente
                </h2>
                <div className="inline-flex rounded-xl bg-brand-neutral-100 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setCheckoutMode('GUEST')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      checkoutMode === 'GUEST'
                        ? 'bg-brand-navy text-white'
                        : 'text-brand-neutral-600'
                    }`}
                  >
                    Compra como Invitado
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutMode('REGISTERED')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      checkoutMode === 'REGISTERED'
                        ? 'bg-brand-navy text-white'
                        : 'text-brand-neutral-600'
                    }`}
                  >
                    Cliente Registrado
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-brand-navy block mb-1">
                    Nombres y Apellidos completos *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Andrea Paredes Cáceres"
                    className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-navy block mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cliente@correo.com"
                    className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-navy block mb-1">
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 959 000 000"
                    className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-brand-navy block mb-1">
                    DNI (Opcional para Boleta simple / Requerido para envío por
                    agencia nacional)
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={dniOptional}
                    onChange={(e) => setDniOptional(e.target.value)}
                    placeholder="8 dígitos de tu DNI (opcional)"
                    className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy"
                  />
                </div>
              </div>
            </section>

            {/* 2. Datos de Facturación (Boleta o Factura) */}
            <section className="bg-white rounded-2xl border border-brand-neutral-200 p-6 shadow-premium space-y-4">
              <h2 className="font-display font-bold text-base text-brand-navy flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-accent" />
                2. Comprobante de Facturación
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBillingType('BOLETA')}
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    billingType === 'BOLETA'
                      ? 'border-brand-navy bg-brand-beige/60 text-brand-navy'
                      : 'border-brand-neutral-200 text-brand-neutral-600'
                  }`}
                >
                  Boleta de Venta Electrónica
                </button>
                <button
                  type="button"
                  onClick={() => setBillingType('FACTURA')}
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    billingType === 'FACTURA'
                      ? 'border-brand-navy bg-brand-beige/60 text-brand-navy'
                      : 'border-brand-neutral-200 text-brand-neutral-600'
                  }`}
                >
                  Factura Electrónica (RUC Empresas / Colegios)
                </button>
              </div>

              {billingType === 'FACTURA' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-brand-navy block mb-1">
                      Número de RUC (11 dígitos) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={rucNumber}
                      onChange={(e) => setRucNumber(e.target.value)}
                      placeholder="20..."
                      className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-navy block mb-1">
                      Razón Social *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Nombre oficial de la empresa o institución"
                      className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* 3. Método de Entrega y Dirección */}
            <section className="bg-white rounded-2xl border border-brand-neutral-200 p-6 shadow-premium space-y-4">
              <h2 className="font-display font-bold text-base text-brand-navy flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-accent" />
                3. Modalidad de Entrega y Dirección
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    code: 'LOCAL_DELIVERY_AQP',
                    title: 'Delivery Arequipa',
                    sub: 'Por distritos',
                  },
                  {
                    code: 'NATIONAL_SHIPPING_PERU',
                    title: 'Envío a todo el Perú',
                    sub: 'Courier / Agencia',
                  },
                  {
                    code: 'STORE_PICKUP',
                    title: 'Recojo en Punto',
                    sub: 'Sin costo de envío',
                  },
                ].map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() =>
                      setDeliveryModality(opt.code as DeliveryModality)
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      deliveryModality === opt.code
                        ? 'border-brand-navy bg-brand-beige/60 text-brand-navy'
                        : 'border-brand-neutral-200 text-brand-neutral-600'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.title}</div>
                    <div className="text-[11px] opacity-80">{opt.sub}</div>
                  </button>
                ))}
              </div>

              {deliveryModality === 'STORE_PICKUP' ? (
                <div className="p-4 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs space-y-1">
                  <strong className="text-brand-navy block">
                    {DEFAULT_SHIPPING_CONFIG.pickupLocation.name}
                  </strong>
                  <p className="text-brand-neutral-600">
                    {DEFAULT_SHIPPING_CONFIG.pickupLocation.address} —{' '}
                    {DEFAULT_SHIPPING_CONFIG.pickupLocation.district},{' '}
                    {DEFAULT_SHIPPING_CONFIG.pickupLocation.city}
                  </p>
                  <p className="text-brand-accent font-semibold">
                    Horario: {DEFAULT_SHIPPING_CONFIG.pickupLocation.schedule}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {deliveryModality === 'LOCAL_DELIVERY_AQP' ? (
                    <>
                      <div>
                        <label className="text-xs font-bold text-brand-navy block mb-1">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          disabled
                          value="Arequipa"
                          className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-100 border border-brand-neutral-200 text-xs text-brand-navy font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-brand-navy block mb-1">
                          Distrito en Arequipa *
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy font-semibold"
                        >
                          {DEFAULT_SHIPPING_CONFIG.arequipaDistricts.map(
                            (d) => (
                              <option key={d.district} value={d.district}>
                                {d.district} ({formatCurrencyPEN(d.ratePEN)})
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-bold text-brand-navy block mb-1">
                          Región / Departamento *
                        </label>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy font-semibold"
                        >
                          {DEFAULT_SHIPPING_CONFIG.peruDepartments.map((d) => (
                            <option key={d.department} value={d.department}>
                              {d.department} ({formatCurrencyPEN(d.ratePEN)})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-brand-navy block mb-1">
                          Ciudad / Distrito de destino *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Ej. Miraflores, Lima / Cusco / Trujillo"
                          className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy"
                        />
                      </div>
                    </>
                  )}

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-brand-navy block mb-1">
                      Dirección exacta de entrega *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="Av. / Calle / Urb. / Número / Interior"
                      className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-brand-navy block mb-1">
                      Referencia de ubicación *
                    </label>
                    <input
                      type="text"
                      required
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Ej. Frente al parque principal, portón negro"
                      className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* 4. Método de Pago (Sección 10) */}
            <section className="bg-white rounded-2xl border border-brand-neutral-200 p-6 shadow-premium space-y-4">
              <h2 className="font-display font-bold text-base text-brand-navy flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-accent" />
                4. Método de Pago (Sin almacenar datos sensibles de tarjetas)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {paymentAdapters.map((adapter) => (
                  <button
                    key={adapter.code}
                    type="button"
                    onClick={() => setPaymentMethod(adapter.code)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      paymentMethod === adapter.code
                        ? 'border-brand-navy bg-brand-beige/60 text-brand-navy ring-2 ring-brand-navy/10'
                        : 'border-brand-neutral-200 text-brand-neutral-600 hover:border-brand-navy/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-brand-navy">
                        {adapter.label}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-navy/10 text-brand-navy">
                        {adapter.environmentMode === 'PRODUCTION'
                          ? 'ACTIVO'
                          : 'SANDBOX'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs space-y-3">
                <p className="text-brand-navy font-medium">
                  {selectedAdapter.instructions}
                </p>

                {selectedAdapter.requiresVoucherUpload && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-brand-navy block mb-1">
                        Número de operación (Yape / Plin / Banco)
                      </label>
                      <input
                        type="text"
                        value={operationCode}
                        onChange={(e) => setOperationCode(e.target.value)}
                        placeholder="Ej. 0492811"
                        className="w-full h-10 px-3 rounded-xl bg-white border border-brand-neutral-200 text-xs text-brand-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-brand-navy block mb-1">
                        Adjuntar captura de comprobante
                      </label>
                      <label className="h-10 px-3 rounded-xl bg-white border border-dashed border-brand-navy/40 text-xs text-brand-navy flex items-center gap-2 cursor-pointer hover:bg-brand-beige/30">
                        <Upload className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                        <span className="truncate">
                          {voucherFileName || 'Seleccionar imagen / PDF...'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          className="hidden"
                          onChange={(e) =>
                            setVoucherFileName(e.target.files?.[0]?.name || '')
                          }
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-navy block mb-1">
                  Observaciones adicionales para el pedido o dedicatoria de
                  regalo
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Opcional: Indícanos si es para regalo, horario preferido de recepción o indicaciones adicionales."
                  className="w-full p-3 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy"
                />
              </div>
            </section>
          </div>

          {/* Columna Derecha: Resumen Completo Antes de Confirmar Compra */}
          <aside className="lg:col-span-5 bg-white rounded-3xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium space-y-6 sticky top-28">
            <h2 className="font-display text-xl font-bold text-brand-navy">
              Resumen Completo Antes de Confirmar
            </h2>

            <div className="divide-y divide-brand-neutral-100 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="py-3 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-brand-navy">
                      {item.quantity}x {item.name}
                    </div>
                    <div className="text-brand-neutral-600">
                      Variante: {item.variantName} · SKU: {item.sku}
                    </div>
                    {item.customization?.customText && (
                      <div className="text-brand-accent font-semibold mt-0.5">
                        Personalizado: “{item.customization.customText}”
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-brand-navy shrink-0">
                    {formatCurrencyPEN(
                      (item.unitPrice + item.customizationFee) * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>

            <dl className="space-y-2 pt-3 border-t border-brand-neutral-200 text-xs">
              <div className="flex justify-between">
                <dt className="text-brand-neutral-600">Subtotal productos</dt>
                <dd className="font-semibold text-brand-navy">
                  {formatCurrencyPEN(totals.subtotal)}
                </dd>
              </div>
              {totals.customizationTotal > 0 && (
                <div className="flex justify-between">
                  <dt className="text-brand-neutral-600">
                    Personalización a medida
                  </dt>
                  <dd className="font-semibold text-brand-navy">
                    {formatCurrencyPEN(totals.customizationTotal)}
                  </dd>
                </div>
              )}
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <dt>Descuento cupón ({appliedCoupon?.code})</dt>
                  <dd>-{formatCurrencyPEN(totals.discountAmount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-brand-neutral-600">
                  Envío ({deliveryModality})
                </dt>
                <dd className="font-semibold text-brand-navy">
                  {totals.shippingCost === 0
                    ? 'GRATIS'
                    : formatCurrencyPEN(totals.shippingCost)}
                </dd>
              </div>
              <div className="pt-3 border-t border-brand-neutral-200 flex justify-between items-baseline">
                <dt className="font-display font-bold text-base text-brand-navy">
                  Total Final a Confirmar
                </dt>
                <dd className="font-display font-bold text-2xl text-brand-navy">
                  {formatCurrencyPEN(totals.totalAmount)}
                </dd>
              </div>
            </dl>

            <Button type="submit" variant="accent" size="lg" fullWidth>
              Confirmar Pedido por {formatCurrencyPEN(totals.totalAmount)}
            </Button>

            <div className="p-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-[11px] text-brand-neutral-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-accent-teal shrink-0" />
              <span>
                Transacción protegida. No almacenamos números de tarjeta ni CVV
                en nuestros servidores.
              </span>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

