"use client";

import React, { useState, useEffect } from "react";
import { Save, Monitor, Layout, Globe, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Eye, Palette } from "lucide-react";

type Tab = "header" | "footer" | "seo";

interface Settings {
  // Site
  siteName: string;
  tagline: string;
  siteUrl: string;
  // Header
  logoText: string;
  logoTagline: string;
  navCtaText: string;
  navCtaHref: string;
  navBg: string;
  navTextColor: string;
  // Footer
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  footerCopyright: string;
  footerTagline: string;
  // SEO
  seoTitle: string;
  metaDescription: string;
}

const DEFAULT: Settings = {
  siteName: "NOVA Marketplace",
  tagline: "Votre Partenaire Premium en Automobile & Immobilier en Côte d'Ivoire",
  siteUrl: "https://nova.ci",
  logoText: "NOVA",
  logoTagline: "Auto & Immobilier",
  navCtaText: "Publier une annonce",
  navCtaHref: "/publier",
  navBg: "#ffffff",
  navTextColor: "#111827",
  phone: "+225 07 00 00 00 00",
  email: "contact@nova.ci",
  address: "Cocody, Abidjan, Côte d'Ivoire",
  whatsapp: "+225 07 00 00 00 00",
  facebook: "https://facebook.com/novaci",
  instagram: "https://instagram.com/nova.ci",
  twitter: "",
  youtube: "",
  footerCopyright: "NOVA Marketplace. Tous droits réservés.",
  footerTagline: "Votre partenaire premium en automobile et immobilier en Côte d'Ivoire.",
  seoTitle: "NOVA — Automobile & Immobilier en Côte d'Ivoire",
  metaDescription: "NOVA est la marketplace #1 pour l'achat, la vente et la location de voitures et biens immobiliers en Côte d'Ivoire.",
};

