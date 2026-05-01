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
import { toProduct } from '@/lib/types'
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
    { docs: trendingDocs },
    { docs: featuredDocs },
    { docs: categoryDocs },
    { docs: blogDocs },
  ] = await Promise.all([
    payload.find({ collection: 'banners', where: { isActive: { equals: true } }, sort: 'sortOrder', limit: 10 }),
    payload.find({ collection: 'products', where: { and: [{ isTrending: { equals: true } }, { isActive: { equals: true } }] }, depth: 1, limit: 10 }),
    payload.find({ collection: 'products', where: { and: [{ isFeatured: { equals: true } }, { isActive: { equals: true } }] }, depth: 1, limit: 16 }),
    payload.find({ collection: 'categories', where: { isActive: { equals: true } }, sort: 'sortOrder', limit: 50 }),
    payload.find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', depth: 1, limit: 3 }),
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
    ...(categoryDocs as any[]).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon ?? null,
      parentId: typeof c.parent === 'object' ? c.parent?.id : (c.parent ?? null),
    })),
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
      <TopProducts products={(trendingDocs as any[]).map(toProduct)} />
      <FeaturedProducts products={(featuredDocs as any[]).map(toProduct)} categories={categories} />
      <Features />
      <BlogPreview posts={blogPosts} />
      <Reviews />
      <ContactCTA />
    </SiteLayout>
  )
}
