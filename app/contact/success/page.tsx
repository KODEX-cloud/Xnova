"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Home, MessageCircle, ArrowRight } from "lucide-react";

export default function ContactSuccessPage() {
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { if (d.whatsapp) setWhatsapp(d.whatsapp); })
      .catch(() => {});
  }, []);

  const waUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Bonjour NOVA, j'ai soumis une demande de contact et j'aimerais en discuter.")}`
    : "#";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-rose-50 flex items-center justify-center px-4 py-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", damping: 20 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="w-24 h-24 bg-green-100 border-2 border-green-300 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </motion.div>

        <h1 className="text-gray-900 font-black text-3xl mb-3">Message envoyé !</h1>
        <p className="text-gray-500 text-base leading-relaxed mb-2">
          Votre demande a bien été reçue. Notre équipe vous contactera dans les plus brefs délais.
        </p>
        <p className="text-gray-400 text-sm mb-10">
          Délai habituel de réponse : moins de 24h
        </p>

        <div className="h-px bg-gray-100 mb-10" />

        <div className="flex flex-col gap-3">
          {whatsapp && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all hover:shadow-lg hover:shadow-green-600/30"
            >
              <MessageCircle className="h-5 w-5" />
              Discuter sur WhatsApp maintenant
            </a>
          )}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold transition-all hover:shadow-lg hover:shadow-nova-red/30"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-500 hover:text-gray-800 text-sm font-medium transition-all"
          >
            Envoyer un autre message <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
