# Developer Architecture Documentation — Siva Sai Products
**Perspective: Senior Full-Stack Developer (20 Years Experience)**
**Date: May 2026**

---

## 1. Tech Stack Overview

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Next.js | 16.2.1 | Full-stack React framework (App Router) |
| CMS | Payload CMS | 3.80.0 | Headless CMS with admin panel |
| Database | PostgreSQL (Supabase) | Latest | Primary data store |
| ORM | Payload DB Postgres | 3.80.0 | Payload's pg adapter |
| Rich Text | Lexical | via Payload | Blog/product rich text editor |
| UI | React 19 + Tailwind CSS 4 | Latest | Component rendering + utility CSS |
| Icons | react-icons (FA6) | 5.6.0 | Font Awesome 6 icon set |
| Media Storage | Local FS → Cloudinary | — | Image storage & CDN |
| Deployment | Vercel | — | Serverless hosting |
| Language | TypeScript 5 | Latest | Type safety across stack |
| Runtime | Node.js 22 | 22.x | Server runtime |
| Package Manager | pnpm | — | Fast, disk-efficient package manager |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     VERCEL (Edge/Serverless)             │
│                                                          │
│  ┌─────────────────┐    ┌──────────────────────────┐    │
│  │  Next.js App    │    │   Payload CMS Admin       │    │
│  │  (App Router)   │    │   (/admin)                │    │
│  │                 │    │                           │    │
│  │  /(site)        │    │  - Products               │    │
│  │  ├── /          │    │  - Categories             │    │
│  │  ├── /products  │    │  - Banners                │    │
│  │  ├── /blog      │    │  - Blog Posts             │    │
│  │  ├── /about     │    │  - Media                  │    │
│  │  └── /contact   │    │  - Enquiries              │    │
│  │                 │    │  - Users                  │    │
│  │  /api           │    │  - Site Settings          │    │
│  │  ├── /enquiry   │    │                           │    │
│  │  └── /seed      │    └──────────────────────────┘    │
│  └────────┬────────┘                │                   │
│           │                         │                   │
│           └──────────┬──────────────┘                   │
│                      │ Payload Local API                 │
│                      ▼                                   │
│           ┌──────────────────┐                          │
│           │  PostgreSQL       │                          │
│           │  (Supabase)       │                          │
│           │  Port 5432        │                          │
│           └──────────────────┘                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
           ┌──────────────────────┐
           │  Cloudinary CDN       │
           │  (Media storage)      │
           └──────────────────────┘
