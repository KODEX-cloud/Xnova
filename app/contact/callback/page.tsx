"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CallbackPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !name.trim()) { setError("Veuillez remplir tous les champs."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CALLBACK",
          name,
          phone,
          message: `Demande de rappel téléphonique — ${name} — ${phone}`,
          source: "CALLBACK_PAGE",
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-rose-50 flex items-center justify-center px-4 py-28">
      <div className="w-full max-w-sm">
        <Link href="/contact" className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour au contact
        </Link>

        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 border-2 border-green-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-gray-900 font-black text-2xl mb-2">Demande enregistrée !</h2>
            <p className="text-gray-500 text-sm mb-8">Nous vous rappellerons au <strong className="text-gray-800">{phone}</strong> dans les plus brefs délais.</p>
            <Link href="/" className="px-6 py-3 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-2xl transition-all hover:shadow-lg hover:shadow-nova-red/30">
              Retour à l'accueil
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-7 w-7 text-nova-red" />
              </div>
              <h1 className="text-gray-900 font-black text-2xl mb-2">Être rappelé</h1>
              <p className="text-gray-500 text-sm">Laissez vos coordonnées et nous vous contactons rapidement.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wide">Votre nom</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jean Kouassi"
                  className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wide">Numéro de téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+225 07 00 00 00 00"
                  className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-nova-red to-nova-orange disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-nova-red/30"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Envoi…</> : <><Phone className="h-4 w-4" /> Être rappelé</>}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
