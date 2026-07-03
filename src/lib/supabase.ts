import { createClient } from '@supabase/supabase-js'

// Optional Next.js fetch cache config (revalidate/tags), forwarded to every
// request this client instance makes so callers can opt a query into the
// Next.js Data Cache instead of always hitting Supabase directly (Task 3.3).
export function createERPClient(cache?: { revalidate: number; tags: string[] }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — ' +
      'set these to the shared Supabase project credentials (same as siva-sai-erp)'
    )
  }
  if (!cache) return createClient(url, key)
  return createClient(url, key, {
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: cache })
    }
  })
}
