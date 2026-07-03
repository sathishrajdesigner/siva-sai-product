import { createHmac, timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

// Receives the signed "a product changed" ping from the ERP
// (erp/lib/catalog-revalidation.ts) and invalidates the cached catalog read
// in erpProducts.ts (Task 3.3). Every visitor previously hit Supabase
// directly because there was no cache to invalidate — this endpoint is what
// makes caching those reads safe.

const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000
const NONCE_TTL_MS = 10 * 60 * 1000

function computeSignature(body: string, nonce: string, timestamp: string, secret: string): string {
  return createHmac('sha256', secret).update(`${timestamp}.${nonce}.${body}`).digest('hex')
}

function signaturesMatch(expected: string, supplied: string): boolean {
  const expectedBuffer = Buffer.from(expected)
  const suppliedBuffer = Buffer.from(supplied)
  if (expectedBuffer.length !== suppliedBuffer.length) return false
  return timingSafeEqual(expectedBuffer, suppliedBuffer)
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  const secret = process.env.PRODUCT_REVALIDATION_SECRET
  if (!secret) return NextResponse.json({ error: 'Revalidation is not configured.' }, { status: 503 })

  const nonce = request.headers.get('x-siva-nonce')
  const signature = request.headers.get('x-siva-signature')
  const timestamp = request.headers.get('x-siva-timestamp')
  if (!nonce || !signature || !timestamp || !UUID_PATTERN.test(nonce)) {
    return NextResponse.json({ error: 'Missing or invalid signature headers.' }, { status: 400 })
  }

  const timestampMs = Number(timestamp)
  if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > MAX_CLOCK_SKEW_MS) {
    return NextResponse.json({ error: 'Request timestamp is stale.' }, { status: 401 })
  }

  const body = await request.text()
  const expectedSignature = computeSignature(body, nonce, timestamp, secret)
  if (!signaturesMatch(expectedSignature, signature)) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  // The nonce table's primary key does the replay-protection: a second
  // request with the same nonce fails this insert with a unique violation.
  const admin = createSupabaseAdminClient()
  const { error: nonceError } = await admin
    .from('website_revalidation_nonces')
    .insert({ nonce, expires_at: new Date(Date.now() + NONCE_TTL_MS).toISOString() })
  if (nonceError) {
    return NextResponse.json({ error: 'Duplicate or replayed request.' }, { status: 409 })
  }

  let event: string | null = null
  try {
    event = (JSON.parse(body) as { event?: string }).event ?? null
  } catch {
    // Body isn't valid JSON — the signature already proved authenticity, so
    // still revalidate rather than fail the whole request over this.
  }

  revalidateTag('erp-products', 'max')

  return NextResponse.json({ ok: true, event })
}
