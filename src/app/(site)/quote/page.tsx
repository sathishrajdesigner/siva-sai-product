'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FaCartShopping, FaTrash, FaPlus, FaMinus, FaCircleCheck,
  FaUser, FaMobileScreenButton, FaEnvelope, FaWhatsapp,
  FaArrowLeft, FaFileLines,
} from 'react-icons/fa6'
import { useQuote } from '@/context/QuoteContext'

type FormState = { name: string; mobile: string; email: string; message: string }
type FieldErrors = Partial<Record<keyof FormState | 'items', string>>
const EMPTY: FormState = { name: '', mobile: '', email: '', message: '' }

function validateClient(form: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = 'Please enter your full name.'
  const digits = form.mobile.replace(/[\s\-\+\(\)]/g, '')
  if (!digits) errors.mobile = 'Mobile number is required.'
  else if (!/^[6-9]\d{9}$/.test(digits))
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address.'
  return errors
}

export default function QuotePage() {
  const { items, removeItem, updateQty, clearCart, totalItems } = useQuote()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919XXXXXXXXX'

  const buildWhatsAppMessage = () => {
    const lines = items.map((item, i) => `${i + 1}. ${item.name} — Qty: ${item.qty}`)
    return encodeURIComponent(
      `Hello! I would like a quotation for the following products from Siva Sai Products:\n\n${lines.join('\n')}\n\nPlease contact me.\nName: ${form.name || '[Your Name]'}\nMobile: ${form.mobile || '[Your Mobile]'}`
    )
  }

  const update = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (fieldErrors[k]) setFieldErrors((fe) => ({ ...fe, [k]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateClient(form)
    if (items.length === 0) errs.items = 'Please add at least one product to your quote.'
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    setStatus('loading')
    setServerError('')

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:    'quotation',
          name:    form.name,
          mobile:  form.mobile,
          email:   form.email,
          message: form.message,
          items:   items.map((i) => ({ productName: i.name, qty: i.qty })),
          _hp:     '',
        }),
      })

      if (res.ok) {
        setStatus('success')
        clearCart()
        setForm(EMPTY)
      } else if (res.status === 422) {
        const data = await res.json()
        setFieldErrors(data.errors || {})
        setStatus('idle')
      } else if (res.status === 429) {
        setServerError('Too many submissions. Please try again later.')
        setStatus('error')
      } else {
        setServerError('Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setServerError('Network error. Please check your connection.')
      setStatus('error')
    }
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (totalItems === 0 && status !== 'success') {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4 py-20 text-center">
        <FaCartShopping className="w-16 h-16 text-orange-200 mb-6" />
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Your Quote is Empty</h1>
        <p className="text-stone-500 mb-8">Browse our products and add items to get a quotation.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" /> Browse Products
        </Link>
      </div>
    )
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4 py-20 text-center">
        <FaCircleCheck className="w-20 h-20 text-green-500 mb-6" />
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Quote Request Sent!</h1>
        <p className="text-stone-500 mb-2">We have received your quotation request.</p>
        <p className="text-stone-500 mb-8">Our team will contact you shortly on your mobile number.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 font-medium rounded-xl hover:bg-white transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" /> Continue Browsing
          </Link>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello! I just submitted a quotation request on your website. Please confirm receipt.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
          >
            <FaWhatsapp className="w-5 h-5" /> Follow up on WhatsApp
          </a>
        </div>
      </div>
    )
  }

  // ── Main quote page ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-600 to-amber-500 py-10 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <FaArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <div className="flex items-center gap-3">
            <FaFileLines className="w-7 h-7" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Quotation</h1>
              <p className="text-white/80 text-sm mt-0.5">
                {totalItems} product{totalItems > 1 ? 's' : ''} selected — fill in your details to send
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Cart Items ─────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-base font-semibold text-stone-700 mb-1">Selected Products</h2>

            {fieldErrors.items && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {fieldErrors.items}
              </p>
            )}

            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0 text-lg">
                  🪔
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">Price on request</p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus className="w-3 h-3 text-stone-600" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-stone-800">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                    aria-label="Increase quantity"
                  >
                    <FaPlus className="w-3 h-3 text-stone-600" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between pt-1">
              <Link href="/products" className="text-sm text-orange-600 hover:underline font-medium">
                + Add more products
              </Link>
              <a
                href={`https://wa.me/${whatsapp}?text=${buildWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" /> Share via WhatsApp
              </a>
            </div>
          </div>

          {/* ── Enquiry Form ───────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-base font-semibold text-stone-800 mb-4">Your Details</h2>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Honeypot */}
                <input
                  type="text"
                  name="_hp"
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none w-0 h-0"
                />

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={update('name')}
                      placeholder="Your full name"
                      aria-invalid={!!fieldErrors.name}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        fieldErrors.name ? 'border-red-400 bg-red-50' : 'border-stone-300'
                      }`}
                    />
                  </div>
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMobileScreenButton className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={update('mobile')}
                      placeholder="+91 XXXXX XXXXX"
                      aria-invalid={!!fieldErrors.mobile}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        fieldErrors.mobile ? 'border-red-400 bg-red-50' : 'border-stone-300'
                      }`}
                    />
                  </div>
                  {fieldErrors.mobile && <p className="mt-1 text-xs text-red-500">{fieldErrors.mobile}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email ID</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      placeholder="your@email.com (optional)"
                      aria-invalid={!!fieldErrors.email}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-stone-300'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Any specific requirements, pack sizes, quantities... (optional)"
                    rows={3}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                {serverError && <p className="text-sm text-red-500">{serverError}</p>}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    'Sending...'
                  ) : (
                    <><FaFileLines className="w-4 h-4" /> Send Quote Request</>
                  )}
                </button>

                <p className="text-xs text-stone-400 text-center">
                  We will call you back with pricing and availability.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
