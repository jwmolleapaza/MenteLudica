/**
 * Modelo de Dominio y Tipos Estrictos de Base de Datos – MenteLúdica
 * Corresponde 1:1 con las 26 tablas definidas en supabase/migrations/0001_initial_schema.sql
 */

export type UserRoleCode =
  | 'ADMINISTRADOR'
  | 'VENTAS'
  | 'ALMACEN'
  | 'DISENO_PRODUCCION'
  | 'CLIENTE';

export type AdminModuleKey =
  | 'products'
  | 'categories'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'payments'
  | 'shipments'
  | 'customizations'
  | 'promotions'
  | 'coupons'
  | 'reviews'
  | 'reports'
  | 'settings'
  | 'users';

export type ProductPublicationStatus = 'draft' | 'published' | 'archived';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PREPARATION'
  | 'IN_CUSTOMIZATION'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type CustomizationProductionStatus =
  | 'PENDIENTE_REVISION'
  | 'EN_DISENO'
  | 'ESPERANDO_APROBACION'
  | 'APROBADO'
  | 'EN_PRODUCCION'
  | 'TERMINADO'
  | 'ENTREGADO';

export type PaymentMethodCode =
  | 'YAPE'
  | 'PLIN'
  | 'BANK_TRANSFER'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'CULQI'
  | 'MERCADO_PAGO'
  | 'NIUBIZ'
  | 'CASH_ON_DELIVERY';

export type PaymentStatus =
  | 'PENDIENTE'
  | 'EN_VALIDACION'
  | 'PAGADO'
  | 'RECHAZADO'
  | 'REEMBOLSADO';

export type DeliveryModality =
  | 'LOCAL_DELIVERY_AQP'
  | 'NATIONAL_SHIPPING_PERU'
  | 'STORE_PICKUP';

export type ShipmentDispatchStatus =
  | 'PENDIENTE'
  | 'PREPARANDO_PAQUETE'
  | 'LISTO_PARA_RECOJO'
  | 'EN_RUTA'
  | 'ENTREGADO'
  | 'INCIDENCIA';

export interface CategoryNode {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  subcategories?: CategoryNode[];
}

export interface ProductEntity {
  id: string;
  sku: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategoryId: string | null;
  shortDescription: string;
  fullDescription: string;
  videoUrl?: string | null;
  salePrice: number;
  promoPrice?: number | null;
  internalCost: number;
  availableStock: number;
  minStockAlert: number;
  brand: string;
  recommendedAge: string;
  dimensions: string;
  weightGrams: number;
  material: string;
  features: string[];
  tags: string[];
  isCustomizable: boolean;
  compatibilityNote?: string | null;
  status: ProductPublicationStatus;
  relatedProductIds: string[];
}

