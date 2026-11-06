'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Eye,
  FileCheck2,
  Trash2,
  ShieldCheck,
  Layers,
  MessageCircle,
} from 'lucide-react';
import { CATALOG_PRODUCTS } from '@/modules/catalog/catalog-data';
import { useCartStore } from '@/modules/cart/cart-store';
import {
  useCustomizationStore,
  validateCustomizationFile,
  CUSTOMIZATION_STATUS_PIPELINE,
  CustomizationFileMetadata,
} from '@/modules/customizations/customization-store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyPEN, buildWhatsAppUrl } from '@/lib/utils';
import { env } from '@/config/env';

const FINISH_STYLE_OPTIONS = [
  {
    id: 'std-engraving',
    label: 'Personalización Estándar (Grabado / Impresión HD)',
    additionalFee: 0,
  },
  {
    id: 'gift-box-dedication',
    label: 'Con Estuche de Regalo + Placa / Dedicatoria Especial',
    additionalFee: 12.0,
  },
  {
    id: 'corporate-branding-pack',
    label: 'Acabado Corporativo Institucional con Vectorización de Logotipo',
    additionalFee: 18.0,
  },
];

/**
 * Estudio de Personalización MenteLúdica (Sección 8 del Prompt Maestro).
 * Cumple los 9 pasos del cliente:
 * 1. Seleccionar el producto.
 * 2. Elegir las opciones disponibles (variante + acabado).
 * 3. Ingresar nombres o textos.
 * 4. Adjuntar fotografías o logotipos (con validación de formato, tamaño y seguridad).
 * 5. Añadir instrucciones especiales.
 * 6. Visualizar una referencia preliminar interactiva en tiempo real.
 * 7. Consultar el precio final desglosado.
 * 8. Agregar al carrito.
 * 9. Realizar el pedido directo.
 */
