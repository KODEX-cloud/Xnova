import { PromotionsProps } from "@/lib/types/page-builder";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight } from "lucide-react";

export default async function CmsPromotions({ props }: { props: PromotionsProps }) {
  const {
    heading = "Offres & Promotions",
    subheading = "Saisir les meilleures opportunités",
  } = props;

  let promos: Array<{ id: string; title: string; subtitle?: string | null; description?: string | null; image?: string | null; link?: string | null; badge?: string | null; discount?: string | null; cta?: string | null; bgColor?: string | null }> = [];
  try {
    promos = await prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 4,
      select: { id: true, title: true, subtitle: true, description: true, image: true, link: true, badge: true, discount: true, cta: true, bgColor: true },
    });
  } catch {}

  if (!promos.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-label inline-flex items-center gap-2 mb-4">
            <Tag className="h-3.5 w-3.5" /> Promotions
          </span>
          {heading && <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">{heading}</h2>}
          {subheading && <p className="text-gray-500 max-w-xl mx-auto">{subheading}</p>}
        </div>

        <div className={`grid grid-cols-1 ${promos.length >= 2 ? "sm:grid-cols-2" : ""} gap-6`}>
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="relative rounded-3xl overflow-hidden min-h-[240px] group"
              style={{ backgroundColor: promo.bgColor || "#F97316" }}
            >
              {promo.image && (
                <Image
                  src={promo.image} alt={promo.title} fill
                  className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="relative z-10 p-8 flex flex-col justify-end h-full">
                {promo.badge && (
                  <span className="inline-block self-start px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3">
                    {promo.badge}
                  </span>
                )}
                {promo.discount && (
                  <p className="text-white/80 text-5xl font-black mb-1">{promo.discount}</p>
                )}
                <h3 className="text-white font-black text-xl mb-1">{promo.title}</h3>
                {promo.subtitle && <p className="text-white/70 text-sm mb-4">{promo.subtitle}</p>}
                {promo.link && (
                  <Link
                    href={promo.link}
                    className="self-start flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-bold text-sm rounded-full hover:shadow-lg transition-all hover:scale-105"
                  >
                    {promo.cta || "En savoir plus"} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
