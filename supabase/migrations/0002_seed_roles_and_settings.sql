-- ============================================================================
-- MENTELÚDICA – MIGRACIÓN 0002: SEMILLAS DE ROLES, PERMISOS, POLÍTICAS RLS Y
-- CONFIGURACIÓN COMERCIAL INICIAL (Secciones 11, 13, 16, 17 y 18)
-- ============================================================================

-- 1. Insertar Roles Oficiales
INSERT INTO public.roles (code, name, description)
VALUES
  ('ADMINISTRADOR', 'Administrador General', 'Acceso completo, configuración, gestión de usuarios, reportes financieros, productos y pedidos.'),
  ('VENTAS', 'Especialista de Ventas', 'Gestión de clientes, pedidos, consultas y seguimiento comercial.'),
  ('ALMACEN', 'Gestor de Almacén y Logística', 'Control de inventarios, preparación de pedidos, despachos y alertas de stock.'),
  ('DISENO_PRODUCCION', 'Especialista en Diseño y Producción', 'Gestión de personalizaciones, validación de archivos, aprobaciones de diseño y seguimiento de taller.'),
  ('CLIENTE', 'Cliente Registrado', 'Acceso al portal personal de pedidos, pagos, direcciones, favoritos y personalizaciones.')
ON CONFLICT (code) DO NOTHING;

-- 2. Función auxiliar de seguridad para verificar rol del usuario autenticado en RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role_code()
RETURNS VARCHAR AS $$
  SELECT r.code
  FROM public.profiles p
  JOIN public.roles r ON r.id = p.role_id
  WHERE p.id = auth.uid() AND p.is_active = TRUE
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Políticas RLS por Rol Administrativo y Propiedad del Cliente
-- ADMINISTRADOR tiene control total sobre productos, categorías y configuraciones
CREATE POLICY "Admin full manage products" ON public.products
  FOR ALL USING (public.get_current_user_role_code() = 'ADMINISTRADOR');

CREATE POLICY "Admin full manage categories" ON public.categories
  FOR ALL USING (public.get_current_user_role_code() = 'ADMINISTRADOR');

-- ALMACÉN y ADMINISTRADOR gestionan inventarios y envíos
CREATE POLICY "Warehouse and Admin manage inventory" ON public.inventory
  FOR ALL USING (public.get_current_user_role_code() IN ('ADMINISTRADOR', 'ALMACEN'));

CREATE POLICY "Warehouse and Admin manage shipments" ON public.shipments
  FOR ALL USING (public.get_current_user_user_role_code() IN ('ADMINISTRADOR', 'ALMACEN', 'VENTAS'));

-- VENTAS y ADMINISTRADOR gestionan pedidos y clientes
CREATE POLICY "Sales and Admin manage orders" ON public.orders
  FOR ALL USING (public.get_current_user_role_code() IN ('ADMINISTRADOR', 'VENTAS', 'ALMACEN'));

-- DISEÑO Y PRODUCCIÓN y ADMINISTRADOR gestionan personalizaciones y aprobaciones
CREATE POLICY "Design and Admin manage customizations" ON public.customizations
  FOR ALL USING (public.get_current_user_role_code() IN ('ADMINISTRADOR', 'DISENO_PRODUCCION', 'VENTAS'));

CREATE POLICY "Design and Admin manage customization files" ON public.customization_files
  FOR ALL USING (public.get_current_user_role_code() IN ('ADMINISTRADOR', 'DISENO_PRODUCCION'));

CREATE POLICY "Design and Admin manage approvals" ON public.customization_approvals
  FOR ALL USING (public.get_current_user_role_code() IN ('ADMINISTRADOR', 'DISENO_PRODUCCION'));

-- 4. Configuración Comercial Inicial Administrable (business_settings)
INSERT INTO public.business_settings (setting_key, setting_value, description)
VALUES
  (
    'commercial_contact',
    '{"businessName": "MenteLúdica – Aprendizaje y Diversión", "whatsappNumber": "51900000000", "supportEmail": "contacto@menteludica.pe", "baseCity": "Arequipa", "country": "Perú"}'::jsonb,
    'Datos comerciales y número de WhatsApp configurable desde administración'
  ),
  (
    'shipping_rules',
    '{"freeShippingThresholdPEN": 250.0, "enableLocalDeliveryArequipa": true, "enableNationalShippingPeru": true, "enableStorePickup": true}'::jsonb,
    'Modalidades y umbral de envío gratuito configurable'
  ),
  (
    'payment_methods_status',
    '{"YAPE": true, "PLIN": true, "BANK_TRANSFER": true, "CREDIT_CARD": true, "DEBIT_CARD": true, "CULQI": true, "MERCADO_PAGO": true, "NIUBIZ": false, "CASH_ON_DELIVERY": true}'::jsonb,
    'Disponibilidad configurable de cada método de pago'
  )
ON CONFLICT (setting_key) DO NOTHING;

