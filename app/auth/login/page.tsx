"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Car } from "lucide-react";

function LoginForm() {
  const router       = useRouter();
  const params       = useSearchParams();
  const callbackUrl  = params.get("callbackUrl") || "/dashboard";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect:  false,
      email:     email.trim(),
      password,
      callbackUrl,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100/30 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-nova-red to-nova-orange rounded-xl rotate-6 group-hover:rotate-3 transition-transform shadow-lg" />
              <span className="relative text-white font-black text-xl z-10">N</span>
            </div>
            <span className="text-nova-red font-black text-3xl tracking-tight">NOVA</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Connectez-vous à votre espace</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Connexion</h1>
          <p className="text-gray-500 text-sm mb-6">
            Pas encore de compte ?{" "}
            <Link href="/auth/register" className="text-nova-red font-semibold hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl p-3.5 mb-5 text-red-600 text-sm"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white focus:ring-2 focus:ring-nova-red/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white focus:ring-2 focus:ring-nova-red/10 transition-all"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-nova-red to-nova-orange hover:from-nova-orange hover:to-nova-red text-white font-black rounded-2xl transition-all hover:shadow-xl hover:shadow-orange-300/50 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
            <Link href="/" className="text-gray-400 text-xs hover:text-gray-600 transition-colors flex items-center gap-1">
              <Car className="h-3.5 w-3.5" /> Retour au site
            </Link>
            <Link href="/admin/login" className="text-gray-400 text-xs hover:text-nova-red transition-colors">
              Accès administrateur →
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-6 text-gray-400 text-xs">
          <span className="flex items-center gap-1">🔒 Connexion sécurisée</span>
          <span>·</span>
          <span>Données protégées</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
