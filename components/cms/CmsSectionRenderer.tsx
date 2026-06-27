import { PageSection } from "@/lib/types/page-builder";
import CmsHero from "./sections/CmsHero";
import CmsStats from "./sections/CmsStats";
import CmsListings from "./sections/CmsListings";
import CmsCta from "./sections/CmsCta";
import CmsServices from "./sections/CmsServices";
import CmsBlog from "./sections/CmsBlog";
import CmsTestimonials from "./sections/CmsTestimonials";
import CmsContact from "./sections/CmsContact";
import CmsRichText from "./sections/CmsRichText";
import CmsFaq from "./sections/CmsFaq";
import CmsGallery from "./sections/CmsGallery";
import CmsPromotions from "./sections/CmsPromotions";

export default function CmsSectionRenderer({ section }: { section: PageSection }) {
  if (section.isVisible === false) return null;

  const p = section.props as any;

  switch (section.type) {
    case "hero":         return <CmsHero props={p} />;
    case "stats":        return <CmsStats props={p} />;
    case "listings":     return <CmsListings props={p} />;
    case "cta":          return <CmsCta props={p} />;
    case "services":     return <CmsServices props={p} />;
    case "blog":         return <CmsBlog props={p} />;
    case "testimonials": return <CmsTestimonials props={p} />;
    case "contact":      return <CmsContact props={p} />;
    case "richtext":     return <CmsRichText props={p} />;
    case "faq":          return <CmsFaq props={p} />;
    case "gallery":      return <CmsGallery props={p} />;
    case "promotions":   return <CmsPromotions props={p} />;
    default:             return null;
  }
}
