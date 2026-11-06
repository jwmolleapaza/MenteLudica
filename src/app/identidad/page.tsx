import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  Sparkles,
  Palette,
  Type,
  LayoutGrid,
  Smartphone,
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'Identidad Visual y Sistema de Diseño',
  description:
    'Manual de identidad visual y sistema de componentes UI de MenteLúdica – Aprendizaje y Diversión (Premium + Minimalista + Creativo).',
};

const COLOR_SWATCHES = [
  {
    name: 'Azul Profundo (Brand Navy)',
    hex: '#0F2537',
    role: 'Confianza, profesionalismo, autoridad educativa y corporativa.',
    bgClass: 'bg-brand-navy text-white',
  },
  {
    name: 'Blanco Puro',
    hex: '#FFFFFF',
    role: 'Limpieza visual, amplitud y protagonismo para las fotografías de producto.',
    bgClass: 'bg-white text-brand-navy border border-brand-neutral-200',
  },
  {
    name: 'Gris Claro Equilibrado',
    hex: '#F8FAFC',
    role: 'Fondos de sección descansados y jerarquía estructural.',
    bgClass: 'bg-brand-neutral-50 text-brand-navy border border-brand-neutral-200',
  },
  {
    name: 'Beige Suave & Cálido',
    hex: '#F5EFE6',
    role: 'Calidez familiar, madera natural, creatividad y cercanía.',
    bgClass: 'bg-brand-beige text-brand-navy border border-brand-beige-warm',
  },
  {
    name: 'Ámbar Creativo (Acento Conversión)',
    hex: '#D97706',
    role: 'Llamados a la acción (CTA), promociones y personalización.',
    bgClass: 'bg-brand-accent text-white',
  },
  {
    name: 'Teal Aprendizaje (Acento Secundario)',
    hex: '#0D9488',
    role: 'Indicadores de stock verificado, edad recomendada y sellos STEM.',
    bgClass: 'bg-brand-accent-teal text-white',
  },
];

