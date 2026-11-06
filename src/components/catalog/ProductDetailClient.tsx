'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Sparkles,
  MessageCircle,
  ZoomIn,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Package,
  Ruler,
  Scale,
  Layers,
  Tag,
  Star,
  Plus,
  Minus,
  Check,
  X,
} from 'lucide-react';
import { CatalogProductView } from '@/modules/catalog/catalog-data';
import { useCartStore } from '@/modules/cart/cart-store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { formatCurrencyPEN, buildWhatsAppUrl } from '@/lib/utils';
import { env } from '@/config/env';

interface ProductDetailClientProps {
  product: CatalogProductView;
  similarProducts: CatalogProductView[];
}

/**
 * Ficha Completa de Producto MenteLúdica (Sección 7 del Prompt Maestro)
 * Incluye:
 * - Galería de imágenes interactiva
 * - Zoom de fotografías (lente interactivo al pasar el cursor + visor pantalla completa)
 * - Selección de variantes con cálculo de precio en tiempo real
 * - Selector de cantidad validado contra stock disponible
 * - Botón Agregar al Carrito (con confirmación instantánea)
 * - Botón Comprar Ahora (añade y dirige directo al carrito/checkout)
 * - Botón Consultar por WhatsApp (con SKU y variante seleccionada)
 * - Especificaciones completas (SKU, categoría, subcategoría, marca, edad, dimensiones, peso, material, etiquetas)
 * - Productos similares
 */
