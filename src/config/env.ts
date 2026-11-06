import { z } from 'zod';

/**
 * Validación centralizada de variables de entorno para MenteLúdica.
 * Detecta qué integraciones externas tienen credenciales activas y cuáles
 * deben operar mediante adaptadores de prueba claramente identificados.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  NEXT_PUBLIC_BUSINESS_NAME: z.string().default('MenteLúdica'),
  NEXT_PUBLIC_DEFAULT_CITY: z.string().default('Arequipa'),
  NEXT_PUBLIC_DEFAULT_COUNTRY: z.string().default('Perú'),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().default('51900000000'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_CULQI_PUBLIC_KEY: z.string().optional(),
  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY: z.string().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
});

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_BUSINESS_NAME: process.env.NEXT_PUBLIC_BUSINESS_NAME,
  NEXT_PUBLIC_DEFAULT_CITY: process.env.NEXT_PUBLIC_DEFAULT_CITY,
  NEXT_PUBLIC_DEFAULT_COUNTRY: process.env.NEXT_PUBLIC_DEFAULT_COUNTRY,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_CULQI_PUBLIC_KEY: process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY,
  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY:
    process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
});

export interface IntegrationReadiness {
  id: string;
  name: string;
  category: 'database' | 'payment' | 'analytics' | 'messaging';
  configured: boolean;
  mode: 'LIVE_READY' | 'SANDBOX_ADAPTER';
  requiredEnvVars: string[];
}

export function getIntegrationReadiness(): IntegrationReadiness[] {
  const hasSupabase = Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !env.NEXT_PUBLIC_SUPABASE_URL.includes('tu-proyecto')
  );

  const hasCulqi = Boolean(env.NEXT_PUBLIC_CULQI_PUBLIC_KEY);
  const hasMercadoPago = Boolean(env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);
  const hasGA = Boolean(env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const hasMetaPixel = Boolean(env.NEXT_PUBLIC_META_PIXEL_ID);

  return [
    {
      id: 'supabase',
      name: 'Supabase (PostgreSQL, Auth & Storage)',
      category: 'database',
      configured: hasSupabase,
      mode: hasSupabase ? 'LIVE_READY' : 'SANDBOX_ADAPTER',
      requiredEnvVars: [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
      ],
    },
    {
      id: 'culqi',
      name: 'Culqi Perú (Tarjetas & Yape Integrado)',
      category: 'payment',
      configured: hasCulqi,
      mode: hasCulqi ? 'LIVE_READY' : 'SANDBOX_ADAPTER',
      requiredEnvVars: [
        'NEXT_PUBLIC_CULQI_PUBLIC_KEY',
        'CULQI_PRIVATE_KEY',
        'CULQI_WEBHOOK_SECRET',
      ],
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago Perú',
      category: 'payment',
      configured: hasMercadoPago,
      mode: hasMercadoPago ? 'LIVE_READY' : 'SANDBOX_ADAPTER',
      requiredEnvVars: [
        'NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY',
        'MERCADOPAGO_ACCESS_TOKEN',
        'MERCADOPAGO_WEBHOOK_SECRET',
      ],
    },
    {
      id: 'niubiz',
      name: 'Niubiz Perú (Visa / Mastercard)',
      category: 'payment',
      configured: false,
      mode: 'SANDBOX_ADAPTER',
      requiredEnvVars: ['NIUBIZ_MERCHANT_ID', 'NIUBIZ_USER', 'NIUBIZ_PASSWORD'],
    },
    {
      id: 'manual_payments',
      name: 'Pagos con Validación Administrativa (Yape / Plin / Transferencia / Contra Entrega)',
      category: 'payment',
      configured: true,
      mode: 'LIVE_READY',
      requiredEnvVars: [],
    },
    {
      id: 'analytics',
      name: 'Google Analytics 4 & Meta Pixel',
      category: 'analytics',
      configured: hasGA || hasMetaPixel,
      mode: hasGA || hasMetaPixel ? 'LIVE_READY' : 'SANDBOX_ADAPTER',
      requiredEnvVars: [
        'NEXT_PUBLIC_GA_MEASUREMENT_ID',
        'NEXT_PUBLIC_META_PIXEL_ID',
      ],
    },
  ];
}

