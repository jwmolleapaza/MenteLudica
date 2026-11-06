'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartCustomizationDraft {
  customText?: string;
  selectedOptionLabel?: string;
  specialInstructions?: string;
  attachmentFileName?: string;
  additionalFee: number;
  requiresApproval: boolean;
}

export interface CartItem {
  key: string; // productId + variantId + customHash
  productId: string;
  slug: string;
  sku: string;
  name: string;
  imageUrl: string;
  variantId: string;
  variantName: string;
  unitPrice: number; // Precio base (o promo) + precio variante
  customizationFee: number;
  quantity: number;
  maxStock: number;
  customization?: CartCustomizationDraft | null;
}

export interface ActiveCoupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minPurchase: number;
}

interface CartStoreState {
  items: CartItem[];
  appliedCoupon: ActiveCoupon | null;
  addItem: (item: Omit<CartItem, 'key'>) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
}

const VALID_COUPONS: Record<string, ActiveCoupon> = {
  BIENVENIDA10: {
    code: 'BIENVENIDA10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minPurchase: 50,
  },
  AREQUIPA15: {
    code: 'AREQUIPA15',
    discountType: 'FIXED_AMOUNT',
    discountValue: 15,
    minPurchase: 120,
  },
};

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

      addItem: (incoming) => {
        const customKey = incoming.customization
          ? `${incoming.customization.customText || ''}-${incoming.customization.attachmentFileName || ''}`
          : 'std';
        const key = `${incoming.productId}::${incoming.variantId}::${customKey}`;

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.key === key);
          if (existingIndex > -1) {
            const updated = [...state.items];
            const current = updated[existingIndex];
            const nextQty = Math.min(
              current.maxStock,
              current.quantity + incoming.quantity
            );
            updated[existingIndex] = { ...current, quantity: nextQty };
            return { items: updated };
          }
          return {
            items: [...state.items, { ...incoming, key }],
          };
        });
      },

      updateQuantity: (key, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.key === key
                ? {
                    ...item,
                    quantity: Math.max(1, Math.min(item.maxStock, quantity)),
                  }
                : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter((i) => i.key !== key),
        }));
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCouponCode: (rawCode) => {
        const normalized = rawCode.trim().toUpperCase();
        const coupon = VALID_COUPONS[normalized];
        if (!coupon) {
          return {
            ok: false,
            message: 'El código de cupón ingresado no existe o ha expirado.',
          };
        }

        const subtotal = get().items.reduce(
          (acc, item) =>
            acc + (item.unitPrice + item.customizationFee) * item.quantity,
          0
        );

        if (subtotal < coupon.minPurchase) {
          return {
            ok: false,
            message: `Este cupón requiere una compra mínima de S/ ${coupon.minPurchase.toFixed(2)}.`,
          };
        }

        set({ appliedCoupon: coupon });
        return {
          ok: true,
          message: `Cupón ${coupon.code} aplicado correctamente.`,
        };
      },

      removeCoupon: () => set({ appliedCoupon: null }),
    }),
    {
      name: 'menteludica-cart-storage',
    }
  )
);

