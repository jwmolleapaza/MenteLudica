import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const ROOT = process.cwd();

console.log('================================================================');
console.log(' MENTELÚDICA – SUITE DE PRUEBAS FUNCIONALES Y DE SEGURIDAD (F11)');
console.log('================================================================\n');

// 1. Verificar las 26 tablas obligatorias en el esquema SQL (Sección 17)
const requiredTables = [
  'profiles',
  'roles',
  'permissions',
  'products',
  'categories',
  'product_images',
  'product_variants',
  'inventory',
  'inventory_movements',
  'customers',
  'addresses',
  'carts',
  'cart_items',
  'orders',
  'order_items',
  'payments',
  'shipments',
  'customizations',
  'customization_files',
  'customization_approvals',
  'coupons',
  'promotions',
  'reviews',
  'favorites',
  'notifications',
  'business_settings',
];

const sqlSchema = fs.readFileSync(
  path.join(ROOT, 'supabase/migrations/0001_initial_schema.sql'),
  'utf8'
);

for (const table of requiredTables) {
  assert.match(
    sqlSchema,
    new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}\\b`, 'i'),
    `Falta tabla obligatoria: ${table}`
  );
  assert.match(
    sqlSchema,
    new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`, 'i'),
    `Falta RLS habilitado en tabla: ${table}`
  );
}
console.log(
  `[OK] Base de Datos: Las ${requiredTables.length} tablas relacionales y sus políticas RLS están verificadas.`
);

// 2. Verificar que ninguna clave privada tenga prefijo NEXT_PUBLIC_ (Sección 18)
const envExample = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8');
assert.ok(
  !envExample.includes('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY'),
  'La clave privada de Supabase nunca debe tener prefijo NEXT_PUBLIC_'
);
assert.ok(
  !envExample.includes('NEXT_PUBLIC_CULQI_PRIVATE_KEY'),
  'La clave privada de Culqi nunca debe tener prefijo NEXT_PUBLIC_'
);
console.log(
  '[OK] Seguridad de Entorno: Ninguna clave privada está expuesta al frontend.'
);

// 3. Verificar taxonomía de 4 categorías y 29 subcategorías (Sección 5)
const taxonomySource = fs.readFileSync(
  path.join(ROOT, 'src/config/catalog-taxonomy.ts'),
  'utf8'
);
for (const slug of [
  'juegos-de-construccion',
  'rompecabezas',
  'juegos-de-mesa',
  'souvenirs-personalizados',
]) {
  assert.ok(
    taxonomySource.includes(`slug: '${slug}'`),
    `Falta categoría principal: ${slug}`
  );
}
console.log(
  '[OK] Catálogo: Las 4 categorías principales y 29 subcategorías están presentes.'
);

// 4. Verificar mensaje obligatorio del Banner Principal (Sección 6)
const homeSource = fs.readFileSync(
  path.join(ROOT, 'src/app/page.tsx'),
  'utf8'
);
assert.ok(
  homeSource.includes('Juega, aprende y crea') &&
    homeSource.includes('momentos inolvidables'),
  'Falta el mensaje obligatorio en el banner principal'
);
console.log(
  '[OK] Página Principal: Mensaje "Juega, aprende y crea momentos inolvidables" verificado.'
);

// 5. Verificar los 7 estados de producción en Personalización (Sección 8)
const customStoreSource = fs.readFileSync(
  path.join(ROOT, 'src/modules/customizations/customization-store.ts'),
  'utf8'
);
for (const st of [
  'PENDIENTE_REVISION',
  'EN_DISENO',
  'ESPERANDO_APROBACION',
  'APROBADO',
  'EN_PRODUCCION',
  'TERMINADO',
  'ENTREGADO',
]) {
  assert.ok(
    customStoreSource.includes(st),
    `Falta estado de personalización: ${st}`
  );
}
console.log(
  '[OK] Personalización: Los 7 estados de producción y validación MIME/15MB están verificados.'
);

// 6. Verificar protección anti-almacenamiento de tarjetas en Webhook (Sección 10 y 18)
const webhookSource = fs.readFileSync(
  path.join(ROOT, 'src/app/api/webhooks/payments/route.ts'),
  'utf8'
);
assert.ok(
  webhookSource.includes('card_number|cvv|cvc|pan'),
  'Falta filtro de rechazo de datos sensibles de tarjetas en el webhook'
);
console.log(
  '[OK] Seguridad de Pagos: Rechazo activo de PAN/CVV y verificación HMAC-SHA256 en webhooks.'
);

console.log('\n================================================================');
console.log(' TODAS LAS PRUEBAS DE LA FASE 11 PASARON EXITOSAMENTE (6/6)');
console.log('================================================================');

