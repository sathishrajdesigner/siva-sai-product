import { createHmac, timingSafeEqual } from 'node:crypto'

export const PRODUCT_REVALIDATION_MAX_AGE_MS = 5 * 60 * 1000

export function createProductRevalidationSignature({
  body,
  nonce,
  secret,
  timestamp,
}: {
  body: string
  nonce: string
  secret: string
  timestamp: string
}): string {
  return createHmac('sha256', secret)
    .update(`${timestamp}.${nonce}.${body}`)
    .digest('hex')
}

export function verifyProductRevalidationRequest({
  body,
  nonce,
  now = Date.now(),
  secret,
  signature,
  timestamp,
}: {
  body: string
  nonce: string | null
  now?: number
  secret: string
  signature: string | null
  timestamp: string | null
}): { ok: true; nonce: string } | { ok: false; reason: string } {
  if (!nonce || !signature || !timestamp) {
    return { ok: false, reason: 'Missing signature headers.' }
  }

  if (!/^[0-9a-f]{64}$/i.test(signature)) {
    return { ok: false, reason: 'Invalid signature.' }
  }

  const requestTime = Number(timestamp)
  if (!Number.isFinite(requestTime) || Math.abs(now - requestTime) > PRODUCT_REVALIDATION_MAX_AGE_MS) {
    return { ok: false, reason: 'Request timestamp is outside the allowed window.' }
  }

  const expected = createProductRevalidationSignature({ body, nonce, secret, timestamp })
  const expectedBuffer = Buffer.from(expected, 'hex')
  const suppliedBuffer = Buffer.from(signature, 'hex')

  if (
    expectedBuffer.length !== suppliedBuffer.length ||
    !timingSafeEqual(expectedBuffer, suppliedBuffer)
  ) {
    return { ok: false, reason: 'Invalid signature.' }
  }

  return { ok: true, nonce }
}
