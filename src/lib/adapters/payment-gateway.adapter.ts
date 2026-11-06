import { PaymentMethodCode, PaymentStatus } from '@/types/database';
import { env } from '@/config/env';

export interface PaymentGatewayDescriptor {
  code: PaymentMethodCode;
  label: string;
  type: 'AUTOMATED_GATEWAY' | 'MANUAL_VERIFICATION' | 'CASH_ON_DELIVERY';
  isConfigured: boolean;
  environmentMode: 'PRODUCTION' | 'SANDBOX_ADAPTER';
  requiresVoucherUpload: boolean;
  instructions: string;
}

/**
 * Adaptador unificado de pasarelas de pago para Perú (Sección 10).
 * No inventa integraciones activas cuando faltan credenciales; expone claramente
 * el modo Sandbox Adapter o Validación Manual Administrativa.
 */
export function getAvailablePaymentAdapters(): PaymentGatewayDescriptor[] {
  const isProd = env.NEXT_PUBLIC_APP_ENV === 'production';

  return [
    {
      code: 'YAPE',
      label: 'Yape (QR / Número Oficial)',
      type: 'MANUAL_VERIFICATION',
      isConfigured: true,
      environmentMode: isProd ? 'PRODUCTION' : 'SANDBOX_ADAPTER',
      requiresVoucherUpload: true,
      instructions:
        'Escanea el código QR oficial de MenteLúdica y adjunta la captura del comprobante con número de operación para validación.',
    },
    {
      code: 'PLIN',
      label: 'Plin (Transferencia Inmediata)',
      type: 'MANUAL_VERIFICATION',
      isConfigured: true,
      environmentMode: isProd ? 'PRODUCTION' : 'SANDBOX_ADAPTER',
      requiresVoucherUpload: true,
      instructions:
        'Realiza el pago al número afiliado a Plin y adjunta tu constancia para validación administrativa.',
    },
    {
      code: 'BANK_TRANSFER',
      label: 'Transferencia Bancaria (BCP / Interbank / BBVA)',
      type: 'MANUAL_VERIFICATION',
      isConfigured: true,
      environmentMode: isProd ? 'PRODUCTION' : 'SANDBOX_ADAPTER',
      requiresVoucherUpload: true,
      instructions:
        'Transfiere a nuestras cuentas corrientes o CCI en Soles (PEN) y adjunta el comprobante.',
    },
    {
      code: 'CREDIT_CARD',
      label: 'Tarjeta de Crédito (Visa / Mastercard / Amex / Diners)',
      type: 'AUTOMATED_GATEWAY',
      isConfigured: Boolean(
        env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ||
          env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
      ),
      environmentMode:
        env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ||
        env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
          ? 'PRODUCTION'
          : 'SANDBOX_ADAPTER',
      requiresVoucherUpload: false,
      instructions:
        'Pago con tarjeta de crédito mediante tokenización segura (sin almacenar datos de tarjeta en la base de datos).',
    },
    {
      code: 'DEBIT_CARD',
      label: 'Tarjeta de Débito (Visa / Mastercard Soles PEN)',
      type: 'AUTOMATED_GATEWAY',
      isConfigured: Boolean(
        env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ||
          env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
      ),
      environmentMode:
        env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ||
        env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
          ? 'PRODUCTION'
          : 'SANDBOX_ADAPTER',
      requiresVoucherUpload: false,
      instructions:
        'Pago directo con tarjeta de débito mediante pasarela oficial verificada.',
    },
    {
      code: 'CULQI',
      label: 'Culqi (Tarjetas Crédito/Débito & Yape Online)',
      type: 'AUTOMATED_GATEWAY',
      isConfigured: Boolean(env.NEXT_PUBLIC_CULQI_PUBLIC_KEY),
      environmentMode: env.NEXT_PUBLIC_CULQI_PUBLIC_KEY
        ? 'PRODUCTION'
        : 'SANDBOX_ADAPTER',
      requiresVoucherUpload: false,
      instructions:
        'Pago seguro tokenizado mediante pasarela oficial Culqi Perú (sin almacenar datos de tarjeta).',
    },
    {
      code: 'MERCADO_PAGO',
      label: 'Mercado Pago Perú',
      type: 'AUTOMATED_GATEWAY',
      isConfigured: Boolean(env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY),
      environmentMode: env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
        ? 'PRODUCTION'
        : 'SANDBOX_ADAPTER',
      requiresVoucherUpload: false,
      instructions: 'Checkout oficial con tarjetas de crédito y débito.',
    },
    {
      code: 'NIUBIZ',
      label: 'Niubiz (Visa / Mastercard)',
      type: 'AUTOMATED_GATEWAY',
      isConfigured: false,
      environmentMode: 'SANDBOX_ADAPTER',
      requiresVoucherUpload: false,
      instructions: 'Integración preparada para credenciales de comercio Niubiz.',
    },
    {
      code: 'CASH_ON_DELIVERY',
      label: 'Pago Contra Entrega (Solo Arequipa Metropolitana Configurable)',
      type: 'CASH_ON_DELIVERY',
      isConfigured: true,
      environmentMode: isProd ? 'PRODUCTION' : 'SANDBOX_ADAPTER',
      requiresVoucherUpload: false,
      instructions:
        'Paga al recibir tu pedido en los distritos habilitados por administración en Arequipa.',
    },
  ];
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDIENTE: 'Pendiente de pago',
  EN_VALIDACION: 'En validación administrativa',
  PAGADO: 'Pagado y verificado',
  RECHAZADO: 'Rechazado / Observado',
  REEMBOLSADO: 'Reembolsado',
};

