import type { MetadataRoute } from 'next'
import { getPayload } from '@/lib/getPayload'
import { getERPProducts } from '@/lib/erpProducts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')

  const [catalog, { docs: blogs }] = await Promise.all([
    getERPProducts(),
    payload.find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, limit: 200, depth: 0 }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: appUrl,                 lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${appUrl}/products`,   lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${appUrl}/blog`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${appUrl}/about`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${appUrl}/contact`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const productPages: MetadataRoute.Sitemap = catalog.products.map((product, index) => ({
    url: `${appUrl}/products/${product.slug}`,
    lastModified: new Date(catalog.rows[index].updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = (blogs as any[]).map((p) => ({
    url: `${appUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...blogPages]
}
