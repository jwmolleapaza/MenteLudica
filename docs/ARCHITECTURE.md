# Arquitectura Técnica – MenteLúdica E-Commerce

## 1. Visión Arquitectónica
Plataforma de comercio electrónico B2C/B2B modular construida con **Next.js 15 (App Router)**, **React 19**, **TypeScript Estricto**, **Tailwind CSS** y **Supabase (PostgreSQL + Auth + Storage)**, preparada para operar inicialmente en **Arequipa, Perú** con cobertura nacional a todo el Perú.

## 2. Estructura de Carpetas del Proyecto
```text
menteludica/
├── docs/
│   └── ARCHITECTURE.md                     # Documentación de arquitectura y decisiones técnicas
├── supabase/
│   └── migrations/
│       └── 0001_initial_schema.sql         # Esquema relacional completo (26 tablas + RLS + índices)
├── src/
│   ├── app/                                # Rutas Next.js App Router (Storefront, Portal Cliente, Admin)
│   │   ├── globals.css                     # Estilos base y variables tipográficas
│   │   ├── layout.tsx                      # Layout raíz con metadatos SEO para Perú
│   │   └── page.tsx                        # Vista principal / Diagnóstico de Fase 1
│   ├── config/
│   │   ├── env.ts                          # Validación Zod de variables de entorno y estado de adaptadores
│   │   └── catalog-taxonomy.ts             # 4 Categorías y 29 Subcategorías oficiales
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── client.ts                   # Cliente Supabase tipado y tolerante a entorno sin credenciales
│   │   └── adapters/
│   │       └── payment-gateway.adapter.ts  # Adaptadores para Yape, Plin, Transferencia, Culqi, Mercado Pago, Niubiz y Contra Entrega
│   ├── modules/                            # Módulos de dominio desacoplados (se expanden en Fases 2-10)
│   └── types/
│       └── database.ts                     # Tipos TypeScript 1:1 con las 26 tablas SQL
├── .env.example                            # Plantilla documentada de variables de entorno
├── next.config.ts                          # Configuración Next.js con cabeceras de seguridad HTTP
├── package.json                            # Dependencias y scripts de validación
├── postcss.config.mjs                      # Configuración PostCSS
├── tailwind.config.ts                      # Sistema de color MenteLúdica (Azul Profundo, Beige, Acentos)
└── tsconfig.json                           # Configuración TypeScript estricta
```

