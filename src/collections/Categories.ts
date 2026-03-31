import type { CollectionConfig } from 'payload'

const generateSlug = (val: string) =>
  val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    group: 'Catalog',
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'depth', 'isActive', 'isFeatured'],
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
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: { description: 'Leave empty for top-level category' },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (emoji or key)',
    },
    {
      name: 'depth',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: '0 = root, 1 = sub, 2 = sub-sub',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'keywords', type: 'text' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Auto-set depth based on parent
        if (data.parent) {
          try {
            const parent = await req.payload.findByID({
              collection: 'categories',
              id: data.parent,
            })
            data.depth = ((parent.depth as number) ?? 0) + 1
          } catch {
            data.depth = 1
          }
        } else {
          data.depth = 0
        }
        return data
      },
    ],
  },
}
