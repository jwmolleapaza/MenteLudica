import type { MetadataRoute } from 'next';
import { env } from '@/config/env';

/**
 * Configuración Robots.txt Oficial MenteLúdica (Sección 15 del Prompt Maestro).
 * Permite la indexación completa del catálogo y protege las rutas privadas administrativas.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/catalogo', '/producto/', '/personalizar', '/identidad'],
        disallow: ['/admin', '/api/', '/checkout'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

