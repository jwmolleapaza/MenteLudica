'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRoleCode } from '@/types/database';

export interface CustomerAddressItem {
  id: string;
  label: string;
  recipientName: string;
  recipientPhone: string;
  department: string;
  city: string;
  district: string;
  addressLine: string;
  reference: string;
  isDefault: boolean;
}

export interface CustomerProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  documentType: 'DNI' | 'RUC';
  documentNumber: string;
  companyName?: string;
  activeStaffRole: UserRoleCode; // Permite probar los 4 roles administrativos en el panel
}

interface CustomerPortalStoreState {
  profile: CustomerProfileData;
  addresses: CustomerAddressItem[];
  favoriteProductIds: string[];
  updateProfile: (patch: Partial<CustomerProfileData>) => void;
  setActiveStaffRole: (role: UserRoleCode) => void;
  addAddress: (addr: Omit<CustomerAddressItem, 'id'>) => void;
  removeAddress: (id: string) => void;
  toggleFavorite: (productId: string) => void;
}

export const useCustomerPortalStore = create<CustomerPortalStoreState>()(
  persist(
    (set, get) => ({
      profile: {
        id: 'usr-menteludica-001',
        fullName: 'Andrea Paredes Cáceres',
        email: 'andrea.paredes@menteludica.pe',
        phone: '959482110',
        documentType: 'DNI',
        documentNumber: '46829104',
        companyName: '',
        activeStaffRole: 'ADMINISTRADOR',
      },
      addresses: [
        {
          id: 'addr-01',
          label: 'Casa Principal (Cayma)',
          recipientName: 'Andrea Paredes Cáceres',
          recipientPhone: '959482110',
          department: 'Arequipa',
          city: 'Arequipa',
          district: 'Cayma',
          addressLine: 'Av. Cayma 412, Dpto. 302',
          reference: 'A media cuadra de la Plaza de Cayma',
          isDefault: true,
        },
      ],
      favoriteProductIds: ['prod-001', 'prod-003', 'prod-004'],

      updateProfile: (patch) =>
        set((state) => ({
          profile: { ...state.profile, ...patch },
        })),

      setActiveStaffRole: (activeStaffRole) =>
        set((state) => ({
          profile: { ...state.profile, activeStaffRole },
        })),

      addAddress: (addr) =>
        set((state) => ({
          addresses: [
            ...state.addresses,
            { ...addr, id: `addr-${Date.now()}` },
          ],
        })),

      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),

      toggleFavorite: (productId) => {
        const exists = get().favoriteProductIds.includes(productId);
        set((state) => ({
          favoriteProductIds: exists
            ? state.favoriteProductIds.filter((id) => id !== productId)
            : [...state.favoriteProductIds, productId],
        }));
      },
    }),
    {
      name: 'menteludica-customer-portal-storage',
    }
  )
);