```

---

## 3. Directory Structure

```
siva-sai-products/
├── src/
│   ├── app/
│   │   ├── (payload)/              # Payload admin routes
│   │   │   ├── admin/              # Admin panel pages
│   │   │   ├── actions.ts          # Server functions for admin
│   │   │   └── layout.tsx          # Payload root layout
│   │   ├── (site)/                 # Public website routes
│   │   │   ├── page.tsx            # Homepage (server component)
│   │   │   ├── about/page.tsx      # About page
│   │   │   ├── contact/page.tsx    # Contact page
│   │   │   ├── products/
│   │   │   │   ├── page.tsx        # Products listing (server)
│   │   │   │   └── ProductsClient.tsx  # Client-side filter UI
│   │   │   └── blog/
│   │   │       ├── page.tsx        # Blog listing (server)
│   │   │       └── [slug]/page.tsx # Blog detail (server)
│   │   ├── api/
│   │   │   ├── enquiry/route.ts    # POST enquiry form
│   │   │   └── seed/route.ts       # One-time data seed
│   │   ├── globals.css             # Tailwind base styles
│   │   └── favicon.ico
│   ├── collections/                # Payload collection schemas
│   │   ├── Products.ts
│   │   ├── ProductVariants.ts
│   │   ├── Categories.ts
│   │   ├── Banners.ts
│   │   ├── BlogPosts.ts
│   │   ├── Media.ts
│   │   ├── Enquiries.ts
│   │   └── Users.ts
│   ├── globals/
│   │   └── SiteSettings.ts         # Global site config
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SiteLayout.tsx
│   │   │   └── TopBar.tsx
│   │   ├── home/
│   │   │   ├── StatsBar.tsx
│   │   │   ├── TopProducts.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Reviews.tsx
│   │   │   ├── BlogPreview.tsx
│   │   │   └── ContactCTA.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── ProductCard.tsx
│   │   └── EnquiryModal.tsx
│   ├── lib/
│   │   ├── getPayload.ts           # Payload singleton getter
│   │   ├── types.ts                # Shared CMS frontend types
│   │   ├── categoryIcons.tsx       # FA6 icon map for categories
│   │   └── mockData.ts             # Legacy — can be removed
│   ├── payload/
│   │   └── components/             # Payload admin UI overrides
│   │       ├── Logo.tsx
│   │       ├── Icon.tsx
│   │       └── BeforeLogin.tsx
│   └── scripts/
│       └── seed.ts                 # Dev seed script (legacy)
├── docs/                           # Project documentation
├── payload.config.ts               # Payload CMS configuration
├── next.config.ts                  # Next.js configuration
├── .env.local                      # Local environment variables
└── vercel.json                     # Vercel deployment config
```

---

## 4. Data Model (Database Schema)

### Collections

#### `products`
| Field | Type | Notes |
|-------|------|-------|
| id | int (auto) | Primary key |
| name | text | Required |
| slug | text | Unique, auto-generated |
| sku | text | Optional |
| category | fk → categories | Required |
| shortDescription | text | For product cards |
| description | richText (Lexical) | Full description |
| ingredients | text | |
| usageInstructions | text | |
| basePrice | float | |
| comparePrice | float | |
| costPrice | float | Internal only |
| gstRate | select | 0/5/12/18/28% |
| hasVariants | bool | |
| variants | m2m → product_variants | |
| images | array | `[{image: fk→media, alt: text}]` |
| trackInventory | bool | |
| stockQuantity | int | |
| stockStatus | select | in_stock/out_of_stock/on_order |
| isActive | bool | Show/hide on site |
| isFeatured | bool | Featured Products section |
| isTrending | bool | Top Products section |
| isFrequentlyBought | bool | |
| viewCount | int | Read-only counter |
| enquiryCount | int | Read-only counter |
| meta.title | text | SEO |
| meta.description | text | SEO |
| _status | select | published/draft (Payload versions) |

#### `categories`
| Field | Type | Notes |
|-------|------|-------|
| id | int | PK |
| name | text | |
| slug | text | Unique |
| parent | fk → categories | Self-reference for subcategories |
| description | text | |
| icon | text | FA icon name or emoji |
| image | fk → media | |
| sortOrder | int | Display order |
| depth | int | 0=root, 1=sub |
| isActive | bool | |
| isFeatured | bool | |

#### `banners`
| Field | Type | Notes |
|-------|------|-------|
| id | int | PK |
| title | text | Hero heading |
| tag | text | Badge text above heading |
| subtitle | text | Subheading |
| image | fk → media | Required |
| ctaText | text | Button label |
| ctaLink | text | Button href |
| isActive | bool | |
| sortOrder | int | Slider order |

#### `blog-posts`
| Field | Type | Notes |
|-------|------|-------|
| id | int | PK |
| title | text | |
| slug | text | Unique |
| excerpt | text | Summary |
| coverImage | fk → media | |
| content | richText (Lexical) | Full content |
| author | text | Default: "Siva Sai Products" |
| status | select | draft/published |
| publishedAt | date | |
| _status | select | Payload draft system |

#### `enquiries`
| Field | Type | Notes |
|-------|------|-------|
| id | int | PK |
| name | text | From form (read-only in admin) |
| mobile | text | From form |
| email | email | From form |
| product | text | Product name |
| message | text | |
| source | text | Default: "website" |
| ipAddress | text | Captured by API |
| referrerUrl | text | Captured by API |
| status | select | new/contacted/converted/closed |
| adminNotes | text | Internal notes |
| contactedAt | date | Follow-up date |

#### `media`
| Field | Type | Notes |
|-------|------|-------|
| id | int | PK |
| filename | text | Stored filename |
| url | text | Accessible URL |
| alt | text | Required for SEO |
| title | text | |
| caption | text | |
| cloudinaryId | text | After Cloudinary sync |
| sizes | json | thumb/card/detail variants |

#### `users`
| Field | Type | Notes |
|-------|------|-------|
| id | int | PK |
| email | email | Login credential |
| password | hashed | Never exposed |
| role | select | admin/super_admin |

### Global: `site-settings`
Single document with: logo, logoText, tagline, phone, whatsappNumber, email, address, googleMapsUrl, socialLinks[], footerText, defaultMeta

---

## 5. API Endpoints

### Payload Auto-generated REST API
```
GET    /api/products
GET    /api/products/:id
GET    /api/categories
GET    /api/banners
GET    /api/blog-posts
GET    /api/media
POST   /api/users/login
POST   /api/users/logout
GET    /api/users/me
```

### Custom API Routes
```
POST   /api/enquiry     # Submit enquiry form (public)
POST   /api/seed        # One-time data seed (protected by PAYLOAD_SECRET)
```

### Enquiry API (`/api/enquiry`)
**Security measures:**
- Rate limiting (enforced by Vercel or custom middleware — needs implementation)
- Honeypot field (`_hp` must be empty)
- Server-side validation (name, mobile Indian format, email)
- IP address capture
- Referrer URL capture

---

## 6. Data Flow: Homepage

```
Request: GET /
  │
  ├── Server Component: app/(site)/page.tsx
  │   │
  │   ├── getPayload() → Payload singleton
  │   │
  │   └── Promise.all([
  │       payload.find('banners', { isActive: true }),
  │       payload.find('products', { isTrending: true, isActive: true }),
  │       payload.find('products', { isFeatured: true, isActive: true }),
  │       payload.find('categories', { isActive: true }),
  │       payload.find('blog-posts', { status: 'published' }),
  │     ])
  │
  ├── Server renders: HeroBanner (props: slides[])
  │                   TopProducts (props: products[])
  │                   FeaturedProducts (props: products[], categories[])
  │                   BlogPreview (props: posts[])
  │
  └── Client hydrates: FeaturedProducts (useState for category filter)
                        HeroBanner (useState for slider)
