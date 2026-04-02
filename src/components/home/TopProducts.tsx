import ProductCard from '@/components/ProductCard'
import { products } from '@/lib/mockData'

export default function TopProducts() {
  // One featured product per family
  const seen = new Set<string>()
  const topProducts = products.filter((p) => {
    if (p.isTopProduct && !seen.has(p.productFamily)) {
      seen.add(p.productFamily)
      return true
    }
    return false
  })

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-widest">Best Sellers</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-800 mt-2">Our Top Products</h2>
          <p className="text-stone-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Most trusted products by temples, retailers and households across Tamil Nadu.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
