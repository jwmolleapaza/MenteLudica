-- ============================================================================
-- MENTELÚDICA – ESQUEMA RELACIONAL POSTGRESQL / SUPABASE (v1.0)
-- Incluye: 26 Tablas Principales, Integridad Referencial, Índices, Auditoría y RLS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ROLES, PERMISOS Y PERFILES DE USUARIO
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL, -- 'ADMINISTRADOR', 'VENTAS', 'ALMACEN', 'DISENO_PRODUCCION', 'CLIENTE'
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  module VARCHAR(60) NOT NULL, -- 'products', 'categories', 'inventory', 'orders', 'customers', 'payments', 'shipments', 'customizations', 'promotions', 'coupons', 'reviews', 'reports', 'settings', 'users'
  can_view BOOLEAN NOT NULL DEFAULT FALSE,
  can_create BOOLEAN NOT NULL DEFAULT FALSE,
  can_edit BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,
  can_export BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(role_id, module)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(30),
  document_type VARCHAR(20) DEFAULT 'DNI',
  document_number VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. ESTRUCTURA DEL CATÁLOGO (CATEGORÍAS, PRODUCTOS, IMÁGENES, VARIANTES)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon_name VARCHAR(60),
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  seo_title VARCHAR(160),
  seo_description VARCHAR(320),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.categories(id),
  short_description VARCHAR(400) NOT NULL,
  full_description TEXT NOT NULL,
  video_url TEXT,
  sale_price NUMERIC(10, 2) NOT NULL CHECK (sale_price >= 0),
  promo_price NUMERIC(10, 2) CHECK (promo_price IS NULL OR promo_price >= 0),
  internal_cost NUMERIC(10, 2) DEFAULT 0 CHECK (internal_cost >= 0),
  brand VARCHAR(100),
  recommended_age VARCHAR(60), -- Ej. "6+ años", "14+ años y adultos"
  dimensions VARCHAR(100),     -- Ej. "32 x 24 x 6 cm"
  weight_grams INT CHECK (weight_grams IS NULL OR weight_grams >= 0),
  material VARCHAR(150),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_customizable BOOLEAN NOT NULL DEFAULT FALSE,
  customization_config JSONB DEFAULT NULL, -- Opciones de texto, foto, precio base adicional
  Compatibility_note TEXT, -- Ej. "Compatible con sistemas de bloques estándar (No es producto oficial LEGO)"
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  related_product_ids UUID[] NOT NULL DEFAULT '{}',
  seo_title VARCHAR(160),
  seo_description VARCHAR(320),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(200) NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku_variant VARCHAR(80) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL, -- Ej. "500 Piezas", "Madera Natural", "Con Caja Regalo"
  attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
  additional_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. INVENTARIO Y KARDEX DE MOVIMIENTOS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  available_stock INT NOT NULL DEFAULT 0 CHECK (available_stock >= 0),
  reserved_stock INT NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
  min_stock_alert INT NOT NULL DEFAULT 3 CHECK (min_stock_alert >= 0),
  warehouse_location VARCHAR(100) DEFAULT 'Almacén Central Arequipa',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, variant_id)
);

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE RESTRICT,
  movement_type VARCHAR(30) NOT NULL CHECK (movement_type IN ('IN_PURCHASE', 'OUT_SALE', 'ADJUSTMENT', 'RETURN', 'RESERVATION')),
  quantity INT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  reference_order_id UUID,
  reason TEXT,
  performed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. CLIENTES Y DIRECCIONES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  document_type VARCHAR(20) DEFAULT 'DNI' CHECK (document_type IN ('DNI', 'RUC', 'CE', 'PASAPORTE')),
  document_number VARCHAR(20),
  company_name VARCHAR(200), -- Para regalos corporativos / colegios / factura RUC
  is_guest BOOLEAN NOT NULL DEFAULT TRUE,
  total_orders INT NOT NULL DEFAULT 0,
  total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  label VARCHAR(60) DEFAULT 'Casa', -- 'Casa', 'Oficina', 'Colegio'
  recipient_name VARCHAR(150) NOT NULL,
  recipient_phone VARCHAR(30) NOT NULL,
  department VARCHAR(80) NOT NULL DEFAULT 'Arequipa',
  province VARCHAR(80) NOT NULL DEFAULT 'Arequipa',
  district VARCHAR(100) NOT NULL,
  address_line VARCHAR(255) NOT NULL,
  reference TEXT NOT NULL,
  postal_code VARCHAR(20),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. PROMOCIONES Y CUPONES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  applies_to_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  banner_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(40) UNIQUE NOT NULL,
  description VARCHAR(200),
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_purchase_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  max_discount_amount NUMERIC(10, 2),
  usage_limit INT,
  used_count INT NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. CARRITOS DE COMPRA (INCLUYE RECUPERACIÓN DE CARRITOS ABANDONADOS)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  session_token VARCHAR(120) UNIQUE,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  status VARCHAR(25) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'converted', 'abandoned')),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  customization_draft JSONB DEFAULT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. PEDIDOS Y DETALLE DE PEDIDOS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(30) UNIQUE NOT NULL, -- Ej. ML-2026-000104
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  shipping_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  shipping_snapshot JSONB NOT NULL, -- Copia inmutable de dirección y contacto
  billing_type VARCHAR(20) NOT NULL DEFAULT 'BOLETA' CHECK (billing_type IN ('BOLETA', 'FACTURA')),
  billing_document_number VARCHAR(20),
  billing_business_name VARCHAR(200),
  delivery_method VARCHAR(30) NOT NULL CHECK (delivery_method IN ('LOCAL_DELIVERY_AQP', 'NATIONAL_SHIPPING_PERU', 'STORE_PICKUP')),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  customization_total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (customization_total >= 0),
  shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  order_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (
    order_status IN ('PENDING', 'CONFIRMED', 'IN_PREPARATION', 'IN_CUSTOMIZATION', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED')
  ),
  customer_notes TEXT,
  internal_admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name_snapshot VARCHAR(200) NOT NULL,
  sku_snapshot VARCHAR(80) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  customization_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (customization_fee >= 0),
  line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. PERSONALIZACIÓN DE PRODUCTOS (ARCHIVOS Y FLUJO DE APROBACIÓN)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.customizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  selected_options JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_text VARCHAR(500),
  special_instructions TEXT,
  additional_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (additional_price >= 0),
  production_status VARCHAR(35) NOT NULL DEFAULT 'PENDIENTE_REVISION' CHECK (
    production_status IN (
      'PENDIENTE_REVISION',
      'EN_DISENO',
      'ESPERANDO_APROBACION',
      'APROBADO',
      'EN_PRODUCCION',
      'TERMINADO',
      'ENTREGADO'
    )
  ),
  requires_design_approval BOOLEAN NOT NULL DEFAULT TRUE,
  production_observations TEXT,
  assigned_designer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.customization_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customization_id UUID NOT NULL REFERENCES public.customizations(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(80) NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'image/svg+xml')),
  file_size_bytes INT NOT NULL CHECK (file_size_bytes <= 15728640), -- Máx 15MB
  uploaded_by_role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER' CHECK (uploaded_by_role IN ('CUSTOMER', 'DESIGNER')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.customization_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customization_id UUID NOT NULL REFERENCES public.customizations(id) ON DELETE CASCADE,
  preview_image_url TEXT NOT NULL,
  designer_comments TEXT,
  approval_status VARCHAR(25) NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'CHANGES_REQUESTED')),
  customer_feedback TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. PAGOS Y ENVÍOS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  payment_method VARCHAR(30) NOT NULL CHECK (
    payment_method IN ('YAPE', 'PLIN', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CULQI', 'MERCADO_PAGO', 'NIUBIZ', 'CASH_ON_DELIVERY')
  ),
  payment_status VARCHAR(25) NOT NULL DEFAULT 'PENDIENTE' CHECK (
    payment_status IN ('PENDIENTE', 'EN_VALIDACION', 'PAGADO', 'RECHAZADO', 'REEMBOLSADO')
  ),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'PEN',
  gateway_transaction_id VARCHAR(150), -- Nunca almacenar PAN/CVV de tarjetas
  manual_voucher_url TEXT,
  operation_code VARCHAR(80),
  validated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  modality VARCHAR(30) NOT NULL CHECK (modality IN ('LOCAL_DELIVERY_AQP', 'NATIONAL_SHIPPING_PERU', 'STORE_PICKUP')),
  carrier_name VARCHAR(100), -- Ej. Olva Courier, Shalom, Cruz del Sur, Motorizado MenteLúdica
  tracking_code VARCHAR(100),
  tracking_url TEXT,
  estimated_delivery_time VARCHAR(120),
  shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  dispatch_status VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE' CHECK (
    dispatch_status IN ('PENDIENTE', 'PREPARANDO_PAQUETE', 'LISTO_PARA_RECOJO', 'EN_RUTA', 'ENTREGADO', 'INCIDENCIA')
  ),
  dispatched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  recipient_signature_notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. RESEÑAS, FAVORITOS, NOTIFICACIONES Y CONFIGURACIÓN COMERCIAL
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(150),
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(40) NOT NULL DEFAULT 'ORDER_UPDATE',
  reference_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. ÍNDICES DE ALTO RENDIMIENTO
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_customizations_status ON public.customizations(production_status);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order ON public.shipments(order_id);

-- ----------------------------------------------------------------------------
-- 12. POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Lectura pública para catálogo activo y reseñas aprobadas
CREATE POLICY "Public view active categories" ON public.categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public view published products" ON public.products
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public view product images" ON public.product_images
  FOR SELECT USING (TRUE);

CREATE POLICY "Public view active variants" ON public.product_variants
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public view approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Public view active promotions" ON public.promotions
  FOR SELECT USING (is_active = TRUE);

