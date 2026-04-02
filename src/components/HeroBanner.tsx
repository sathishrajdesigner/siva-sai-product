'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa6'

const slides = [
  {
    id: 1,
    tag: 'Manufacturer & Wholesaler',
    heading: 'Pure Camphor\nFor Every Ritual',
    subheading: 'Factory-direct camphor tablets of the highest purity. Trusted by temples and retailers across Tamil Nadu.',
    cta: 'Explore Products',
    href: '/products',
    image: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1400&q=80&auto=format&fit=crop',
    overlay: 'from-orange-900/80 via-orange-800/60 to-transparent',
  },
  {
    id: 2,
    tag: 'Wholesale Pooja Oils',
    heading: 'Sacred Oils\nFor Your Lamps',
    subheading: 'Neem oil, castor oil and deepam oil — cold-pressed and pure. Available in bulk for retailers and distributors.',
    cta: 'View Oils',
    href: '/products?category=oils',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1400&q=80&auto=format&fit=crop',
    overlay: 'from-amber-900/80 via-amber-800/60 to-transparent',
  },
  {
    id: 3,
    tag: 'Complete Pooja Range',
    heading: 'Vibhuti, Kumkum\n& More',
    subheading: 'One-stop wholesale source for all your pooja product needs — packaged under the trusted Siva Sai brand.',
    cta: 'Get a Quote',
    href: '/contact',
    image: 'https://images.unsplash.com/photo-1545093149-618ce3bcf49d?w=1400&q=80&auto=format&fit=crop',
    overlay: 'from-red-900/80 via-red-800/60 to-transparent',
  },
]

export default function HeroBanner() {
  const [current, setCurrent]   = useState(0)
  const [paused, setPaused]     = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [paused])

  const slide = slides[current]

  return (
    <section
      className="relative h-[520px] md:h-[600px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Only render adjacent slides to avoid loading all 3 at once */}
          {Math.abs(i - current) <= 1 && (
            <Image
              src={s.image}
              alt={s.heading.replace('\n', ' ')}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          )}
        </div>
      ))}

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay} transition-all duration-700`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-white">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider border border-white/30">
            {slide.tag}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight whitespace-pre-line mb-4 drop-shadow-sm">
            {slide.heading}
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-xl leading-relaxed mb-8">
            {slide.subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={slide.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg"
            >
              {slide.cta}
              <FaArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 text-white/60 text-sm font-medium">
        {current + 1} / {slides.length}
      </div>
    </section>
  )
}
