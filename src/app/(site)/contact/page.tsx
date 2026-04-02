'use client'

import { useState } from 'react'
import SiteLayout from '@/components/layout/SiteLayout'
import { FaLocationDot, FaPhone, FaEnvelope, FaWhatsapp, FaCircleCheck, FaUser, FaMobileScreenButton } from 'react-icons/fa6'

type FormState = { name: string; mobile: string; email: string; message: string }
type FieldErrors = Partial<Record<keyof FormState, string>>

const EMPTY: FormState = { name: '', mobile: '', email: '', message: '' }

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
  if (form.message.length > 1000)
    errors.message = 'Message is too long (max 1000 characters).'
  return errors
}

export default function ContactPage() {
  const phone    = process.env.NEXT_PUBLIC_PHONE    || '+91-XXXXX-XXXXX'
  const email    = process.env.NEXT_PUBLIC_EMAIL    || 'info@sivasaiproducts.com'
  const address  = process.env.NEXT_PUBLIC_ADDRESS  || 'Hosur, Tamil Nadu - 635109'
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919XXXXXXXXX'

  const [form, setForm]             = useState<FormState>(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus]         = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const update = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          message: form.message,
          product: 'General Enquiry',
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

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 to-amber-500 py-14 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
          <p className="text-white/80 text-lg">
            Reach out for wholesale enquiries, bulk orders or any questions.
          </p>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Get In Touch</h2>

            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <FaLocationDot className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-0.5">Address</div>
                  <span className="text-stone-800 font-medium">{address}</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <FaPhone className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-0.5">Phone</div>
                  <a href={`tel:${phone}`} className="text-stone-800 font-medium hover:text-orange-600 transition-colors">{phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <FaEnvelope className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-0.5">Email</div>
                  <a href={`mailto:${email}`} className="text-stone-800 font-medium hover:text-orange-600 transition-colors">{email}</a>
                </div>
              </div>
            </div>

            {/* WhatsApp button */}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              <FaWhatsapp className="w-5 h-5" />
              Chat on WhatsApp
            </a>

            {/* Map embed */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-stone-200 h-56">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31108.123456789!2d77.8253!3d12.7409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae706ef3c7c5e3%3A0x4a7f2c3b9a0e1234!2sHosur%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Siva Sai Products Location"
              />
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Send a Message</h2>
            <p className="text-stone-500 text-sm mb-6">We&apos;ll get back to you within 24 hours.</p>

            {status === 'success' ? (
              <div className="text-center py-10">
                <FaCircleCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-stone-800 mb-2">Message Sent!</h3>
                <p className="text-stone-500 text-sm">We will contact you shortly.</p>
                <button
                  onClick={() => { setStatus('idle'); setForm(EMPTY); setFieldErrors({}) }}
                  className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  Send Another
                </button>
              </div>
            ) : (
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
                      placeholder="Your name"
                      aria-invalid={!!fieldErrors.name}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
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
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        fieldErrors.mobile ? 'border-red-400 bg-red-50' : 'border-stone-300'
                      }`}
                    />
                  </div>
                  {fieldErrors.mobile && <p className="mt-1 text-xs text-red-500">{fieldErrors.mobile}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email ID</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="your@email.com"
                    aria-invalid={!!fieldErrors.email}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-stone-300'
                    }`}
                  />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Tell us about your requirements..."
                    aria-invalid={!!fieldErrors.message}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                      fieldErrors.message ? 'border-red-400 bg-red-50' : 'border-stone-300'
                    }`}
                  />
                  {fieldErrors.message && <p className="mt-1 text-xs text-red-500">{fieldErrors.message}</p>}
                </div>

                {serverError && (
                  <p className="text-sm text-red-500">{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
