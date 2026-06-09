import SiteLayout from '@/components/layout/SiteLayout'
import HeroBanner from '@/components/HeroBanner'
import StatsBar from '@/components/home/StatsBar'
import TopProducts from '@/components/home/TopProducts'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Features from '@/components/home/Features'
import Reviews from '@/components/home/Reviews'
import ContactCTA from '@/components/home/ContactCTA'
import BlogPreview from '@/components/home/BlogPreview'
import { getPayload } from '@/lib/getPayload'
import { getERPProducts } from '@/lib/erpProducts'
import type { CmsBannerSlide, CmsCategory } from '@/lib/types'
import type { CmsBlogPost } from '@/components/home/BlogPreview'

const OVERLAYS = [
  'from-orange-900/80 via-orange-800/60 to-transparent',
  'from-amber-900/80 via-amber-800/60 to-transparent',
  'from-red-900/80 via-red-800/60 to-transparent',
]

export default async function HomePage() {
  const payload = await getPayload()

  const [
    { docs: bannerDocs },
    { docs: blogDocs },
    catalog,
  ] = await Promise.all([
    payload.find({ collection: 'banners', where: { isActive: { equals: true } }, sort: 'sortOrder', limit: 10 }),
    payload.find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', depth: 1, limit: 3 }),
    getERPProducts(),
  ])

  const slides: CmsBannerSlide[] = (bannerDocs as any[]).map((b, i) => ({
    id: b.id,
    tag: b.tag ?? null,
    heading: b.title,
    subheading: b.subtitle ?? null,
    cta: b.ctaText ?? null,
    href: b.ctaLink ?? null,
    imageUrl: typeof b.image === 'object' ? b.image?.url ?? null : null,
    overlay: OVERLAYS[i % OVERLAYS.length],
  }))

  const categories: CmsCategory[] = [
    { id: 'all', name: 'All Products', slug: 'all' },
    ...catalog.categories,
  ]

  const blogPosts: CmsBlogPost[] = (blogDocs as any[]).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? null,
    coverImageUrl: typeof p.coverImage === 'object' ? p.coverImage?.url ?? null : null,
    author: p.author ?? null,
    publishedAt: p.publishedAt ?? null,
  }))

  return (
    <SiteLayout>
      <HeroBanner slides={slides} />
      <StatsBar />
      <TopProducts products={catalog.products.slice(0, 10)} />
      <FeaturedProducts products={catalog.products} categories={categories} />
      <Features />
      <BlogPreview posts={blogPosts} />
      <Reviews />
      <ContactCTA />
    </SiteLayout>
  )
}