export default function ApparencePage() {
  const [tab, setTab] = useState<Tab>("header");
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: keyof Settings, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "header", label: "En-tête", icon: <Layout size={16} /> },
    { id: "footer", label: "Pied de page", icon: <Monitor size={16} /> },
    { id: "seo", label: "SEO & Général", icon: <Globe size={16} /> },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apparence</h1>
          <p className="text-gray-500 text-sm mt-0.5">Configurez l'en-tête, le pied de page et les paramètres globaux du site.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-red text-white rounded-xl font-semibold hover:bg-nova-red/90 transition-all disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {/* ── HEADER TAB ── */}
        {tab === "header" && (
          <>
            <Section title="Logo & Marque" icon={<Palette size={16} />}>
              <Row label="Texte du logo">
                <Input value={settings.logoText} onChange={(v) => set("logoText", v)} placeholder="NOVA" />
              </Row>
              <Row label="Sous-titre du logo">
                <Input value={settings.logoTagline} onChange={(v) => set("logoTagline", v)} placeholder="Auto & Immobilier" />
              </Row>
              <Row label="Nom du site">
                <Input value={settings.siteName} onChange={(v) => set("siteName", v)} placeholder="NOVA Marketplace" />
              </Row>
            </Section>

            <Section title="Navigation" icon={<Layout size={16} />}>
              <Row label="Couleur de fond navbar">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.navBg || "#ffffff"}
                    onChange={(e) => set("navBg", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <Input value={settings.navBg} onChange={(v) => set("navBg", v)} placeholder="#ffffff" />
                </div>
              </Row>
              <Row label="Couleur du texte navbar">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.navTextColor || "#111827"}
                    onChange={(e) => set("navTextColor", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <Input value={settings.navTextColor} onChange={(v) => set("navTextColor", v)} placeholder="#111827" />
                </div>
              </Row>
            </Section>

            <Section title="Bouton CTA de la navbar" icon={<Eye size={16} />}>
              <Row label="Texte du bouton">
                <Input value={settings.navCtaText} onChange={(v) => set("navCtaText", v)} placeholder="Publier une annonce" />
              </Row>
              <Row label="Lien du bouton">
                <Input value={settings.navCtaHref} onChange={(v) => set("navCtaHref", v)} placeholder="/publier" />
              </Row>
            </Section>

            {/* Live Preview */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aperçu de la navbar
              </div>
              <div
                className="px-6 py-3 flex items-center justify-between"
                style={{ backgroundColor: settings.navBg || "#ffffff" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center">
                    <span className="text-white font-black text-sm">N</span>
                  </div>
                  <div>
                    <div className="font-black text-sm leading-none" style={{ color: settings.navTextColor || "#111827" }}>
                      {settings.logoText || "NOVA"}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest opacity-50" style={{ color: settings.navTextColor || "#111827" }}>
                      {settings.logoTagline || "Auto & Immobilier"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {["Accueil", "Automobile", "Immobilier"].map((item) => (
                    <span key={item} className="text-sm font-medium opacity-70" style={{ color: settings.navTextColor || "#111827" }}>
                      {item}
                    </span>
                  ))}
                  <span className="px-4 py-1.5 rounded-full text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #F97316, #FB923C)" }}>
                    {settings.navCtaText || "Publier"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── FOOTER TAB ── */}
        {tab === "footer" && (
          <>
            <Section title="Informations de contact" icon={<Phone size={16} />}>
              <Row label="Téléphone">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400 flex-shrink-0" />
                  <Input value={settings.phone} onChange={(v) => set("phone", v)} placeholder="+225 07 00 00 00 00" />
                </div>
              </Row>
              <Row label="Email">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <Input value={settings.email} onChange={(v) => set("email", v)} placeholder="contact@nova.ci" />
                </div>
              </Row>
              <Row label="Adresse">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <Input value={settings.address} onChange={(v) => set("address", v)} placeholder="Cocody, Abidjan, Côte d'Ivoire" />
                </div>
              </Row>
              <Row label="WhatsApp">
                <Input value={settings.whatsapp} onChange={(v) => set("whatsapp", v)} placeholder="+225 07 00 00 00 00" />
              </Row>
            </Section>

            <Section title="Réseaux sociaux" icon={<Globe size={16} />}>
              <Row label="Facebook">
                <div className="flex items-center gap-2">
                  <Facebook size={16} className="text-blue-600 flex-shrink-0" />
                  <Input value={settings.facebook} onChange={(v) => set("facebook", v)} placeholder="https://facebook.com/novaci" />
                </div>
              </Row>
              <Row label="Instagram">
                <div className="flex items-center gap-2">
                  <Instagram size={16} className="text-pink-500 flex-shrink-0" />
                  <Input value={settings.instagram} onChange={(v) => set("instagram", v)} placeholder="https://instagram.com/nova.ci" />
                </div>
              </Row>
              <Row label="Twitter / X">
                <div className="flex items-center gap-2">
                  <Twitter size={16} className="text-sky-500 flex-shrink-0" />
                  <Input value={settings.twitter} onChange={(v) => set("twitter", v)} placeholder="https://twitter.com/novaci" />
                </div>
              </Row>
              <Row label="YouTube">
                <div className="flex items-center gap-2">
                  <Youtube size={16} className="text-red-600 flex-shrink-0" />
                  <Input value={settings.youtube} onChange={(v) => set("youtube", v)} placeholder="https://youtube.com/@novaci" />
                </div>
              </Row>
            </Section>

            <Section title="Textes du pied de page" icon={<Monitor size={16} />}>
              <Row label="Description courte">
                <textarea
                  value={settings.footerTagline}
                  onChange={(e) => set("footerTagline", e.target.value)}
                  rows={2}
                  placeholder="Votre partenaire premium..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nova-red/30 resize-none"
                />
              </Row>
              <Row label="Texte de copyright">
                <Input value={settings.footerCopyright} onChange={(v) => set("footerCopyright", v)} placeholder="NOVA Marketplace. Tous droits réservés." />
              </Row>
            </Section>
          </>
        )}

        {/* ── SEO TAB ── */}
        {tab === "seo" && (
          <>
            <Section title="Informations générales" icon={<Globe size={16} />}>
              <Row label="Nom du site">
                <Input value={settings.siteName} onChange={(v) => set("siteName", v)} placeholder="NOVA Marketplace" />
              </Row>
              <Row label="URL du site">
                <Input value={settings.siteUrl} onChange={(v) => set("siteUrl", v)} placeholder="https://nova.ci" />
              </Row>
              <Row label="Slogan">
                <Input value={settings.tagline} onChange={(v) => set("tagline", v)} placeholder="Votre Partenaire Premium..." />
              </Row>
            </Section>

            <Section title="SEO Global" icon={<Globe size={16} />}>
              <Row label="Titre SEO (balise title)">
                <Input value={settings.seoTitle} onChange={(v) => set("seoTitle", v)} placeholder="NOVA — Automobile & Immobilier en CI" />
                <p className="text-xs text-gray-400 mt-1">{settings.seoTitle?.length || 0} / 60 caractères recommandés</p>
              </Row>
              <Row label="Meta description">
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => set("metaDescription", e.target.value)}
                  rows={3}
                  placeholder="Description pour les moteurs de recherche..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nova-red/30 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{settings.metaDescription?.length || 0} / 160 caractères recommandés</p>
              </Row>
            </Section>

            {/* SERP Preview */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aperçu Google
              </div>
              <div className="p-4">
                <div className="text-xs text-green-700 mb-0.5">{settings.siteUrl || "https://nova.ci"}</div>
                <div className="text-blue-700 text-lg font-medium leading-tight hover:underline cursor-pointer">
                  {settings.seoTitle || "NOVA — Automobile & Immobilier en Côte d'Ivoire"}
                </div>
                <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {settings.metaDescription || "Description de votre site..."}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-nova-red">{icon}</span>
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 items-start">
      <label className="text-sm font-medium text-gray-600 pt-2">{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

function Input({
  value, onChange, placeholder,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nova-red/30"
    />
  );
}
