import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Siva Sai Products — Wholesale Pooja Products, Hosur',
  description:
    'Siva Sai Products is a trusted manufacturer and wholesale supplier of camphor, pooja oils, vibhuti, kumkum and devotional products from Hosur, Tamil Nadu.',
  keywords: 'camphor manufacturer, pooja products wholesale, neem oil, deepam oil, vibhuti, kumkum, Hosur, Tamil Nadu',
}

export default function SiteRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}
