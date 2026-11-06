'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DeliveryModality,
  OrderStatus,
  PaymentMethodCode,
  PaymentStatus,
} from '@/types/database';
import { CartItem } from '@/modules/cart/cart-store';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  checkoutMode: 'GUEST' | 'REGISTERED';
  customer: {
    fullName: string;
    email: string;
    phone: string;
    documentType: 'DNI' | 'RUC' | 'CE';
    documentNumber?: string;
  };
  billing: {
    type: 'BOLETA' | 'FACTURA';
    rucNumber?: string;
    businessName?: string;
    fiscalAddress?: string;
  };
  delivery: {
    modality: DeliveryModality;
    department: string;
    city: string;
    district: string;
    addressLine: string;
    reference: string;
    carrierName?: string;
    trackingCode?: string;
    estimatedWindow: string;
  };
  payment: {
    method: PaymentMethodCode;
    status: PaymentStatus;
    operationCode?: string;
    voucherFileName?: string;
  };
  items: CartItem[];
  pricing: {
    subtotal: number;
    customizationTotal: number;
    discountAmount: number;
    couponCode?: string | null;
    shippingCost: number;
    totalAmount: number;
  };
  customerNotes?: string;
  orderStatus: OrderStatus;
}

interface OrdersStoreState {
  orders: OrderRecord[];
  createOrder: (
    payload: Omit<OrderRecord, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus'>
  ) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
}

export const useOrdersStore = create<OrdersStoreState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (payload) => {
        const sequence = (get().orders.length + 101)
          .toString()
          .padStart(6, '0');
        const year = new Date().getFullYear();
        const newOrder: OrderRecord = {
          ...payload,
          id: `ord-${Date.now()}`,
          orderNumber: `ML-${year}-${sequence}`,
          createdAt: new Date().toISOString(),
          orderStatus: payload.items.some((i) => i.customization)
            ? 'IN_CUSTOMIZATION'
            : 'PENDING',
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId, orderStatus) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, orderStatus } : o
          ),
        }));
      },

      updatePaymentStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, payment: { ...o.payment, status } }
              : o
          ),
        }));
      },
    }),
    {
      name: 'menteludica-orders-storage',
    }
  )
);

