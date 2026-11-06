import { AdminModuleKey, UserRoleCode } from '@/types/database';

export interface RoleDefinition {
  code: UserRoleCode;
  name: string;
  summary: string;
  allowedModules: AdminModuleKey[];
  capabilities: string[];
}

/**
 * Matriz Oficial de Roles y Permisos MenteLúdica (Sección 13 del Prompt Maestro).
 * Define qué módulos administrativos puede operar cada rol.
 */
export const ROLE_PERMISSION_MATRIX: Record<UserRoleCode, RoleDefinition> = {
  ADMINISTRADOR: {
    code: 'ADMINISTRADOR',
    name: 'Administrador General',
    summary:
      'Acceso completo, configuración, gestión de usuarios, reportes financieros, productos y pedidos.',
    allowedModules: [
      'products',
      'categories',
      'inventory',
      'orders',
      'customers',
      'payments',
      'shipments',
      'customizations',
      'promotions',
      'coupons',
      'reviews',
      'reports',
      'settings',
      'users',
    ],
    capabilities: [
      'Acceso total a los 14 módulos administrativos',
      'Configuración general del negocio, tarifas de envío y WhatsApp',
      'Gestión de usuarios y asignación de roles',
      'Exportación de reportes financieros a Excel y CSV',
      'Validación de pagos y gestión de catálogo',
    ],
  },
  VENTAS: {
    code: 'VENTAS',
    name: 'Especialista de Ventas',
    summary: 'Clientes, pedidos, consultas y seguimiento comercial.',
    allowedModules: [
      'orders',
      'customers',
      'payments',
      'promotions',
      'coupons',
      'reviews',
    ],
    capabilities: [
      'Gestión y actualización comercial de pedidos',
      'Directorio de clientes (familias, colegios y empresas RUC)',
      'Verificación de estados de pago y cupones',
      'Atención de consultas y reseñas de clientes',
    ],
  },
  ALMACEN: {
    code: 'ALMACEN',
    name: 'Almacén y Despachos',
    summary: 'Inventarios, preparación, despachos y control de stock.',
    allowedModules: ['inventory', 'shipments', 'orders', 'products'],
    capabilities: [
      'Control de stock disponible y alertas de stock mínimo',
      'Registro de movimientos de Kardex (entradas, salidas, ajustes)',
      'Preparación de paquetes y asignación de agencia / código de seguimiento',
      'Actualización de estados de despacho (Arequipa, Nacional y Recojo)',
    ],
  },
  DISENO_PRODUCCION: {
    code: 'DISENO_PRODUCCION',
    name: 'Diseño y Producción',
    summary:
      'Personalizaciones, archivos, aprobaciones y seguimiento de producción.',
    allowedModules: ['customizations', 'orders'],
    capabilities: [
      'Descarga y validación de fotografías y logotipos adjuntos',
      'Carga de previsualización digital para aprobación del cliente',
      'Gestión de los 7 estados de producción en taller',
      'Registro de observaciones técnicas de grabado láser e impresión HD',
    ],
  },
  CLIENTE: {
    code: 'CLIENTE',
    name: 'Cliente Registrado',
    summary:
      'Portal personal para consultar pedidos, pagos, direcciones, personalizaciones y favoritos.',
    allowedModules: [],
    capabilities: [
      'Consulta de pedidos, pagos y descarga de comprobantes',
      'Aprobación de diseños personalizados',
      'Gestión de libreta de direcciones y lista de favoritos',
    ],
  },
};

export function canRoleAccessModule(
  role: UserRoleCode,
  moduleKey: AdminModuleKey
): boolean {
  return ROLE_PERMISSION_MATRIX[role]?.allowedModules.includes(moduleKey) ?? false;
}

