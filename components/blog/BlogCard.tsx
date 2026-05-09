"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, User, ArrowRight, Calendar } from "lucide-react";

export interface BlogPost {
  id: string; title: string; excerpt?: string; coverImage?: string;
  category?: string; author?: string; publishedAt?: string;
  slug: string; readTime?: number; tags?: string[];
}

const CAT_COLORS: Record<string, string> = {
  Automobile:   "bg-nova-orange/15 text-nova-orange border-nova-orange/20",
  Immobilier:   "bg-nova-red/15 text-nova-red border-nova-red/20",
  Conseils:     "bg-nova-yellow/15 text-nova-yellow border-nova-yellow/20",
  "Guide d'achat": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Tendances:    "bg-pink-500/15 text-pink-400 border-pink-500/20",
  Actualité:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

const DEFAULT_CAT = "bg-white/10 text-white/60 border-white/10";

export function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function SkeletonBlogCard() {
  return (
    <div className="bg-nova-navy rounded-2xl overflow-hidden border border-white/5 animate-pulse flex flex-col">
      <div className="h-52 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-white/5 rounded-full w-20" />
        <div className="h-4 bg-white/5 rounded-full w-4/5" />
        <div className="h-4 bg-white/5 rounded-full w-3/5" />
        <div className="h-3 bg-white/5 rounded-full w-full" />
        <div className="h-3 bg-white/5 rounded-full w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 bg-white/5 rounded-full w-24" />
          <div className="h-3 bg-white/5 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

export default function BlogCard({ post, index = 0, featured = false }: {
  post: BlogPost; index?: number; featured?: boolean;
}) {
  const href = `/blog/${post.slug}`;
  const img = post.coverImage || "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80";
  const catClass = CAT_COLORS[post.category || ""] || DEFAULT_CAT;

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="group relative rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40"
      >
        <Link href={href} className="block relative h-80 sm:h-96 overflow-hidden">
          <Image src={img} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="100vw" unoptimized={img.startsWith("/")} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            {post.category && (
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border mb-3 ${catClass}`}>
                {post.category}
              </span>
            )}
            <h2 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-3 group-hover:text-nova-red transition-colors">
              {post.title}
            </h2>
            {post.excerpt && <p className="text-white/60 text-sm line-clamp-2 mb-4">{post.excerpt}</p>}
            <div className="flex items-center gap-4 text-white/40 text-xs">
              {post.author && <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{post.author}</span>}
              {post.readTime && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{post.readTime} min</span>}
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group bg-nova-navy rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 flex flex-col"
    >
      <Link href={href} className="block relative h-52 overflow-hidden flex-shrink-0">
        <Image src={img} alt={post.title} fill
          className="object-cover group-hover:scale-105 transition-transform duration-600"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={img.startsWith("/")} />
        <div className="absolute inset-0 bg-gradient-to-t from-nova-navy/80 via-transparent to-transparent" />
        {post.category && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold border ${catClass}`}>
            {post.category}
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-white/35 text-xs mb-3">
          {post.author && <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>}
          {post.readTime ? <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime} min</span> : null}
        </div>

        <Link href={href}>
          <h3 className="text-white font-bold text-base leading-snug mb-3 line-clamp-2 group-hover:text-nova-red transition-colors duration-200">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="text-white/45 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.05] mt-auto">
          <span className="text-white/25 text-xs">{formatDate(post.publishedAt)}</span>
          <Link href={href}
            className="flex items-center gap-1.5 text-nova-red hover:text-nova-orange font-semibold text-xs transition-colors group/link">
            Lire l'article
            <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
