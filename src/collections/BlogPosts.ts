import type { CollectionConfig } from 'payload'

const generateSlug = (val: string) =>
  val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'publishedAt'],
    preview: (doc) => `${process.env.NEXT_PUBLIC_APP_URL}/blog/${doc?.slug}`,
  },

  versions: {
    drafts: true,
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated from title.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Short summary shown on blog listing page.' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Recommended: 1200×630px.' },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Siva Sai Products',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: '📝 Draft',     value: 'draft' },
        { label: '✅ Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Google title. Max 60 characters.' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Google description. Max 160 characters.' },
        },
        {
          name: 'keywords',
          type: 'text',
        },
      ],
    },
  ],

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          data.slug = generateSlug(data.title)
        }
        return data
      },
    ],
  },
}