export function ProductDetailClient({
  product,
  similarProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isHoverZooming, setIsHoverZooming] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [quickCustomText, setQuickCustomText] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const activeImage =
    product.images[selectedImageIndex] || product.images[0];

  const baseEffectivePrice =
    typeof product.promoPrice === 'number' &&
    product.promoPrice < product.salePrice
      ? product.promoPrice
      : product.salePrice;

  const finalUnitPrice =
    baseEffectivePrice + (selectedVariant?.additionalPrice || 0);
  const originalReferencePrice =
    product.salePrice + (selectedVariant?.additionalPrice || 0);
  const hasDiscount = finalUnitPrice < originalReferencePrice;

  const handleMouseMoveZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const handleAddToCart = (redirectToCheckout = false) => {
    addItem({
      productId: product.id,
      slug: product.slug,
      sku: selectedVariant?.skuVariant || product.sku,
      name: product.name,
      imageUrl: activeImage.url,
      variantId: selectedVariant?.id || 'default',
      variantName: selectedVariant?.name || 'Estándar',
      unitPrice: finalUnitPrice,
      customizationFee: 0,
      quantity,
      maxStock: product.availableStock,
      customization:
        product.isCustomizable && quickCustomText.trim()
          ? {
              customText: quickCustomText.trim(),
              selectedOptionLabel: selectedVariant?.name,
              additionalFee: 0,
              requiresApproval: true,
            }
          : null,
    });

    if (redirectToCheckout) {
      router.push('/carrito');
      return;
    }

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2800);
  };

  const whatsappUrl = buildWhatsAppUrl(
    env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    `Hola MenteLúdica, deseo consultar por el producto "${product.name}" — Código SKU: ${selectedVariant?.skuVariant || product.sku} (Variante: ${selectedVariant?.name || 'Estándar'}, Cantidad: ${quantity}).`
  );

  return (
    <div className="bg-brand-neutral-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        {/* Migas de Pan (Breadcrumbs SEO) */}
        <nav
          aria-label="Ruta de navegación"
          className="text-xs text-brand-neutral-600 flex flex-wrap items-center gap-2"
        >
          <Link href="/" className="hover:text-brand-navy font-medium">
            Inicio
          </Link>
          <span>/</span>
          <Link
            href={`/catalogo?categoria=${product.categorySlug}`}
            className="hover:text-brand-navy font-medium"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <Link
            href={`/catalogo?categoria=${product.categorySlug}&subcategoria=${product.subcategorySlug}`}
            className="hover:text-brand-navy font-medium"
          >
            {product.subcategoryName}
          </Link>
          <span>/</span>
          <span className="text-brand-navy font-bold line-clamp-1">
            {product.name}
          </span>
        </nav>

        {/* Bloque Principal: Galería con Zoom + Panel de Compra */}
        <div className="bg-white rounded-3xl border border-brand-neutral-200 p-6 md:p-10 shadow-premium grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Columna Izquierda: Galería de Imágenes y Lente de Zoom */}
          <div className="lg:col-span-6 space-y-4">
            <div
              onMouseEnter={() => setIsHoverZooming(true)}
              onMouseLeave={() => setIsHoverZooming(false)}
              onMouseMove={handleMouseMoveZoom}
              onClick={() => setIsZoomModalOpen(true)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-neutral-100 border border-brand-neutral-200 cursor-zoom-in group"
            >
              <img
                src={activeImage.url}
                alt={activeImage.alt}
                style={
                  isHoverZooming
                    ? {
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                        transform: 'scale(1.85)',
                      }
                    : undefined
                }
                className="w-full h-full object-cover transition-transform duration-200"
              />

              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                {hasDiscount && <Badge variant="accent">PRECIO PROMOCIONAL</Badge>}
                {product.isCustomizable && (
                  <Badge variant="navy">
                    <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                    Personalizable
                  </Badge>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomModalOpen(true);
                }}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm text-brand-navy text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:bg-white"
              >
                <ZoomIn className="w-4 h-4 text-brand-accent" />
                Ampliar Fotografía
              </button>
            </div>

            {/* Miniaturas de Galería */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-brand-accent ring-2 ring-brand-accent/30'
                      : 'border-brand-neutral-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Nota de Compatibilidad (cuando aplica a Juegos de Construcción) */}
            {product.compatibilityNote && (
              <div className="p-4 rounded-2xl bg-brand-beige/70 border border-brand-beige-warm text-xs text-brand-navy flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-accent-teal shrink-0 mt-0.5" />
                <div>
                  <strong>Compatibilidad Verificada:</strong>{' '}
                  {product.compatibilityNote}
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha: Información Comercial, Variantes y Botones */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Marca, SKU y Calificación */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-brand-accent">
                    {product.brand}
                  </span>
                  <span className="text-brand-neutral-200">|</span>
                  <span className="font-mono text-brand-neutral-600">
                    SKU: {selectedVariant?.skuVariant || product.sku}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 font-bold text-brand-navy">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {product.rating.toFixed(1)} ({product.reviewsCount} opiniones)
                </div>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-navy leading-tight">
                {product.name}
              </h1>

              <p className="text-sm text-brand-neutral-600 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Bloque de Precio y Disponibilidad */}
              <div className="p-4 rounded-2xl bg-brand-neutral-50 border border-brand-neutral-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-brand-neutral-600 block">
                    Precio de venta online (Incluye IGV)
                  </span>
                  <div className="flex items-baseline gap-3 mt-0.5">
                    <span className="font-display text-3xl font-bold text-brand-navy">
                      {formatCurrencyPEN(finalUnitPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-brand-neutral-600 line-through">
                        {formatCurrencyPEN(originalReferencePrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    variant={
                      product.availableStock > product.minStockAlert
                        ? 'success'
                        : 'warning'
                    }
                  >
                    Stock disponible: {product.availableStock} unidades
                  </Badge>
                  <span className="block text-[11px] text-brand-neutral-600 mt-1">
                    Despacho desde Arequipa
                  </span>
                </div>
              </div>

              {/* Selección de Variantes */}
              {product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy block">
                    Selecciona una presentación / variante:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'border-brand-navy bg-brand-beige/60 text-brand-navy ring-2 ring-brand-navy/15'
                              : 'border-brand-neutral-200 bg-white text-brand-neutral-600 hover:border-brand-navy/40'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-brand-navy">
                              {variant.name}
                            </div>
                            <div className="text-[11px] font-mono text-brand-neutral-600">
                              {variant.skuVariant}
                            </div>
                          </div>
                          {variant.additionalPrice > 0 && (
                            <span className="text-xs font-bold text-brand-accent shrink-0">
                              +{formatCurrencyPEN(variant.additionalPrice)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Campo Rápido de Personalización o Enlace al Estudio Completo */}
              {product.isCustomizable && (
                <div className="p-4 rounded-2xl bg-brand-beige/50 border border-brand-beige-warm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-accent" />
                      Opciones de Personalización
                    </span>
                    <Link
                      href={`/personalizar?producto=${product.slug}`}
                      className="text-xs font-bold text-brand-accent hover:underline"
                    >
                      Subir fotos / logos en Estudio Completo →
                    </Link>
                  </div>
                  <input
                    type="text"
                    value={quickCustomText}
                    onChange={(e) => setQuickCustomText(e.target.value)}
                    placeholder="Opcional: Ingresa nombre, frase o dedicatoria para grabar..."
                    className="w-full h-10 px-3.5 rounded-xl bg-white border border-brand-neutral-200 text-xs text-brand-navy focus:outline-none focus:border-brand-navy"
                  />
                </div>
              )}

              {/* Selector de Cantidad y Botones Principales de Compra */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Control de Cantidad */}
                  <div className="inline-flex items-center rounded-xl border border-brand-neutral-200 bg-white h-12 px-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-brand-navy hover:text-brand-accent"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-display font-bold text-sm text-brand-navy">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(product.availableStock, q + 1)
                        )
                      }
                      className="p-2 text-brand-navy hover:text-brand-accent"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Botón Agregar al Carrito */}
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 h-12"
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        ¡Agregado al Carrito!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-brand-accent" />
                        Agregar al Carrito
                      </>
                    )}
                  </Button>

                  {/* Botón Comprar Ahora */}
                  <Button
                    type="button"
                    variant="accent"
                    size="lg"
                    onClick={() => handleAddToCart(true)}
                    className="h-12"
                  >
                    Comprar Ahora
                  </Button>
                </div>

                {/* Botón Consultar por WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar este producto por WhatsApp (SKU:{' '}
                  {selectedVariant?.skuVariant || product.sku})
                </a>
              </div>
            </div>

            {/* Garantías de Entrega */}
            <div className="pt-4 border-t border-brand-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-neutral-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-accent shrink-0" />
                <span>Delivery Arequipa y envíos a todo el Perú</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-accent-teal shrink-0" />
                <span>Pagos con Yape, Plin, Tarjetas o Contra Entrega</span>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción Completa y Tabla de Ficha Técnica (Sección 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium space-y-5">
            <h2 className="font-display text-xl font-bold text-brand-navy">
              Descripción Completa y Beneficios
            </h2>
            <p className="text-sm text-brand-neutral-600 leading-relaxed">
              {product.fullDescription}
            </p>

            <div className="space-y-2.5 pt-2">
              <h3 className="font-display font-bold text-sm text-brand-navy">
                Características Destacadas:
              </h3>
              <ul className="space-y-2">
                {product.features.map((feat) => (
                  <li
                    key={feat}
                    className="text-xs sm:text-sm text-brand-navy flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-brand-neutral-600 inline-flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Etiquetas:
              </span>
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/catalogo?q=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 rounded-lg bg-brand-neutral-100 hover:bg-brand-beige text-xs font-medium text-brand-navy"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium space-y-4">
            <h2 className="font-display text-xl font-bold text-brand-navy">
              Especificaciones Técnicas
            </h2>
            <dl className="divide-y divide-brand-neutral-100 text-xs">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-brand-neutral-600 font-medium flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-accent" />
                  Código SKU
                </dt>
                <dd className="font-mono font-bold text-brand-navy">
                  {selectedVariant?.skuVariant || product.sku}
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-brand-neutral-600 font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-accent" />
                  Categoría / Subcategoría
                </dt>
                <dd className="font-semibold text-brand-navy text-right">
                  {product.categoryName} · {product.subcategoryName}
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-brand-neutral-600 font-medium">Marca</dt>
                <dd className="font-semibold text-brand-navy">{product.brand}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-brand-neutral-600 font-medium">
                  Edad recomendada
                </dt>
                <dd className="font-semibold text-brand-navy">
                  {product.recommendedAge}
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-brand-neutral-600 font-medium flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-brand-accent" />
                  Dimensiones
                </dt>
                <dd className="font-semibold text-brand-navy">
                  {product.dimensions}
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-brand-neutral-600 font-medium flex items-center gap-2">
                  <Scale className="w-4 h-4 text-brand-accent" />
                  Peso aproximado
                </dt>
                <dd className="font-semibold text-brand-navy">
                  {product.weightGrams} g
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-brand-neutral-600 font-medium">Material</dt>
                <dd className="font-semibold text-brand-navy text-right">
                  {product.material}
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-brand-neutral-600 font-medium">
                  Estado de publicación
                </dt>
                <dd className="font-semibold text-emerald-700 uppercase">
                  {product.status === 'published' ? 'Publicado' : product.status}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Productos Similares / Relacionados */}
        {similarProducts.length > 0 && (
          <section className="space-y-6 pt-4">
            <h2 className="font-display text-2xl font-bold text-brand-navy">
              Productos Similares y Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal de Zoom de Fotografía a Pantalla Completa */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-brand-navy-dark/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-premium-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-brand-navy text-white flex items-center justify-between">
              <span className="font-display font-bold text-sm">
                {product.name} — Vista Ampliada
              </span>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-brand-neutral-100 flex items-center justify-center max-h-[80vh]">
              <img
                src={activeImage.url}
                alt={activeImage.alt}
                className="max-h-[72vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

