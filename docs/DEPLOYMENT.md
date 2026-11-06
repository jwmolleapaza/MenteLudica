# Guía de Despliegue y Puesta en Producción – MenteLúdica

## 1. Requisitos de Infraestructura
- **Frontend & Edge Network:** Vercel (con soporte nativo para Next.js 15 App Router y dominio personalizado como `www.menteludica.pe`).
- **Base de Datos, Autenticación y Almacenamiento:** Proyecto en Supabase (PostgreSQL 15+ con Row Level Security y Supabase Storage).

## 2. Configuración de Base de Datos en Supabase
1. Crear un nuevo proyecto en [Supabase](https://supabase.com) en la región de Sudamérica (`sa-east-1` São Paulo) o US East.
2. En el **SQL Editor** de Supabase, ejecutar en orden:
   - `supabase/migrations/0001_initial_schema.sql` (Crea las 26 tablas relacionales, índices y políticas RLS públicas).
   - `supabase/migrations/0002_seed_roles_and_settings.sql` (Inserta los 5 roles oficiales, función de verificación de rol y configuración comercial inicial).
3. En **Supabase Storage**, crear los buckets:
   - `product-media` (Público, para fotografías del catálogo).
   - `customization-uploads` (Privado con RLS, para fotografías y logotipos subidos por clientes hasta 15 MB).
   - `payment-vouchers` (Privado con RLS, para constancias de Yape, Plin y transferencias).

## 3. Configuración de Variables de Entorno en Vercel
Configurar en **Vercel > Project Settings > Environment Variables** las variables listadas en `.env.example`:
- `NEXT_PUBLIC_SITE_URL`: `https://www.menteludica.pe`
- `NEXT_PUBLIC_APP_ENV`: `production`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Número comercial oficial en formato internacional (ej. `51959000000`)
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Exclusiva para el servidor, nunca con prefijo `NEXT_PUBLIC_`)
- Credenciales de pasarelas oficiales cuando se activen en vivo: `NEXT_PUBLIC_CULQI_PUBLIC_KEY`, `CULQI_PRIVATE_KEY`, `CULQI_WEBHOOK_SECRET`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`, `NIUBIZ_MERCHANT_ID`, `NIUBIZ_USER`, `NIUBIZ_PASSWORD`.

## 4. Configuración de Dominio Personalizado
1. En **Vercel > Settings > Domains**, añadir `menteludica.pe` y `www.menteludica.pe`.
2. Apuntar el registro `A` a `76.76.21.21` y el `CNAME` (`www`) a `cname.vercel-dns.com`.
3. Verificar que el certificado SSL/TLS automático esté activo y que `/sitemap.xml` y `/robots.txt` respondan sobre HTTPS.

