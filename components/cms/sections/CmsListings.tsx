import { ListingsProps } from "@/lib/types/page-builder";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Car, Home, MapPin, ArrowRight } from "lucide-react";

function formatPrice(price: number, priceType?: string) {
  const f = price.toLocaleString("fr-FR");
  return priceType === "RENT" ? `${f} FCFA/mois` : `${f} FCFA`;
}

function firstImg(raw?: string | null): string {
  try {
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) && arr[0] ? arr[0] : "";
  } catch { return ""; }
}

export default async function CmsListings({ props }: { props: ListingsProps }) {
  const {
    heading = "Nos meilleures offres",
    subheading = "Sélection premium mise à jour quotidiennement",
    listingType = "both",
    limit = 6,
    featuredOnly = true,
  } = props;

  let items: Array<{ id: string; slug?: string; title: string; price: number; priceType?: string; city?: string; images?: string; kind: "car" | "property" }> = [];

  try {
    if (listingType === "cars" || listingType === "both") {
      const cars = await prisma.car.findMany({
        where: { status: "ACTIVE", ...(featuredOnly ? { featured: true } : {}) },
        take: listingType === "both" ? Math.ceil(limit / 2) : limit,
        orderBy: { createdAt: "desc" },
        select: { id: true, slug: true, title: true, price: true, priceType: true, city: true, images: true },
      });
      items.push(...cars.map((c) => ({ ...c, city: c.city ?? undefined, kind: "car" as const })));
    }
    if (listingType === "properties" || listingType === "both") {
      const props_ = await prisma.property.findMany({
        where: { status: "ACTIVE", ...(featuredOnly ? { featured: true } : {}) },
        take: listingType === "both" ? Math.floor(limit / 2) : limit,
        orderBy: { createdAt: "desc" },
        select: { id: true, slug: true, title: true, price: true, priceType: true, city: true, images: true },
      });
      items.push(...props_.map((p) => ({ ...p, city: p.city ?? undefined, kind: "property" as const })));
    }
  } catch {}

  if (!items.length) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            <span className="section-label inline-flex items-center gap-2 mb-4">
              <Car className="h-3.5 w-3.5" /> Annonces
            </span>
            {heading && <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">{heading}</h2>}
            {subheading && <p className="text-gray-500 max-w-xl mx-auto">{subheading}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {items.slice(0, limit).map((item) => {
            const img = firstImg(item.images);
            const href = item.kind === "car"
              ? `/automobile/${item.slug || item.id}`
              : `/immobilier/${item.slug || item.id}`;
            return (
              <Link key={item.id} href={href}
                className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl overflow-hidden transition-all duration-300"
              >
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  {img ? (
                    <Image src={img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {item.kind === "car"
                        ? <Car className="h-12 w-12 text-gray-300" />
                        : <Home className="h-12 w-12 text-gray-300" />}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                    item.kind === "car" ? "bg-nova-red" : "bg-blue-500"
                  }`}>
                    {item.kind === "car" ? "Automobile" : "Immobilier"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-2 group-hover:text-nova-red transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-nova-red font-black text-lg mb-2">{formatPrice(item.price, item.priceType)}</p>
                  {item.city && (
                    <p className="flex items-center gap-1 text-gray-400 text-xs">
                      <MapPin className="h-3 w-3" /> {item.city}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          {(listingType === "cars" || listingType === "both") && (
            <Link href="/automobile" className="flex items-center gap-2 px-6 py-3 bg-nova-red text-white font-bold rounded-full hover:shadow-lg hover:shadow-nova-red/30 transition-all">
              Voir les voitures <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {(listingType === "properties" || listingType === "both") && (
            <Link href="/immobilier" className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:border-nova-red/40 transition-all">
              Voir les biens <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
