import { CtaProps } from "@/lib/types/page-builder";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CmsCta({ props }: { props: CtaProps }) {
  const {
    heading = "Prêt à trouver votre prochain bien ?",
    subheading = "Rejoignez des milliers de clients satisfaits en Côte d'Ivoire",
    btnText = "Commencer maintenant",
    btnHref = "/contact",
    variant = "gradient",
  } = props;

  const isGradient = variant === "gradient";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-3xl overflow-hidden p-12 text-center shadow-xl ${
          isGradient
            ? "bg-gradient-to-br from-nova-red via-orange-500 to-nova-orange"
            : variant === "solid"
            ? "bg-nova-red"
            : "bg-white border-2 border-nova-red"
        }`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${variant === "outline" ? "text-nova-red" : "text-white"}`}>
              {heading}
            </h2>
            {subheading && (
              <p className={`text-lg mb-8 max-w-xl mx-auto ${variant === "outline" ? "text-gray-500" : "text-white/80"}`}>
                {subheading}
              </p>
            )}
            {btnText && (
              <Link
                href={btnHref || "#"}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 hover:shadow-xl ${
                  variant === "outline"
                    ? "bg-nova-red text-white hover:shadow-nova-red/30"
                    : "bg-white text-nova-red hover:shadow-white/20"
                }`}
              >
                {btnText}
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
