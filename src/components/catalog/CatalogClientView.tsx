'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Filter,
  Search,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_CATALOG_TAXONOMY } from '@/config/catalog-taxonomy';
import { CATALOG_PRODUCTS } from '@/modules/catalog/catalog-data';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Badge } from '@/components/ui/Badge';

export function CatalogClientView() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('categoria') || 'todas';
  const initialSubcategory = searchParams.get('subcategoria') || 'todas';
  const initialQuery = searchParams.get('q') || '';
  const initialOffers = searchParams.get('ofertas') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState(initialSubcategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(initialOffers);
  const [sortBy, setSortBy] = useState<
    'relevancia' | 'precio-asc' | 'precio-desc' | 'mas-vendidos'
  >('relevancia');

  const activeCategoryNode = useMemo(
    () =>
      INITIAL_CATALOG_TAXONOMY.find((cat) => cat.slug === selectedCategory) ||
      null,
    [selectedCategory]
  );

  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      if (
        selectedCategory !== 'todas' &&
        product.categorySlug !== selectedCategory
      ) {
        return false;
      }
      if (
        selectedSubcategory !== 'todas' &&
        product.subcategorySlug !== selectedSubcategory
      ) {
        return false;
      }
      if (onlyCustomizable && !product.isCustomizable) {
        return false;
      }
      if (
        onlyOffers &&
        !(
          typeof product.promoPrice === 'number' &&
          product.promoPrice < product.salePrice
        )
      ) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchSku = product.sku.toLowerCase().includes(q);
        const matchDesc = product.shortDescription.toLowerCase().includes(q);
        const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchSku && !matchDesc && !matchTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.promoPrice ?? a.salePrice;
      const priceB = b.promoPrice ?? b.salePrice;
      if (sortBy === 'precio-asc') return priceA - priceB;
      if (sortBy === 'precio-desc') return priceB - priceA;
      if (sortBy === 'mas-vendidos')
        return Number(b.isBestseller) - Number(a.isBestseller);
      return 0;
    });
  }, [
    selectedCategory,
    selectedSubcategory,
    onlyCustomizable,
    onlyOffers,
    searchQuery,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('todas');
    setSelectedSubcategory('todas');
    setSearchQuery('');
    setOnlyCustomizable(false);
    setOnlyOffers(false);
    setSortBy('relevancia');
  };

  return (
    <div className="bg-brand-neutral-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Encabezado del Catálogo */}
        <div className="bg-brand-navy rounded-3xl p-6 md:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="accent">CATÁLOGO OFICIAL MENTELÚDICA</Badge>
            <h1 className="font-display text-2xl md:text-4xl font-bold">
              {activeCategoryNode
                ? activeCategoryNode.name
                : 'Todos los Juegos Educativos, Creativos y Personalizados'}
            </h1>
            <p className="text-xs sm:text-sm text-brand-neutral-200">
              {activeCategoryNode
                ? activeCategoryNode.description
                : 'Explora nuestras 4 categorías principales y 29 subcategorías con stock en Arequipa y envíos a todo el Perú.'}
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-2xl p-4 text-xs space-y-2 shrink-0">
            <div className="font-bold text-brand-beige flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              ¿Buscas un diseño a pedido?
            </div>
            <p className="text-brand-neutral-200 max-w-xs">
              Personalizamos rompecabezas con foto, llaveros y regalos
              corporativos con logotipo.
            </p>
            <Link
              href="/personalizar"
              className="inline-block text-brand-accent font-bold hover:underline"
            >
              Abrir Estudio de Personalización →
            </Link>
          </div>
        </div>

        {/* Layout de Filtros Laterales + Grilla de Productos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar de Filtros */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-brand-neutral-200 p-5 shadow-premium space-y-6">
            <div className="flex items-center justify-between border-b border-brand-neutral-100 pb-3">
              <h2 className="font-display font-bold text-sm text-brand-navy flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-accent" />
                Filtros del Catálogo
              </h2>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-neutral-600 hover:text-brand-navy"
              >
                <RotateCcw className="w-3 h-3" />
                Limpiar
              </button>
            </div>

            {/* Buscador Instantáneo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-navy block">
                Buscar por nombre, SKU o etiqueta
              </label>
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej. Catedral, madera, STEM..."
                  className="w-full h-10 pl-3 pr-9 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs text-brand-navy focus:outline-none focus:border-brand-navy"
                />
                <Search className="w-3.5 h-3.5 text-brand-neutral-600 absolute right-3 top-3" />
              </div>
            </div>

            {/* Categorías Principales */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-neutral-600">
                Categorías Principales
              </h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('todas');
                    setSelectedSubcategory('todas');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCategory === 'todas'
                      ? 'bg-brand-navy text-white'
                      : 'text-brand-navy hover:bg-brand-neutral-100'
                  }`}
                >
                  Todas las categorías ({CATALOG_PRODUCTS.length})
                </button>

                {INITIAL_CATALOG_TAXONOMY.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setSelectedSubcategory('todas');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-brand-navy text-white'
                        : 'text-brand-navy hover:bg-brand-neutral-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-75">
                      {cat.subcategories?.length} sub
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategorías de la Categoría Seleccionada */}
            {activeCategoryNode && (
              <div className="space-y-2 pt-2 border-t border-brand-neutral-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                  Subcategorías de {activeCategoryNode.name}
                </h3>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('todas')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs ${
                      selectedSubcategory === 'todas'
                        ? 'bg-brand-beige font-bold text-brand-navy'
                        : 'text-brand-neutral-600 hover:bg-brand-neutral-50'
                    }`}
                  >
                    Todas en {activeCategoryNode.name}
                  </button>
                  {activeCategoryNode.subcategories?.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub.slug)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs ${
                        selectedSubcategory === sub.slug
                          ? 'bg-brand-beige font-bold text-brand-navy'
                          : 'text-brand-neutral-600 hover:bg-brand-neutral-50'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filtros Rápidos */}
            <div className="space-y-2.5 pt-2 border-t border-brand-neutral-100">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-brand-navy cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyCustomizable}
                  onChange={(e) => setOnlyCustomizable(e.target.checked)}
                  className="rounded border-brand-neutral-200 text-brand-accent focus:ring-brand-accent"
                />
                <span>Solo productos personalizables</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-semibold text-brand-navy cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => setOnlyOffers(e.target.checked)}
                  className="rounded border-brand-neutral-200 text-brand-accent focus:ring-brand-accent"
                />
                <span>Solo ofertas y promociones</span>
              </label>
            </div>
          </aside>

          {/* Contenido Principal del Catálogo */}
          <div className="lg:col-span-9 space-y-6">
            {/* Barra de Ordenamiento y Conteo */}
            <div className="bg-white rounded-2xl border border-brand-neutral-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="text-xs text-brand-neutral-600">
                Mostrando{' '}
                <strong className="text-brand-navy">
                  {filteredProducts.length}
                </strong>{' '}
                productos disponibles
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-accent" />
                <label htmlFor="sort-select" className="text-xs font-semibold">
                  Ordenar por:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | 'relevancia'
                        | 'precio-asc'
                        | 'precio-desc'
                        | 'mas-vendidos'
                    )
                  }
                  className="h-9 px-3 rounded-xl bg-brand-neutral-50 border border-brand-neutral-200 text-xs font-semibold text-brand-navy focus:outline-none"
                >
                  <option value="relevancia">Relevancia comercial</option>
                  <option value="mas-vendidos">Más vendidos</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                </select>
              </div>
            </div>

            {/* Aviso de transparencia sobre compatibilidad de bloques (Sección 5.1) */}
            {(selectedCategory === 'todas' ||
              selectedCategory === 'juegos-de-construccion') && (
              <div className="p-4 rounded-2xl bg-brand-beige/70 border border-brand-beige-warm flex items-start gap-3 text-xs text-brand-navy">
                <CheckCircle2 className="w-4 h-4 text-brand-accent-teal shrink-0 mt-0.5" />
                <div>
                  <strong>Nota de Transparencia en Juegos de Construcción:</strong>{' '}
                  Nuestros sets de bloques armables son compatibles con sistemas
                  de bloques de construcción de tamaño estándar de otras marcas,
                  sin atribuirles falsamente la condición de productos oficiales
                  LEGO.
                </div>
              </div>
            )}

            {/* Grilla de Productos */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-brand-neutral-200 p-12 text-center space-y-4">
                <p className="font-display font-bold text-lg text-brand-navy">
                  No encontramos productos con los filtros seleccionados
                </p>
                <p className="text-xs text-brand-neutral-600 max-w-md mx-auto">
                  Prueba limpiando los filtros o escríbenos para cotizar un
                  producto o regalo personalizado a medida.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

