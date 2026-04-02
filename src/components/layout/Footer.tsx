import Link from 'next/link'
import { FaPhone, FaEnvelope, FaLocationDot, FaWhatsapp, FaChevronRight } from 'react-icons/fa6'

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_PHONE || '+91-XXXXX-XXXXX'
  const email = process.env.NEXT_PUBLIC_EMAIL || 'info@sivasaiproducts.com'
  const address = process.env.NEXT_PUBLIC_ADDRESS || 'Hosur, Tamil Nadu - 635109'
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919XXXXXXXXX'

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                SS
              </div>
              <div>
                <div className="font-bold text-white leading-tight">Siva Sai</div>
                <div className="text-xs text-stone-400 leading-tight">Products</div>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Trusted manufacturer and wholesale supplier of camphor, pooja oils and devotional products. Serving temples, retailers and distributors across Tamil Nadu.
            </p>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              <FaWhatsapp className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/products', label: 'Products' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                    <FaChevronRight className="w-2.5 h-2.5 text-orange-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Products</h3>
            <ul className="space-y-2 text-sm">
              {['Camphor', 'Neem Oil', 'Castor Oil', 'Deepam Oil', 'Vibhuti', 'Kumkum', 'Pooja Powder', 'Paneer Water'].map(
                (item) => (
                  <li key={item}>
                    <Link href="/products" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                      <FaChevronRight className="w-2.5 h-2.5 text-orange-500" />
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <FaLocationDot className="w-4 h-4 mt-0.5 text-orange-400 shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FaPhone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-orange-400 transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <FaEnvelope className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-orange-400 transition-colors">{email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} Siva Sai Products. All rights reserved.</span>
          <span>Hosur, Tamil Nadu, India</span>
        </div>
      </div>
    </footer>
  )
}
