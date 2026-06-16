import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  PRODUCT_REVALIDATION_MAX_AGE_MS,
  verifyProductRevalidationRequest,
} from '@/lib/product-revalidation'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

const eventSchema = z.object({
  event: z.enum([
    'product_created',
    'product_updated',
    'product_publication_changed',
    'product_active_changed',
    'product_deleted',
  ]),
  productId: z.string().uuid(),
})

export async function POST(request: Request) {
  const secret = process.env.PRODUCT_REVALIDATION_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Product revalidation is not configured.' }, { status: 503 })
  }

  const body = await request.text()
  if (body.length > 2048) {
    return NextResponse.json({ error: 'Request body is too large.' }, { status: 413 })
  }

  const verification = verifyProductRevalidationRequest({
    body,
    nonce: request.headers.get('x-siva-nonce'),
    secret,
    signature: request.headers.get('x-siva-signature'),
    timestamp: request.headers.get('x-siva-timestamp'),
  })

  if (!verification.ok) {
    return NextResponse.json({ error: verification.reason }, { status: 401 })
  }

  let json: unknown
  try {
    json = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = eventSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product event.' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  const expiresAt = new Date(Date.now() + PRODUCT_REVALIDATION_MAX_AGE_MS).toISOString()
  const { error: nonceError } = await supabase.from('website_revalidation_nonces').insert({
    nonce: verification.nonce,
    expires_at: expiresAt,
  })

  if (nonceError?.code === '23505') {
    return NextResponse.json({ error: 'This request has already been processed.' }, { status: 409 })
  }
  if (nonceError) {
    console.error('Could not record product revalidation nonce.', nonceError.message)
    return NextResponse.json({ error: 'Could not validate request replay state.' }, { status: 503 })
  }

  revalidateTag('erp-products', { expire: 0 })
  revalidatePath('/')
  revalidatePath('/products')

  void supabase
    .from('website_revalidation_nonces')
    .delete()
    .lt('expires_at', new Date().toISOString())

  return NextResponse.json({
    revalidated: true,
    event: parsed.data.event,
    productId: parsed.data.productId,
  })
}
