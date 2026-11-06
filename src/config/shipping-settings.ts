import { DeliveryModality } from '@/types/database';

export interface DistrictShippingRate {
  district: string;
  ratePEN: number;
  estimatedWindow: string;
  allowCashOnDelivery: boolean;
}

export interface DepartmentShippingRate {
  department: string;
  ratePEN: number;
  estimatedWindow: string;
  carriers: string[];
}

export interface ShippingSettingsConfig {
  freeShippingThresholdPEN: number;
  pickupLocation: {
    name: string;
    address: string;
    district: string;
    city: string;
    schedule: string;
    preparationTime: string;
  };
  arequipaDistricts: DistrictShippingRate[];
  peruDepartments: DepartmentShippingRate[];
}

/**
 * Configuración de Envíos y Entregas Administrable (Sección 11 del Prompt Maestro).
 * Estos parámetros provienen de la tabla `business_settings` y son editables desde el
 * Panel Administrativo (Módulo G: Envíos y Módulo M: Configuración General).
 */
export const DEFAULT_SHIPPING_CONFIG: ShippingSettingsConfig = {
  freeShippingThresholdPEN: 250.0,
  pickupLocation: {
    name: 'Showroom & Taller MenteLúdica Arequipa',
    address: 'Av. Ejército / Cayma (Coordinación previa con número de pedido)',
    district: 'Cayma',
    city: 'Arequipa',
    schedule: 'Lunes a Sábado de 10:00 a.m. a 7:30 p.m.',
    preparationTime: 'Listo según confirmación administrativa',
  },
  arequipaDistricts: [
    {
      district: 'Cercado (Arequipa)',
      ratePEN: 8.0,
      estimatedWindow: 'Programable en el día / 24h (según configuración)',
      allowCashOnDelivery: true,
    },
    {
      district: 'Cayma',
      ratePEN: 8.0,
      estimatedWindow: 'Programable en el día / 24h (según configuración)',
      allowCashOnDelivery: true,
    },
    {
      district: 'Yanahuara',
      ratePEN: 8.0,
      estimatedWindow: 'Programable en el día / 24h (según configuración)',
      allowCashOnDelivery: true,
    },
    {
      district: 'José Luis Bustamante y Rivero',
      ratePEN: 9.0,
      estimatedWindow: 'Programable en el día / 24h (según configuración)',
      allowCashOnDelivery: true,
    },
    {
      district: 'Sachaca',
      ratePEN: 10.0,
      estimatedWindow: '24h hábiles (según configuración)',
      allowCashOnDelivery: true,
    },
    {
      district: 'Cerro Colorado',
      ratePEN: 10.0,
      estimatedWindow: '24h hábiles (según configuración)',
      allowCashOnDelivery: true,
    },
    {
      district: 'Miraflores (Arequipa)',
      ratePEN: 9.0,
      estimatedWindow: '24h hábiles (según configuración)',
      allowCashOnDelivery: true,
    },
    {
      district: 'Paucarpata',
      ratePEN: 10.0,
      estimatedWindow: '24h hábiles (según configuración)',
      allowCashOnDelivery: true,
    },
    {
      district: 'Alto Selva Alegre',
      ratePEN: 10.0,
      estimatedWindow: '24h hábiles (según configuración)',
      allowCashOnDelivery: true,
    },
    {
      district: 'Mariano Melgar',
      ratePEN: 10.0,
      estimatedWindow: '24h hábiles (según configuración)',
      allowCashOnDelivery: true,
    },
    {
      district: 'Socabaya / Hunter / Tiabaya',
      ratePEN: 12.0,
      estimatedWindow: '24h a 48h hábiles (según configuración)',
      allowCashOnDelivery: false,
    },
  ],
  peruDepartments: [
    {
      department: 'Lima y Callao',
      ratePEN: 18.0,
      estimatedWindow: 'Según agencia seleccionada por administración',
      carriers: ['Olva Courier', 'Shalom Empresarial', 'Cruz del Sur Cargo'],
    },
    {
      department: 'Cusco / Puno / Tacna / Moquegua / Ica',
      ratePEN: 16.0,
      estimatedWindow: 'Según agencia seleccionada por administración',
      carriers: ['Olva Courier', 'Shalom Empresarial', 'Marvisur'],
    },
    {
      department: 'La Libertad / Piura / Lambayeque / Áncash / Junín',
      ratePEN: 20.0,
      estimatedWindow: 'Según agencia seleccionada por administración',
      carriers: ['Olva Courier', 'Shalom Empresarial'],
    },
    {
      department: 'Otros Departamentos del Perú',
      ratePEN: 24.0,
      estimatedWindow: 'Según agencia seleccionada por administración',
      carriers: ['Olva Courier', 'Shalom Empresarial'],
    },
  ],
};

export function calculateConfigurableShipping(params: {
  modality: DeliveryModality;
  district?: string;
  department?: string;
  subtotalAfterDiscount: number;
  config?: ShippingSettingsConfig;
}): { cost: number; estimatedLabel: string; isFreeByThreshold: boolean } {
  const cfg = params.config || DEFAULT_SHIPPING_CONFIG;

  if (params.modality === 'STORE_PICKUP') {
    return {
      cost: 0,
      estimatedLabel: cfg.pickupLocation.preparationTime,
      isFreeByThreshold: false,
    };
  }

  const qualifiesFree =
    cfg.freeShippingThresholdPEN > 0 &&
    params.subtotalAfterDiscount >= cfg.freeShippingThresholdPEN;

  if (params.modality === 'LOCAL_DELIVERY_AQP') {
    const found =
      cfg.arequipaDistricts.find((d) => d.district === params.district) ||
      cfg.arequipaDistricts[0];
    return {
      cost: qualifiesFree ? 0 : found.ratePEN,
      estimatedLabel: found.estimatedWindow,
      isFreeByThreshold: qualifiesFree,
    };
  }

  const foundDept =
    cfg.peruDepartments.find((d) => d.department === params.department) ||
    cfg.peruDepartments[0];

  return {
    cost: qualifiesFree ? 0 : foundDept.ratePEN,
    estimatedLabel: foundDept.estimatedWindow,
    isFreeByThreshold: qualifiesFree,
  };
}

