import type { CollectionConfig } from 'payload'

const generateSlug = (val: string) =>
  val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const Products: CollectionConfig = {
  slug: 'products',

  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'category', 'stockStatus', 'isFeatured', 'isTrending', 'enquiryCount'],
    listSearchableFields: ['name', 'slug', 'sku'],
    preview: (doc) => `${process.env.NEXT_PUBLIC_APP_URL}/products/${doc?.slug}`,
  },

  versions: {
    drafts: true,
  },

  fields: [
    // ── TABS ──────────────────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [

        // ── BASIC INFO ─────────────────────────────────────────────────
        {
          label: 'Basic Info',
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              admin: {
                readOnly: true,
                description: 'Auto-generated from name.',
              },
            },
            {
              name: 'sku',
              type: 'text',
              label: 'SKU',
              admin: { description: 'Example: SSP-OIL-001' },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              required: true,
              hasMany: false,
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              admin: { description: 'Shown on product card. Max 150 characters.' },
            },
            {
              name: 'description',
              type: 'richText',
              admin: { description: 'Full product description shown on product detail page.' },
            },
            {
              name: 'ingredients',
              type: 'textarea',
              admin: { description: 'Ingredients list — important for pooja items.' },
            },
            {
              name: 'usageInstructions',
              type: 'textarea',
              admin: { description: 'How to use this product.' },
            },
          ],
        },

        // ── PRICING ────────────────────────────────────────────────────
        {
          label: 'Pricing',
          fields: [
            {
              name: 'basePrice',
              type: 'number',
              label: 'Selling Price (₹)',
              admin: { description: 'Leave empty if product uses variants with individual prices.' },
            },
            {
              name: 'comparePrice',
              type: 'number',
              label: 'Compare Price (₹)',
              admin: { description: 'Original price shown as strikethrough.' },
            },
            {
              name: 'costPrice',
              type: 'number',
              label: 'Cost Price (₹)',
              admin: { description: 'Internal only — never shown to customers.' },
            },
            {
              name: 'gstRate',
              type: 'select',
              label: 'GST Rate',
              defaultValue: '0',
              options: [
                { label: '0% GST',  value: '0' },
                { label: '5% GST',  value: '5' },
                { label: '12% GST', value: '12' },
                { label: '18% GST', value: '18' },
                { label: '28% GST', value: '28' },
              ],
              admin: { description: 'Used in Phase 2 billing and invoices.' },
            },
          ],
        },

        // ── VARIANTS ───────────────────────────────────────────────────
        {
          label: 'Variants',
          fields: [
            {
              name: 'hasVariants',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Turn ON if this product has multiple sizes (100ml, 250ml, 500ml) or variants.',
              },
            },
            {
              name: 'variants',
              type: 'relationship',
              relationTo: 'product-variants',
              hasMany: true,
              admin: {
                description: 'Create variants in Product Variants first, then link them here.',
              },
            },
          ],
        },

        // ── IMAGES ─────────────────────────────────────────────────────
        {
          label: 'Images',
          fields: [
            {
              name: 'images',
              type: 'array',
              minRows: 1,
              admin: {
                description: 'Upload product images. First image is the main image on the website. Max 6.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'alt',
                  type: 'text',
                  admin: { description: 'Describe the image for SEO. Example: Neem Oil 100ml bottle' },
                },
              ],
            },
          ],
        },

        // ── INVENTORY ──────────────────────────────────────────────────
        {
          label: 'Inventory',
          fields: [
            {
              name: 'trackInventory',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Turn ON to track stock quantity. Phase 2 feature.' },
            },
            {
              name: 'stockQuantity',
              type: 'number',
              defaultValue: 0,
              admin: { description: 'Current stock quantity.' },
            },
            {
              name: 'lowStockThreshold',
              type: 'number',
              defaultValue: 10,
              admin: { description: 'Alert when stock falls below this number.' },
            },
            {
              name: 'stockStatus',
              type: 'select',
              defaultValue: 'in_stock',
              options: [
                { label: '✅ In Stock',     value: 'in_stock' },
                { label: '❌ Out of Stock', value: 'out_of_stock' },
                { label: '🔄 On Order',     value: 'on_order' },
              ],
            },
            {
              name: 'weightGrams',
              type: 'number',
              label: 'Weight (grams)',
              admin: { description: 'Used for shipping calculation in Phase 2.' },
            },
          ],
        },

        // ── SEO ────────────────────────────────────────────────────────
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'SEO Settings',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: { description: 'Google title. Max 60 chars. Leave empty to use product name.' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: { description: 'Google description. Max 160 characters.' },
                },
                {
                  name: 'keywords',
                  type: 'text',
                  admin: { description: 'Example: camphor tablets, pooja camphor, Hosur camphor' },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Social share image. 1200×630px. Leave empty to use first product image.' },
                },
              ],
            },
          ],
        },

      ],
    },

    // ── SIDEBAR FIELDS ────────────────────────────────────────────────
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to hide from website.',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in Featured Products section.',
      },
    },
    {
      name: 'isTrending',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in Trending / Top Products section on Home page.',
      },
    },
    {
      name: 'isFrequentlyBought',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in Frequently Bought section on Home page.',
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Total page views.',
      },
    },
    {
      name: 'enquiryCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Total enquiries received for this product.',
      },
    },
  ],

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.name && !data?.slug) {
          data.slug = generateSlug(data.name)
        }
        return data
      },
    ],
  },
}
