import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  admin: {
    group: 'Content',
  },

  upload: {
    staticDir: 'public/media',
    imageSizes: [
      { name: 'thumb',  width: 150, height: 150, position: 'centre' },
      { name: 'card',   width: 400, height: 300, position: 'centre' },
      { name: 'detail', width: 800, height: 600, position: 'centre' },
    ],
    adminThumbnail: 'thumb',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
      admin: {
        description: 'Required for SEO and accessibility. Describe the image clearly.',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Image title for SEO (optional).' },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Caption shown below the image on the website (optional).' },
    },
  ],
}
