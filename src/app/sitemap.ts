import type { MetadataRoute } from 'next';
import { env } from '@/config/env';
import { INITIAL_CATALOG_TAXONOMY } from '@/config/catalog-taxonomy';
import { CATALOG_PRODUCTS } from '@/modules/catalog/catalog-data';

/**
 * Sitemap Dinámico Oficial MenteLúdica (Sección 15 del Prompt Maestro).
 * Indexa las páginas principales, las 4 categorías + 29 subcategorías y cada ficha de producto.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/personalizar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/identidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap =
    INITIAL_CATALOG_TAXONOMY.flatMap((category) => [
      {
        url: `${baseUrl}/catalogo?categoria=${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      },
      ...(category.subcategories || []).map((sub) => ({
        url: `${baseUrl}/catalogo?categoria=${category.slug}&subcategoria=${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      })),
    ]);

  const productRoutes: MetadataRoute.Sitemap = CATALOG_PRODUCTS.map(
    (product) => ({
      url: `${baseUrl}/producto/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  );

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

