import { GalleryProps } from "@/lib/types/page-builder";
import Image from "next/image";

export default function CmsGallery({ props }: { props: GalleryProps }) {
  const { heading = "Notre galerie", images = [], columns = 3 } = props;
  if (!images.length) return null;

  const cols = columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {heading && (
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">{heading}</h2>
        )}
        <div className={`grid grid-cols-2 ${cols} gap-4`}>
          {images.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              <Image
                src={src} alt={`Galerie ${i + 1}`} fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
