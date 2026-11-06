# MENTELÚDICA – APRENDIZAJE Y DIVERSIÓN

Plataforma profesional de comercio electrónico especializada en juegos de construcción, rompecabezas, juegos de mesa y souvenirs personalizados, diseñada para operar en **Arequipa, Perú** con cobertura a todo el territorio peruano.

> **Propuesta de valor:** *"Juega, aprende y crea momentos inolvidables"*.

---

## Arquitectura Tecnológica
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript Estricto, Tailwind CSS.
- **Estado Persistente y Dominio:** Zustand + Validación con Zod.
- **Backend y Base de Datos:** Supabase (PostgreSQL con 26 tablas relacionales, Row Level Security, Supabase Auth y Supabase Storage).
- **Despliegue:** Preparado para Vercel con dominio personalizado configurable (`vercel.json`).

---

## Comandos de Desarrollo y Producción

En Windows PowerShell:

```powershell
# 1. Instalar dependencias
npm.cmd install

# 2. Iniciar servidor de desarrollo (http://localhost:3000)
npm.cmd run dev

# 3. Verificar tipos TypeScript
npm.cmd run typecheck

# 4. Ejecutar suite de pruebas funcionales y de seguridad
node scripts/verify-platform.mjs

# 5. Compilar para producción
npm.cmd run build
```

---

## Rutas Principales de la Aplicación
- `/` — **Página Principal** con las 14 secciones comerciales obligatorias.
- `/catalogo` — **Catálogo Interactivo** con las 4 categorías principales y 29 subcategorías.
- `/producto/[slug]` — **Ficha de Producto** con galería, zoom, variantes, WhatsApp con SKU y Schema.org JSON-LD.
- `/personalizar` — **Estudio de Personalización de Productos** con referencia preliminar en vivo, validación MIME/15MB y trazabilidad de 7 estados de producción.
- `/carrito` — **Carrito de Compras** con cupones y estimador de envíos configurables.
- `/checkout` — **Proceso de Compra Seguro** (Invitado o Registrado, Boleta/Factura RUC, Delivery Arequipa / Nacional / Recojo, 9 métodos de pago).
- `/mi-cuenta` — **Portal del Cliente** (Pedidos, Pagos y Descarga de Comprobantes, Personalizaciones, Direcciones, Favoritos, Datos).
- `/admin` — **Panel Administrativo Independiente** con 10 KPIs, 14 módulos (A–N), simulador de 4 roles RBAC y exportación a Excel (`.xls`) y CSV (`.csv`).
- `/identidad` — **Manual de Identidad Visual y Sistema de Diseño MenteLúdica**.
- `/api/webhooks/payments` — **Endpoint de Webhooks Verificados** (HMAC-SHA256 y protección PCI-DSS).

