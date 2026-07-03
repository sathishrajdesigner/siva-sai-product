import { createERPClient } from './supabase'
import type { CmsCategory, CmsProduct } from './types'

type ERPProduct = {
  id: string
  name: string
  category: string
  image_url: string | null
  updated_at: string
}

// One row per active, website-visible pack variant (a product with 3 packs
// returns 3 rows) — this site doesn't show pack/price yet, so rows are
// deduplicated back down to one per product below. The view deliberately
// doesn't expose mrp (Task 2.5 — price stays private until the operator
// confirms otherwise).
type WebsiteProductVariantRow = {
  id: string
  name: string
  category: string
  variant_id: string
  unit: string
  image_url: string | null
  updated_at: string
}

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export async function getERPProducts(): Promise<{
  products: CmsProduct[]
  categories: CmsCategory[]
  rows: ERPProduct[]
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { products: [], categories: [], rows: [] }
  }

  // website_products already applies the active/website-visible/RLS
  // filtering ERP intends for public visibility — read the view, not the
  // base table (querying erp_products directly only worked because anon RLS
  // happened to filter rows the same way).
  //
  // Cached for 5 minutes and invalidated instantly by the ERP's signed
  // "product changed" webhook (see app/api/revalidate-catalog/route.ts) —
  // every visitor previously hit Supabase directly on every request.
  const { data, error } = await createERPClient({ revalidate: 300, tags: ['erp-products'] })
    .from('website_products')
    .select('id,name,category,variant_id,unit,image_url,updated_at')
    .order('category')
    .order('name')

  if (error) throw new Error(`Could not load ERP products: ${error.message}`)

  const variantRows = (data ?? []) as WebsiteProductVariantRow[]
  const seenProductIds = new Set<string>()
  const rows: ERPProduct[] = []
  for (const row of variantRows) {
    if (seenProductIds.has(row.id)) continue
    seenProductIds.add(row.id)
    rows.push({ id: row.id, name: row.name, category: row.category, image_url: row.image_url, updated_at: row.updated_at })
  }
  const products: CmsProduct[] = rows.map((product) => ({
    id: product.id,
    name: product.name,
    slug: slugify(product.name),
    imageUrl: product.image_url,
    categoryName: product.category,
    categorySlug: slugify(product.category),
  }))

  const categoryNames = [...new Set(rows.map((product) => product.category))]
  const categories: CmsCategory[] = categoryNames.map((name) => ({
    id: slugify(name),
    name,
    slug: slugify(name),
  }))

  return { products, categories, rows }
}
