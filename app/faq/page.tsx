import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { MessageCircle, ChevronDown } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: "faq" } }).catch(() => null);
  return {
    title: page?.seoTitle || "FAQ — NOVA Marketplace",
    description: page?.metaDescription || "Trouvez les réponses à vos questions sur NOVA Marketplace.",
  };
}

export default async function FaqPage() {
  const [items, pageSettings] = await Promise.all([
    prisma.faqItem.findMany({ where: { isActive: true }, orderBy: [{ category: "asc" }, { order: "asc" }] }),
    prisma.siteSetting.findMany({ where: { key: { startsWith: "page.faq." } } }),
  ]);

  const settings = Object.fromEntries(pageSettings.map(s => [s.key.replace("page.faq.", ""), s.value]));
  const heroTitle = settings["hero.title"] || "Questions fréquentes";
  const heroSubtitle = settings["hero.subtitle"] || "Trouvez rapidement les réponses à vos questions.";

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const cat = item.category || "Général";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-nova-red to-nova-orange py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6">
            <MessageCircle className="h-3.5 w-3.5" />
            Support
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{heroTitle}</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">{heroSubtitle}</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Aucune question disponible pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, faqItems]) => (
              <section key={category}>
                <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">{category}</h2>
                <div className="space-y-3">
                  {faqItems.map((item) => (
                    <details
                      key={item.id}
                      className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-nova-red transition-colors list-none">
                        <span>{item.question}</span>
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* CTA contact */}
        <div className="mt-14 text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-gray-900 font-bold text-xl mb-2">Vous n&apos;avez pas trouvé votre réponse ?</h3>
          <p className="text-gray-500 text-sm mb-6">Notre équipe est disponible pour vous aider.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            Nous contacter
          </a>
        </div>
      </div>
    </main>
  );
}
