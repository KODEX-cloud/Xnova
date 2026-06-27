import { PageSection } from "@/lib/types/page-builder";
import HeroSection from "./HeroSection";
import FeaturedListings from "./FeaturedListings";
import StatsSection from "./StatsSection";
import TestimonialsSection from "./TestimonialsSection";
import BlogSection from "./BlogSection";
import ContactSection from "./ContactSection";
import ServicesSection from "./ServicesSection";
import GallerySection from "./GallerySection";
import PromotionsSection from "./PromotionsSection";
import SearchSection from "./SearchSection";

interface Props {
  section: PageSection;
}

export default function SectionRenderer({ section }: Props) {
  if (!section.isVisible) return null;

  const p = section.props;

  switch (section.type) {
    case "hero":
      return <HeroSection />;
    case "listings":
      return <FeaturedListings />;
    case "stats":
      return <StatsSection />;
    case "testimonials":
      return <TestimonialsSection />;
    case "blog":
      return <BlogSection />;
    case "contact":
      return <ContactSection />;
    case "services":
      return <ServicesSection />;
    case "gallery":
      return <GallerySection />;
    case "promotions":
      return <PromotionsSection />;
    case "search":
      return <SearchSection />;
    case "faq":
      return <FaqSectionInline props={p} />;
    case "cta":
      return <CtaSectionInline props={p} />;
    case "richtext":
      return <RichTextSectionInline props={p} />;
    default:
      return null;
  }
}

// Inline FAQ section
function FaqSectionInline({ props }: { props: Record<string, unknown> }) {
  const items = (props.items as Array<{ question: string; answer: string }>) || [];
  const heading = props.heading as string | undefined;
  const subheading = props.subheading as string | undefined;
  return (
    <section className="py-20 px-4 bg-nova-dark">
      <div className="max-w-3xl mx-auto">
        {heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">{heading}</h2>
            {subheading && <p className="text-white/50 mt-3">{subheading}</p>}
          </div>
        )}
        <div className="space-y-3">
          {items.map((item, i) => (
            <details key={i} className="group bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-white font-medium list-none">
                {item.question}
                <span className="text-white/40 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-6 pb-4 text-white/60 text-sm leading-relaxed">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Inline CTA section
function CtaSectionInline({ props }: { props: Record<string, unknown> }) {
  const variant = (props.variant as string) || "gradient";
  const heading = props.heading as string | undefined;
  const subheading = props.subheading as string | undefined;
  const btnText = props.btnText as string | undefined;
  const btnHref = (props.btnHref as string) || "#";
  const bgClass = variant === "gradient"
    ? "bg-gradient-to-r from-nova-red to-nova-orange"
    : variant === "solid"
    ? "bg-nova-red"
    : "border-2 border-nova-red";

  return (
    <section className={`py-20 px-4 ${bgClass}`}>
      <div className="max-w-3xl mx-auto text-center">
        {heading && <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{heading}</h2>}
        {subheading && <p className={`text-lg mb-8 ${variant === "outline" ? "text-white/70" : "text-white/80"}`}>{subheading}</p>}
        {btnText && (
          <a href={btnHref}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              variant === "outline" ? "bg-nova-red text-white hover:bg-nova-red/90" : "bg-white text-nova-red hover:bg-white/90"
            }`}>
            {btnText}
          </a>
        )}
      </div>
    </section>
  );
}

// Inline Rich Text section
function RichTextSectionInline({ props }: { props: Record<string, unknown> }) {
  const align = (props.align as string) || "left";
  const heading = props.heading as string | undefined;
  const content = (props.content as string) || "";
  return (
    <section className="py-16 px-4 bg-nova-dark">
      <div className="max-w-4xl mx-auto">
        {heading && (
          <h2 className={`text-2xl font-bold text-white mb-6 text-${align}`}>{heading}</h2>
        )}
        <div
          className={`prose prose-invert max-w-none text-${align}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
