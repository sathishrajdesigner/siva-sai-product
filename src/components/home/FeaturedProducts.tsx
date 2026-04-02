'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa6'
import ProductCard from '@/components/ProductCard'
import { products, categories } from '@/lib/mockData'

const VISIBLE_COUNT = 8

export default function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory || p.subCategory === activeCategory)

  const visible = filtered.slice(0, VISIBLE_COUNT)
  const hasMore = filtered.length > VISIBLE_COUNT

  return (
    <section className="py-16 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-widest">Browse Range</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-800 mt-2">Our Products</h2>
          <p className="text-stone-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Each product is available in multiple pack sizes for retail and wholesale needs.
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.slug
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-stone-400 py-12">No products in this category yet.</p>
        )}

        {/* View more */}
        {(hasMore || activeCategory !== 'all') && (
          <div className="text-center mt-10">
            <Link
              href={`/products${activeCategory !== 'all' ? `?category=${activeCategory}` : ''}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
            >
              View All Products
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
