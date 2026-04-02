import TopBar from './TopBar'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
