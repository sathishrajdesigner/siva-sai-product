import type { CollectionConfig } from 'payload'

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',

  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'product', 'price', 'stockStatus', 'isDefault', 'isActive'],
  },

  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: false,
      admin: {
        description: 'Which product does this variant belong to?',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Variant label. Example: 100ml  250ml  500g  1kg',
      },
    },
    {
      name: 'sku',
      type: 'text',
      label: 'SKU',
      admin: { description: 'Example: SSP-OIL-001-100ML' },
    },
    {
      name: 'price',
      type: 'number',
      label: 'Price (₹)',
      admin: { description: 'Leave empty to use the product base price.' },
    },
    {
      name: 'comparePrice',
      type: 'number',
      label: 'Compare Price (₹)',
      admin: { description: 'Original price shown as strikethrough.' },
    },
    {
      name: 'stockQuantity',
      type: 'number',
      defaultValue: 0,
      label: 'Stock Quantity',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional variant-specific image (e.g. different bottle size photo).',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Pre-selected when product page loads.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Uncheck to hide this variant.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower number = displayed first.' },
    },
  ],
}
