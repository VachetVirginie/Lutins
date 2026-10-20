import type { SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * La voie synchronisée est ouverte dès que les clés sont configurées —
 * le drapeau ne dépend pas du SDK (~120 kB) qui ne se charge que si
 * un code famille relie réellement deux appareils.
 */
export const syncAvailable = Boolean(url && anonKey)

let client: SupabaseClient | null = null

/**
 * Client Supabase chargé à la demande — une expédition 100 % locale
 * ne télécharge jamais le SDK.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (client || !syncAvailable) return client
  const { createClient } = await import('@supabase/supabase-js')
  client = createClient(url!, anonKey!)
  return client
}
