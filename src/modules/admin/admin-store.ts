'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CategoryNode,
  PaymentMethodCode,
  ShipmentDispatchStatus,
  UserRoleCode,
} from '@/types/database';
import { INITIAL_CATALOG_TAXONOMY } from '@/config/catalog-taxonomy';
import {
  CATALOG_PRODUCTS,
  CatalogProductView,
} from '@/modules/catalog/catalog-data';
import {
  DEFAULT_SHIPPING_CONFIG,
  DistrictShippingRate,
  DepartmentShippingRate,
} from '@/config/shipping-settings';

export interface AdminCouponItem {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minPurchase: number;
  isActive: boolean;
}

export interface AdminPromotionItem {
  id: string;
  name: string;
  discountPercentage: number;
  categoryName: string;
  isActive: boolean;
}

export interface AdminReviewItem {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
}

export interface AdminStaffUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRoleCode;
  isActive: boolean;
}

export interface ShipmentTrackingRecord {
  orderId: string;
  orderNumber: string;
  carrierName: string;
  trackingCode: string;
  estimatedDeliveryTime: string;
  dispatchStatus: ShipmentDispatchStatus;
  updatedAt: string;
}

interface AdminStoreState {
  activeRole: UserRoleCode;
  products: CatalogProductView[];
  categories: CategoryNode[];
  coupons: AdminCouponItem[];
  promotions: AdminPromotionItem[];
  reviews: AdminReviewItem[];
  staffUsers: AdminStaffUser[];
  arequipaDistrictRates: DistrictShippingRate[];
  peruDepartmentRates: DepartmentShippingRate[];
  transportCarriers: string[];
  shipmentTrackings: Record<string, ShipmentTrackingRecord>;
  businessConfig: {
    businessName: string;
    whatsappNumber: string;
    supportEmail: string;
    freeShippingThresholdPEN: number;
    enabledPaymentMethods: Record<PaymentMethodCode, boolean>;
  };
  setActiveRole: (role: UserRoleCode) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  addCategoryOrSubcategory: (params: {
    name: string;
    slug: string;
    description: string;
    parentCategoryId: string | null;
  }) => void;
  addCoupon: (coupon: Omit<AdminCouponItem, 'id'>) => void;
  toggleCouponStatus: (id: string) => void;
  toggleReviewApproval: (id: string) => void;
  togglePaymentMethodAvailability: (code: PaymentMethodCode) => void;
  updateBusinessSettings: (patch: {
    whatsappNumber?: string;
    freeShippingThresholdPEN?: number;
  }) => void;
  updateDistrictRate: (
    district: string,
    ratePEN: number,
    estimatedWindow: string
  ) => void;
  updateDepartmentRate: (
    department: string,
    ratePEN: number,
    estimatedWindow: string
  ) => void;
  upsertShipmentTracking: (record: ShipmentTrackingRecord) => void;
  updateStaffUserRole: (userId: string, role: UserRoleCode) => void;
}

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set) => ({
      activeRole: 'ADMINISTRADOR',
      products: CATALOG_PRODUCTS,
      categories: INITIAL_CATALOG_TAXONOMY,
      arequipaDistrictRates: DEFAULT_SHIPPING_CONFIG.arequipaDistricts,
      peruDepartmentRates: DEFAULT_SHIPPING_CONFIG.peruDepartments,
      transportCarriers: [
        'Motorizado Propio MenteLúdica (Arequipa)',
        'Olva Courier',
        'Shalom Empresarial',
        'Cruz del Sur Cargo',
        'Marvisur',
      ],
      shipmentTrackings: {},
      coupons: [
        {
          id: 'cp-1',
          code: 'BIENVENIDA10',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          minPurchase: 50,
          isActive: true,
        },
        {
          id: 'cp-2',
          code: 'AREQUIPA15',
          discountType: 'FIXED_AMOUNT',
          discountValue: 15,
          minPurchase: 120,
          isActive: true,
        },
      ],
      promotions: [
        {
          id: 'prm-1',
          name: 'Campaña Juegos de Construcción & Arquitectura',
          discountPercentage: 15,
          categoryName: 'Juegos de construcción',
          isActive: true,
        },
        {
          id: 'prm-2',
          name: 'Especial Regalos Personalizados & Corporativos',
          discountPercentage: 12,
          categoryName: 'Souvenirs personalizados',
          isActive: true,
        },
      ],
      reviews: [
        {
          id: 'rv-1',
          productName: 'Set Arquitectónico Catedral Histórica de Arequipa',
          customerName: 'Ing. Carlos Valdivia',
          rating: 5,
          comment:
            'Excelente precisión en las piezas y presentación impecable.',
          isApproved: true,
        },
        {
          id: 'rv-2',
          productName: 'Rompecabezas Fotográfico Personalizado',
          customerName: 'Mariana Zeballos',
          rating: 5,
          comment:
            'Nos enviaron la previsualización antes de producir y quedó hermoso.',
          isApproved: true,
        },
      ],
      staffUsers: [
        {
          id: 'st-1',
          fullName: 'Dirección General MenteLúdica',
          email: 'admin@menteludica.pe',
          role: 'ADMINISTRADOR',
          isActive: true,
        },
        {
          id: 'st-2',
          fullName: 'Valeria Quispe – Atención Comercial',
          email: 'ventas@menteludica.pe',
          role: 'VENTAS',
          isActive: true,
        },
        {
          id: 'st-3',
          fullName: 'Rodrigo Mamani – Logística Arequipa',
          email: 'almacen@menteludica.pe',
          role: 'ALMACEN',
          isActive: true,
        },
        {
          id: 'st-4',
          fullName: 'Camila Flores – Taller Láser & Diseño',
          email: 'diseno@menteludica.pe',
          role: 'DISENO_PRODUCCION',
          isActive: true,
        },
      ],
      businessConfig: {
        businessName: 'MenteLúdica – Aprendizaje y Diversión',
        whatsappNumber: '51900000000',
        supportEmail: 'contacto@menteludica.pe',
        freeShippingThresholdPEN:
          DEFAULT_SHIPPING_CONFIG.freeShippingThresholdPEN,
        enabledPaymentMethods: {
          YAPE: true,
          PLIN: true,
          BANK_TRANSFER: true,
          CREDIT_CARD: true,
          DEBIT_CARD: true,
          CULQI: true,
          MERCADO_PAGO: true,
          NIUBIZ: false,
          CASH_ON_DELIVERY: true,
        },
      },

      setActiveRole: (activeRole) => set({ activeRole }),

      updateProductStock: (productId, newStock) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? { ...p, availableStock: Math.max(0, newStock) }
              : p
          ),
        })),

      addCategoryOrSubcategory: ({
        name,
        slug,
        description,
        parentCategoryId,
      }) =>
        set((state) => {
          const newNode: CategoryNode = {
            id: `cat-${Date.now()}`,
            parentId: parentCategoryId,
            name,
            slug,
            description,
            subcategories: [],
          };

          if (!parentCategoryId) {
            return { categories: [...state.categories, newNode] };
          }

          return {
            categories: state.categories.map((cat) =>
              cat.id === parentCategoryId
                ? {
                    ...cat,
                    subcategories: [...(cat.subcategories || []), newNode],
                  }
                : cat
            ),
          };
        }),

      addCoupon: (coupon) =>
        set((state) => ({
          coupons: [...state.coupons, { ...coupon, id: `cp-${Date.now()}` }],
        })),

      toggleCouponStatus: (id) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        })),

      toggleReviewApproval: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, isApproved: !r.isApproved } : r
          ),
        })),

      togglePaymentMethodAvailability: (code) =>
        set((state) => ({
          businessConfig: {
            ...state.businessConfig,
            enabledPaymentMethods: {
              ...state.businessConfig.enabledPaymentMethods,
              [code]: !state.businessConfig.enabledPaymentMethods[code],
            },
          },
        })),

      updateBusinessSettings: (patch) =>
        set((state) => ({
          businessConfig: {
            ...state.businessConfig,
            ...patch,
          },
        })),

      updateDistrictRate: (district, ratePEN, estimatedWindow) =>
        set((state) => ({
          arequipaDistrictRates: state.arequipaDistrictRates.map((d) =>
            d.district === district
              ? { ...d, ratePEN: Math.max(0, ratePEN), estimatedWindow }
              : d
          ),
        })),

      updateDepartmentRate: (department, ratePEN, estimatedWindow) =>
        set((state) => ({
          peruDepartmentRates: state.peruDepartmentRates.map((d) =>
            d.department === department
              ? { ...d, ratePEN: Math.max(0, ratePEN), estimatedWindow }
              : d
          ),
        })),

      upsertShipmentTracking: (record) =>
        set((state) => ({
          shipmentTrackings: {
            ...state.shipmentTrackings,
            [record.orderId]: record,
          },
        })),

      updateStaffUserRole: (userId, role) =>
        set((state) => ({
          staffUsers: state.staffUsers.map((u) =>
            u.id === userId ? { ...u, role } : u
          ),
        })),
    }),
    {
      name: 'menteludica-admin-store',
    }
  )
);
