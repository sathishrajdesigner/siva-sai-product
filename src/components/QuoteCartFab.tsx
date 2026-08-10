'use client'

import Link from 'next/link'
import { FaCartShopping } from 'react-icons/fa6'
import { useQuote } from '@/context/QuoteContext'

export default function QuoteCartFab() {
  const { totalItems } = useQuote()

  if (totalItems === 0) return null

  return (
    <Link
      href="/quote"
      className="fixed bottom-24 right-6 z-50 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-xl flex items-center gap-2 pl-4 pr-5 py-3 transition-all hover:scale-105 active:scale-95"
      aria-label={`View quote — ${totalItems} product${totalItems > 1 ? 's' : ''}`}
    >
      <div className="relative">
        <FaCartShopping className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold leading-none">
          {totalItems}
        </span>
      </div>
      <span className="text-sm font-semibold">
        My Quote
      </span>
    </Link>
  )
}
