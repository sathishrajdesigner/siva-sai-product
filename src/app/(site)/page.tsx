import SiteLayout from '@/components/layout/SiteLayout'
import HeroBanner from '@/components/HeroBanner'
import StatsBar from '@/components/home/StatsBar'
import TopProducts from '@/components/home/TopProducts'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Features from '@/components/home/Features'
import Reviews from '@/components/home/Reviews'
import ContactCTA from '@/components/home/ContactCTA'

export default function HomePage() {
  return (
    <SiteLayout>
      <HeroBanner />
      <StatsBar />
      <TopProducts />
      <FeaturedProducts />
      <Features />
      <Reviews />
      <ContactCTA />
    </SiteLayout>
  )
}
