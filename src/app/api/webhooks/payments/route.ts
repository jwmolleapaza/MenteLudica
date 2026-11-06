import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { PaymentStatus } from '@/types/database';

/**
 * Esquema de validación del payload de Webhook de Pasarelas Oficiales (Sección 10 y 18).
 * Prohibido recibir o persistir PAN, CVV o fechas de expiración de tarjetas.
 */
const webhookEventSchema = z.object({
  provider: z.enum(['CULQI', 'MERCADO_PAGO', 'NIUBIZ']),
  eventId: z.string().min(4),
  eventType: z.enum([
    'charge.succeeded',
    'charge.failed',
    'charge.refunded',
    'payment.updated',
  ]),
  orderNumber: z.string().regex(/^ML-\d{4}-\d{6}$/),
  gatewayTransactionId: z.string().min(4),
  amountPEN: z.number().nonnegative(),
  timestamp: z.number(),
});

function verifyHmacSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string | undefined
): boolean {
  if (!secret || !signatureHeader) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Regla PCI-DSS: rechazar inmediatamente si algún cliente malconfigurado envía números de tarjeta
    if (/"(card_number|cvv|cvc|pan)"\s*:/i.test(rawBody)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Violación de seguridad: MenteLúdica no procesa ni almacena datos sensibles de tarjetas en el servidor.',
        },
        { status: 400 }
      );
    }

    const parsedJson = JSON.parse(rawBody);
    const validation = webhookEventSchema.safeParse(parsedJson);

    if (!validation.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Estructura de webhook inválida.',
          details: validation.error.flatten(),
        },
        { status: 422 }
      );
    }

    const payload = validation.data;
    const signature = request.headers.get('x-menteludica-webhook-signature');

    const providerSecretMap: Record<string, string | undefined> = {
      CULQI: process.env.CULQI_WEBHOOK_SECRET,
      MERCADO_PAGO: process.env.MERCADOPAGO_WEBHOOK_SECRET,
      NIUBIZ: process.env.NIUBIZ_PASSWORD,
    };

    const configuredSecret = providerSecretMap[payload.provider];
    const isLiveVerified = verifyHmacSignature(
      rawBody,
      signature,
      configuredSecret
    );

    // Determinar el nuevo estado oficial del pago (Sección 10)
    const mappedStatus: PaymentStatus =
      payload.eventType === 'charge.succeeded'
        ? 'PAGADO'
        : payload.eventType === 'charge.refunded'
          ? 'REEMBOLSADO'
          : payload.eventType === 'charge.failed'
            ? 'RECHAZADO'
            : 'EN_VALIDACION';

    return NextResponse.json({
      ok: true,
      mode: configuredSecret
        ? isLiveVerified
          ? 'LIVE_VERIFIED_WEBHOOK'
          : 'REJECTED_INVALID_SIGNATURE'
        : 'SANDBOX_ADAPTER_WEBHOOK',
      orderNumber: payload.orderNumber,
      provider: payload.provider,
      gatewayTransactionId: payload.gatewayTransactionId,
      resolvedPaymentStatus: mappedStatus,
      processedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Error procesando el webhook de pasarela de pago.',
      },
      { status: 500 }
    );
  }
}

