import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Blocks,
  Puzzle,
  Dices,
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  HeartHandshake,
  Star,
  MessageCircle,
  CheckCircle2,
  Gift,
  Building2,
} from 'lucide-react';
import { INITIAL_CATALOG_TAXONOMY } from '@/config/catalog-taxonomy';
import { CATALOG_PRODUCTS } from '@/modules/catalog/catalog-data';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NewsletterForm } from '@/components/marketing/NewsletterForm';
import { env } from '@/config/env';
import { buildWhatsAppUrl } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'juegos-de-construccion': Blocks,
  rompecabezas: Puzzle,
  'juegos-de-mesa': Dices,
  'souvenirs-personalizados': Sparkles,
};

const CUSTOMER_TESTIMONIALS = [
  {
    id: 'rev-1',
    author: 'Mariana Zeballos',
    location: 'Cayma, Arequipa',
    role: 'Madre de familia',
    rating: 5,
    product: 'Rompecabezas Fotográfico Personalizado 500 Piezas',
    comment:
      'La calidad del cartón antirreflejo y la nitidez de nuestra fotografía familiar superaron nuestras expectativas. Nos enviaron la vista previa por WhatsApp antes de producirlo y llegó puntual.',
  },
  {
    id: 'rev-2',
    author: 'Ing. Carlos Valdivia',
    location: 'Yanahuara, Arequipa',
    role: 'Coleccionista & Padre',
    rating: 5,
    product: 'Set Arquitectónico Catedral Histórica (1,480 Piezas)',
    comment:
      'El encaje de los bloques es sumamente preciso y el manual está muy bien estructurado. Lo armamos durante el fin de semana con mi hijo adolescente y ahora luce increíble en el estudio.',
  },
  {
    id: 'rev-3',
    author: 'Lucía Paredes – RR.HH.',
    location: 'Miraflores, Lima (Envío Nacional)',
    role: 'Cliente Corporativo B2B',
    rating: 5,
    product: 'Kit Regalo Corporativo Lúdico con Logotipo Grabado',
    comment:
      'Solicitamos 40 kits personalizados con el logo de nuestra empresa y factura RUC. El grabado láser en madera quedó impecable y el envío a Lima llegó perfectamente embalado.',
  },
];