```

---

## 7. Rendering Strategy

| Route | Rendering | Cache |
|-------|-----------|-------|
| `/` | SSR (dynamic) | None — real-time CMS data |
| `/products` | SSR (dynamic) | None |
| `/blog` | SSR (dynamic) | None |
| `/blog/[slug]` | SSR (dynamic) | Candidate for ISR |
| `/about` | Static or SSR | Can be static |
| `/contact` | Static | Can be static |
| `/admin/*` | SSR | Payload controlled |

**Recommendation:** Add `revalidate` to blog posts (ISR) for better performance:
```ts
export const revalidate = 3600 // Revalidate blog pages every hour
```

---

## 8. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URI` | ✅ | PostgreSQL connection string |
| `PAYLOAD_SECRET` | ✅ | Payload encryption secret (min 32 chars) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public app URL |
| `NEXT_PUBLIC_APP_NAME` | ✅ | App display name |
| `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ | Supabase service role (server-only) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret (server-only) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | For client-side Cloudinary |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | WhatsApp number (with country code) |
| `NEXT_PUBLIC_PHONE` | ✅ | Phone display string |
| `NEXT_PUBLIC_EMAIL` | ✅ | Contact email |
| `NEXT_PUBLIC_ADDRESS` | ✅ | Physical address |
| `ADMIN_EMAIL` | ✅ | Admin email for Payload |

---

## 9. Known Technical Debt & Issues

### Critical
1. **`src/lib/mockData.ts` is unused** — can be deleted. All frontend now reads from Payload.
2. **`src/scripts/seed.ts` (standalone)** — doesn't work outside Next.js context. Use the `/api/seed` route instead.
3. **Rate limiting on `/api/enquiry` is incomplete** — no server-side rate limiting implemented. Spam possible at scale.
4. **`SUPABASE_SERVICE_ROLE_KEY` is `NEXT_PUBLIC_`** — service role key must NEVER be prefixed with `NEXT_PUBLIC_`. It's currently server-side only (no `NEXT_PUBLIC_` prefix) — but should be double-checked.

### High Priority
5. **No error boundary on pages** — a Payload failure will crash the page. Add try/catch with fallback.
6. **No ISR on blog pages** — every request re-fetches. Add `revalidate = 3600`.
7. **ProductVariants not integrated** — product variants exist in the schema but are not displayed on any frontend page.
8. **No `sitemap.xml`** — critical for SEO. Add `app/sitemap.ts`.
9. **No `robots.txt`** — add `app/robots.ts`.

### Medium Priority
10. **Hardcoded data remaining** — StatsBar, Reviews, Features sections still use hardcoded data.
11. **`/api/seed` endpoint** — should be removed or protected more strictly in production.
12. **Media Cloudinary sync** — after upload, Cloudinary sync is async via `afterChange` hook. If it fails silently, `cloudinaryId` remains empty. Add error alerting.
13. **No product detail page** — `/products/[slug]` route doesn't exist.

### Low Priority
14. **TypeScript `any` usage** — `toProduct(p: any)` in types.ts should use Payload's generated types once `payload generate:types` is run.
15. **`payload-types.ts` not generated** — run `npx payload generate:types` to get full type safety.

---

## 10. Recommended Next Development Steps

### Phase 1 — Stability (Week 1)
1. Delete `src/lib/mockData.ts` (now unused)
2. Run `npx payload generate:types` → replace `any` types
3. Add `try/catch` with fallback to all server page components
4. Add `app/sitemap.ts` and `app/robots.ts`
5. Add `not-found.tsx` for 404 page
6. Remove or disable `/api/seed` route in production

### Phase 2 — Features (Week 2–3)
7. Build `/products/[slug]` — product detail page with variants
8. Connect StatsBar, Reviews, Features to SiteSettings/new Payload collection
9. Add rate limiting to `/api/enquiry` (using `@vercel/kv` or upstash)
10. Implement ISR on blog posts (`revalidate`)
11. Add product image display support from uploaded media

### Phase 3 — Optimization (Week 3–4)
12. Add `generateStaticParams` to blog `[slug]` page
13. Implement Cloudinary image transformation URLs for optimized delivery
14. Add analytics (Google Analytics or Plausible)
15. Performance audit (Lighthouse > 90 score target)

---

## 11. Deployment Checklist

### Pre-deployment
- [ ] All environment variables set in Vercel dashboard
- [ ] `DATABASE_URI` points to production Supabase (not pooler - or pooler with correct config)
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] `PAYLOAD_SECRET` is 32+ random characters
- [ ] `/api/seed` endpoint removed or disabled
- [ ] Run `npx payload generate:types` before building
- [ ] Test admin login on production
- [ ] Verify media uploads work (Cloudinary config)

### Post-deployment
- [ ] Submit sitemap to Google Search Console
- [ ] Verify WhatsApp number links work
- [ ] Test enquiry form end-to-end
- [ ] Check all images load correctly
- [ ] Monitor Supabase connection pooler usage
