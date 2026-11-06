import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Sparkles,
  Star,
  MessageCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { CatalogProductView } from '@/modules/catalog/catalog-data';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyPEN, buildWhatsAppUrl } from '@/lib/utils';
import { env } from '@/config/env';

interface ProductCardProps {
  product: CatalogProductView;
}

/**
 * Tarjeta de Producto Comercial MenteLúdica (Secciones 6 y 7).
 * Muestra categoría, insignias de oferta/personalización, nota de compatibilidad,
 * precio regular y promocional en Soles (PEN), acceso a la ficha técnica y consulta por WhatsApp.
 */
export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0];
  const hasPromo =
    typeof product.promoPrice === 'number' &&
    product.promoPrice < product.salePrice;
  const effectivePrice = hasPromo ? product.promoPrice! : product.salePrice;
  const discountPercentage = hasPromo
    ? Math.round(
        ((product.salePrice - product.promoPrice!) / product.salePrice) * 100
      )
    : 0;

  const whatsappProductUrl = buildWhatsAppUrl(
    env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    `Hola MenteLúdica, deseo consultar por el producto "${product.name}" (SKU: ${product.sku}).`
  );

  return (
    <article className="group bg-white rounded-2xl border border-brand-neutral-200 overflow-hidden shadow-premium hover:shadow-premium-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Imagen con Badges Superiores */}
        <div className="relative aspect-[4/3] bg-brand-neutral-100 overflow-hidden">
          <Link href={`/producto/${product.slug}`} className="block w-full h-full">
            <img
              src={primaryImage?.url}
              alt={primaryImage?.alt || product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {hasPromo && (
              <Badge variant="accent">-{discountPercentage}% OFERTA</Badge>
            )}
            {product.isCustomizable && (
              <Badge variant="navy">
                <Sparkles className="w-3 h-3 text-brand-accent" />
                Personalizable
              </Badge>
            )}
            {product.isNew && !hasPromo && (
              <Badge variant="teal">Nuevo</Badge>
            )}
          </div>

          <div className="absolute bottom-2.5 right-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm text-[11px] font-bold text-brand-navy shadow-sm">
              {product.recommendedAge}
            </span>
          </div>
        </div>

        {/* Contenido e Información Clave */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-brand-neutral-600">
            <span className="uppercase tracking-wider text-brand-accent">
              {product.subcategoryName}
            </span>
            <span className="inline-flex items-center gap-1 text-brand-navy">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)} ({product.reviewsCount})
            </span>
          </div>

          <Link
            href={`/producto/${product.slug}`}
            className="block font-display font-bold text-base text-brand-navy group-hover:text-brand-accent transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          <p className="text-xs text-brand-neutral-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {product.compatibilityNote && (
            <div className="p-2 rounded-lg bg-brand-beige/60 border border-brand-beige-warm text-[11px] text-brand-navy flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent-teal shrink-0 mt-0.5" />
              <span>Compatible con sistemas de bloques estándar (No LEGO).</span>
            </div>
          )}
        </div>
      </div>

      {/* Pie de Tarjeta: Precio + Acciones */}
      <div className="px-5 pb-5 pt-2 border-t border-brand-neutral-100 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-brand-neutral-600 block">
              Precio online
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-xl text-brand-navy">
                {formatCurrencyPEN(effectivePrice)}
              </span>
              {hasPromo && (
                <span className="text-xs text-brand-neutral-600 line-through">
                  {formatCurrencyPEN(product.salePrice)}
                </span>
              )}
            </div>
          </div>

          <span className="text-[11px] font-mono text-brand-neutral-600">
            Stock: {product.availableStock} u.
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          <Link
            href={`/producto/${product.slug}`}
            className="col-span-4 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light transition-colors"
          >
            {product.isCustomizable ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                Ver / Personalizar
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-brand-accent" />
                Ver Ficha / Comprar
              </>
            )}
          </Link>

          <a
            href={whatsappProductUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Consultar este producto por WhatsApp"
            aria-label={`Consultar ${product.name} por WhatsApp`}
            className="col-span-1 inline-flex items-center justify-center h-10 rounded-xl bg-[#128C7E]/10 text-[#128C7E] hover:bg-[#128C7E] hover:text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

