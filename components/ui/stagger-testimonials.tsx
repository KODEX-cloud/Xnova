"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

interface Testimonial {
  tempId: number;
  testimonial: string;
  by: string;
  imgSrc: string;
}

interface TestimonialCardProps {
  position: number;
  testimonial: Testimonial;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border transition-all duration-500 ease-in-out rounded-2xl shadow-sm",
        isCenter ? "z-10 border-nova-red shadow-xl" : "z-0 border-gray-200 hover:border-nova-red/40 hover:shadow-md"
      )}
      style={{
        width: cardSize, height: cardSize,
        background: isCenter ? "linear-gradient(135deg, var(--nova-primary) 0%, var(--nova-secondary) 100%)" : "#FFFFFF",
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `translate(-50%, -50%) translateX(${(cardSize / 1.5) * position}px) translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px) rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)`,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(249, 115, 22, 0.2)" : "0px 0px 0px 0px transparent",
        backdropFilter: "blur(12px)",
      }}
    >
      <span className="absolute block origin-top-right rotate-45"
        style={{ right: -2, top: 48, width: SQRT_5000, height: 2, background: isCenter ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.06)" }} />

      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={cn("h-4 w-4 fill-current", isCenter ? "text-white" : "text-amber-500")} />
        ))}
      </div>

      <img src={testimonial.imgSrc} alt={testimonial.by.split(",")[0]}
        className="mb-4 h-14 w-12 object-cover object-top rounded-lg"
        style={{ boxShadow: isCenter ? "3px 3px 0px rgba(0,0,0,0.15)" : "3px 3px 0px rgba(0,0,0,0.08)" }} />

      <h3 className={cn("text-base sm:text-lg font-bold leading-snug", isCenter ? "text-white" : "text-slate-800")}>
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>

      <p className={cn("absolute bottom-8 left-8 right-8 mt-2 text-sm italic font-medium", isCenter ? "text-white/80" : "text-slate-500")}>
        — {testimonial.by}
      </p>
    </div>
  );
};

interface StaggerTestimonialsProps {
  initialData?: Array<{ id: string; content: string; author: string; role: string; avatar: string; }>;
}

export const StaggerTestimonials: React.FC<StaggerTestimonialsProps> = ({ initialData }) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setTestimonialsList(
        initialData.map((t, i) => ({
          tempId: i,
          testimonial: t.content,
          by: t.role ? `${t.author}, ${t.role}` : t.author,
          imgSrc: t.avatar || `https://i.pravatar.cc/150?img=${i + 1}`,
        }))
      );
    } else {
      // Fallback hardcoded testimonials
      setTestimonialsList([
        { tempId: 0, testimonial: "NOVA m'a aidé à trouver la villa de mes rêves à Cocody en moins d'une semaine. Service exceptionnel et très professionnel !", by: "Kofi Asante, Directeur à Abidjan", imgSrc: "https://i.pravatar.cc/150?img=1" },
        { tempId: 1, testimonial: "J'ai loué ma Range Rover via NOVA pour une occasion spéciale. La voiture était impeccable, la livraison ponctuelle. Je recommande !", by: "Aminata Diallo, Consultante au Plateau", imgSrc: "https://i.pravatar.cc/150?img=5" },
        { tempId: 2, testimonial: "NOVA a géré la vente de mon appartement au Plateau en un temps record. Équipe sérieuse et à l'écoute.", by: "Jean-Pierre Kouassi, Entrepreneur à Marcory", imgSrc: "https://i.pravatar.cc/150?img=3" },
        { tempId: 3, testimonial: "Le service de chauffeur de NOVA est tout simplement irremplaçable. Ponctuel, discret et professionnel.", by: "Fatou Bamba, Avocate à Abidjan", imgSrc: "https://i.pravatar.cc/150?img=9" },
        { tempId: 4, testimonial: "Grâce à NOVA, j'ai investi dans un terrain à Yopougon à un prix très avantageux. L'équipe m'a guidé tout au long du processus.", by: "Mamadou Traoré, Investisseur à Treichville", imgSrc: "https://i.pravatar.cc/150?img=4" },
      ]);
    }
  }, [initialData]);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (testimonialsList.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-transparent" style={{ height: 600 }}>
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard key={testimonial.tempId} testimonial={testimonial}
            handleMove={handleMove} position={position} cardSize={cardSize} />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 z-20">
        <button onClick={() => handleMove(-1)}
          className={cn("flex h-12 w-12 items-center justify-center text-xl transition-all rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-nova-red hover:text-white hover:border-nova-red shadow-sm")}
          aria-label="Témoignage précédent"><ChevronLeft size={16} /></button>
        <button onClick={() => handleMove(1)}
          className={cn("flex h-12 w-12 items-center justify-center text-xl transition-all rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-nova-red hover:text-white hover:border-nova-red shadow-sm")}
          aria-label="Témoignage suivant"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
};

export default StaggerTestimonials;