export default function BrandIdentityPage() {
  return (
    <div className="bg-brand-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        {/* Encabezado del Manual de Marca */}
        <div className="bg-brand-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-premium-lg">
          <div className="max-w-3xl space-y-4">
            <Badge variant="accent">
              <Sparkles className="w-3.5 h-3.5" />
              FASE 2 · IDENTIDAD VISUAL & SISTEMA DE DISEÑO
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Concepto Visual:{' '}
              <span className="text-brand-beige">
                Premium + Minimalista + Creativo
              </span>
            </h1>
            <p className="text-brand-neutral-200 text-sm md:text-base leading-relaxed">
              Diseñado para transmitir confianza tanto a padres de familia y
              jóvenes coleccionistas como a colegios y empresas en Arequipa y
              todo el Perú, evitando una estética excesivamente infantil.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-beige hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de la tienda
              </Link>
            </div>
          </div>
        </div>

        {/* 1. Logotipo e Isotipo */}
        <section className="bg-white rounded-2xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium">
          <SectionHeading
            eyebrow="01. Identidad de Marca"
            title="Logotipo e Isotipo Vectorial Escalable"
            description="El isotipo sintetiza un bloque de construcción isométrico y el encaje de precisión de un rompecabezas."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-brand-neutral-50 border border-brand-neutral-200 p-8 flex flex-col items-start justify-between gap-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-neutral-600">
                Versión Principal sobre Fondo Claro
              </span>
              <BrandLogo variant="dark" size="lg" />
              <p className="text-xs text-brand-neutral-600">
                Aplicación en cabeceras, boletas/facturas, fichas técnicas y
                empaques de regalo.
              </p>
            </div>

            <div className="rounded-2xl bg-brand-navy p-8 flex flex-col items-start justify-between gap-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-beige/80">
                Versión Invertida sobre Azul Profundo
              </span>
              <BrandLogo variant="light" size="lg" />
              <p className="text-xs text-brand-neutral-200">
                Aplicación en banners institucionales, pie de página y
                presentaciones corporativas B2B.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Paleta de Color */}
        <section className="bg-white rounded-2xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium">
          <SectionHeading
            eyebrow="02. Psicología del Color"
            title="Paleta Oficial MenteLúdica"
            description="Contraste AA/AAA verificado para lectura nítida en computadoras, tablets y smartphones."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COLOR_SWATCHES.map((swatch) => (
              <div
                key={swatch.hex}
                className="rounded-2xl border border-brand-neutral-200 overflow-hidden flex flex-col justify-between bg-white"
              >
                <div
                  className={`h-28 p-4 flex items-end justify-between ${swatch.bgClass}`}
                >
                  <Palette className="w-5 h-5 opacity-80" />
                  <span className="font-mono text-xs font-bold">
                    {swatch.hex}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-sm text-brand-navy">
                    {swatch.name}
                  </h3>
                  <p className="text-xs text-brand-neutral-600 mt-1">
                    {swatch.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Sistema Tipográfico */}
        <section className="bg-white rounded-2xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium">
          <SectionHeading
            eyebrow="03. Tipografía"
            title="Jerarquía Editorial Moderna y Legible"
            description="Combinación de Outfit (geométrica expresiva para titulares) y Plus Jakarta Sans (máxima legibilidad en precios, SKU y especificaciones)."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-brand-beige/40 border border-brand-beige-warm space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-accent uppercase tracking-wider">
                <Type className="w-4 h-4" />
                Fuente Display — Outfit
              </div>
              <p className="font-display text-3xl font-bold text-brand-navy">
                Juega, aprende y crea momentos inolvidables.
              </p>
              <p className="text-xs text-brand-neutral-600">
                Utilizada en titulares de campañas, nombres de categorías,
                encabezados de sección y precios destacados.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-neutral-50 border border-brand-neutral-200 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy uppercase tracking-wider">
                <LayoutGrid className="w-4 h-4" />
                Fuente UI & Cuerpo — Plus Jakarta Sans
              </div>
              <p className="font-sans text-base text-brand-navy leading-relaxed">
                Cada pieza ha sido seleccionada para estimular la concentración,
                la creatividad espacial y el tiempo de calidad en familia o en
                equipo.
              </p>
              <p className="text-xs text-brand-neutral-600">
                Utilizada en descripciones técnicas, fichas de producto,
                formularios de checkout y panel administrativo.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Componentes Interactivos y Botones */}
        <section className="bg-white rounded-2xl border border-brand-neutral-200 p-6 md:p-8 shadow-premium">
          <SectionHeading
            eyebrow="04. Kit de Interfaz (UI Kit)"
            title="Botones, Etiquetas y Estados Comerciales"
            description="Componentes reutilizables sin elementos decorativos vacíos; cada estado comunica una acción clara de conversión."
          />

          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-neutral-600 mb-3">
                Variantes de Botones de Acción
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">
                  <ShoppingBag className="w-4 h-4" />
                  Agregar al Carrito
                </Button>
                <Button variant="accent">
                  <Sparkles className="w-4 h-4" />
                  Personalizar Ahora
                </Button>
                <Button variant="secondary">Explorar Categoría</Button>
                <Button variant="outline">Ver Especificaciones</Button>
                <Button variant="whatsapp">
                  <MessageCircle className="w-4 h-4" />
                  Consultar por WhatsApp
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-neutral-600 mb-3">
                Insignias y Estados (Badges)
              </h3>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="navy">Más Vendido</Badge>
                <Badge variant="accent">Personalizable a Medida</Badge>
                <Badge variant="beige">8+ Años y Adultos</Badge>
                <Badge variant="teal">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Compatible con Sistemas de Bloques
                </Badge>
                <Badge variant="success">Stock Disponible en Arequipa</Badge>
                <Badge variant="warning">En Diseño Personalizado</Badge>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-brand-neutral-50 border border-brand-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-brand-accent shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-navy">
                    Diseño Mobile-First (Android, iPhone, Tablets y Desktop)
                  </h4>
                  <p className="text-xs text-brand-neutral-600">
                    Áreas táctiles mínimas de 44px, buscador persistente y
                    acceso directo a WhatsApp flotante.
                  </p>
                </div>
              </div>
              <Badge variant="teal">Sección 19 Verificada</Badge>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

