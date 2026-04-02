import { NextRequest, NextResponse } from 'next/server'

// ── Simple in-memory rate limiter ─────────────────────────────────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const WINDOW_MS  = 60 * 60 * 1000  // 1 hour

function isRateLimited(ip: string): boolean {
  const now   = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function sanitize(str: string): string {
  return str.trim().replace(/[<>"']/g, '')
}

function isValidMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile.replace(/[\s\-\+\(\)]/g, ''))
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ── POST /api/enquiry ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Origin check
    const origin  = req.headers.get('origin') || ''
    const appUrl  = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    if (origin && origin !== appUrl && !origin.startsWith('http://localhost')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Rate limit
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 },
      )
    }

    // 3. Parse body
    const body = await req.json()
    const { name, mobile, email, product, message, _hp } = body

    // 4. Honeypot
    if (_hp && String(_hp).length > 0) {
      return NextResponse.json({ success: true })
    }

    // 5. Validate
    const errors: Record<string, string> = {}
    const cleanName    = sanitize(String(name    || ''))
    const cleanMobile  = sanitize(String(mobile  || ''))
    const cleanEmail   = sanitize(String(email   || ''))
    const cleanMessage = sanitize(String(message || ''))
    const cleanProduct = sanitize(String(product || 'General Enquiry'))

    if (!cleanName || cleanName.length < 2)       errors.name    = 'Name must be at least 2 characters.'
    if (cleanName.length > 100)                   errors.name    = 'Name is too long.'
    if (!cleanMobile)                             errors.mobile  = 'Mobile number is required.'
    else if (!isValidMobile(cleanMobile))         errors.mobile  = 'Enter a valid 10-digit Indian mobile number.'
    if (cleanEmail && !isValidEmail(cleanEmail))  errors.email   = 'Enter a valid email address.'
    if (cleanMessage.length > 1000)               errors.message = 'Message is too long (max 1000 characters).'

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 })
    }

    // 6. Forward to Payload REST API
    const payloadRes = await fetch(`${appUrl}/api/enquiries`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:        cleanName,
        mobile:      cleanMobile,
        email:       cleanEmail   || undefined,
        product:     cleanProduct,
        message:     cleanMessage || undefined,
        source:      'website',
        ipAddress:   ip,
        referrerUrl: req.headers.get('referer') || undefined,
      }),
    })

    if (!payloadRes.ok) {
      console.error('[enquiry] payload error:', await payloadRes.text())
      return NextResponse.json({ error: 'Failed to save enquiry.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[enquiry] error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