export default function HomePage() {
  const bestSellers = CATALOG_PRODUCTS.filter((p) => p.isBestseller);
  const newArrivals = CATALOG_PRODUCTS.filter((p) => p.isNew);
  const recommendedProducts = CATALOG_PRODUCTS.filter((p) => p.isFeatured);
  const promoProducts = CATALOG_PRODUCTS.filter(
    (p) => typeof p.promoPrice === 'number' && p.promoPrice < p.salePrice
  );

  const whatsappDirectUrl = buildWhatsAppUrl(
    env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    'Hola MenteLúdica, vengo desde la página web y deseo recibir asesoría para elegir un producto o regalo personalizado.'
  );

  return (
    <main className="bg-brand-neutral-50">
      {/* =====================================================================
          SECCIONES 2 & 3: BANNER PRINCIPAL CON PROPUESTA DE VALOR + BOTONES
          Mensaje obligatorio: "Juega, aprende y crea momentos inolvidables"
      ===================================================================== */}
      <section className="relative bg-brand-navy text-white overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-brand-beige text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              Tienda Especializada en Arequipa · Envíos a todo el Perú
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Juega, aprende y crea{' '}
              <span className="text-brand-beige underline decoration-brand-accent/60 decoration-wavy underline-offset-8">
                momentos inolvidables
              </span>
              .
            </h1>

            <p className="text-base sm:text-lg text-brand-neutral-200 max-w-2xl leading-relaxed">
              Seleccionamos sets de construcción, rompecabezas de colección,
              juegos de mesa modernos y souvenirs personalizados que despiertan
              la creatividad de niños, jóvenes, adultos, familias y empresas.
            </p>

            {/* Botones de Compra y Exploración (Sección 6.3) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center gap-2.5 h-13 px-7 py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-white font-bold text-sm shadow-premium-lg transition-all"
              >
                Explorar Catálogo Completo
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/personalizar"
                className="inline-flex items-center justify-center gap-2.5 h-13 px-6 py-3.5 rounded-xl bg-brand-beige text-brand-navy hover:bg-brand-beige-warm font-bold text-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-brand-accent" />
                Personalizar un Regalo
              </Link>

              <Link
                href="/catalogo?ofertas=true"
                className="inline-flex items-center justify-center h-13 px-5 py-3.5 rounded-xl border border-white/25 text-white hover:bg-white/10 font-semibold text-sm transition-all"
              >
                Ver Ofertas del Mes
              </Link>
            </div>

            {/* Indicadores de Confianza */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 max-w-xl text-xs text-brand-beige/90">
              <div>
                <strong className="block text-white font-display text-base">
                  4 Líneas
                </strong>
                <span>29 Subcategorías</span>
              </div>
              <div>
                <strong className="block text-white font-display text-base">
                  Diseño a Medida
                </strong>
                <span>Con vista previa aprobada</span>
              </div>
              <div>
                <strong className="block text-white font-display text-base">
                  Arequipa & Perú
                </strong>
                <span>Delivery y envíos nacionales</span>
              </div>
            </div>
          </div>

          {/* Mosaico Visual de Producto */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-brand-navy-light shadow-premium-lg">
                <img
                  src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=700&q=80"
                  alt="Juegos de construcción y arquitectura"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3.5">
                  <span className="text-[11px] font-bold text-brand-accent uppercase">
                    Construcción & STEM
                  </span>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    Sets de Arquitectura y Vehículos
                  </p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/15 bg-brand-navy-light shadow-premium-lg">
                <img
                  src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=700&q=80"
                  alt="Juegos de mesa familiares y de estrategia"
                  className="w-full h-40 object-cover"
                />
                <div className="p-3.5">
                  <span className="text-[11px] font-bold text-brand-beige uppercase">
                    Juegos de Mesa
                  </span>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    Estrategia, Lógica y Familia
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-brand-navy-light shadow-premium-lg">
                <img
                  src="https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&w=700&q=80"
                  alt="Rompecabezas de madera y personalizados"
                  className="w-full h-40 object-cover"
                />
                <div className="p-3.5">
                  <span className="text-[11px] font-bold text-brand-accent-teal uppercase">
                    Rompecabezas
                  </span>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    Madera Láser, 3D y Fotográficos
                  </p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/15 bg-brand-navy-light shadow-premium-lg">
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80"
                  alt="Souvenirs personalizados y regalos corporativos"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3.5">
                  <span className="text-[11px] font-bold text-brand-accent uppercase">
                    Souvenirs a Medida
                  </span>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    Eventos, Fotos y Logos Empresas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 4: CATEGORÍAS DESTACADAS (4 Categorías + 29 Subcategorías)
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeading
          eyebrow="Explora Nuestro Universo Lúdico"
          title="Categorías Destacadas"
          description="Cuatro mundos especializados diseñados para estimular el ingenio, compartir en familia y crear regalos con identidad propia."
          action={
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-accent"
            >
              Ver las 29 subcategorías
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_CATALOG_TAXONOMY.map((category) => {
            const IconComponent =
              CATEGORY_ICONS[category.slug] || Sparkles;
            return (
              <div
                key={category.id}
                className="group bg-white rounded-2xl border border-brand-neutral-200 p-6 shadow-premium hover:border-brand-navy transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-beige text-brand-navy flex items-center justify-center mb-4 group-hover:bg-brand-navy group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <Link
                    href={`/catalogo?categoria=${category.slug}`}
                    className="font-display font-bold text-lg text-brand-navy group-hover:text-brand-accent transition-colors block"
                  >
                    {category.name}
                  </Link>

                  <p className="text-xs text-brand-neutral-600 mt-1.5 mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {category.subcategories?.slice(0, 5).map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/catalogo?categoria=${category.slug}&subcategoria=${sub.slug}`}
                        className="px-2.5 py-1 rounded-lg bg-brand-neutral-50 hover:bg-brand-beige text-[11px] font-medium text-brand-navy border border-brand-neutral-200 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/catalogo?categoria=${category.slug}`}
                  className="inline-flex items-center justify-between pt-3 border-t border-brand-neutral-100 text-xs font-bold text-brand-navy group-hover:text-brand-accent"
                >
                  <span>
                    Explorar {category.subcategories?.length} subcategorías
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 5: PRODUCTOS MÁS VENDIDOS
      ===================================================================== */}
      <section className="bg-white border-y border-brand-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Favoritos de Nuestros Clientes"
            title="Productos Más Vendidos"
            description="Los sets de construcción, rompecabezas y regalos personalizados con mayor demanda en Arequipa y el Perú."
            action={
              <Link
                href="/catalogo?orden=mas-vendidos"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-accent"
              >
                Ver ranking completo
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 9: MÓDULO DESTACADO DE PERSONALIZACIÓN DE PRODUCTOS
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl bg-brand-navy text-white p-8 md:p-12 shadow-premium-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <Badge variant="accent">
              <Sparkles className="w-3.5 h-3.5" />
              TALLER DE PERSONALIZACIÓN MENTELÚDICA
            </Badge>

            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Transformamos tus fotografías, nombres y logotipos en piezas únicas
            </h2>

            <p className="text-sm md:text-base text-brand-neutral-200 leading-relaxed">
              Desde rompecabezas fotográficos familiares y llaveros para
              cumpleaños hasta kits ejecutivos con el logotipo de tu empresa o
              colegio. Cada pedido personalizado pasa por revisión de diseño y
              aprobación digital antes de entrar a producción.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-brand-beige">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                <span>1. Elige el producto y variante base</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                <span>2. Ingresa nombres, textos o dedicatoria</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                <span>3. Adjunta fotografías o logotipo en alta calidad</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                <span>4. Aprueba la referencia visual antes de producir</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-3">
              <Link
                href="/personalizar"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-white font-bold text-xs transition-colors"
              >
                <Gift className="w-4 h-4" />
                Ir al Estudio de Personalización
              </Link>
              <Link
                href="/catalogo?categoria=souvenirs-personalizados"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
              >
                <Building2 className="w-4 h-4" />
                Ver Regalos Corporativos y Eventos
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 border border-white/15 rounded-2xl p-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-beige">
              Flujo Transparente de Producción (7 Estados)
            </div>
            <ol className="space-y-2.5 text-xs">
              {[
                '1. Pendiente de revisión de archivos',
                '2. En diseño y retoque digital',
                '3. Esperando aprobación del cliente',
                '4. Diseño aprobado para taller',
                '5. En producción (Corte láser / Impresión HD)',
                '6. Terminado y control de calidad',
                '7. Entregado en Arequipa o despachado a nivel nacional',
              ].map((step, idx) => (
                <li
                  key={step}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 text-brand-neutral-100"
                >
                  <span className="w-5 h-5 rounded-full bg-brand-accent text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  {step.replace(/^\d+\.\s/, '')}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECCIONES 6 & 7: PRODUCTOS NUEVOS Y PRODUCTOS RECOMENDADOS
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 space-y-16">
        <div>
          <SectionHeading
            eyebrow="Recién Llegados al Catálogo"
            title="Productos Nuevos"
            description="Últimos lanzamientos en ingeniería armable, retos de lógica STEM y personalización creativa."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="Selección del Equipo MenteLúdica"
            title="Productos Recomendados por Edad y Objetivo"
            description="Curaduría pensada para regalar, compartir en casa o implementar en espacios educativos."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 8: OFERTAS Y PROMOCIONES ACTIVAS
      ===================================================================== */}
      <section className="bg-brand-beige/60 border-y border-brand-beige-warm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Oportunidades Especiales"
            title="Ofertas y Promociones de Temporada"
            description="Aprovecha precios promocionales por tiempo limitado y usa el cupón BIENVENIDA10 en tu primera compra."
            action={
              <Badge variant="accent">Cupón Activo: BIENVENIDA10 (-10%)</Badge>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promoProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 10: BENEFICIOS DE COMPRAR EN MENTELÚDICA
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeading
          eyebrow="Propuesta de Valor Diferencial"
          title="¿Por qué elegir MenteLúdica?"
          description="Combinamos estándares de tienda especializada con cercanía local en Arequipa y alcance a todo el Perú."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-brand-neutral-200 shadow-premium">
            <div className="w-11 h-11 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-4">
              <Award className="w-5 h-5 text-brand-accent" />
            </div>
            <h3 className="font-display font-bold text-base text-brand-navy">
              Curaduría Educativa y Creativa
            </h3>
            <p className="text-xs text-brand-neutral-600 mt-2 leading-relaxed">
              Seleccionamos productos con materiales seguros, encaje preciso y
              alto valor formativo tanto para niños como para adultos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-neutral-200 shadow-premium">
            <div className="w-11 h-11 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-brand-accent" />
            </div>
            <h3 className="font-display font-bold text-base text-brand-navy">
              Taller Propio de Personalización
            </h3>
            <p className="text-xs text-brand-neutral-600 mt-2 leading-relaxed">
              Grabado láser e impresión fotográfica HD con revisión de archivos y
              aprobación digital antes de fabricar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-neutral-200 shadow-premium">
            <div className="w-11 h-11 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-4">
              <Truck className="w-5 h-5 text-brand-accent" />
            </div>
            <h3 className="font-display font-bold text-base text-brand-navy">
              Logística Flexible Arequipa & Perú
            </h3>
            <p className="text-xs text-brand-neutral-600 mt-2 leading-relaxed">
              Delivery local por distritos en Arequipa, recojo en punto de
              entrega y despachos nacionales con código de seguimiento.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-neutral-200 shadow-premium">
            <div className="w-11 h-11 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5 text-brand-accent" />
            </div>
            <h3 className="font-display font-bold text-base text-brand-navy">
              Atención a Familias, Colegios y Empresas
            </h3>
            <p className="text-xs text-brand-neutral-600 mt-2 leading-relaxed">
              Asesoría personalizada por edad u ocasión, ventas corporativas por
              volumen y emisión de Boleta o Factura RUC.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECCIÓN 11: OPINIONES DE CLIENTES VERIFICADOS
      ===================================================================== */}
      <section className="bg-white border-t border-brand-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Confianza Comprobada"
            title="Opiniones de Clientes en Arequipa y Perú"
            description="Experiencias reales de familias, coleccionistas e instituciones que confían en MenteLúdica."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTOMER_TESTIMONIALS.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-2xl bg-brand-neutral-50 border border-brand-neutral-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-brand-navy leading-relaxed italic">
                    “{review.comment}”
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-neutral-200">
                  <div className="font-display font-bold text-sm text-brand-navy">
                    {review.author}
                  </div>
                  <div className="text-xs text-brand-neutral-600">
                    {review.role} · {review.location}
                  </div>
                  <div className="text-[11px] font-semibold text-brand-accent mt-1">
                    Compra verificada: {review.product}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECCIONES 12 & 13: SUSCRIPCIÓN A NOVEDADES + ACCESO DIRECTO A WHATSAPP
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl bg-brand-navy text-white p-8 md:p-12 text-center space-y-6 shadow-premium-lg">
          <Badge variant="beige">Comunidad MenteLúdica Perú</Badge>
          <h2 className="font-display text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
            Suscríbete a nuestras novedades y recibe beneficios exclusivos
          </h2>
          <p className="text-sm text-brand-neutral-200 max-w-xl mx-auto">
            Entérate antes que nadie de nuevos sets de construcción, diseños de
            rompecabezas de edición limitada y campañas para fechas especiales.
          </p>

          <NewsletterForm />

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-brand-beige">
            <span>¿Prefieres atención inmediata de un asesor en Arequipa?</span>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Conversar ahora por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
