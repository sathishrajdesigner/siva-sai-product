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

const appURL = process.env.NEXT_PUBLIC_APP_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

const corsOrigins = [
  'http://localhost:3000',
  appURL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  // Canonical Vercel domain for this project
  'https://siva-sai-products.vercel.app',
].filter((v): v is string => !!v)
  .filter((v, i, a) => a.indexOf(v) === i)

export default buildConfig({
  serverURL: appURL,
  cors: corsOrigins,
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
      max: 3,
    },
  }),
  typescript: {
    outputFile: 'src/payload-types.ts',
  },
  secret: process.env.PAYLOAD_SECRET ?? '',
})
