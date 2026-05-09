"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, User, Calendar, Eye, Tag, Share2,
  MessageCircle, Phone, ChevronRight, BookOpen,
} from "lucide-react";
import { BlogPost, formatDate } from "@/components/blog/BlogCard";
import BlogCard from "@/components/blog/BlogCard";

interface FullPost extends BlogPost {
  content?: string;
  views?: number;
  status?: string;
}

interface Settings {
  whatsapp?: string;
  phone?: string;
}

const CAT_COLORS: Record<string, string> = {
  Automobile:       "bg-nova-orange/15 text-nova-orange border-nova-orange/20",
  Immobilier:       "bg-nova-red/15 text-nova-red border-nova-red/20",
  Conseils:         "bg-nova-yellow/15 text-nova-yellow border-nova-yellow/20",
  "Guide d'achat":  "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Tendances:        "bg-pink-500/15 text-pink-400 border-pink-500/20",
  Actualité:        "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<FullPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/blog/${slug}`).then(r => r.json()),
      fetch("/api/settings").then(r => r.json()).catch(() => ({})),
    ]).then(([postData, settingsData]) => {
      if (postData.error) { setPost(null); setLoading(false); return; }
      setPost(postData);
      setSettings(settingsData);
      if (postData.category) {
        fetch(`/api/blog?category=${encodeURIComponent(postData.category)}&limit=4`)
          .then(r => r.json())
          .then(d => {
            setRelated((d.posts || []).filter((p: BlogPost) => p.id !== postData.id).slice(0, 3));
          });
      }
      setLoading(false);
    });
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const whatsappUrl = (msg: string) =>
    `https://wa.me/${(settings.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-nova-darker pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
          <div className="h-6 bg-white/5 rounded-full w-32" />
          <div className="h-10 bg-white/5 rounded-full w-3/4" />
          <div className="h-80 bg-white/5 rounded-3xl" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`h-4 bg-white/5 rounded-full ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-nova-darker pt-28 flex flex-col items-center justify-center gap-5 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-white/20" />
        </div>
        <h1 className="text-white text-2xl font-black">Article introuvable</h1>
        <p className="text-white/40 text-sm">Cet article n'existe pas ou a été supprimé.</p>
        <Link href="/blog"
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white font-semibold rounded-xl text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour au blog
        </Link>
      </div>
    );
  }

  const img = post.coverImage || "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80";
  const catClass = CAT_COLORS[post.category || ""] || "bg-white/10 text-white/60 border-white/10";

  return (
    <div className="min-h-screen bg-nova-darker">
      {/* Hero image */}
      <div className="relative h-72 sm:h-96 lg:h-[480px] overflow-hidden">
        <Image src={img} alt={post.title} fill className="object-cover" sizes="100vw" unoptimized={img.startsWith("/")} />
        <div className="absolute inset-0 bg-gradient-to-t from-nova-darker via-nova-darker/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          {post.category && (
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border mb-4 ${catClass}`}>
              {post.category}
            </span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-white font-black text-2xl sm:text-3xl lg:text-4xl leading-tight max-w-3xl"
          >
            {post.title}
          </motion.h1>
        </div>
      </div>

      {/* Back link + breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 text-white/35 text-xs">
          <Link href="/blog" className="hover:text-nova-red transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Blog
          </Link>
          <ChevronRight className="h-3 w-3" />
          {post.category && (
            <>
              <Link href={`/blog/${post.category.toLowerCase()}`} className="hover:text-nova-red transition-colors capitalize">
                {post.category}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-white/50 truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

        {/* Article body */}
        <article>
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm mb-8 pb-6 border-b border-white/[0.06]">
            {post.author && (
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{post.author}</span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime} min de lecture</span>
            )}
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.publishedAt)}</span>
            {post.views !== undefined && (
              <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{post.views} vues</span>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-white/65 text-lg leading-relaxed font-medium mb-8 border-l-4 border-nova-red pl-5 italic">
              {post.excerpt}
            </p>
          )}

          {/* Rich content */}
          {post.content ? (
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-white/40 italic">Contenu non disponible.</p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-white/30" />
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share row */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
            >
              <Share2 className="h-4 w-4" />
              {copied ? "Lien copié !" : "Partager"}
            </button>
            {settings.whatsapp && (
              <a
                href={whatsappUrl(`Bonjour, j'ai lu cet article Nova et j'aimerais en savoir plus : ${post.title}`)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/20 hover:bg-green-600/30 border border-green-500/20 text-green-400 text-sm font-medium transition-all"
              >
                <MessageCircle className="h-4 w-4" /> Discuter sur WhatsApp
              </a>
            )}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Author card */}
          {post.author && (
            <div className="rounded-2xl bg-nova-navy border border-white/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-nova-red/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-nova-red" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{post.author}</p>
                  <p className="text-white/35 text-xs">Auteur Nova</p>
                </div>
              </div>
              <p className="text-white/45 text-xs leading-relaxed">
                Expert en automobile et immobilier, partageant les meilleures pratiques et conseils du marché ivoirien.
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-nova-red/10 via-nova-orange/5 to-transparent border border-nova-red/10 p-5 space-y-3">
            <h4 className="text-white font-bold text-sm">Une question ?</h4>
            <p className="text-white/45 text-xs leading-relaxed">Notre équipe est disponible pour vous accompagner.</p>
            {settings.whatsapp && (
              <a
                href={whatsappUrl(`Bonjour Nova, j'ai une question suite à l'article : ${post.title}`)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm font-semibold transition-colors"
              >
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
            )}
          </div>

          {/* Article info */}
          <div className="rounded-2xl bg-nova-navy border border-white/5 p-5 space-y-3">
            <h4 className="text-white font-bold text-sm mb-4">Informations</h4>
            {post.category && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/35">Catégorie</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold border ${catClass}`}>{post.category}</span>
              </div>
            )}
            {post.readTime && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/35">Lecture</span>
                <span className="text-white/70">{post.readTime} minutes</span>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/35">Publié le</span>
                <span className="text-white/70">{formatDate(post.publishedAt)}</span>
              </div>
            )}
            {post.views !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/35">Vues</span>
                <span className="text-white/70">{post.views}</span>
              </div>
            )}
          </div>

          {/* Navigation links */}
          <div className="rounded-2xl bg-nova-navy border border-white/5 p-5">
            <h4 className="text-white font-bold text-sm mb-3">Explorer</h4>
            <div className="space-y-1.5">
              {[
                { label: "Tous les articles", href: "/blog" },
                { label: "Automobile", href: "/blog/automobile" },
                { label: "Immobilier", href: "/blog/immobilier" },
                { label: "Guides & Conseils", href: "/blog/guides" },
                { label: "Actualités", href: "/blog/actualites" },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white text-sm transition-colors group">
                  {l.label}
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="border-t border-white/[0.06] pt-12">
            <h3 className="text-white font-black text-xl mb-6">Articles similaires</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => <BlogCard key={p.id} post={p} index={i} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
