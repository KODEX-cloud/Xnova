"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, LayoutDashboard } from "lucide-react";

export default function PaiementCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-rose-50 flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center mx-auto mb-8"
        >
          <XCircle className="h-12 w-12 text-gray-400" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Paiement annulé</h1>
          <p className="text-gray-500 text-base leading-relaxed mb-10">
            Votre annonce a bien été enregistrée en mode gratuit. Vous pouvez la booster à tout moment depuis votre tableau de bord.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/paiement"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-2xl transition-all hover:shadow-lg hover:shadow-nova-red/30"
            >
              <ArrowLeft className="h-4 w-4" />
              Réessayer
            </Link>
            <Link
              href="/dashboard/annonces"
              className="flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-2xl transition-all hover:bg-gray-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              Mes annonces
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
