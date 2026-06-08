import { createClient } from '@supabase/supabase-js'

export function createERPClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — ' +
      'set these to the shared Supabase project credentials (same as siva-sai-erp)'
    )
  }
  return createClient(url, key)
}
