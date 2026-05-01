import Link from 'next/link'
import { FaHouse, FaBoxOpen, FaEnvelope } from 'react-icons/fa6'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaBoxOpen className="w-12 h-12 text-orange-400" />
        </div>
        <h1 className="font-heading text-6xl font-bold text-orange-600 mb-2">404</h1>
        <h2 className="font-heading text-2xl font-bold text-stone-800 mb-3">Page Not Found</h2>
        <p className="text-stone-500 text-base max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let us help you find what you need.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors"
        >
          <FaHouse className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-stone-700 font-semibold rounded-xl border border-stone-200 hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          <FaBoxOpen className="w-4 h-4" />
          View Products
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-stone-700 font-semibold rounded-xl border border-stone-200 hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          <FaEnvelope className="w-4 h-4" />
          Contact Us
        </Link>
      </div>
    </div>
  )
}
