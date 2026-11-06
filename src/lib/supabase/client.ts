import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/config/env';

/**
 * Cliente Supabase para componentes del navegador.
 * Si las credenciales aún no están definidas en .env.local, devuelve null
 * de forma controlada para que la capa de adaptadores informe el estado sin romper la ejecución.
 */
export function getSupabaseBrowserClient() {
  if (
    !env.NEXT_PUBLIC_SUPABASE_URL ||
    !env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_URL.includes('tu-proyecto')
  ) {
    return null;
  }

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

