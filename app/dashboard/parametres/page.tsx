"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Building2, Lock, Eye, EyeOff, Loader2, Check, AlertCircle, UserCircle } from "lucide-react";

interface Profile {
  id: string; name: string; email: string; phone?: string;
  userType: string; role: string; subscriptionPlan: string; createdAt: string;
}

export default function ParametresPage() {
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [saved,   setSaved]     = useState(false);
  const [error,   setError]     = useState("");
  const [showPwd, setShowPwd]   = useState(false);

  const [form, setForm] = useState({
    name: "", phone: "", userType: "VENDEUR",
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setForm((f) => ({ ...f, name: data.name ?? "", phone: data.phone ?? "", userType: data.userType ?? "VENDEUR" }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaved(false);

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (form.newPassword && form.newPassword.length < 8) {
      setError("Le nouveau mot de passe doit faire au moins 8 caractères.");
      return;
    }

    setSaving(true);
    try {
      const payload: any = { name: form.name, phone: form.phone, userType: form.userType };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword     = form.newPassword;
      }

      const res = await fetch("/api/user/profile", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur lors de la sauvegarde."); return; }

      setProfile((prev) => prev ? { ...prev, ...data } : data);
      setSaved(true);
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Paramètres du compte</h1>
        <p className="text-gray-500 text-sm mt-0.5">Modifiez vos informations personnelles et votre mot de passe.</p>
      </div>

      {/* Avatar / profile summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border-2 border-gray-100 p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-200/60">
          <span className="text-white font-black text-2xl">{profile?.name?.[0]?.toUpperCase() ?? "U"}</span>
        </div>
        <div>
          <p className="text-gray-900 font-black text-lg">{profile?.name ?? "—"}</p>
          <p className="text-gray-500 text-sm">{profile?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">
              {profile?.userType === "AGENCE" ? "Agence / Pro" : "Particulier"}
            </span>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400">
              Membre depuis {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "—"}
            </span>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-600 text-sm">
            <Check className="h-4 w-4 flex-shrink-0" /> Modifications enregistrées avec succès !
          </div>
        )}

        {/* Profile info */}
        <div className="bg-white rounded-3xl border-2 border-gray-100 p-6">
          <h2 className="text-gray-900 font-bold text-base mb-5 pb-3 border-b border-gray-100">Informations personnelles</h2>
          <div className="space-y-4">
            {/* Account type */}
            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-2">Type de compte</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: "VENDEUR", label: "Particulier", Icon: UserCircle }, { value: "AGENCE", label: "Agence / Pro", Icon: Building2 }].map(({ value, label, Icon }) => (
                  <button key={value} type="button" onClick={() => setForm((p) => ({ ...p, userType: value }))}
                    className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-sm font-semibold transition-all ${form.userType === value ? "border-nova-red bg-orange-50 text-nova-red" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={form.name} onChange={set("name")} required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">Email <span className="text-gray-400 font-normal">(non modifiable)</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="email" value={profile?.email ?? ""} disabled
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 text-sm cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold block mb-1.5">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+225 07 XX XX XX XX"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-3xl border-2 border-gray-100 p-6">
          <h2 className="text-gray-900 font-bold text-base mb-5 pb-3 border-b border-gray-100">Changer le mot de passe</h2>
          <div className="space-y-4">
            {[
              { field: "currentPassword", label: "Mot de passe actuel", placeholder: "••••••••" },
              { field: "newPassword",     label: "Nouveau mot de passe", placeholder: "Minimum 8 caractères" },
              { field: "confirmPassword", label: "Confirmer le nouveau", placeholder: "••••••••" },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="text-gray-700 text-sm font-semibold block mb-1.5">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type={showPwd ? "text" : "password"} value={(form as any)[field]}
                    onChange={set(field as keyof typeof form)} placeholder={placeholder}
                    className="w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
                  {field === "currentPassword" && (
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-nova-red to-nova-orange text-white font-black rounded-2xl text-sm hover:shadow-xl hover:shadow-orange-300/50 hover:scale-[1.01] disabled:opacity-60 transition-all flex items-center justify-center gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Enregistrement…" : saved ? <><Check className="h-4 w-4" /> Enregistré !</> : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
