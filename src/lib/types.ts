export type CmsProduct = {
  id: number | string
  name: string
  slug: string
  shortDescription?: string | null
  imageUrl?: string | null
  categoryName?: string | null
  categorySlug?: string | null
}

export type CmsCategory = {
  id: number | string
  name: string
  slug: string
  icon?: string | null
  parentId?: number | string | null
}

export type CmsBannerSlide = {
  id: number | string
  tag?: string | null
  heading: string
  subheading?: string | null
  cta?: string | null
  href?: string | null
  imageUrl?: string | null
  overlay: string
}

export function toProduct(p: any): CmsProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription ?? null,
    imageUrl: p.images?.[0]?.image?.url ?? null,
    categoryName: typeof p.category === 'object' ? p.category?.name : null,
    categorySlug: typeof p.category === 'object' ? p.category?.slug : null,
  }
}
