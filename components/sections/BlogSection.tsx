"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Clock, User, Tag } from "lucide-react";

interface BlogPost {
  id: string; title: string; excerpt: string; coverImage: string;
  category: string; author: string; publishedAt: string; slug: string; readTime: number;
}

const categoryColors: Record<string, string> = {
  Automobile: "text-orange-700 bg-orange-100",
  Immobilier: "text-blue-700 bg-blue-100",
  Conseils: "text-amber-700 bg-amber-100",
  default: "text-purple-700 bg-purple-100",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogSection() {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [cms, setCms] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings?prefix=homepage.")
      .then(r => r.json()).then(d => setCms(d || {})).catch(() => {});
    fetch("/api/blog?limit=3").then(r => r.json())
      .then(data => setArticles(Array.isArray(data?.posts) ? data.posts : []))
      .catch(() => {});
  }, []);

  return (
    <section id="blog" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.span className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {cms["homepage.blogLabel"] || "Blog & Conseils"}
            </motion.span>
            <motion.h2 className="text-3xl md:text-4xl font-black text-gray-900"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              {cms["homepage.blogTitle"] || <>Nos derniers <span className="gradient-text-nova">articles</span></>}
            </motion.h2>
            <motion.p className="text-gray-500 mt-2 max-w-lg"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              {cms["homepage.blogSubtitle"] || "Conseils d'experts, tendances du marché et guides pratiques"}
            </motion.p>
          </div>
          <motion.a href="/blog"
            className="flex items-center gap-2 text-nova-red hover:text-nova-orange font-bold text-sm transition-colors group self-start md:self-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Voir tous les articles
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => {
            const colorClass = categoryColors[article.category] ?? categoryColors.default;
            const imgSrc = article.coverImage || "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80";
            return (
              <motion.article key={article.id}
                className="group bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1 * index, duration: 0.5 }}>
                <div className="relative h-52 overflow-hidden flex-shrink-0">
                  <Image src={imgSrc} alt={article.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
                    {article.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{article.author}</span>
                    {article.readTime > 0 && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime} min</span>}
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg leading-snug mb-3 group-hover:text-nova-red transition-colors line-clamp-2 flex-1">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{article.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-gray-400 text-xs">{formatDate(article.publishedAt)}</span>
                    <a href={`/blog/${article.slug}`}
                      className="flex items-center gap-1.5 text-nova-red hover:text-nova-orange font-bold text-sm transition-colors group/link">
                      Lire <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Newsletter */}
        <motion.div className="mt-16 rounded-3xl p-8 md:p-12 bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 border-2 border-orange-100 text-center"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <Tag className="h-7 w-7 text-nova-red" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Ne ratez aucun conseil de nos experts</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Abonnez-vous à notre newsletter et recevez chaque semaine les meilleures offres et conseils
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Votre email..."
              className="flex-1 px-5 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 transition-all" />
            <button className="px-6 py-3 bg-gradient-to-r from-nova-red to-nova-orange hover:from-nova-orange hover:to-nova-red text-white font-bold rounded-full text-sm transition-all hover:shadow-lg hover:shadow-orange-300/50 whitespace-nowrap">
              S&apos;abonner
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
