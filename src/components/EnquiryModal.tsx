'use client'

import { useState } from 'react'
import { FaXmark, FaCircleCheck, FaUser, FaMobileScreenButton, FaEnvelope } from 'react-icons/fa6'

type Props = {
  isOpen: boolean
  onClose: () => void
  productName?: string
}

type FormState = { name: string; mobile: string; email: string }
type FieldErrors = Partial<Record<keyof FormState, string>>

const EMPTY: FormState = { name: '', mobile: '', email: '' }

function validateClient(form: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = 'Please enter your full name.'
  const digits = form.mobile.replace(/[\s\-\+\(\)]/g, '')
  if (!digits)
    errors.mobile = 'Mobile number is required.'
  else if (!/^[6-9]\d{9}$/.test(digits))
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address.'
  return errors
}

export default function EnquiryModal({ isOpen, onClose, productName }: Props) {
  const [form, setForm]       = useState<FormState>(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  if (!isOpen) return null

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (fieldErrors[k]) setFieldErrors((fe) => ({ ...fe, [k]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateClient(form)
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    setStatus('loading')
    setServerError('')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    form.name,
          mobile:  form.mobile,
          email:   form.email,
          product: productName || 'General Enquiry',
          message: `Enquiry about: ${productName || 'General'}`,
          _hp:     '',   // honeypot — must stay empty
        }),
      })

      if (res.ok) {
        setStatus('success')
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

  const handleClose = () => {
    setForm(EMPTY)
    setFieldErrors({})
    setStatus('idle')
    setServerError('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-title"
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleClose}
          aria-label="Close enquiry form"
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors p-1"
        >
          <FaXmark className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-8">
            <FaCircleCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-stone-800 mb-2">Enquiry Sent!</h3>
            <p className="text-stone-500 text-sm">We will contact you shortly.</p>
            <button
              onClick={handleClose}
              className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 id="enquiry-title" className="text-xl font-bold text-stone-800">Enquire Now</h2>
              {productName && (
                <p className="text-sm text-orange-600 mt-1 font-medium">About: {productName}</p>
              )}
              <p className="text-sm text-stone-500 mt-1">Fill in your details and we&apos;ll get back to you soon.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Honeypot — hidden from humans, bots fill it */}
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
                    placeholder="your@email.com"
                    aria-invalid={!!fieldErrors.email}
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-stone-300'
                    }`}
                  />
                </div>
                {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
              </div>

              {serverError && (
                <p className="text-sm text-red-500">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Enquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
