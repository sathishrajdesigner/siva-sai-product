import Link from 'next/link'
import Image from 'next/image'
import { FaArrowRight, FaCalendar, FaUser } from 'react-icons/fa6'

export type CmsBlogPost = {
  id: number | string
  title: string
  slug: string
  excerpt?: string | null
  coverImageUrl?: string | null
  author?: string | null
  publishedAt?: string | null
}

type Props = {
  posts: CmsBlogPost[]
}

export default function BlogPreview({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-widest">Latest Articles</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-800 mt-2">From Our Blog</h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-orange-600 font-semibold text-sm hover:gap-3 transition-all"
          >
            View All <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-48 bg-orange-50 overflow-hidden">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="w-12 h-12 text-orange-200" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-stone-800 text-base leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-stone-400 border-t border-stone-100 pt-3">
                  {post.author && (
                    <span className="flex items-center gap-1">
                      <FaUser className="w-3 h-3" /> {post.author}
                    </span>
                  )}
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <FaCalendar className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors"
          >
            View All Posts <FaArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
