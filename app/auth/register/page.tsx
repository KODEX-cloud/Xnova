"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User, Phone, Building2, UserCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    phone:    "",
    password: "",
    confirm:  "",
    userType: "VENDEUR" as "VENDEUR" | "AGENCE",
  });
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:     form.name,
          email:    form.email,
          phone:    form.phone || undefined,
          password: form.password,
          userType: form.userType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription.");
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      const result = await signIn("credentials", {
        redirect: false,
        email:    form.email,
        password: form.password,
      });

      if (result?.ok) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 flex items-center justify-center p-4 py-12">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100/30 rounded-full blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-nova-red to-nova-orange rounded-xl rotate-6 group-hover:rotate-3 transition-transform shadow-lg" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-black text-xl">N</span>
            </div>
            <span className="text-nova-red font-black text-3xl">NOVA</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Créez votre compte gratuitement</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Inscription</h1>
          <p className="text-gray-500 text-sm mb-6">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-nova-red font-semibold hover:underline">Se connecter</Link>
          </p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl p-3.5 mb-5 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account type */}
            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">Type de compte</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "VENDEUR", label: "Particulier",  Icon: UserCircle  },
                  { value: "AGENCE",  label: "Agence / Pro", Icon: Building2 },
                ].map(({ value, label, Icon }) => (
                  <button key={value} type="button"
                    onClick={() => setForm((p) => ({ ...p, userType: value as "VENDEUR" | "AGENCE" }))}
                    className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                      form.userType === value
                        ? "border-nova-red bg-orange-50 text-nova-red"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}>
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">
                {form.userType === "AGENCE" ? "Nom de l'agence" : "Nom complet"}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={form.name} onChange={set("name")} required placeholder="Jean Dupont"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="email" value={form.email} onChange={set("email")} required placeholder="vous@exemple.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">Téléphone <span className="text-gray-400 font-normal">(optionnel)</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+225 07 XX XX XX XX"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type={showPwd ? "text" : "password"} value={form.password} onChange={set("password")} required minLength={8} placeholder="Minimum 8 caractères"
                  className="w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type={showPwd ? "text" : "password"} value={form.confirm} onChange={set("confirm")} required placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
              </div>
            </div>

            <p className="text-gray-400 text-xs">
              En vous inscrivant, vous acceptez nos{" "}
              <Link href="/cgu" className="text-nova-red hover:underline">conditions d'utilisation</Link>.
            </p>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-nova-red to-nova-orange hover:from-nova-orange hover:to-nova-red text-white font-black rounded-2xl transition-all hover:shadow-xl hover:shadow-orange-300/50 disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Création du compte…" : "Créer mon compte gratuitement"}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-gray-400 text-xs">
          <span>🔒 Inscription sécurisée</span>
          <span>·</span>
          <span>Données protégées</span>
        </div>
      </motion.div>
    </div>
  );
}
