import { describe, expect, it } from 'vitest'
import {
  createProductRevalidationSignature,
  PRODUCT_REVALIDATION_MAX_AGE_MS,
  verifyProductRevalidationRequest,
} from './product-revalidation'

describe('product revalidation verification', () => {
  const secret = 'test-secret'
  const body = '{"event":"product_updated","productId":"123"}'
  const nonce = '1138b260-0cb0-4ac0-b464-bd09bf1a22aa'
  const now = 1_781_500_000_000
  const timestamp = now.toString()

  it('accepts a valid current signature', () => {
    const signature = createProductRevalidationSignature({ body, nonce, secret, timestamp })

    expect(
      verifyProductRevalidationRequest({
        body,
        nonce,
        now,
        secret,
        signature,
        timestamp,
      }),
    ).toEqual({ ok: true, nonce })
  })

  it('rejects tampered and expired requests', () => {
    const signature = createProductRevalidationSignature({ body, nonce, secret, timestamp })

    expect(
      verifyProductRevalidationRequest({
        body: `${body} `,
        nonce,
        now,
        secret,
        signature,
        timestamp,
      }).ok,
    ).toBe(false)

    expect(
      verifyProductRevalidationRequest({
        body,
        nonce,
        now: now + PRODUCT_REVALIDATION_MAX_AGE_MS + 1,
        secret,
        signature,
        timestamp,
      }).ok,
    ).toBe(false)
  })
})
