import type { Metadata, Viewport } from 'next'
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://siva-sai-products.vercel.app'),
  title: {
    default: 'Siva Sai Products - Wholesale Pooja Products, Hosur',
    template: '%s | Siva Sai Products',
  },
  description:
    'Siva Sai Products is a trusted manufacturer and wholesale supplier of camphor, pooja oils, vibhuti, kumkum and devotional products from Hosur, Tamil Nadu.',
  keywords:
    'camphor manufacturer, pooja products wholesale, neem oil, deepam oil, vibhuti, kumkum, Hosur, Tamil Nadu',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Siva Sai Products',
    title: 'Siva Sai Products - Wholesale Pooja Products, Hosur',
    description:
      'Manufacturer and wholesale supplier of camphor, pooja oils, vibhuti, kumkum and devotional products from Hosur, Tamil Nadu.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siva Sai Products',
    description: 'Wholesale pooja products manufacturer and supplier in Hosur, Tamil Nadu.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ea580c',
}

export default function SiteRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}
