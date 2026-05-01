import SiteLayout from '@/components/layout/SiteLayout'
import ProductsClient from './ProductsClient'
import { getPayload } from '@/lib/getPayload'
import { toProduct } from '@/lib/types'
import type { CmsCategory } from '@/lib/types'

export default async function ProductsPage() {
  const payload = await getPayload()

  const [{ docs: productDocs }, { docs: categoryDocs }] = await Promise.all([
    payload.find({ collection: 'products', where: { isActive: { equals: true } }, depth: 1, limit: 500 }),
    payload.find({ collection: 'categories', where: { isActive: { equals: true } }, sort: 'sortOrder', limit: 100 }),
  ])

  const products = (productDocs as any[]).map(toProduct)

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

  return (
    <SiteLayout>
      <ProductsClient products={products} categories={categories} />
    </SiteLayout>
  )
}
