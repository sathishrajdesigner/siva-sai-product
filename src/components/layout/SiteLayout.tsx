import TopBar from './TopBar'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-md bg-stone-900 px-4 py-2 text-white focus:translate-y-0"
      >
        Skip to main content
      </a>
      <TopBar />
      <Header />
      <main className="flex-1" id="main-content">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
