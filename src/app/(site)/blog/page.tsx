import Link from 'next/link'
import Image from 'next/image'
import SiteLayout from '@/components/layout/SiteLayout'
import { getPayload } from '@/lib/getPayload'
import { FaArrowRight, FaCalendar, FaUser, FaNewspaper } from 'react-icons/fa6'

export const metadata = {
  title: 'Blog — Siva Sai Products',
  description: 'Articles on pooja products, camphor, devotional oils and more from Siva Sai Products.',
}

export default async function BlogPage() {
  const payload = await getPayload()

  const { docs: posts } = await payload.find({
    collection: 'blog-posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit: 50,
  })

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-800 to-stone-900 py-14 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaNewspaper className="w-8 h-8 text-orange-400" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Our Blog</h1>
          </div>
          <p className="text-stone-300 text-lg">
            Tips, guides and insights on pooja products, rituals and our manufacturing process.
          </p>
        </div>
      </section>

      <section className="py-12 bg-stone-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <FaNewspaper className="w-16 h-16 mx-auto mb-4 text-stone-300" />
              <p className="text-xl font-medium text-stone-500">No blog posts yet.</p>
              <p className="text-sm mt-1 text-stone-400">Check back soon for articles and updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(posts as any[]).map((post) => {
                const coverUrl = typeof post.coverImage === 'object' ? post.coverImage?.url ?? null : null
                const publishedAt = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                  : null

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative h-52 bg-orange-50 overflow-hidden">
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaNewspaper className="w-14 h-14 text-orange-200" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="font-bold text-stone-800 text-lg leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                        <div className="flex items-center gap-3 text-xs text-stone-400">
                          {post.author && (
                            <span className="flex items-center gap-1">
                              <FaUser className="w-3 h-3" /> {post.author}
                            </span>
                          )}
                          {publishedAt && (
                            <span className="flex items-center gap-1">
                              <FaCalendar className="w-3 h-3" /> {publishedAt}
                            </span>
                          )}
                        </div>
                        <span className="text-orange-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read <FaArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  )
}
