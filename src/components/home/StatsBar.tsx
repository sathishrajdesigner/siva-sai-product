import { FaIndustry, FaBuildingColumns, FaBoxesStacked, FaHandshake } from 'react-icons/fa6'

const stats = [
  { icon: FaIndustry, value: '20+', label: 'Years in Business' },
  { icon: FaBuildingColumns, value: '200+', label: 'Temples Served' },
  { icon: FaBoxesStacked, value: '30+', label: 'Product SKUs' },
  { icon: FaHandshake, value: '500+', label: 'Wholesale Clients' },
]

export default function StatsBar() {
  return (
    <section className="bg-stone-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center shrink-0">
                <stat.icon className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-heading">{stat.value}</div>
                <div className="text-xs text-stone-400 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
