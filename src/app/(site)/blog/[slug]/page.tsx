import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import SiteLayout from '@/components/layout/SiteLayout'
import { getPayload } from '@/lib/getPayload'
import { FaCalendar, FaUser, FaArrowLeft, FaTag } from 'react-icons/fa6'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload()
  const { docs } = await payload.find({ collection: 'blog-posts', where: { slug: { equals: slug } }, limit: 1 })
  const post = docs[0] as any
  if (!post) return {}
  return {
    title: post.meta?.title || `${post.title} — Siva Sai Products`,
    description: post.meta?.description || post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const post = docs[0] as any
  if (!post) notFound()

  const coverUrl = typeof post.coverImage === 'object' ? post.coverImage?.url ?? null : null
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <SiteLayout>
      {/* Cover */}
      {coverUrl && (
        <div className="relative h-[400px] md:h-[480px] w-full bg-stone-200">
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-stone-500 text-sm hover:text-orange-600 transition-colors mb-8"
        >
          <FaArrowLeft className="w-3.5 h-3.5" /> Back to Blog
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400 mb-4">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <FaUser className="w-3.5 h-3.5 text-orange-500" /> {post.author}
            </span>
          )}
          {publishedAt && (
            <span className="flex items-center gap-1.5">
              <FaCalendar className="w-3.5 h-3.5 text-orange-500" /> {publishedAt}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <FaTag className="w-3.5 h-3.5 text-orange-500" /> Siva Sai Products
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Excerpt as lead */}
        {post.excerpt && (
          <p className="text-lg text-stone-600 leading-relaxed border-l-4 border-orange-500 pl-5 mb-8 italic">
            {post.excerpt}
          </p>
        )}

        {/* Content — rendered as prose */}
        {post.content && (
          <div className="prose prose-stone prose-lg max-w-none prose-headings:font-heading prose-a:text-orange-600 prose-strong:text-stone-800">
            <BlogContent content={post.content} />
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
          <p className="font-semibold text-stone-800 mb-1">Interested in our products?</p>
          <p className="text-stone-500 text-sm mb-4">Browse our full range of pooja products and get a wholesale quote.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors text-sm"
          >
            View Products <FaArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
      </article>
    </SiteLayout>
  )
}

// Simple Lexical content renderer — extracts text from nodes
function BlogContent({ content }: { content: any }) {
  if (!content?.root?.children) return null

  function renderNode(node: any, key: number): React.ReactNode {
    if (node.type === 'text') {
      let text: React.ReactNode = node.text
      if (node.format & 1) text = <strong key={key}>{text}</strong>
      if (node.format & 2) text = <em key={key}>{text}</em>
      if (node.format & 8) text = <u key={key}>{text}</u>
      return text
    }
    const children = node.children?.map((child: any, i: number) => renderNode(child, i))
    switch (node.type) {
      case 'paragraph': return <p key={key}>{children}</p>
      case 'heading':   return node.tag === 'h2' ? <h2 key={key}>{children}</h2> : node.tag === 'h3' ? <h3 key={key}>{children}</h3> : <h4 key={key}>{children}</h4>
      case 'list':      return node.listType === 'number' ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>
      case 'listitem':  return <li key={key}>{children}</li>
      case 'quote':     return <blockquote key={key}>{children}</blockquote>
      case 'link':      return <a key={key} href={node.url}>{children}</a>
      default:          return <span key={key}>{children}</span>
    }
  }

  return <>{content.root.children.map((node: any, i: number) => renderNode(node, i))}</>
}
