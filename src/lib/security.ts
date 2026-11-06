import { UserRoleCode } from '@/types/database';

/**
 * Utilidades de Seguridad, Sanitización de Datos y Auditoría Administrativa (Sección 18).
 * - Elimina etiquetas HTML/scripts maliciosos (prevención XSS)
 * - Valida DNI (8 dígitos) y RUC Peruano (11 dígitos con prefijo 10/20)
 * - Registra eventos de operaciones administrativas
 */
export function sanitizeUserText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export function isValidPeruvianDNI(dni: string): boolean {
  return /^\d{8}$/.test(dni.trim());
}

export function isValidPeruvianRUC(ruc: string): boolean {
  return /^(10|15|17|20)\d{9}$/.test(ruc.trim());
}

export interface AdminAuditLogEntry {
  id: string;
  timestamp: string;
  actorRole: UserRoleCode;
  action: string;
  targetResource: string;
  details: string;
}

export function createAuditLogEntry(params: {
  actorRole: UserRoleCode;
  action: string;
  targetResource: string;
  details: string;
}): AdminAuditLogEntry {
  return {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorRole: params.actorRole,
    action: sanitizeUserText(params.action),
    targetResource: sanitizeUserText(params.targetResource),
    details: sanitizeUserText(params.details),
  };
}

