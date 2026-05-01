import ProductCard from '@/components/ProductCard'
import type { CmsProduct } from '@/lib/types'

type Props = {
  products: CmsProduct[]
}

export default function TopProducts({ products }: Props) {
  if (products.length === 0) return null

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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
