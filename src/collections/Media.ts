import { APIError, type CollectionConfig } from 'payload'

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

const webpFormat = {
  format: 'webp' as const,
  options: {
    quality: 82,
    effort: 4,
  },
}

export const Media: CollectionConfig = {
  slug: 'media',

  admin: {
    group: 'Content',
  },

  hooks: {
    beforeValidate: [
      ({ req }) => {
        if (req.file && req.file.size > MAX_UPLOAD_BYTES) {
          throw new APIError('Image is too large. Upload an image smaller than 15 MB.', 413)
        }
      },
    ],
  },

  upload: {
    staticDir: 'public/media',
    displayPreview: true,
    constructorOptions: {
      animated: true,
      failOn: 'none',
    },
    resizeOptions: {
      width: 2000,
      height: 2000,
      fit: 'inside',
      withoutEnlargement: true,
    },
    formatOptions: webpFormat,
    imageSizes: [
      {
        name: 'thumb',
        width: 150,
        height: 150,
        position: 'centre',
        withoutEnlargement: true,
        formatOptions: { ...webpFormat, options: { quality: 76, effort: 4 } },
      },
      {
        name: 'card',
        width: 400,
        height: 300,
        position: 'centre',
        withoutEnlargement: true,
        formatOptions: { ...webpFormat, options: { quality: 78, effort: 4 } },
      },
      {
        name: 'detail',
        width: 800,
        height: 600,
        position: 'centre',
        withoutEnlargement: true,
        formatOptions: { ...webpFormat, options: { quality: 82, effort: 4 } },
      },
    ],
    adminThumbnail: 'thumb',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
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
