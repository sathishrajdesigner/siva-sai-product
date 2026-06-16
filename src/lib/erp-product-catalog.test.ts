import { describe, expect, it } from 'vitest'
import { buildPublicCatalog, PUBLIC_PRODUCT_SOURCE } from './erp-product-catalog'

describe('public ERP catalog', () => {
  it('uses the restricted Supabase view', () => {
    expect(PUBLIC_PRODUCT_SOURCE).toBe('website_products')
  })

  it('maps public rows into storefront products and unique categories', () => {
    const rows = [
      {
        id: 'product-1',
        name: 'Temple Oil 500 ml',
        category: 'Liquid',
        image_url: 'product-images/oil.webp',
        updated_at: '2026-06-15T00:00:00.000Z',
      },
      {
        id: 'product-2',
        name: 'Rose Water',
        category: 'Liquid',
        image_url: null,
        updated_at: '2026-06-15T00:00:00.000Z',
      },
    ]

    const catalog = buildPublicCatalog(rows, (value) => value ? `/media/${value}` : null)

    expect(catalog.products).toHaveLength(2)
    expect(catalog.products[0]).toMatchObject({
      slug: 'temple-oil-500-ml',
      categorySlug: 'liquid',
      imageUrl: '/media/product-images/oil.webp',
    })
    expect(catalog.categories).toEqual([{ id: 'liquid', name: 'Liquid', slug: 'liquid' }])
  })
})
