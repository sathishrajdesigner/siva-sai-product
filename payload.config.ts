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
  serverURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  cors: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || '',
  ].filter(Boolean),
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: '— Siva Sai Admin',
      openGraph: {
        title: 'Siva Sai Products Admin',
      },
    },
    components: {
      graphics: {
        Logo: '/src/payload/components/Logo#default',
        Icon: '/src/payload/components/Icon#default',
      },
      beforeLogin: ['/src/payload/components/BeforeLogin#default'],
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
      connectionString: process.env.DATABASE_URI ?? '',
      ssl: { rejectUnauthorized: false },
    },
  }),
  typescript: {
    outputFile: 'src/payload-types.ts',
  },
  secret: process.env.PAYLOAD_SECRET ?? '',
})
