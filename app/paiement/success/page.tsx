"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, LayoutDashboard, Home, Star } from "lucide-react";

export default function PaiementSuccessPage() {
  useEffect(() => {
    localStorage.removeItem("nova_pending_id");
    localStorage.removeItem("nova_pending_type");
    localStorage.removeItem("nova_pending_title");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-rose-50 flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="text-yellow-600 font-bold text-sm uppercase tracking-wider">Paiement confirmé</span>
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Annonce boostée !</h1>
          <p className="text-gray-500 text-base leading-relaxed mb-10">
            Votre annonce est maintenant mise en avant et visible par des milliers d'acheteurs qualifiés sur Nova.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/annonces"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-2xl transition-all hover:shadow-lg hover:shadow-nova-red/30"
            >
              <LayoutDashboard className="h-4 w-4" />
              Mes annonces
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-2xl transition-all hover:bg-gray-50"
            >
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
