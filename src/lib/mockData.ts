export type Product = {
  id: string
  name: string
  slug: string
  category: string
  subCategory: string
  productFamily: string
  description: string
  size: string
  image: string
  isFeatured?: boolean
  isTopProduct?: boolean
}

export type SubCategory = {
  id: string
  name: string
  slug: string
}

export type Category = {
  id: string
  name: string
  slug: string
  icon: string
  subCategories: SubCategory[]
}

export const categories: Category[] = [
  {
    id: 'all',
    name: 'All Products',
    slug: 'all',
    icon: '🛍️',
    subCategories: [],
  },
  {
    id: 'oils',
    name: 'Oils',
    slug: 'oils',
    icon: '🫙',
    subCategories: [
      { id: 'pooja-oils', name: 'Pooja Oils', slug: 'pooja-oils' },
      { id: 'castor-oils', name: 'Castor Oils', slug: 'castor-oils' },
      { id: 'neem-oils', name: 'Neem Oils', slug: 'neem-oils' },
    ],
  },
  {
    id: 'camphor',
    name: 'Camphor',
    slug: 'camphor',
    icon: '✨',
    subCategories: [
      { id: 'jar-camphor', name: 'Jar Camphor', slug: 'jar-camphor' },
      { id: 'katti-camphor', name: 'Katti Camphor', slug: 'katti-camphor' },
    ],
  },
  {
    id: 'vibhuti',
    name: 'Vibhuti',
    slug: 'vibhuti',
    icon: '🙏',
    subCategories: [],
  },
  {
    id: 'kumkum',
    name: 'Kumkum',
    slug: 'kumkum',
    icon: '🔴',
    subCategories: [],
  },
  {
    id: 'pooja-powder',
    name: 'Pooja Powder',
    slug: 'pooja-powder',
    icon: '🌸',
    subCategories: [],
  },
  {
    id: 'paneer-water',
    name: 'Paneer Water',
    slug: 'paneer-water',
    icon: '🌹',
    subCategories: [],
  },
]

// ─── Images ──────────────────────────────────────────────────────────────────

