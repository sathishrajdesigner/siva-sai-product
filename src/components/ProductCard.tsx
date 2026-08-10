'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaPhone, FaCartShopping, FaCircleCheck } from 'react-icons/fa6'
import EnquiryModal from './EnquiryModal'
import { useQuote } from '@/context/QuoteContext'
import type { CmsProduct } from '@/lib/types'

type Props = {
  product: CmsProduct
}

export default function ProductCard({ product }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, isInCart } = useQuote()

  const inCart = isInCart(product.id)

  const handleAddToQuote = () => {
    addItem({ id: product.id, name: product.name })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

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
          {inCart && (
            <div className="absolute top-3 left-3">
              <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <FaCircleCheck className="w-3 h-3" /> In Quote
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

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleAddToQuote}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
                justAdded
                  ? 'bg-green-500 text-white'
                  : inCart
                  ? 'bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {justAdded ? (
                <><FaCircleCheck className="w-3.5 h-3.5" /> Added!</>
              ) : inCart ? (
                <><FaCartShopping className="w-3.5 h-3.5" /> Add Again</>
              ) : (
                <><FaCartShopping className="w-3.5 h-3.5" /> Add to Quote</>
              )}
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 text-stone-600 text-xs font-medium rounded-xl border border-stone-200 hover:border-orange-300 hover:text-orange-600 transition-all duration-150"
            >
              <FaPhone className="w-3 h-3" />
              Contact to Enquire
            </button>
          </div>
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
