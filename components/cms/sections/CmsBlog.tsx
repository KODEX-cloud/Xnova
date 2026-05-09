import { BlogProps } from "@/lib/types/page-builder";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, Clock } from "lucide-react";

const CAT_COLORS: Record<string, string> = {
  Automobile: "bg-orange-100 text-orange-700",
  Immobilier: "bg-blue-100 text-blue-700",
  Conseils: "bg-amber-100 text-amber-700",
  Actualité: "bg-green-100 text-green-700",
};

export default async function CmsBlog({ props }: { props: BlogProps }) {
  const {
    heading = "Nos derniers articles",
    subheading = "Conseils d'experts et guides pratiques",
    limit = 3,
    category,
  } = props;

  let posts: Array<{ id: string; slug: string; title: string; excerpt?: string | null; coverImage?: string | null; category?: string | null; readTime?: number; publishedAt?: Date | null }> = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        ...(category ? { category } : {}),
      },
      take: limit,
      orderBy: { publishedAt: "desc" },
      select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, category: true, readTime: true, publishedAt: true },
    });
  } catch {}

  if (!posts.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label inline-flex items-center gap-2 mb-4">
              <BookOpen className="h-3.5 w-3.5" /> Blog
            </span>
            {heading && <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">{heading}</h2>}
            {subheading && <p className="text-gray-500">{subheading}</p>}
          </div>
          <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-nova-red font-bold text-sm hover:underline">
            Tous les articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl overflow-hidden transition-all duration-300"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {post.coverImage ? (
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-10 w-10 text-gray-300" />
                  </div>
                )}
                {post.category && (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${CAT_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
                    {post.category}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-2 group-hover:text-nova-red transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock className="h-3 w-3" />
                  {post.readTime || 5} min de lecture
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/blog" className="inline-flex items-center gap-2 text-nova-red font-bold text-sm">
            Tous les articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
