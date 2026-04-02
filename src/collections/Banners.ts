import type { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'isActive', 'sortOrder'],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Recommended size: 1440×500px.',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Button Text',
      admin: { description: 'Example: Shop Now  |  View Products' },
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'CTA Link URL',
      admin: { description: 'Example: /products  |  /contact' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Uncheck to hide from the hero slider.' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower number = appears first in slider.' },
    },
  ],
}
