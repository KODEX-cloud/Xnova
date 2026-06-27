"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ArrowRight, ExternalLink } from "lucide-react";
import { useImageModal } from "@/contexts/imageModal";

export default function ImageModal() {
  const { data, close } = useImageModal();

  useEffect(() => {
    if (!data) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [data, close]);

  const waUrl = data?.whatsappText
    ? `https://wa.me/?text=${encodeURIComponent(data.whatsappText)}`
    : undefined;

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-4xl bg-nova-dark rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col lg:flex-row"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Image — left 60% */}
            <div className="relative lg:w-[60%] h-64 lg:h-auto min-h-64 flex-shrink-0 bg-nova-navy">
              <Image
                src={data.src}
                alt={data.title || "Image"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                unoptimized={data.src.startsWith("/")}
              />
            </div>

            {/* Info — right 40% */}
            <div className="flex flex-col justify-center p-8 gap-5 flex-1">
              {data.price && (
                <span className="text-nova-red font-black text-2xl">{data.price}</span>
              )}
              {data.title && (
                <h3 className="text-white font-black text-xl leading-snug">{data.title}</h3>
              )}
              {data.description && (
                <p className="text-white/55 text-sm leading-relaxed">{data.description}</p>
              )}

              <div className="flex flex-col gap-3 mt-2">
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contacter sur WhatsApp
                  </a>
                )}
                {data.href && (
                  <Link
                    href={data.href}
                    onClick={close}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-nova-red hover:bg-nova-red/90 text-white font-bold text-sm transition-colors"
                  >
                    Voir plus <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {!data.href && !waUrl && (
                  <button
                    onClick={close}
                    className="py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors"
                  >
                    Fermer
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
