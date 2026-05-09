import { TestimonialsProps } from "@/lib/types/page-builder";
import { prisma } from "@/lib/prisma";
import { Quote, Star } from "lucide-react";

export default async function CmsTestimonials({ props }: { props: TestimonialsProps }) {
  const {
    heading = "Ils nous font confiance",
    subheading = "Des milliers de clients satisfaits",
  } = props;

  let items: Array<{ id: string; name: string; role?: string | null; company?: string | null; avatar?: string | null; content: string; rating: number }> = [];
  try {
    items = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 6,
      select: { id: true, name: true, role: true, company: true, avatar: true, content: true, rating: true },
    });
  } catch {}

  if (!items.length) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-label inline-flex items-center gap-2 mb-4">
            <Quote className="h-3.5 w-3.5" /> Témoignages
          </span>
          {heading && <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">{heading}</h2>}
          {subheading && <p className="text-gray-500 max-w-xl mx-auto">{subheading}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">{t.name}</p>
                  {(t.role || t.company) && (
                    <p className="text-gray-400 text-xs">
                      {[t.role, t.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