export function CustomizationStudioClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { requests, registerRequest, approveDesignByCustomer } =
    useCustomizationStore();

  const customizableProducts = useMemo(
    () => CATALOG_PRODUCTS.filter((p) => p.isCustomizable),
    []
  );

  const initialProductSlug = searchParams.get('producto');
  const defaultProduct =
    customizableProducts.find((p) => p.slug === initialProductSlug) ||
    customizableProducts[0];

  const [selectedProductId, setSelectedProductId] = useState(defaultProduct.id);

  const activeProduct = useMemo(
    () =>
      customizableProducts.find((p) => p.id === selectedProductId) ||
      customizableProducts[0],
    [customizableProducts, selectedProductId]
  );

  const [selectedVariantId, setSelectedVariantId] = useState(
    activeProduct.variants[0]?.id || ''
  );

  const activeVariant = useMemo(
    () =>
      activeProduct.variants.find((v) => v.id === selectedVariantId) ||
      activeProduct.variants[0],
    [activeProduct, selectedVariantId]
  );

  const [selectedFinishId, setSelectedFinishId] = useState(
    FINISH_STYLE_OPTIONS[0].id
  );
  const [customText, setCustomText] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [attachedFiles, setAttachedFiles] = useState<
    CustomizationFileMetadata[]
  >([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [confirmationBanner, setConfirmationBanner] = useState<string | null>(
    null
  );

  const activeFinish =
    FINISH_STYLE_OPTIONS.find((f) => f.id === selectedFinishId) ||
    FINISH_STYLE_OPTIONS[0];

  const pricing = useMemo(() => {
    const baseSale = activeProduct.promoPrice ?? activeProduct.salePrice;
    const variantExtra = activeVariant?.additionalPrice || 0;
    const baseWithVariant = baseSale + variantExtra;
    const customizationExtra = activeFinish.additionalFee;
    const unitFinal = baseWithVariant + customizationExtra;
    const totalOrderLine = unitFinal * quantity;

    return {
      baseWithVariant,
      customizationExtra,
      unitFinal,
      totalOrderLine,
    };
  }, [activeProduct, activeVariant, activeFinish, quantity]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    const validation = validateCustomizationFile(file);
    if (!validation.valid) {
      setFileError(validation.error || 'Archivo no válido.');
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFiles((prev) => [
          ...prev,
          {
            fileName: file.name,
            mimeType: file.type,
            sizeBytes: file.size,
            previewDataUrl:
              typeof reader.result === 'string' ? reader.result : undefined,
          },
        ]);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachedFiles((prev) => [
        ...prev,
        {
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        },
      ]);
    }
  };

  const handleRemoveAttachment = (fileName: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.fileName !== fileName));
  };

  const handleSaveAndAddToCart = (proceedToCheckout: boolean) => {
    const record = registerRequest({
      productId: activeProduct.id,
      productName: activeProduct.name,
      productSku: activeVariant?.skuVariant || activeProduct.sku,
      variantId: activeVariant?.id || 'default',
      variantName: activeVariant?.name || 'Estándar',
      selectedStyleOption: activeFinish.label,
      customText: customText.trim() || 'Sin texto adicional',
      specialInstructions:
        specialInstructions.trim() || 'Estándar según diseño adjunto',
      attachedFiles,
      basePrice: pricing.baseWithVariant,
      additionalPrice: pricing.customizationExtra,
      finalUnitPrice: pricing.unitFinal,
      quantity,
      observations:
        'Solicitud registrada por el cliente. Pendiente de revisión de archivos.',
    });

    addItem({
      productId: activeProduct.id,
      slug: activeProduct.slug,
      sku: activeVariant?.skuVariant || activeProduct.sku,
      name: activeProduct.name,
      imageUrl: activeProduct.images[0]?.url || '',
      variantId: activeVariant?.id || 'default',
      variantName: activeVariant?.name || 'Estándar',
      unitPrice: pricing.baseWithVariant,
      customizationFee: pricing.customizationExtra,
      quantity,
      maxStock: activeProduct.availableStock,
      customization: {
        customText: customText.trim() || undefined,
        selectedOptionLabel: activeFinish.label,
        specialInstructions: specialInstructions.trim() || undefined,
        attachmentFileName: attachedFiles.map((f) => f.fileName).join(', '),
        additionalFee: pricing.customizationExtra,
        requiresApproval: true,
      },
    });

    if (proceedToCheckout) {
      router.push('/checkout');
      return;
    }

    setConfirmationBanner(
      `Personalización ${record.requestCode} registrada y añadida al carrito.`
    );
  };

  const primaryUploadedPreview = attachedFiles.find(
    (f) => f.previewDataUrl
  )?.previewDataUrl;

  return (
    <div className="bg-brand-neutral-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Encabezado del Módulo */}
        <div className="bg-brand-navy rounded-3xl p-8 md:p-10 text-white shadow-premium-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="accent">
              <Sparkles className="w-3.5 h-3.5" />
              MÓDULO ESPECIALIZADO · PERSONALIZACIÓN MENTELÚDICA
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Estudio de Personalización de Productos
            </h1>
            <p className="text-sm text-brand-neutral-200 leading-relaxed">
              Diseña rompecabezas fotográficos, sets con placa conmemorativa,
              llaveros para eventos y regalos corporativos con logotipo.
              Visualiza una referencia preliminar al instante y aprueba el
              diseño final antes de pasar a producción.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-2xl p-4 text-xs space-y-1.5 shrink-0">
            <div className="font-bold text-brand-beige flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              Validación de Archivos Activa
            </div>
            <p className="text-brand-neutral-200">
              Formatos: JPG, PNG, WEBP, SVG, PDF (Máx. 15 MB)
            </p>
            <p className="text-brand-neutral-200">
              Garantía de revisión y aprobación previa al taller
            </p>
          </div>
        </div>

        {confirmationBanner && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {confirmationBanner}
            </span>
            <button
              type="button"
              onClick={() => router.push('/carrito')}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold"
            >
              Ir al Carrito
            </button>
          </div>
        )}

        {/* Configurador en 2 Columnas: Formulario Paso a Paso + Referencia Preliminar Live */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Pasos 1 al 5 */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium space-y-6">
            {/* Paso 1: Seleccionar el producto */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-accent block">
                Paso 1 · Selecciona el Producto Base Personalizable
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customizableProducts.map((prod) => {
                  const isSelected = prod.id === activeProduct.id;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setSelectedVariantId(prod.variants[0]?.id || '');
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-brand-navy bg-brand-beige/60 ring-2 ring-brand-navy/15'
                          : 'border-brand-neutral-200 hover:border-brand-navy/40'
                      }`}
                    >
                      <img
                        src={prod.images[0]?.url}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-brand-navy line-clamp-2">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-brand-accent font-semibold mt-0.5">
                          Desde{' '}
                          {formatCurrencyPEN(prod.promoPrice ?? prod.salePrice)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paso 2: Elegir las opciones disponibles (Variante + Acabado) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-neutral-100">
              <div>
                <label className="text-xs font-bold text-brand-navy block mb-1.5">
                  Paso 2A · Tamaño o Variante Disponible
                </label>
                <select
                  value={activeVariant?.id}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs font-semibold text-brand-navy"
                >
                  {activeProduct.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}{' '}
                      {v.additionalPrice > 0
                        ? `(+${formatCurrencyPEN(v.additionalPrice)})`
                        : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-navy block mb-1.5">
                  Paso 2B · Opción de Acabado / Presentación
                </label>
                <select
                  value={selectedFinishId}
                  onChange={(e) => setSelectedFinishId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs font-semibold text-brand-navy"
                >
                  {FINISH_STYLE_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}{' '}
                      {f.additionalFee > 0
                        ? `(+${formatCurrencyPEN(f.additionalFee)})`
                        : '(Incluido)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Paso 3: Ingresar nombres o textos */}
            <div className="pt-2 border-t border-brand-neutral-100 space-y-1.5">
              <label className="text-xs font-bold text-brand-navy block">
                Paso 3 · Ingresa Nombres, Fechas, Frases o Nombre de Empresa
              </label>
              <input
                type="text"
                maxLength={140}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ej. Familia Rodríguez · Aniversario 2026 / Colegio San José"
                className="w-full h-11 px-4 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy focus:outline-none focus:border-brand-navy"
              />
            </div>

            {/* Paso 4: Adjuntar fotografías o logotipos con validación */}
            <div className="pt-2 border-t border-brand-neutral-100 space-y-2.5">
              <label className="text-xs font-bold text-brand-navy block">
                Paso 4 · Adjunta Fotografías o Logotipos (JPG, PNG, WEBP, SVG o
                PDF · Máx. 15 MB)
              </label>

              <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-brand-navy/30 bg-brand-beige/30 hover:bg-brand-beige/60 cursor-pointer transition-colors text-center">
                <Upload className="w-6 h-6 text-brand-accent mb-1.5" />
                <span className="text-xs font-bold text-brand-navy">
                  Haz clic para subir tu fotografía o logotipo vectorial
                </span>
                <span className="text-[11px] text-brand-neutral-600 mt-0.5">
                  Validación automática de seguridad y resolución
                </span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.svg,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {fileError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  {attachedFiles.map((f) => (
                    <div
                      key={f.fileName}
                      className="p-2.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-2 font-semibold text-brand-navy truncate">
                        <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {f.fileName} ({(f.sizeBytes / 1024).toFixed(0)} KB)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(f.fileName)}
                        className="text-red-600 hover:underline p-1"
                        aria-label="Quitar archivo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Paso 5: Añadir instrucciones especiales */}
            <div className="pt-2 border-t border-brand-neutral-100 space-y-1.5">
              <label className="text-xs font-bold text-brand-navy block">
                Paso 5 · Instrucciones Especiales de Diseño y Producción
              </label>
              <textarea
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Indica detalles sobre la posición del texto, lista de nombres individuales para llaveros, colores corporativos o fecha requerida para tu evento..."
                className="w-full p-3.5 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy focus:outline-none focus:border-brand-navy"
              />
            </div>
          </div>

          {/* Columna Derecha: Pasos 6, 7, 8 y 9 (Referencia Preliminar + Precio Final + Compra) */}
          <aside className="lg:col-span-5 bg-white rounded-3xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium space-y-6 sticky top-28">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-brand-navy flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-accent" />
                Paso 6 · Referencia Preliminar
              </h2>
              <Badge variant="teal">Vista Previa Interactiva</Badge>
            </div>

            {/* Lienzo de Previsualización Preliminar */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-navy text-white border border-brand-neutral-200 shadow-inner flex flex-col justify-between">
              <img
                src={
                  primaryUploadedPreview || activeProduct.images[0]?.url
                }
                alt="Referencia preliminar del producto personalizado"
                className="absolute inset-0 w-full h-full object-cover opacity-85"
              />
              <div className="relative z-10 p-3 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                <span className="px-2.5 py-1 rounded-md bg-brand-navy/90 text-[10px] font-mono uppercase">
                  SKU: {activeVariant?.skuVariant}
                </span>
                {primaryUploadedPreview && (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                    Fotografía / Logo Aplicado
                  </span>
                )}
              </div>

              <div className="relative z-10 p-4 bg-gradient-to-t from-brand-navy via-brand-navy/85 to-transparent space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">
                  {activeFinish.label}
                </div>
                <div className="font-display font-bold text-base text-brand-beige break-words">
                  {customText.trim() || 'Tu nombre, frase o logotipo aquí'}
                </div>
                <div className="text-[11px] text-white/80">
                  {activeProduct.name} · {activeVariant?.name}
                </div>
              </div>
            </div>

            {/* Paso 7: Consultar el precio final */}
            <div className="p-4 rounded-2xl bg-brand-neutral-50 border border-brand-neutral-200 space-y-2.5 text-xs">
              <div className="font-bold text-brand-navy uppercase tracking-wider text-[11px]">
                Paso 7 · Desglose de Precio Final
              </div>
              <div className="flex justify-between">
                <span className="text-brand-neutral-600">
                  Producto + Variante ({activeVariant?.name})
                </span>
                <span className="font-semibold text-brand-navy">
                  {formatCurrencyPEN(pricing.baseWithVariant)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-neutral-600">
                  Adicional de personalización
                </span>
                <span className="font-semibold text-brand-navy">
                  {pricing.customizationExtra > 0
                    ? `+${formatCurrencyPEN(pricing.customizationExtra)}`
                    : 'Incluido (S/ 0.00)'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-brand-neutral-200">
                <span className="font-semibold text-brand-navy">
                  Cantidad solicitada:
                </span>
                <input
                  type="number"
                  min={1}
                  max={activeProduct.availableStock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-20 h-8 px-2 rounded-lg border border-brand-neutral-200 text-center font-bold text-brand-navy bg-white"
                />
              </div>

              <div className="pt-2 border-t border-brand-neutral-200 flex justify-between items-baseline">
                <span className="font-display font-bold text-sm text-brand-navy">
                  Precio Final Total
                </span>
                <span className="font-display font-bold text-2xl text-brand-navy">
                  {formatCurrencyPEN(pricing.totalOrderLine)}
                </span>
              </div>
            </div>

            {/* Pasos 8 y 9: Agregar al carrito y Realizar el pedido */}
            <div className="space-y-2.5">
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => handleSaveAndAddToCart(false)}
              >
                <ShoppingBag className="w-4 h-4 text-brand-accent" />
                Paso 8 · Agregar Personalización al Carrito
              </Button>

              <Button
                type="button"
                variant="accent"
                size="lg"
                fullWidth
                onClick={() => handleSaveAndAddToCart(true)}
              >
                <Sparkles className="w-4 h-4" />
                Paso 9 · Realizar Pedido Personalizado Ahora
              </Button>

              <a
                href={buildWhatsAppUrl(
                  env.NEXT_PUBLIC_WHATSAPP_NUMBER,
                  `Hola MenteLúdica, estoy personalizando "${activeProduct.name}" (${activeVariant?.name}) con el texto "${customText || 'A coordinar'}" por ${formatCurrencyPEN(pricing.totalOrderLine)}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 rounded-xl border border-brand-neutral-200 text-brand-navy hover:bg-brand-neutral-100 text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#128C7E]" />
                Consultar detalles de este diseño por WhatsApp
              </a>
            </div>
          </aside>
        </div>

        {/* Seguimiento de Solicitudes y los 7 Estados Oficiales de Producción */}
        <section className="bg-white rounded-3xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold text-brand-navy flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-accent" />
                Trazabilidad de Producción y Aprobación de Diseño (7 Estados)
              </h2>
              <p className="text-xs text-brand-neutral-600">
                Cada personalización registrada conserva sus archivos adjuntos,
                fecha de solicitud, especificaciones, precio adicional y estado
                de aprobación.
              </p>
            </div>
            <Badge variant="beige">
              {requests.length} solicitudes registradas
            </Badge>
          </div>

          {/* Línea de los 7 estados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
            {CUSTOMIZATION_STATUS_PIPELINE.map((st) => (
              <div
                key={st.code}
                className="p-3 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs"
              >
                <div className="font-bold text-brand-navy">{st.label}</div>
                <p className="text-[11px] text-brand-neutral-600 mt-1">
                  {st.description}
                </p>
              </div>
            ))}
          </div>

          {/* Listado de solicitudes y botón de aprobación del diseño por el cliente */}
          <div className="space-y-3 pt-2">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-brand-neutral-200 bg-brand-beige/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-brand-navy">
                      {req.requestCode}
                    </span>
                    <Badge variant="navy">{req.productionStatus}</Badge>
                    <span className="text-brand-neutral-600">
                      Fecha:{' '}
                      {new Date(req.requestedAt).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-brand-navy">
                    {req.productName} ({req.variantName})
                  </div>
                  <p className="text-brand-neutral-600">
                    <strong>Texto:</strong> {req.customText} ·{' '}
                    <strong>Archivos:</strong>{' '}
                    {req.attachedFiles.map((f) => f.fileName).join(', ') ||
                      'Ninguno'}
                  </p>
                  <p className="text-brand-neutral-600">
                    <strong>Observaciones de producción:</strong>{' '}
                    {req.observations}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                  <div className="font-display font-bold text-base text-brand-navy">
                    {formatCurrencyPEN(req.finalUnitPrice * req.quantity)} (Adic:{' '}
                    {formatCurrencyPEN(req.additionalPrice)})
                  </div>
                  {req.designApprovalStatus === 'PENDIENTE' ? (
                    <button
                      type="button"
                      onClick={() => approveDesignByCustomer(req.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aprobar Diseño Preliminar
                    </button>
                  ) : (
                    <Badge variant="success">
                      Diseño Aprobado por el Cliente
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

