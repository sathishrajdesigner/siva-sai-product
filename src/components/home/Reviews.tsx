import { FaStar, FaQuoteLeft, FaCircleCheck } from 'react-icons/fa6'

const reviews = [
  {
    id: 1,
    name: 'Murugan Temple Trust',
    location: 'Krishnagiri, TN',
    rating: 5,
    review: 'We have been sourcing camphor and deepam oil from Siva Sai Products for over 5 years. Consistent quality and reliable delivery every time.',
    initial: 'M',
    color: 'bg-orange-600',
  },
  {
    id: 2,
    name: 'Sri Lakshmi Stores',
    location: 'Hosur, TN',
    rating: 5,
    review: 'Best wholesale rates for vibhuti and kumkum in the region. The packaging is excellent and our customers love the quality.',
    initial: 'S',
    color: 'bg-red-600',
  },
  {
    id: 3,
    name: 'Puja Items Distributor',
    location: 'Bangalore, KA',
    rating: 5,
    review: 'Very professional team. Bulk orders are always fulfilled on time. Paneer water and pooja powder quality is top-notch.',
    initial: 'P',
    color: 'bg-amber-600',
  },
]

export default function Reviews() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-800 mt-2">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-stone-50 rounded-2xl p-6 border border-stone-100 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <FaQuoteLeft className="w-10 h-10 text-orange-100 absolute top-4 right-4" />
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <FaStar key={i} className="w-4 h-4 text-amber-400" />
                ))}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-5">
                &quot;{r.review}&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                <div className={`w-11 h-11 rounded-full ${r.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {r.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-stone-800 text-sm flex items-center gap-1.5">
                    {r.name}
                    <FaCircleCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">{r.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
