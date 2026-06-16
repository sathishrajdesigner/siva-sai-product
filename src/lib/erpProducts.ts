import { unstable_cache } from 'next/cache'
import {
  buildPublicCatalog,
  PUBLIC_PRODUCT_SOURCE,
  type PublicERPProduct,
} from './erp-product-catalog'
import { createERPClient } from './supabase'
import type { CmsCategory, CmsProduct } from './types'

const ERP_APP_URL = (process.env.NEXT_PUBLIC_ERP_URL || 'https://siva-sai-erp.vercel.app').replace(/\/$/, '')

function normalizeProductImageUrl(value: string | null) {
  if (!value) return null

  try {
    const url = new URL(value)
    if (url.pathname.startsWith('/product-images/')) {
      return `${ERP_APP_URL}/api/product-image?key=${encodeURIComponent(url.pathname.slice(1))}`
    }
  } catch {
    if (value.startsWith('product-images/')) {
      return `${ERP_APP_URL}/api/product-image?key=${encodeURIComponent(value)}`
    }
  }

  return value
}

type ERPCatalog = {
  products: CmsProduct[]
  categories: CmsCategory[]
  rows: PublicERPProduct[]
}

const loadERPProducts = async (): Promise<ERPCatalog> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { products: [], categories: [], rows: [] }
  }

  const { data, error } = await createERPClient()
    .from(PUBLIC_PRODUCT_SOURCE)
    .select('id,name,category,image_url,updated_at')
    .order('category')
    .order('name')

  if (error) throw new Error(`Could not load ERP products: ${error.message}`)

  const rows = (data ?? []) as PublicERPProduct[]
  const { products, categories } = buildPublicCatalog(rows, normalizeProductImageUrl)

  return { products, categories, rows }
}

export const getERPProducts = unstable_cache(
  loadERPProducts,
  ['erp-products'],
  {
    revalidate: 300,
    tags: ['erp-products'],
  },
)
