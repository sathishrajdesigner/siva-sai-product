import { unstable_noStore as noStore } from 'next/cache'
import { createERPClient } from './supabase'
import type { CmsCategory, CmsProduct } from './types'

type ERPProduct = {
  id: string
  name: string
  category: string
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
  noStore()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { products: [], categories: [], rows: [] }
  }

  const { data, error } = await createERPClient()
    .from('erp_products')
    .select('id,name,category,image_url,updated_at')
    .eq('active', true)
    .order('category')
    .order('name')

  if (error) throw new Error(`Could not load ERP products: ${error.message}`)

  const rows = (data ?? []) as ERPProduct[]
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
