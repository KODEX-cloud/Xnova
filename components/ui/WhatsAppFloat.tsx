"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppFloat() {
  const [whatsapp, setWhatsapp] = useState("");
  const [tooltip, setTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { if (d.whatsapp) setWhatsapp(d.whatsapp); })
      .catch(() => {});
    const t = setTimeout(() => setTooltip(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!whatsapp) return null;

  const number = whatsapp.replace(/\D/g, "");
  const url = `https://wa.me/${number}?text=${encodeURIComponent("Bonjour NOVA, je souhaite plus d'informations.")}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {tooltip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="relative bg-white text-gray-800 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-xl max-w-[220px] text-center"
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="h-3 w-3 text-gray-600" />
            </button>
            Besoin d'aide ? Chattez avec nous !
            <div className="absolute bottom-[-6px] right-8 w-3 h-3 bg-white rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTooltip(false)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 transition-colors"
        aria-label="Contact WhatsApp"
      >
        <MessageCircle className="h-7 w-7 text-white fill-white" />
      </motion.a>
    </div>
  );
}
