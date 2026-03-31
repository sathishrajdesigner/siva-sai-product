import type { CollectionConfig } from 'payload'

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',
  admin: {
    group: 'Catalog',
    useAsTitle: 'name',
    defaultColumns: ['product', 'name', 'price', 'stockStatus', 'isActive'],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: false,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. 250ml, 500g, Rose' },
    },
    {
      name: 'sku',
      type: 'text',
      label: 'SKU',
    },
    {
      name: 'price',
      type: 'number',
      label: 'Price (₹)',
      admin: { description: 'Leave empty to inherit product base price' },
    },
    {
      name: 'comparePrice',
      type: 'number',
      label: 'Compare Price (₹)',
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
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Default Variant',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
