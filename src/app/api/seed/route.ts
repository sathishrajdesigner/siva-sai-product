/**
 * One-time seed endpoint. Populates categories and products from mock data.
 * Protected by PAYLOAD_SECRET to prevent unauthorized access.
 *
 * Usage: POST /api/seed  with header  Authorization: Bearer <PAYLOAD_SECRET>
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/getPayload'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  if (auth !== `Bearer ${process.env.PAYLOAD_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload()
  const log: string[] = []

  // ── Root Categories ──────────────────────────────────────────────────────
  const rootCatData = [
    { name: 'Oils',         slug: 'oils',         icon: '🫙', sortOrder: 10 },
    { name: 'Camphor',      slug: 'camphor',       icon: '✨', sortOrder: 20 },
    { name: 'Vibhuti',      slug: 'vibhuti',       icon: '🙏', sortOrder: 30 },
    { name: 'Kumkum',       slug: 'kumkum',        icon: '🔴', sortOrder: 40 },
    { name: 'Pooja Powder', slug: 'pooja-powder',  icon: '🌸', sortOrder: 50 },
    { name: 'Paneer Water', slug: 'paneer-water',  icon: '🌹', sortOrder: 60 },
  ]

  const rootCatIds: Record<string, number> = {}

  for (const cat of rootCatData) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: cat.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      rootCatIds[cat.slug] = existing.docs[0].id as number
      log.push(`skip category: ${cat.name}`)
      continue
    }
    const created = await payload.create({
      collection: 'categories',
      data: { name: cat.name, slug: cat.slug, icon: cat.icon, sortOrder: cat.sortOrder, isActive: true, depth: 0 },
    })
    rootCatIds[cat.slug] = created.id as number
    log.push(`created category: ${cat.name}`)
  }

  // ── Sub-categories ───────────────────────────────────────────────────────
  const subCatData = [
    { name: 'Pooja Oils',    slug: 'pooja-oils',    parent: 'oils',    sortOrder: 11 },
    { name: 'Castor Oils',   slug: 'castor-oils',   parent: 'oils',    sortOrder: 12 },
    { name: 'Neem Oils',     slug: 'neem-oils',     parent: 'oils',    sortOrder: 13 },
    { name: 'Jar Camphor',   slug: 'jar-camphor',   parent: 'camphor', sortOrder: 21 },
    { name: 'Katti Camphor', slug: 'katti-camphor', parent: 'camphor', sortOrder: 22 },
  ]

  const subCatIds: Record<string, number> = {}

  for (const cat of subCatData) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: cat.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      subCatIds[cat.slug] = existing.docs[0].id as number
      log.push(`skip sub-category: ${cat.name}`)
      continue
    }
    const created = await payload.create({
      collection: 'categories',
      data: {
        name: cat.name,
        slug: cat.slug,
        parent: rootCatIds[cat.parent],
        sortOrder: cat.sortOrder,
        isActive: true,
        depth: 1,
      },
    })
    subCatIds[cat.slug] = created.id as number
    log.push(`created sub-category: ${cat.name}`)
  }

  // ── Products ─────────────────────────────────────────────────────────────
  const productData = [
    {
      name: 'Pooja Oil',     slug: 'pooja-oil',
      category: subCatIds['pooja-oils'] || rootCatIds['oils'],
      shortDescription: 'Premium deepam oil for pooja lamps and daily rituals. Available in 200ml, 500ml, 1L and 5L.',
      isTrending: true, isFeatured: true,
    },
    {
      name: 'Castor Oil',    slug: 'castor-oil',
      category: subCatIds['castor-oils'] || rootCatIds['oils'],
      shortDescription: 'Pure castor oil for pooja lamps and household use. Available in 100ml, 250ml, 500ml and 1L.',
      isTrending: true, isFeatured: true,
    },
    {
      name: 'Neem Oil',      slug: 'neem-oil',
      category: subCatIds['neem-oils'] || rootCatIds['oils'],
      shortDescription: 'Cold-pressed neem oil for pooja lamps and medicinal use. Available in 100ml, 250ml, 500ml and 1L.',
      isTrending: true, isFeatured: true,
    },
    {
      name: 'Jar Camphor',   slug: 'jar-camphor',
      category: subCatIds['jar-camphor'] || rootCatIds['camphor'],
      shortDescription: 'Premium camphor tablets in sealed jar for pooja and aromatherapy. Available in 100g to 1kg.',
      isTrending: true, isFeatured: true,
    },
    {
      name: 'Katti Camphor', slug: 'katti-camphor',
      category: subCatIds['katti-camphor'] || rootCatIds['camphor'],
      shortDescription: 'Traditional block camphor for temples and bulk pooja use. Available in 100g to 1kg.',
      isTrending: false, isFeatured: true,
    },
    {
      name: 'Vibhuti',       slug: 'vibhuti',
      category: rootCatIds['vibhuti'],
      shortDescription: 'Sacred holy ash for daily pooja, tilak and blessings. Available in 50g, 100g, 250g and 500g.',
      isTrending: true, isFeatured: true,
    },
    {
      name: 'Kumkum',        slug: 'kumkum',
      category: rootCatIds['kumkum'],
      shortDescription: 'Bright red kumkum powder for tilak, pooja and festive rituals. Available in 25g to 250g.',
      isTrending: false, isFeatured: true,
    },
    {
      name: 'Pooja Powder',  slug: 'pooja-powder',
      category: rootCatIds['pooja-powder'],
      shortDescription: 'Aromatic pooja powder blend for daily worship. Available in 100g, 250g and 500g.',
      isTrending: false, isFeatured: false,
    },
    {
      name: 'Paneer Water',  slug: 'paneer-water',
      category: rootCatIds['paneer-water'],
      shortDescription: 'Natural paneer rose water for pooja offerings and skincare. Available in 100ml to 500ml.',
      isTrending: false, isFeatured: false,
    },
  ]

  for (const p of productData) {
    const existing = await payload.find({ collection: 'products', where: { slug: { equals: p.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      log.push(`skip product: ${p.name}`)
      continue
    }
    await payload.create({
      collection: 'products',
      data: {
        name: p.name,
        slug: p.slug,
        category: p.category,
        shortDescription: p.shortDescription,
        isTrending: p.isTrending,
        isFeatured: p.isFeatured,
        isActive: true,
        stockStatus: 'in_stock',
        _status: 'published',
      },
    })
    log.push(`created product: ${p.name}`)
  }

  return NextResponse.json({ success: true, log })
}
