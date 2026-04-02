import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import '../globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: true,
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Siva Sai Products — Wholesale Pooja Products, Hosur',
  description:
    'Siva Sai Products is a trusted manufacturer and wholesale supplier of camphor, pooja oils, vibhuti, kumkum and devotional products from Hosur, Tamil Nadu.',
  keywords: 'camphor manufacturer, pooja products wholesale, neem oil, deepam oil, vibhuti, kumkum, Hosur, Tamil Nadu',
}

export default function SiteRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}
