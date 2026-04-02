import Link from 'next/link'
import { FaWhatsapp, FaArrowRight } from 'react-icons/fa6'

export default function ContactCTA() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919XXXXXXXXX'
  const message = encodeURIComponent('Hello! I would like to enquire about your products.')

  return (
    <section className="py-16 bg-gradient-to-br from-orange-600 to-amber-500">
      <div className="max-w-3xl mx-auto px-4 text-center text-white">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to Place a Bulk Order?</h2>
        <p className="text-white/80 text-lg mb-8 leading-relaxed">
          Contact us for wholesale pricing, custom packaging and bulk supply across Tamil Nadu and beyond.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
          >
            Contact Us
            <FaArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/${whatsapp}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            <FaWhatsapp className="w-5 h-5" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )
}
