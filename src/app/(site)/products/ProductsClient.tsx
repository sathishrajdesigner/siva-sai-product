'use client'

import { useState } from 'react'
import { FaMagnifyingGlass, FaChevronRight } from 'react-icons/fa6'
import ProductCard from '@/components/ProductCard'
import { getCategoryIcon } from '@/lib/categoryIcons'
import type { CmsProduct, CmsCategory } from '@/lib/types'

type Props = {
  products: CmsProduct[]
  categories: CmsCategory[]
}

export default function ProductsClient({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeSub, setActiveSub] = useState('')
  const [search, setSearch] = useState('')

  // Build category hierarchy
  const rootCategories = categories.filter((c) => !c.parentId)
  const subCategories = categories.filter((c) => !!c.parentId)

  const parentSlugById: Record<string | number, string> = {}
  for (const root of rootCategories) {
    parentSlugById[root.id] = root.slug
  }

  const subsByParentSlug: Record<string, CmsCategory[]> = {}
  for (const sub of subCategories) {
    const parentSlug = sub.parentId ? parentSlugById[sub.parentId] : null
    if (parentSlug) {
      subsByParentSlug[parentSlug] = subsByParentSlug[parentSlug] || []
      subsByParentSlug[parentSlug].push(sub)
    }
  }

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug)
    setActiveSub('')
  }

  const filtered = products.filter((p) => {
    const catSlug = p.categorySlug ?? ''
    const parentSlug = subCategories.find((s) => s.slug === catSlug)?.parentId
      ? parentSlugById[subCategories.find((s) => s.slug === catSlug)!.parentId!]
      : null

    const matchCat =
      activeCategory === 'all' ||
      catSlug === activeCategory ||
      parentSlug === activeCategory

    const matchSub = !activeSub || catSlug === activeSub

    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.shortDescription ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.categoryName ?? '').toLowerCase().includes(search.toLowerCase())

    return matchCat && matchSub && matchSearch
  })

  const activeSubs = subsByParentSlug[activeCategory] ?? []
  const activeCatData = categories.find((c) => c.slug === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 to-amber-500 py-14 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">Our Products</h1>
          <p className="text-white/80 text-lg">
            Browse our complete range — each product available in multiple pack sizes.
          </p>
        </div>
      </section>

      <section className="py-10 bg-orange-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search */}
          <div className="relative max-w-sm mb-6">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
            />
          </div>

          {/* Root category pills */}
          <div className="flex flex-wrap gap-2 mb-3">
            {rootCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.slug)
              const isActive = activeCategory === cat.slug && !activeSub
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              )
            })}
          </div>

          {/* Sub-category pills */}
          {activeSubs.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 pl-1">
              <FaChevronRight className="w-3 h-3 text-orange-400" />
              {activeSubs.map((sub) => {
                const Icon = getCategoryIcon(sub.slug)
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSub(activeSub === sub.slug ? '' : sub.slug)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      activeSub === sub.slug
                        ? 'bg-orange-100 text-orange-700 border-orange-400'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-orange-300 hover:text-orange-600'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {sub.name}
                  </button>
                )
              })}
            </div>
          )}

          {/* Breadcrumb */}
          {activeCatData && activeCatData.slug !== 'all' && (
            <p className="text-sm text-stone-500 mb-5">
              <span className="text-stone-400">Products</span>
              <span className="mx-1.5 text-stone-300">/</span>
              <span className="font-medium text-stone-700">{activeCatData.name}</span>
              {activeSub && (
                <>
                  <span className="mx-1.5 text-stone-300">/</span>
                  <span className="font-medium text-orange-600">
                    {activeSubs.find((s) => s.slug === activeSub)?.name}
                  </span>
                </>
              )}
              <span className="ml-2 text-stone-400">({filtered.length} items)</span>
            </p>
          )}

          {/* Products grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FaMagnifyingGlass className="w-12 h-12 mx-auto mb-4 text-stone-300" />
              <p className="text-lg font-medium text-stone-500">No products found</p>
              <p className="text-sm mt-1 text-stone-400">Try a different category or search term.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
