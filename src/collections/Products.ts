import type { CollectionConfig } from 'payload'

const generateSlug = (val: string) =>
  val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    group: 'Catalog',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'isActive', 'isFeatured', 'isTrending'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (data?.name) return generateSlug(data.name)
            return value
          },
        ],
      },
    },
    {
      name: 'sku',
      type: 'text',
      label: 'SKU',
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
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'ingredients',
      type: 'textarea',
    },
    {
      name: 'usageInstructions',
      type: 'textarea',
    },
    // Pricing
    {
      name: 'basePrice',
      type: 'number',
      label: 'Base Price (₹)',
    },
    {
      name: 'comparePrice',
      type: 'number',
      label: 'Compare Price (₹)',
      admin: { description: 'Strikethrough price shown to customers' },
    },
    {
      name: 'costPrice',
      type: 'number',
      label: 'Cost Price (₹)',
      admin: { description: 'Internal only — not shown to customers' },
    },
    {
      name: 'gstRate',
      type: 'select',
      label: 'GST Rate (%)',
      options: [
        { label: '0%', value: '0' },
        { label: '5%', value: '5' },
        { label: '12%', value: '12' },
        { label: '18%', value: '18' },
        { label: '28%', value: '28' },
      ],
    },
    // Flags
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isTrending',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isFrequentlyBought',
      type: 'checkbox',
      defaultValue: false,
      label: 'Frequently Bought Together',
    },
    {
      name: 'hasVariants',
      type: 'checkbox',
      defaultValue: false,
    },
    // Images
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'alt', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'caption', type: 'text' },
      ],
    },
    // SEO
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'keywords', type: 'text' },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    // Stats (read-only)
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'enquiryCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    // Inventory (Phase 2 ready)
    {
      name: 'trackInventory',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'stockQuantity',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'stockStatus',
      type: 'select',
      defaultValue: 'in_stock',
      options: [
        { label: 'In Stock', value: 'in_stock' },
        { label: 'Out of Stock', value: 'out_of_stock' },
        { label: 'On Order', value: 'on_order' },
      ],
    },
    {
      name: 'weightGrams',
      type: 'number',
      label: 'Weight (grams)',
    },
    {
      name: 'requiresShipping',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
