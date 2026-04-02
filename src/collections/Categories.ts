import type { CollectionConfig } from 'payload'

const generateSlug = (val: string) =>
  val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const Categories: CollectionConfig = {
  slug: 'categories',

  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'parent', 'isActive', 'sortOrder'],
    listSearchableFields: ['name', 'slug'],
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
      admin: {
        readOnly: true,
        description: 'Auto-generated from name. Do not edit manually.',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        description: 'Leave empty for root category. Select parent to make this a sub-category.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Emoji icon. Example: 🪔  🫙  ✨',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category thumbnail. Recommended: 400×300px.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower number = appears first. Use 10, 20, 30 for easy reordering.',
      },
    },
    {
      name: 'depth',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: '0 = Root category  1 = Sub-category. Auto-calculated.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Uncheck to hide this category from the website.',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show in Featured Categories section on the Home page.',
      },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Google page title. Max 60 characters.' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Google description. Max 160 characters.' },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: { description: 'Comma separated. Example: camphor, pooja oil, deepam' },
        },
      ],
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
