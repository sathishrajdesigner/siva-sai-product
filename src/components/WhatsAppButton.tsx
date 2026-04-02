'use client'

import { FaWhatsapp } from 'react-icons/fa6'

export default function WhatsAppButton() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919XXXXXXXXX'
  const message = encodeURIComponent('Hello! I would like to know more about your products.')

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
    </a>
  )
}
