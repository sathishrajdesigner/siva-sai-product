import { FaIndustry, FaAward, FaTruckFast, FaTags } from 'react-icons/fa6'

const features = [
  {
    icon: FaIndustry,
    title: 'Factory Direct',
    description: 'We manufacture camphor in-house, ensuring consistent quality and the best wholesale prices.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: FaAward,
    title: 'Pure & Trusted',
    description: 'All products are quality-checked before packaging. No adulteration, no compromise.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: FaTruckFast,
    title: 'Bulk Supply',
    description: 'We supply in bulk to temples, retailers, supermarkets and distributors across Tamil Nadu.',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    icon: FaTags,
    title: 'Custom Branding',
    description: 'Products available under the Siva Sai brand with custom labelling options for large orders.',
    color: 'text-stone-600',
    bg: 'bg-stone-100',
  },
]

export default function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-800 mt-2">Our Strengths</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="text-center p-6 rounded-2xl border border-stone-100 hover:border-orange-200 hover:shadow-sm transition-all group"
            >
              <div className={`w-16 h-16 ${f.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="font-bold text-stone-800 text-lg mb-2">{f.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
