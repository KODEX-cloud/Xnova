"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Save, Loader2, Camera, User, Phone, MapPin, Globe, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function ProfilPage() {
  const { data: session, update } = useSession();
  const [form, setForm] = useState({
    name: "", phone: "", city: "", bio: "", company: "", website: "",
    facebook: "", instagram: "", twitter: "", linkedin: "", whatsapp: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile").then(r => r.json()).then(d => {
      if (d) setForm({ name: d.name || "", phone: d.phone || "", city: d.city || "", bio: d.bio || "", company: d.company || "", website: d.website || "", facebook: d.facebook || "", instagram: d.instagram || "", twitter: d.twitter || "", linkedin: d.linkedin || "", whatsapp: d.whatsapp || "", avatar: d.avatar || "" });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/user/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); await update(); }
    setSaving(false);
  };

  const Field = ({ label, name, type = "text", placeholder = "", icon: Icon }: { label: string; name: keyof typeof form; type?: string; placeholder?: string; icon?: any }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input type={type} value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))} placeholder={placeholder}
          className={`w-full border border-gray-200 rounded-xl py-2.5 ${Icon ? "pl-9 pr-4" : "px-4"} text-sm focus:outline-none focus:border-nova-red/50 focus:ring-2 focus:ring-nova-red/10`} />
      </div>
    </div>
  );

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-gray-900">Mon profil</h1><p className="text-gray-500 text-sm mt-0.5">Informations visibles sur vos annonces</p></div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-all">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Enregistré !" : "Enregistrer"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Photo de profil</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-nova-red/10 flex items-center justify-center border-2 border-gray-200">
                  <User size={28} className="text-nova-red" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <Field label="URL de la photo" name="avatar" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Informations personnelles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom complet" name="name" icon={User} placeholder="Votre nom" />
            <Field label="Téléphone" name="phone" icon={Phone} placeholder="+225 07 XX XX XX" />
            <Field label="Ville" name="city" icon={MapPin} placeholder="Abidjan, Cocody..." />
            <Field label="Entreprise / Agence" name="company" placeholder="Nom de votre société" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio / Description</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="Parlez de vous..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-nova-red/50 resize-none" />
          </div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Réseaux sociaux & Web</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Site web" name="website" icon={Globe} placeholder="https://monsite.com" />
            <Field label="WhatsApp" name="whatsapp" icon={Phone} placeholder="+225 07 XX XX XX" />
            <Field label="Facebook" name="facebook" icon={Facebook} placeholder="facebook.com/..." />
            <Field label="Instagram" name="instagram" icon={Instagram} placeholder="@moncompte" />
            <Field label="Twitter / X" name="twitter" icon={Twitter} placeholder="@moncompte" />
            <Field label="LinkedIn" name="linkedin" icon={Linkedin} placeholder="linkedin.com/in/..." />
          </div>
        </div>
      </div>
    </div>
  );
}
