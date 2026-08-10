import TopBar from './TopBar'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import QuoteCartFab from '@/components/QuoteCartFab'
import { QuoteProvider } from '@/context/QuoteContext'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuoteProvider>
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <QuoteCartFab />
    </QuoteProvider>
  )
}
