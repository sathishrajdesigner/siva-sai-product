import { FaPhone, FaEnvelope } from 'react-icons/fa6'

export default function TopBar() {
  const phone = process.env.NEXT_PUBLIC_PHONE || '+91-XXXXX-XXXXX'
  const email = process.env.NEXT_PUBLIC_EMAIL || 'info@sivasaiproducts.com'

  return (
    <div className="bg-orange-600 text-white text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-1">
        <span className="font-medium tracking-wide">
          Welcome to Siva Sai Products — Wholesale Enquiries Welcome
        </span>
        <div className="flex items-center gap-5">
          <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:text-orange-200 transition-colors">
            <FaPhone className="w-3 h-3" />
            {phone}
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-orange-200 transition-colors">
            <FaEnvelope className="w-3 h-3" />
            {email}
          </a>
        </div>
      </div>
    </div>
  )
}
