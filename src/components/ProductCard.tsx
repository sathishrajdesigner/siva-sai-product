'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaPhone } from 'react-icons/fa6'
import EnquiryModal from './EnquiryModal'
import type { CmsProduct } from '@/lib/types'

type Props = {
  product: CmsProduct
}

export default function ProductCard({ product }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
        <div className="relative h-52 overflow-hidden bg-stone-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-orange-50">
              <span className="text-5xl">🪔</span>
            </div>
          )}
          {product.categoryName && (
            <div className="absolute top-3 right-3">
              <span className="bg-white/90 backdrop-blur-sm text-stone-600 text-xs font-medium px-2.5 py-1 rounded-full capitalize shadow-sm">
                {product.categoryName}
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-stone-800 text-base leading-snug">{product.name}</h3>
          {product.shortDescription && (
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed flex-1 line-clamp-2">
              {product.shortDescription}
            </p>
          )}
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 active:scale-95 transition-all duration-150"
          >
            <FaPhone className="w-3.5 h-3.5" />
            Contact to Enquire
          </button>
        </div>
      </div>

      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={product.name}
      />
    </>
  )
}
