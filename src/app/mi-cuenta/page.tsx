'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  CreditCard,
  MapPin,
  Sparkles,
  Heart,
  UserCheck,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { useCustomerPortalStore } from '@/modules/auth/customer-portal-store';
import { useOrdersStore, OrderRecord } from '@/modules/orders/orders-store';
import { useCustomizationStore } from '@/modules/customizations/customization-store';
import { CATALOG_PRODUCTS } from '@/modules/catalog/catalog-data';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyPEN } from '@/lib/utils';

type PortalTab =
  | 'pedidos'
  | 'pagos'
  | 'personalizaciones'
  | 'direcciones'
  | 'favoritos'
  | 'datos';

/**
 * Portal Personal del Cliente MenteLúdica (Sección 14 del Prompt Maestro).
 * Permite al cliente:
 * 1. Consultar sus pedidos e historial de compras.
 * 2. Consultar pagos y descargar comprobantes cuando estén disponibles.
 * 3. Gestionar direcciones de entrega.
 * 4. Consultar personalizaciones y aprobar diseños.
 * 5. Registrar y gestionar favoritos.
 * 6. Actualizar sus datos personales y de facturación.
 */
export default function CustomerPortalPage() {
  const {
    profile,
    addresses,
    favoriteProductIds,
    updateProfile,
    addAddress,
    removeAddress,
  } = useCustomerPortalStore();

  const orders = useOrdersStore((state) => state.orders);
  const { requests: customizations, approveDesignByCustomer } =
    useCustomizationStore();

  const [activeTab, setActiveTab] = useState<PortalTab>('pedidos');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Estado formulario nueva dirección
  const [addrLabel, setAddrLabel] = useState('Oficina / Casa');
  const [addrDistrict, setAddrDistrict] = useState('Yanahuara');
  const [addrLine, setAddrLine] = useState('');
  const [addrRef, setAddrRef] = useState('');

  // Estado actualización de perfil
  const [editName, setEditName] = useState(profile.fullName);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editDocNumber, setEditDocNumber] = useState(profile.documentNumber);
  const [editCompany, setEditCompany] = useState(profile.companyName || '');

  const favoriteProducts = CATALOG_PRODUCTS.filter((p) =>
    favoriteProductIds.includes(p.id)
  );

  const handleDownloadReceipt = (order: OrderRecord) => {
    const content = [
      '======================================================',
      '     MENTELÚDICA – APRENDIZAJE Y DIVERSIÓN (PERÚ)     ',
      '======================================================',
      `Comprobante Electrónico: ${order.billing.type}`,
      `Pedido Nro:              ${order.orderNumber}`,
      `Fecha de Emisión:        ${new Date(order.createdAt).toLocaleString('es-PE')}`,
      `Cliente:                 ${order.customer.fullName}`,
      `Documento:               ${order.customer.documentType} ${order.customer.documentNumber || '-'}`,
      `Modalidad Entrega:       ${order.delivery.modality} (${order.delivery.district}, ${order.delivery.city})`,
      '------------------------------------------------------',
      'DETALLE DE PRODUCTOS:',
      ...order.items.map(
        (item) =>
          ` - ${item.quantity}x ${item.name} [${item.sku}] -> S/ ${((item.unitPrice + item.customizationFee) * item.quantity).toFixed(2)}`
      ),
      '------------------------------------------------------',
      `Subtotal:                S/ ${order.pricing.subtotal.toFixed(2)}`,
      `Personalización:         S/ ${order.pricing.customizationTotal.toFixed(2)}`,
      `Descuento:              -S/ ${order.pricing.discountAmount.toFixed(2)}`,
      `Envío:                   S/ ${order.pricing.shippingCost.toFixed(2)}`,
      `TOTAL PAGADO (PEN):      S/ ${order.pricing.totalAmount.toFixed(2)}`,
      `Método de Pago:          ${order.payment.method} (${order.payment.status})`,
      '======================================================',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprobante-${order.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine.trim() || !addrRef.trim()) return;
    addAddress({
      label: addrLabel.trim(),
      recipientName: profile.fullName,
      recipientPhone: profile.phone,
      department: 'Arequipa',
      city: 'Arequipa',
      district: addrDistrict,
      addressLine: addrLine.trim(),
      reference: addrRef.trim(),
      isDefault: false,
    });
    setAddrLine('');
    setAddrRef('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      documentNumber: editDocNumber.trim(),
      companyName: editCompany.trim(),
    });
    setSavedNotice('Tus datos personales han sido actualizados correctamente.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const tabs: { id: PortalTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'pedidos', label: 'Mis Pedidos e Historial', icon: Package },
    { id: 'pagos', label: 'Pagos y Comprobantes', icon: CreditCard },
    { id: 'personalizaciones', label: 'Mis Personalizaciones', icon: Sparkles },
    { id: 'direcciones', label: 'Mis Direcciones', icon: MapPin },
    { id: 'favoritos', label: `Favoritos (${favoriteProducts.length})`, icon: Heart },
    { id: 'datos', label: 'Actualizar mis Datos', icon: UserCheck },
  ];

  return (
    <div className="bg-brand-neutral-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Cabecera del Portal del Cliente */}
        <div className="bg-brand-navy rounded-3xl p-6 md:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="accent">PORTAL PERSONAL DEL CLIENTE</Badge>
            <h1 className="font-display text-2xl md:text-4xl font-bold">
              Hola, {profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-brand-neutral-200">
              {profile.email} · {profile.documentType}: {profile.documentNumber}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/personalizar"
              className="px-4 py-2.5 rounded-xl bg-brand-accent text-white text-xs font-bold hover:bg-brand-accent-hover"
            >
              Nueva Personalización
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold hover:bg-white/20 inline-flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-brand-accent" />
              Ir al Panel Administrativo
            </Link>
          </div>
        </div>

        {/* Navegación por Pestañas del Portal */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-brand-neutral-200 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-brand-navy hover:bg-brand-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4 text-brand-accent" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contenido de la Pestaña Activa */}
        {activeTab === 'pedidos' && (
          <section className="bg-white rounded-3xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium space-y-6">
            <h2 className="font-display text-xl font-bold text-brand-navy">
              Historial de Compras y Seguimiento de Pedidos
            </h2>

            {orders.length === 0 ? (
              <div className="p-8 rounded-2xl bg-brand-neutral-50 border border-brand-neutral-200 text-center space-y-3">
                <p className="font-display font-bold text-base text-brand-navy">
                  Aún no has registrado pedidos en esta sesión
                </p>
                <p className="text-xs text-brand-neutral-600">
                  Agrega productos al carrito y completa el checkout para ver tu
                  historial aquí.
                </p>
                <Link
                  href="/catalogo"
                  className="inline-block px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold"
                >
                  Explorar Catálogo
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl border border-brand-neutral-200 bg-brand-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-sm text-brand-navy">
                          {order.orderNumber}
                        </span>
                        <Badge variant="navy">{order.orderStatus}</Badge>
                        <Badge variant="beige">{order.delivery.modality}</Badge>
                      </div>
                      <p className="text-brand-neutral-600">
                        Fecha:{' '}
                        {new Date(order.createdAt).toLocaleString('es-PE')} ·
                        Destino: {order.delivery.district},{' '}
                        {order.delivery.city}
                      </p>
                      <div className="text-brand-navy font-medium">
                        {order.items
                          .map((i) => `${i.quantity}x ${i.name}`)
                          .join(' | ')}
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                      <span className="font-display font-bold text-lg text-brand-navy">
                        {formatCurrencyPEN(order.pricing.totalAmount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(order)}
                        className="px-3.5 py-2 rounded-xl bg-brand-navy text-white text-xs font-bold inline-flex items-center gap-1.5 hover:bg-brand-navy-light"
                      >
                        <Download className="w-3.5 h-3.5 text-brand-accent" />
                        Descargar Comprobante
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'pagos' && (
          <section className="bg-white rounded-3xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium space-y-6">
            <h2 className="font-display text-xl font-bold text-brand-navy">
              Estado de Pagos y Descarga de Comprobantes Electrónicos
            </h2>

            {orders.length === 0 ? (
              <p className="text-xs text-brand-neutral-600">
                No existen transacciones registradas todavía.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-brand-neutral-200 text-brand-neutral-600 uppercase">
                      <th className="py-3 px-3">Pedido</th>
                      <th className="py-3 px-3">Comprobante</th>
                      <th className="py-3 px-3">Método</th>
                      <th className="py-3 px-3">Estado de Pago</th>
                      <th className="py-3 px-3">Monto</th>
                      <th className="py-3 px-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-neutral-100">
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-3 px-3 font-mono font-bold text-brand-navy">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-3">{ord.billing.type}</td>
                        <td className="py-3 px-3 font-semibold">
                          {ord.payment.method}
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={
                              ord.payment.status === 'PAGADO'
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {ord.payment.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 font-bold text-brand-navy">
                          {formatCurrencyPEN(ord.pricing.totalAmount)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(ord)}
                            className="inline-flex items-center gap-1 text-brand-accent font-bold hover:underline"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Descargar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === 'personalizaciones' && (
          <section className="bg-white rounded-3xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium space-y-6">
            <h2 className="font-display text-xl font-bold text-brand-navy">
              Mis Productos Personalizados y Aprobación de Diseños
            </h2>
            <div className="space-y-4">
              {customizations.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl border border-brand-neutral-200 bg-brand-beige/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-navy">
                        {req.requestCode}
                      </span>
                      <Badge variant="navy">{req.productionStatus}</Badge>
                    </div>
                    <div className="font-bold text-sm text-brand-navy">
                      {req.productName} — {req.variantName}
                    </div>
                    <p className="text-brand-neutral-600">
                      Texto grabado/impreso: <strong>{req.customText}</strong>
                    </p>
                    <p className="text-brand-neutral-600">
                      Observaciones: {req.observations}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {req.designApprovalStatus === 'PENDIENTE' ? (
                      <Button
                        type="button"
                        variant="accent"
                        size="sm"
                        onClick={() => approveDesignByCustomer(req.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Aprobar Diseño para Producción
                      </Button>
                    ) : (
                      <Badge variant="success">Diseño Aprobado</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'direcciones' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-neutral-200 p-6 shadow-premium space-y-4">
              <h2 className="font-display text-lg font-bold text-brand-navy">
                Mis Direcciones Guardadas
              </h2>
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-brand-neutral-200 flex items-start justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-brand-navy">
                        {addr.label} — {addr.district}, {addr.city}
                      </div>
                      <p className="text-brand-neutral-600">
                        {addr.addressLine}
                      </p>
                      <p className="text-brand-neutral-600">
                        Referencia: {addr.reference}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAddress(addr.id)}
                      className="text-red-600 hover:underline p-1"
                      aria-label="Eliminar dirección"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleAddAddress}
              className="lg:col-span-5 bg-white rounded-3xl border border-brand-neutral-200 p-6 shadow-premium space-y-4"
            >
              <h3 className="font-display font-bold text-base text-brand-navy flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-accent" />
                Agregar Nueva Dirección
              </h3>
              <div>
                <label className="text-xs font-bold text-brand-navy block mb-1">
                  Etiqueta (Casa, Oficina, Colegio)
                </label>
                <input
                  type="text"
                  required
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand-navy block mb-1">
                  Distrito
                </label>
                <input
                  type="text"
                  required
                  value={addrDistrict}
                  onChange={(e) => setAddrDistrict(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand-navy block mb-1">
                  Dirección exacta
                </label>
                <input
                  type="text"
                  required
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  placeholder="Calle / Av. / Número"
                  className="w-full h-10 px-3 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand-navy block mb-1">
                  Referencia de ubicación
                </label>
                <input
                  type="text"
                  required
                  value={addrRef}
                  onChange={(e) => setAddrRef(e.target.value)}
                  placeholder="Frente a..."
                  className="w-full h-10 px-3 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs"
                />
              </div>
              <Button type="submit" variant="primary" size="md" fullWidth>
                Guardar Dirección
              </Button>
            </form>
          </section>
        )}

        {activeTab === 'favoritos' && (
          <section className="space-y-6">
            <h2 className="font-display text-xl font-bold text-brand-navy">
              Mis Productos Favoritos Guardados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'datos' && (
          <section className="bg-white rounded-3xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium max-w-2xl space-y-5">
            <h2 className="font-display text-xl font-bold text-brand-navy">
              Actualizar Datos Personales y de Facturación
            </h2>

            {savedNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {savedNotice}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-brand-navy block mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-brand-navy block mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-navy block mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-brand-navy block mb-1">
                    DNI / RUC
                  </label>
                  <input
                    type="text"
                    value={editDocNumber}
                    onChange={(e) => setEditDocNumber(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-navy block mb-1">
                    Empresa / Institución Educativa (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder="Opcional para cotizaciones B2B"
                    className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" size="md">
                Guardar Cambios en mi Perfil
              </Button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

