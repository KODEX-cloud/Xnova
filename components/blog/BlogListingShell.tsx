"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight, BookOpen, Rss } from "lucide-react";
import BlogCard, { BlogPost, SkeletonBlogCard } from "./BlogCard";
import Link from "next/link";

const NAV_TABS = [
  { label: "Tous", href: "/blog" },
  { label: "Automobile", href: "/blog/automobile" },
  { label: "Immobilier", href: "/blog/immobilier" },
  { label: "Guides", href: "/blog/guides" },
  { label: "Actualités", href: "/blog/actualites" },
];

interface BlogListingShellProps {
  title: string;
  subtitle: string;
  apiQuery: string; // e.g. "category=Automobile"
  activeTab: string; // matches href
  emptyMessage?: string;
}

export default function BlogListingShell({
  title, subtitle, apiQuery, activeTab, emptyMessage = "Aucun article trouvé.",
}: BlogListingShellProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const LIMIT = 9;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(apiQuery || "");
    params.set("limit", String(LIMIT));
    params.set("page", String(page));
    const res = await fetch(`/api/blog?${params.toString()}`);
    const data = await res.json();
    let arr: BlogPost[] = data.posts || [];
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || "").toLowerCase().includes(q) ||
        (p.author || "").toLowerCase().includes(q)
      );
    }
    setPosts(arr);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setLoading(false);
  }, [apiQuery, page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-nova-darker">
      {/* Hero */}
      <div className="relative bg-nova-dark border-b border-white/5 pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-nova-red/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-500/4 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-nova-red text-xs font-bold uppercase tracking-widest mb-3">
                <Rss className="h-3.5 w-3.5" /> Blog & Conseils
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">{title}</h1>
              <p className="text-white/45 text-base max-w-xl">{subtitle}</p>
              {!loading && (
                <p className="text-nova-red text-sm font-semibold mt-3">
                  {total} article{total !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un article..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-nova-red/40 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="sticky top-16 z-30 bg-nova-dark/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {NAV_TABS.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.href
                    ? "bg-nova-red text-white shadow-lg shadow-nova-red/25"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonBlogCard key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5">
              <BookOpen className="h-8 w-8 text-white/20" />
            </div>
            <p className="text-white font-semibold text-lg mb-2">{emptyMessage}</p>
            <p className="text-white/30 text-sm mb-6">Essayez d'effacer votre recherche</p>
            {search && (
              <button onClick={() => setSearch("")}
                className="px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-xl transition-colors">
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={`${page}-${search}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Featured first article */}
              {page === 1 && featured && <BlogCard post={featured} featured />}

              {/* Grid of rest */}
              {(page === 1 ? rest : posts).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(page === 1 ? rest : posts).map((p, i) => (
                    <BlogCard key={p.id} post={p} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${n === page ? "bg-nova-red text-white shadow-lg shadow-nova-red/30" : "bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-20 rounded-3xl p-10 md:p-14 bg-gradient-to-br from-nova-red/10 via-nova-orange/5 to-blue-500/5 border border-nova-red/10 text-center">
          <Rss className="h-10 w-10 text-nova-red mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white mb-2">Ne ratez aucun conseil</h3>
          <p className="text-white/45 text-sm mb-7 max-w-md mx-auto">
            Recevez chaque semaine nos meilleurs articles automobile & immobilier directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input type="email" placeholder="Votre adresse email..."
              className="flex-1 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-nova-red/40 transition-all" />
            <button className="px-6 py-3 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-2xl text-sm transition-all hover:shadow-lg hover:shadow-nova-red/30 whitespace-nowrap">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
