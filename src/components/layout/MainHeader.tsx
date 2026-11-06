'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  User,
  Sparkles,
  Menu,
  X,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Heart,
  ArrowUpRight,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { INITIAL_CATALOG_TAXONOMY } from '@/config/catalog-taxonomy';
import { CATALOG_PRODUCTS } from '@/modules/catalog/catalog-data';
import { useCartStore } from '@/modules/cart/cart-store';
import { formatCurrencyPEN } from '@/lib/utils';

/**
 * Header Comercial MenteLúdica (Actualizado en Fase 4)
 * - Contador en tiempo real conectado a useCartStore
 * - Buscador predictivo con autocompletado instantáneo por nombre, SKU, categoría o etiqueta
 * - Mega-menú de 4 categorías y 29 subcategorías
 */
export function MainHeader() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const totalCartUnits = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(
    null
  );

  const instantSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return CATALOG_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.subcategoryName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setIsSearchFocused(false);
    if (trimmed) {
      router.push(`/catalogo?q=${encodeURIComponent(trimmed)}`);
      setMobileMenuOpen(false);
    } else {
      router.push('/catalogo');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-neutral-200">
      {/* Barra Superior Comercial */}
      <div className="bg-brand-navy text-brand-beige text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-brand-accent" />
              Sede Arequipa · Envíos seguros a todo el Perú
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-brand-neutral-200">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-accent-teal" />
              Atención a Familias, Colegios y Empresas
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/personalizar"
              className="inline-flex items-center gap-1 text-brand-beige hover:text-white font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              Estudio de Personalización
            </Link>
            <span className="text-white/25">|</span>
            <Link
              href="/mi-cuenta"
              className="hover:text-white transition-colors"
            >
              Seguimiento de Pedido
            </Link>
          </div>
        </div>
      </div>

      {/* Barra Principal: Logo + Buscador Predictivo + Acciones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-brand-navy hover:bg-brand-neutral-100"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <Link href="/" aria-label="Ir al inicio de MenteLúdica">
              <BrandLogo variant="dark" size="md" />
            </Link>
          </div>

          {/* Buscador Inteligente con Autocompletado */}
          <div className="hidden md:block flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} role="search">
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 180)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por producto, código SKU, categoría o edad..."
                className="w-full h-11 pl-4 pr-12 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-sm text-brand-navy placeholder:text-brand-neutral-600/70 focus:outline-none focus:border-brand-navy focus:bg-white transition-all"
              />
              <button
                type="submit"
                aria-label="Buscar productos"
                className="absolute right-1.5 top-1.5 h-8 w-9 rounded-lg bg-brand-navy text-white flex items-center justify-center hover:bg-brand-accent transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Panel de Resultados Instantáneos */}
            {isSearchFocused && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-brand-neutral-200 shadow-premium-lg overflow-hidden z-50">
                {instantSuggestions.length > 0 ? (
                  <div className="divide-y divide-brand-neutral-100">
                    <div className="px-4 py-2 bg-brand-neutral-50 text-[11px] font-bold uppercase tracking-wider text-brand-neutral-600">
                      Sugerencias directas del catálogo
                    </div>
                    {instantSuggestions.map((item) => {
                      const effectivePrice = item.promoPrice ?? item.salePrice;
                      return (
                        <Link
                          key={item.id}
                          href={`/producto/${item.slug}`}
                          className="flex items-center justify-between gap-3 p-3 hover:bg-brand-beige/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.images[0]?.url}
                              alt={item.name}
                              className="w-11 h-11 rounded-lg object-cover border border-brand-neutral-200 shrink-0"
                            />
                            <div>
                              <div className="text-xs font-bold text-brand-navy line-clamp-1">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-brand-neutral-600">
                                {item.subcategoryName} ·{' '}
                                <span className="font-mono">{item.sku}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-brand-navy">
                              {formatCurrencyPEN(effectivePrice)}
                            </div>
                            <span className="text-[10px] text-brand-accent font-semibold inline-flex items-center gap-0.5">
                              Ver ficha <ArrowUpRight className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                    <Link
                      href={`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`}
                      className="block px-4 py-2.5 bg-brand-navy text-white text-center text-xs font-bold hover:bg-brand-navy-light"
                    >
                      Ver todos los resultados para “{searchQuery.trim()}”
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-brand-neutral-600">
                    No encontramos coincidencias exactas para “
                    {searchQuery.trim()}”. Presiona Enter para explorar el
                    catálogo completo.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Acciones de Usuario y Carrito */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/personalizar"
              className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-beige text-brand-navy text-xs font-bold hover:bg-brand-beige-warm transition-colors"
            >
              <Sparkles className="w-4 h-4 text-brand-accent" />
              Personalizar Regalo
            </Link>

            <Link
              href="/mi-cuenta"
              className="p-2.5 rounded-xl text-brand-navy hover:bg-brand-neutral-100 transition-colors"
              aria-label="Mis favoritos"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/mi-cuenta"
              className="p-2.5 rounded-xl text-brand-navy hover:bg-brand-neutral-100 transition-colors inline-flex items-center gap-2"
              aria-label="Portal del cliente"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold">
                Mi Cuenta
              </span>
            </Link>

            <Link
              href="/carrito"
              className="relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-brand-navy text-white hover:bg-brand-navy-light transition-colors"
              aria-label="Ver carrito de compras"
            >
              <ShoppingBag className="w-4 h-4 text-brand-accent" />
              <span className="text-xs font-bold hidden sm:inline">Carrito</span>
              <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-brand-accent text-white leading-none">
                {totalCartUnits}
              </span>
            </Link>
          </div>
        </div>

        {/* Buscador Móvil */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-3 md:hidden relative"
          role="search"
        >
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué juego o regalo personalizado buscas hoy?"
            className="w-full h-10 pl-4 pr-11 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy focus:outline-none focus:border-brand-navy"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="absolute right-1.5 top-1.5 h-7 w-8 rounded-lg bg-brand-navy text-white flex items-center justify-center"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Barra de Categorías y Subcategorías (Desktop) */}
      <nav
        aria-label="Categorías principales"
        className="hidden lg:block border-t border-brand-neutral-100 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <ul className="flex items-center gap-1">
            <li>
              <Link
                href="/catalogo"
                className="inline-flex items-center px-3.5 py-3 text-xs font-bold uppercase tracking-wider text-brand-navy hover:text-brand-accent transition-colors"
              >
                Todo el Catálogo
              </Link>
            </li>

            {INITIAL_CATALOG_TAXONOMY.map((category) => (
              <li
                key={category.id}
                className="relative group"
                onMouseEnter={() => setActiveCategorySlug(category.slug)}
                onMouseLeave={() => setActiveCategorySlug(null)}
              >
                <Link
                  href={`/catalogo?categoria=${category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-3 text-xs font-semibold text-brand-navy hover:text-brand-accent transition-colors"
                >
                  {category.name}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
                </Link>

                {activeCategorySlug === category.slug && (
                  <div className="absolute left-0 top-full w-72 bg-white rounded-2xl shadow-premium-lg border border-brand-neutral-200 p-4 z-50">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-brand-accent mb-2 px-2">
                      {category.name}
                    </div>
                    <ul className="space-y-1">
                      {category.subcategories?.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/catalogo?categoria=${category.slug}&subcategoria=${sub.slug}`}
                            className="block px-2.5 py-1.5 rounded-lg text-xs text-brand-navy hover:bg-brand-beige/60 font-medium transition-colors"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}

            <li>
              <Link
                href="/catalogo?ofertas=true"
                className="inline-flex items-center px-3.5 py-3 text-xs font-bold text-brand-accent hover:text-brand-accent-hover transition-colors"
              >
                Ofertas & Promociones
              </Link>
            </li>
          </ul>

          <Link
            href="/identidad"
            className="text-xs font-semibold text-brand-neutral-600 hover:text-brand-navy transition-colors"
          >
            Sistema de Diseño & Marca
          </Link>
        </div>
      </nav>

      {/* Drawer de Navegación Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-neutral-200 bg-white px-4 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-3">
            {INITIAL_CATALOG_TAXONOMY.map((category) => (
              <div
                key={category.id}
                className="rounded-xl bg-brand-neutral-50 p-3 border border-brand-neutral-200"
              >
                <Link
                  href={`/catalogo?categoria=${category.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display font-bold text-sm text-brand-navy block mb-2"
                >
                  {category.name}
                </Link>
                <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-brand-accent/40">
                  {category.subcategories?.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/catalogo?categoria=${category.slug}&subcategoria=${sub.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs text-brand-neutral-600 py-1 hover:text-brand-navy"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
