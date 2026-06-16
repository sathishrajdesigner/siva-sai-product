import type { CmsCategory, CmsProduct } from './types'

export const PUBLIC_PRODUCT_SOURCE = 'website_products'

export type PublicERPProduct = {
  id: string
  name: string
  category: string
  image_url: string | null
  updated_at: string
}

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function buildPublicCatalog(
  rows: PublicERPProduct[],
  normalizeImageUrl: (value: string | null) => string | null,
): { products: CmsProduct[]; categories: CmsCategory[] } {
  const products: CmsProduct[] = rows.map((product) => ({
    id: product.id,
    name: product.name,
    slug: slugify(product.name),
    imageUrl: normalizeImageUrl(product.image_url),
    categoryName: product.category,
    categorySlug: slugify(product.category),
  }))

  const categoryNames = [...new Set(rows.map((product) => product.category))]
  const categories: CmsCategory[] = categoryNames.map((name) => ({
    id: slugify(name),
    name,
    slug: slugify(name),
  }))

  return { products, categories }
}
