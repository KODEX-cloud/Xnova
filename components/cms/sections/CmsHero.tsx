import { HeroProps } from "@/lib/types/page-builder";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CmsHero({ props }: { props: HeroProps }) {
  const {
    badge = "Marketplace #1 en Côte d'Ivoire",
    line1 = "Votre Partenaire",
    line2 = "Premium CI",
    subtitle = "Découvrez les meilleures voitures et propriétés d'Abidjan.",
    backgroundImage,
    primaryBtnText = "Explorer les annonces",
    primaryBtnHref = "#annonces",
    secondaryBtnText = "Déposer une annonce",
    secondaryBtnHref = "/publier",
  } = props;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-white via-orange-50 to-rose-50 pt-20">
      {/* Background image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image src={backgroundImage} alt="Hero" fill className="object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-orange-50/70 to-rose-50/80" />
        </div>
      )}

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-200/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-3xl">
          {badge && (
            <span className="section-label inline-flex items-center gap-2 mb-6">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {badge}
            </span>
          )}

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
            {line1}{" "}
            {line2 && <span className="gradient-text-nova block">{line2}</span>}
          </h1>

          {subtitle && (
            <p className="text-gray-500 text-xl leading-relaxed mb-10 max-w-xl">{subtitle}</p>
          )}

          <div className="flex flex-wrap gap-4">
            {primaryBtnText && (
              <Link
                href={primaryBtnHref || "#"}
                className="flex items-center gap-2 px-8 py-4 bg-nova-red text-white font-bold rounded-full hover:shadow-xl hover:shadow-nova-red/30 hover:scale-105 transition-all duration-300 text-base"
              >
                {primaryBtnText}
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
            {secondaryBtnText && (
              <Link
                href={secondaryBtnHref || "#"}
                className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:border-nova-red/40 hover:text-nova-red transition-all duration-300 text-base shadow-sm"
              >
                {secondaryBtnText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
