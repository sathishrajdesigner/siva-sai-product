import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'

export const metadata = {
  title: 'About Us — Siva Sai Products',
  description: 'Learn about Siva Sai Products — camphor manufacturer and wholesale pooja items supplier from Hosur, Tamil Nadu.',
}

export default function AboutPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 to-amber-500 py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-white/80 text-lg">
            Trusted manufacturer and wholesale supplier of pooja products from Hosur, Tamil Nadu.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
            <h2 className="text-3xl font-bold text-stone-800 mt-2 mb-4">Who We Are</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Siva Sai Products is a Hosur-based manufacturer and wholesale distributor of devotional products. We specialise in camphor manufacturing and supply a wide range of pooja essentials including oils, vibhuti, kumkum, pooja powder and paneer water.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              What began as a small camphor manufacturing unit has grown into a trusted brand serving temples, retailers, supermarkets and distributors across Tamil Nadu and Karnataka.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Our products are packaged under the Siva Sai brand with a focus on purity, consistency and value — qualities that our customers have come to rely on.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🏭', label: 'Own Factory', value: 'Hosur, TN' },
              { icon: '📦', label: 'Products', value: '8+ SKUs' },
              { icon: '🏛️', label: 'Temples Served', value: '100+' },
              { icon: '📍', label: 'States', value: 'TN & KA' },
            ].map((stat) => (
              <div key={stat.label} className="bg-orange-50 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-bold text-stone-800 text-lg">{stat.value}</div>
                <div className="text-stone-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-stone-800 mb-3">Our Mission</h3>
            <p className="text-stone-600 leading-relaxed">
              To provide pure, high-quality pooja products at fair wholesale prices — making devotional essentials accessible for every home, temple and retail shop. We believe that purity in products reflects purity in devotion.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl mb-4">🌟</div>
            <h3 className="text-xl font-bold text-stone-800 mb-3">Our Vision</h3>
            <p className="text-stone-600 leading-relaxed">
              To become South India&apos;s most trusted brand for devotional products — expanding our manufacturing capabilities, growing our product range and building a seamless online platform for wholesale and retail customers nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Products overview */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="text-3xl font-bold text-stone-800 mt-2 mb-10">Our Product Range</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: '✨', name: 'Camphor', note: 'Manufactured in-house' },
              { icon: '🪔', name: 'Deepam Oil', note: 'For pooja lamps' },
              { icon: '🌿', name: 'Neem Oil', note: 'Cold-pressed pure' },
              { icon: '🫙', name: 'Castor Oil', note: 'Premium quality' },
              { icon: '🙏', name: 'Vibhuti', note: 'Sacred holy ash' },
              { icon: '🔴', name: 'Kumkum', note: 'Bright & pure' },
              { icon: '🌸', name: 'Pooja Powder', note: 'Aromatic blend' },
              { icon: '🌹', name: 'Paneer Water', note: 'Natural rose water' },
            ].map((item) => (
              <div key={item.name} className="bg-orange-50 rounded-xl p-4 text-center hover:bg-orange-100 transition-colors">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold text-stone-800 text-sm">{item.name}</div>
                <div className="text-stone-500 text-xs mt-0.5">{item.note}</div>
              </div>
            ))}
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 mt-10 px-8 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </SiteLayout>
  )
}
