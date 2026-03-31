import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Categories } from './src/collections/Categories'
import { Products } from './src/collections/Products'
import { ProductVariants } from './src/collections/ProductVariants'
import { Enquiries } from './src/collections/Enquiries'
import { Banners } from './src/collections/Banners'
import { BlogPosts } from './src/collections/BlogPosts'
import { Media } from './src/collections/Media'
import { Users } from './src/collections/Users'
import { SiteSettings } from './src/globals/SiteSettings'

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Siva Sai Admin',
    },
  },
  collections: [
    Categories,
    Products,
    ProductVariants,
    Enquiries,
    Banners,
    BlogPosts,
    Media,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI as string,
    },
  }),
  typescript: {
    outputFile: 'src/payload-types.ts',
  },
  secret: process.env.PAYLOAD_SECRET as string,
})
