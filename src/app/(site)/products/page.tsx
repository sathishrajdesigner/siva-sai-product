import SiteLayout from '@/components/layout/SiteLayout'
import ProductsClient from './ProductsClient'
import { getERPProducts } from '@/lib/erpProducts'
import type { CmsCategory } from '@/lib/types'

export default async function ProductsPage() {
  const catalog = await getERPProducts()
  const categories: CmsCategory[] = [
    { id: 'all', name: 'All Products', slug: 'all' },
    ...catalog.categories,
  ]

  return (
    <SiteLayout>
      <ProductsClient products={catalog.products} categories={categories} />
    </SiteLayout>
  )
}
