import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { INITIAL_CATALOG_TAXONOMY } from '@/config/catalog-taxonomy';
import { env } from '@/config/env';
import { buildWhatsAppUrl } from '@/lib/utils';

/**
 * Footer Comercial MenteLúdica (Sección 6.14 del Prompt Maestro)
 * Incluye propuesta de valor, enlaces a las 4 categorías, atención al cliente,
 * métodos de pago soportados en Perú y acceso a Libro de Reclamaciones / Políticas.
 */
export function MainFooter() {
  const whatsappHref = buildWhatsAppUrl(
    env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    'Hola MenteLúdica, deseo recibir asesoría sobre sus productos y envíos.'
  );

  return (
    <footer className="bg-brand-navy text-white border-t border-white/10 mt-auto">
      {/* Franja de Garantías Comerciales */}
      <div className="border-b border-white/10 bg-brand-navy-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/20 text-brand-accent flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">
                Delivery en Arequipa y Envíos a todo el Perú
              </h3>
              <p className="text-xs text-brand-neutral-200 mt-0.5">
                Despachos rápidos por distrito en Arequipa, agencias nacionales y
                recojo en punto de entrega.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/20 text-brand-accent flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">
                Personalización con Aprobación Previa
              </h3>
              <p className="text-xs text-brand-neutral-200 mt-0.5">
                Diseñamos rompecabezas, recuerdos y regalos corporativos con
                validación visual antes de producir.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/20 text-brand-accent flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">
                Pagos 100% Seguros en Soles (PEN)
              </h3>
              <p className="text-xs text-brand-neutral-200 mt-0.5">
                Aceptamos Yape, Plin, Transferencias, Tarjetas (Culqi / Mercado
                Pago / Niubiz) y Pago Contra Entrega.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cuerpo Principal del Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Columna 1-2: Identidad de Marca */}
        <div className="lg:col-span-2 space-y-4">
          <BrandLogo variant="light" size="md" />
          <p className="text-sm text-brand-neutral-200 max-w-sm leading-relaxed">
            <strong>“Juega, aprende y crea momentos inolvidables”.</strong>{' '}
            Tienda especializada en productos recreativos, educativos, creativos
            y personalizados para niños, jóvenes, adultos, familias, colegios y
            empresas.
          </p>
          <div className="space-y-2 text-xs text-brand-beige/90 pt-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
              <span>Arequipa, Perú — Atención local y despachos nacionales</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-accent shrink-0" />
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                WhatsApp Comercial: +{env.NEXT_PUBLIC_WHATSAPP_NUMBER}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-accent shrink-0" />
              <span>contacto@menteludica.pe</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-accent shrink-0" />
              <span>Lunes a Sábado: 9:00 a.m. – 8:00 p.m.</span>
            </div>
          </div>
        </div>

        {/* Columna 3: Categorías */}
        <div>
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-brand-beige mb-4">
            Categorías
          </h4>
          <ul className="space-y-2.5 text-xs text-brand-neutral-200">
            {INITIAL_CATALOG_TAXONOMY.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/personalizar"
                className="text-brand-accent font-semibold hover:underline"
              >
                Personalización a Medida
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Atención al Cliente */}
        <div>
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-brand-beige mb-4">
            Cliente & Soporte
          </h4>
          <ul className="space-y-2.5 text-xs text-brand-neutral-200">
            <li>
              <Link href="/mi-cuenta" className="hover:text-white">
                Portal del Cliente / Mis Pedidos
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="hover:text-white">
                Mi Carrito de Compras
              </Link>
            </li>
            <li>
              <Link href="/personalizar" className="hover:text-white">
                Estado de Diseño Personalizado
              </Link>
            </li>
            <li>
              <Link href="/identidad" className="hover:text-white">
                Identidad Visual MenteLúdica
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white">
                Acceso Administrativo
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 5: Ventas Corporativas & Colegios */}
        <div>
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-brand-beige mb-4">
            Empresas y Colegios
          </h4>
          <p className="text-xs text-brand-neutral-200 leading-relaxed mb-4">
            Desarrollamos souvenirs corporativos con logotipo, kits educativos y
            recuerdos para eventos institucionales con emisión de Boleta o
            Factura RUC.
          </p>
          <a
            href={buildWhatsAppUrl(
              env.NEXT_PUBLIC_WHATSAPP_NUMBER,
              'Hola MenteLúdica, deseo solicitar una cotización corporativa / institucional.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-brand-accent text-white font-bold text-xs hover:bg-brand-accent-hover transition-colors"
          >
            Solicitar Cotización B2B
          </a>
        </div>
      </div>

      {/* Pie Legal e Información de Pagos */}
      <div className="border-t border-white/10 bg-brand-navy-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-neutral-200">
          <p>
            © {new Date().getFullYear()} MenteLúdica – Aprendizaje y Diversión.
            Todos los derechos reservados. Arequipa, Perú.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-semibold">
              Yape / Plin
            </span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-semibold">
              BCP / BBVA / Interbank
            </span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-semibold">
              Culqi · Mercado Pago · Niubiz
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