const IMG = {
  poojaOil:  'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&q=80&auto=format&fit=crop',
  poojaOil2: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80&auto=format&fit=crop',
  castorOil: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80&auto=format&fit=crop',
  neemOil:   'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80&auto=format&fit=crop',
  camphor:   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80&auto=format&fit=crop',
  vibhuti:   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop',
  kumkum:    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop',
  powder:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop',
  rose:      'https://images.unsplash.com/photo-1548940740-204726a19be3?w=400&q=80&auto=format&fit=crop',
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const products: Product[] = [

  // ── Pooja Oils (Deepam Oil) ──────────────────────────────────────────────
  { id: 'pooja-200',  name: 'Pooja Oil',  slug: 'pooja-oil-200ml',  category: 'oils', subCategory: 'pooja-oils', productFamily: 'pooja-oil', description: 'Premium deepam oil for pooja lamps and daily rituals.', size: '200 ml',    image: IMG.poojaOil,  isFeatured: true,  isTopProduct: true  },
  { id: 'pooja-500',  name: 'Pooja Oil',  slug: 'pooja-oil-500ml',  category: 'oils', subCategory: 'pooja-oils', productFamily: 'pooja-oil', description: 'Premium deepam oil for pooja lamps and daily rituals.', size: '500 ml',    image: IMG.poojaOil2, isFeatured: false, isTopProduct: false },
  { id: 'pooja-1l',   name: 'Pooja Oil',  slug: 'pooja-oil-1l',     category: 'oils', subCategory: 'pooja-oils', productFamily: 'pooja-oil', description: 'Premium deepam oil for pooja lamps and daily rituals.', size: '1 Litre',   image: IMG.poojaOil,  isFeatured: false, isTopProduct: false },
  { id: 'pooja-5l',   name: 'Pooja Oil',  slug: 'pooja-oil-5l',     category: 'oils', subCategory: 'pooja-oils', productFamily: 'pooja-oil', description: 'Premium deepam oil for pooja lamps and daily rituals.', size: '5 Litres',  image: IMG.poojaOil2, isFeatured: false, isTopProduct: false },

  // ── Castor Oils ──────────────────────────────────────────────────────────
  { id: 'castor-100', name: 'Castor Oil', slug: 'castor-oil-100ml', category: 'oils', subCategory: 'castor-oils', productFamily: 'castor-oil', description: 'Pure castor oil for pooja lamps and household use.', size: '100 ml',   image: IMG.castorOil, isFeatured: true,  isTopProduct: true  },
  { id: 'castor-250', name: 'Castor Oil', slug: 'castor-oil-250ml', category: 'oils', subCategory: 'castor-oils', productFamily: 'castor-oil', description: 'Pure castor oil for pooja lamps and household use.', size: '250 ml',   image: IMG.castorOil, isFeatured: false, isTopProduct: false },
  { id: 'castor-500', name: 'Castor Oil', slug: 'castor-oil-500ml', category: 'oils', subCategory: 'castor-oils', productFamily: 'castor-oil', description: 'Pure castor oil for pooja lamps and household use.', size: '500 ml',   image: IMG.castorOil, isFeatured: false, isTopProduct: false },
  { id: 'castor-1l',  name: 'Castor Oil', slug: 'castor-oil-1l',   category: 'oils', subCategory: 'castor-oils', productFamily: 'castor-oil', description: 'Pure castor oil for pooja lamps and household use.', size: '1 Litre',  image: IMG.castorOil, isFeatured: false, isTopProduct: false },

  // ── Neem Oils ────────────────────────────────────────────────────────────
  { id: 'neem-100',   name: 'Neem Oil',   slug: 'neem-oil-100ml',  category: 'oils', subCategory: 'neem-oils', productFamily: 'neem-oil', description: 'Cold-pressed neem oil for pooja lamps and medicinal use.', size: '100 ml',  image: IMG.neemOil, isFeatured: true,  isTopProduct: true  },
  { id: 'neem-250',   name: 'Neem Oil',   slug: 'neem-oil-250ml',  category: 'oils', subCategory: 'neem-oils', productFamily: 'neem-oil', description: 'Cold-pressed neem oil for pooja lamps and medicinal use.', size: '250 ml',  image: IMG.neemOil, isFeatured: false, isTopProduct: false },
  { id: 'neem-500',   name: 'Neem Oil',   slug: 'neem-oil-500ml',  category: 'oils', subCategory: 'neem-oils', productFamily: 'neem-oil', description: 'Cold-pressed neem oil for pooja lamps and medicinal use.', size: '500 ml',  image: IMG.neemOil, isFeatured: false, isTopProduct: false },
  { id: 'neem-1l',    name: 'Neem Oil',   slug: 'neem-oil-1l',     category: 'oils', subCategory: 'neem-oils', productFamily: 'neem-oil', description: 'Cold-pressed neem oil for pooja lamps and medicinal use.', size: '1 Litre', image: IMG.neemOil, isFeatured: false, isTopProduct: false },

  // ── Jar Camphor ──────────────────────────────────────────────────────────
  { id: 'jar-100',    name: 'Jar Camphor',   slug: 'jar-camphor-100g',  category: 'camphor', subCategory: 'jar-camphor',   productFamily: 'jar-camphor',   description: 'Premium camphor tablets in sealed jar — for pooja and aromatherapy.', size: '100 g', image: IMG.camphor, isFeatured: true,  isTopProduct: true  },
  { id: 'jar-250',    name: 'Jar Camphor',   slug: 'jar-camphor-250g',  category: 'camphor', subCategory: 'jar-camphor',   productFamily: 'jar-camphor',   description: 'Premium camphor tablets in sealed jar — for pooja and aromatherapy.', size: '250 g', image: IMG.camphor, isFeatured: false, isTopProduct: false },
  { id: 'jar-500',    name: 'Jar Camphor',   slug: 'jar-camphor-500g',  category: 'camphor', subCategory: 'jar-camphor',   productFamily: 'jar-camphor',   description: 'Premium camphor tablets in sealed jar — for pooja and aromatherapy.', size: '500 g', image: IMG.camphor, isFeatured: false, isTopProduct: false },
  { id: 'jar-1kg',    name: 'Jar Camphor',   slug: 'jar-camphor-1kg',   category: 'camphor', subCategory: 'jar-camphor',   productFamily: 'jar-camphor',   description: 'Premium camphor tablets in sealed jar — for pooja and aromatherapy.', size: '1 kg',  image: IMG.camphor, isFeatured: false, isTopProduct: false },

  // ── Katti Camphor ────────────────────────────────────────────────────────
  { id: 'katti-100',  name: 'Katti Camphor', slug: 'katti-camphor-100g', category: 'camphor', subCategory: 'katti-camphor', productFamily: 'katti-camphor', description: 'Traditional katti (block) camphor for temples and bulk pooja use.', size: '100 g', image: IMG.camphor, isFeatured: false, isTopProduct: false },
  { id: 'katti-250',  name: 'Katti Camphor', slug: 'katti-camphor-250g', category: 'camphor', subCategory: 'katti-camphor', productFamily: 'katti-camphor', description: 'Traditional katti (block) camphor for temples and bulk pooja use.', size: '250 g', image: IMG.camphor, isFeatured: false, isTopProduct: false },
  { id: 'katti-500',  name: 'Katti Camphor', slug: 'katti-camphor-500g', category: 'camphor', subCategory: 'katti-camphor', productFamily: 'katti-camphor', description: 'Traditional katti (block) camphor for temples and bulk pooja use.', size: '500 g', image: IMG.camphor, isFeatured: false, isTopProduct: false },
  { id: 'katti-1kg',  name: 'Katti Camphor', slug: 'katti-camphor-1kg',  category: 'camphor', subCategory: 'katti-camphor', productFamily: 'katti-camphor', description: 'Traditional katti (block) camphor for temples and bulk pooja use.', size: '1 kg',  image: IMG.camphor, isFeatured: false, isTopProduct: false },

  // ── Vibhuti ──────────────────────────────────────────────────────────────
  { id: 'vibhuti-50',  name: 'Vibhuti', slug: 'vibhuti-50g',  category: 'vibhuti', subCategory: 'vibhuti', productFamily: 'vibhuti', description: 'Sacred holy ash for daily pooja, tilak and blessings.', size: '50 g',  image: IMG.vibhuti, isFeatured: true,  isTopProduct: true  },
  { id: 'vibhuti-100', name: 'Vibhuti', slug: 'vibhuti-100g', category: 'vibhuti', subCategory: 'vibhuti', productFamily: 'vibhuti', description: 'Sacred holy ash for daily pooja, tilak and blessings.', size: '100 g', image: IMG.vibhuti, isFeatured: false, isTopProduct: false },
  { id: 'vibhuti-250', name: 'Vibhuti', slug: 'vibhuti-250g', category: 'vibhuti', subCategory: 'vibhuti', productFamily: 'vibhuti', description: 'Sacred holy ash for daily pooja, tilak and blessings.', size: '250 g', image: IMG.vibhuti, isFeatured: false, isTopProduct: false },
  { id: 'vibhuti-500', name: 'Vibhuti', slug: 'vibhuti-500g', category: 'vibhuti', subCategory: 'vibhuti', productFamily: 'vibhuti', description: 'Sacred holy ash for daily pooja, tilak and blessings.', size: '500 g', image: IMG.vibhuti, isFeatured: false, isTopProduct: false },

  // ── Kumkum ───────────────────────────────────────────────────────────────
  { id: 'kumkum-25',  name: 'Kumkum', slug: 'kumkum-25g',  category: 'kumkum', subCategory: 'kumkum', productFamily: 'kumkum', description: 'Bright red kumkum powder for tilak, pooja and festive rituals.', size: '25 g',  image: IMG.kumkum, isFeatured: true,  isTopProduct: false },
  { id: 'kumkum-50',  name: 'Kumkum', slug: 'kumkum-50g',  category: 'kumkum', subCategory: 'kumkum', productFamily: 'kumkum', description: 'Bright red kumkum powder for tilak, pooja and festive rituals.', size: '50 g',  image: IMG.kumkum, isFeatured: false, isTopProduct: false },
  { id: 'kumkum-100', name: 'Kumkum', slug: 'kumkum-100g', category: 'kumkum', subCategory: 'kumkum', productFamily: 'kumkum', description: 'Bright red kumkum powder for tilak, pooja and festive rituals.', size: '100 g', image: IMG.kumkum, isFeatured: false, isTopProduct: false },
  { id: 'kumkum-250', name: 'Kumkum', slug: 'kumkum-250g', category: 'kumkum', subCategory: 'kumkum', productFamily: 'kumkum', description: 'Bright red kumkum powder for tilak, pooja and festive rituals.', size: '250 g', image: IMG.kumkum, isFeatured: false, isTopProduct: false },

  // ── Pooja Powder ─────────────────────────────────────────────────────────
  { id: 'ppowder-100', name: 'Pooja Powder', slug: 'pooja-powder-100g', category: 'pooja-powder', subCategory: 'pooja-powder', productFamily: 'pooja-powder', description: 'Aromatic pooja powder blend for daily worship and special occasions.', size: '100 g', image: IMG.powder, isFeatured: false, isTopProduct: false },
  { id: 'ppowder-250', name: 'Pooja Powder', slug: 'pooja-powder-250g', category: 'pooja-powder', subCategory: 'pooja-powder', productFamily: 'pooja-powder', description: 'Aromatic pooja powder blend for daily worship and special occasions.', size: '250 g', image: IMG.powder, isFeatured: false, isTopProduct: false },
  { id: 'ppowder-500', name: 'Pooja Powder', slug: 'pooja-powder-500g', category: 'pooja-powder', subCategory: 'pooja-powder', productFamily: 'pooja-powder', description: 'Aromatic pooja powder blend for daily worship and special occasions.', size: '500 g', image: IMG.powder, isFeatured: false, isTopProduct: false },

  // ── Paneer Water ─────────────────────────────────────────────────────────
  { id: 'paneer-100', name: 'Paneer Water', slug: 'paneer-water-100ml', category: 'paneer-water', subCategory: 'paneer-water', productFamily: 'paneer-water', description: 'Natural paneer rose water for pooja offerings and skincare.', size: '100 ml', image: IMG.rose, isFeatured: false, isTopProduct: false },
  { id: 'paneer-200', name: 'Paneer Water', slug: 'paneer-water-200ml', category: 'paneer-water', subCategory: 'paneer-water', productFamily: 'paneer-water', description: 'Natural paneer rose water for pooja offerings and skincare.', size: '200 ml', image: IMG.rose, isFeatured: false, isTopProduct: false },
  { id: 'paneer-500', name: 'Paneer Water', slug: 'paneer-water-500ml', category: 'paneer-water', subCategory: 'paneer-water', productFamily: 'paneer-water', description: 'Natural paneer rose water for pooja offerings and skincare.', size: '500 ml', image: IMG.rose, isFeatured: false, isTopProduct: false },
]
