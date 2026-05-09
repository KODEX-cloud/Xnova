"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Loader2 } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

type SettingsMap = Record<string, string>;

const TEXT_KEYS = [
  { group: "🌐 Site", items: [
    { key: "siteName", label: "Nom du site", placeholder: "NOVA Marketplace" },
    { key: "tagline", label: "Slogan", placeholder: "Votre partenaire premium CI" },
    { key: "siteUrl", label: "URL du site", placeholder: "https://nova.ci" },
  ]},
  { group: "📞 Contact", items: [
    { key: "phone", label: "Téléphone", placeholder: "+225 07 00 00 00 00" },
    { key: "email", label: "Email", placeholder: "contact@nova.ci" },
    { key: "address", label: "Adresse", placeholder: "Abidjan, Cocody, Côte d'Ivoire" },
    { key: "whatsapp", label: "WhatsApp", placeholder: "+225 07 00 00 00 00" },
  ]},
  { group: "📱 Réseaux sociaux", items: [
    { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/novaCI" },
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/novaCI" },
    { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/nova-ci" },
    { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/novaCI" },
    { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@novaCI" },
    { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@novaCI" },
  ]},
  { group: "📊 Analytics & Pixels", items: [
    { key: "googleAnalyticsId", label: "Google Analytics ID", placeholder: "G-XXXXXXXXXX" },
    { key: "googleTagManagerId", label: "Google Tag Manager ID", placeholder: "GTM-XXXXXXX" },
    { key: "facebookPixelId", label: "Facebook Pixel ID", placeholder: "123456789012345" },
    { key: "googleVerification", label: "Google Search Console (meta)", placeholder: "xxxxxxxxxxxxxxxxxxxxxxx" },
  ]},
  { group: "✉️ Notifications email", items: [
    { key: "smtpHost", label: "SMTP Host", placeholder: "smtp.gmail.com" },
    { key: "smtpPort", label: "SMTP Port", placeholder: "587" },
    { key: "smtpUser", label: "SMTP User", placeholder: "noreply@nova.ci" },
    { key: "notifyEmail", label: "Email de réception des leads", placeholder: "admin@nova.ci" },
  ]},
];

export default function ParametresPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => { setSettings(data); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2"><Settings size={20} className="text-nova-red" /> Paramètres du site</h1>
          <p className="text-white/40 text-sm mt-0.5">Configurez votre site sans toucher au code</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-nova-red/20">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saved ? "✓ Sauvegardé" : "Sauvegarder"}
        </button>
      </div>

      {/* Branding — logo & favicon */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">🎨 Branding</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Logo (PNG transparent recommandé)</label>
            <ImageUploader value={settings.logo ? [settings.logo] : []} onChange={urls => setSettings(s => ({ ...s, logo: urls[0] || "" }))} maxFiles={1} label="" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Favicon (ICO ou PNG 32×32)</label>
            <ImageUploader value={settings.favicon ? [settings.favicon] : []} onChange={urls => setSettings(s => ({ ...s, favicon: urls[0] || "" }))} maxFiles={1} label="" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Couleur primaire</label>
            <div className="flex items-center gap-2">
              <input type="color" value={settings.primaryColor || "#E30613"}
                onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
              <input type="text" value={settings.primaryColor || "#E30613"}
                onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-nova-red/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Couleur secondaire</label>
            <div className="flex items-center gap-2">
              <input type="color" value={settings.secondaryColor || "#FF6B00"}
                onChange={e => setSettings(s => ({ ...s, secondaryColor: e.target.value }))}
                className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
              <input type="text" value={settings.secondaryColor || "#FF6B00"}
                onChange={e => setSettings(s => ({ ...s, secondaryColor: e.target.value }))}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-nova-red/50" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">Police principale</label>
          <select value={settings.fontFamily || "Inter"} onChange={e => setSettings(s => ({ ...s, fontFamily: e.target.value }))}
            className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-nova-red/50">
            {["Inter", "Poppins", "Outfit", "Plus Jakarta Sans", "DM Sans", "Montserrat"].map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">🏠 Hero Banner</h2>
        {[
          { key: "heroTitle", label: "Titre principal", placeholder: "Votre Partenaire Premium CI" },
          { key: "heroSubtitle", label: "Sous-titre", placeholder: "Découvrez les meilleures voitures et propriétés..." },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
            <input type="text" value={settings[key] || ""} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} placeholder={placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">Image Hero</label>
          <ImageUploader value={settings.heroImage ? [settings.heroImage] : []} onChange={urls => setSettings(s => ({ ...s, heroImage: urls[0] || "" }))} maxFiles={1} label="" />
        </div>
      </div>

      {/* Text groups */}
      {TEXT_KEYS.map(({ group, items }) => (
        <div key={group} className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
          <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">{group}</h2>
          {items.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
              <input type="text" value={settings[key] || ""} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
