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

type CmsProductDocument = {
  id: number | string
  name: string
  slug: string
  shortDescription?: string | null
  images?: Array<{ image?: { url?: string | null } | number | string | null }> | null
  category?: { name?: string | null; slug?: string | null } | number | string | null
}

export function toProduct(p: CmsProductDocument): CmsProduct {
  const image = p.images?.[0]?.image

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription ?? null,
    imageUrl: typeof image === 'object' && image ? image.url ?? null : null,
    categoryName: typeof p.category === 'object' ? p.category?.name : null,
    categorySlug: typeof p.category === 'object' ? p.category?.slug : null,
  }
}
