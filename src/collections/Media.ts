import type { CollectionConfig } from 'payload'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'

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
    {
      name: 'cloudinaryId',
      type: 'text',
      label: 'Cloudinary Public ID',
      admin: {
        readOnly: true,
        description: 'Auto-populated after upload to Cloudinary.',
      },
    },
  ],

  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create' || !doc.filename || doc.cloudinaryId) return doc
        if (!process.env.CLOUDINARY_CLOUD_NAME) return doc

        try {
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key:    process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          })

          const filePath = path.join(process.cwd(), 'public', 'media', doc.filename)
          const result = await cloudinary.uploader.upload(filePath, {
            folder: 'siva-sai-products',
            use_filename: false,
            unique_filename: true,
          })

          await req.payload.update({
            collection: 'media',
            id: doc.id,
            data: { cloudinaryId: result.public_id },
            overrideAccess: true,
          })

          return { ...doc, cloudinaryId: result.public_id }
        } catch (err) {
          console.error('[Cloudinary upload error]', err)
          return doc
        }
      },
    ],
  },
}
