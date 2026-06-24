"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Save, Monitor, Layout, Globe, Phone, Mail, MapPin,
  Facebook, Instagram, Twitter, Youtube, Eye, Palette,
  Image, Plus, Trash2, GripVertical, Link2, ChevronDown, ChevronUp,
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

type Tab = "branding" | "header" | "footer" | "liens" | "seo";

interface FooterLink { label: string; href: string; }
interface FooterColumn { title: string; links: FooterLink[]; }

interface Settings {
  // Branding
  logoUrl: string;
  logoMobileUrl: string;
  faviconUrl: string;
  logoDarkUrl: string;
  logoLightUrl: string;
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
  newsletterTitle: string;
  newsletterSubtitle: string;
  footerCities: string;
  // SEO
  seoTitle: string;
  metaDescription: string;
}

const DEFAULT: Settings = {
  logoUrl: "",
  logoMobileUrl: "",
  faviconUrl: "",
  logoDarkUrl: "",
  logoLightUrl: "",
  siteName: "NOVA Marketplace",
  tagline: "Votre Partenaire Premium en Automobile & Immobilier en Côte d'Ivoire",
  siteUrl: "https://nova.ci",
  logoText: "NOVA",
  logoTagline: "Auto & Immobilier",
  navCtaText: "Nous contacter",
  navCtaHref: "/contact",
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
  newsletterTitle: "Restez informé des meilleures offres",
  newsletterSubtitle: "Recevez en avant-première nos annonces exclusives et conseils immobiliers & auto",
  footerCities: "",
  seoTitle: "NOVA — Automobile & Immobilier en Côte d'Ivoire",
  metaDescription: "NOVA est la marketplace #1 pour l'achat, la vente et la location de voitures et biens immobiliers en Côte d'Ivoire.",
};

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Automobile", links: [
    { label: "Vente de voitures", href: "/automobile/vente" },
    { label: "Location de voitures", href: "/automobile/location" },
    { label: "Gestion de flotte", href: "/services/flotte" },
    { label: "Vente de pièces auto", href: "/services/pieces-auto" },
  ]},
  { title: "Immobilier", links: [
    { label: "Vente de maisons", href: "/immobilier/vente" },
    { label: "Location de maisons", href: "/immobilier/location" },
    { label: "Terrains", href: "/immobilier/terrains" },
    { label: "Studios meublés", href: "/immobilier/studios" },
  ]},
  { title: "Société", links: [
    { label: "À propos de nous", href: "/about" },
    { label: "Blog & Conseils", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Publier une annonce", href: "/publier" },
  ]},
  { title: "Support", links: [
    { label: "FAQ", href: "/faq" },
    { label: "Confidentialité", href: "/confidentialite" },
    { label: "CGU", href: "/cgu" },
    { label: "Plan du site", href: "/sitemap" },
  ]},
];

export default function ApparencePage() {
  const [tab, setTab] = useState<Tab>("branding");
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [columns, setColumns] = useState<FooterColumn[]>(DEFAULT_COLUMNS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
        if (data.footerColumns) {
          try {
            const cols = JSON.parse(data.footerColumns);
            if (Array.isArray(cols) && cols.length > 0) setColumns(cols);
          } catch {}
        }
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
      body: JSON.stringify({ ...settings, footerColumns: JSON.stringify(columns) }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Column management
  const addColumn = () => setColumns(p => [...p, { title: "Nouvelle colonne", links: [] }]);
  const removeColumn = (i: number) => setColumns(p => p.filter((_, idx) => idx !== i));
  const updateColumnTitle = (i: number, title: string) =>
    setColumns(p => p.map((c, idx) => idx === i ? { ...c, title } : c));
  const addLink = (colIdx: number) =>
    setColumns(p => p.map((c, idx) => idx === colIdx ? { ...c, links: [...c.links, { label: "", href: "" }] } : c));
  const removeLink = (colIdx: number, linkIdx: number) =>
    setColumns(p => p.map((c, idx) => idx === colIdx ? { ...c, links: c.links.filter((_, li) => li !== linkIdx) } : c));
  const updateLink = (colIdx: number, linkIdx: number, field: "label" | "href", value: string) =>
    setColumns(p => p.map((c, idx) => idx === colIdx
      ? { ...c, links: c.links.map((l, li) => li === linkIdx ? { ...l, [field]: value } : l) }
      : c));

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "branding", label: "Branding", icon: <Image size={16} /> },
    { id: "header", label: "En-tête", icon: <Layout size={16} /> },
    { id: "footer", label: "Pied de page", icon: <Monitor size={16} /> },
    { id: "liens", label: "Liens Footer", icon: <Link2 size={16} /> },
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
          <p className="text-gray-500 text-sm mt-0.5">Configurez l'identité visuelle, la navigation et le SEO global.</p>
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
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 flex-wrap">
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

        {/* ── BRANDING TAB ── */}
        {tab === "branding" && (
          <>
            <Section title="Logo principal" icon={<Image size={16} />}>
              <Row label="Logo (URL ou upload)">
                <div className="space-y-2">
                  <ImageUploader
                    value={settings.logoUrl ? [settings.logoUrl] : []}
                    onChange={(urls) => set("logoUrl", urls[0] || "")}
                    label="Téléverser le logo principal"
                    maxFiles={1}
                  />
                  {settings.logoUrl && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
                      <span className="text-xs text-gray-500 truncate">{settings.logoUrl}</span>
                    </div>
                  )}
                </div>
              </Row>
              <Row label="Logo mobile (optionnel)">
                <ImageUploader
                  value={settings.logoMobileUrl ? [settings.logoMobileUrl] : []}
                  onChange={(urls) => set("logoMobileUrl", urls[0] || "")}
                  label="Logo version mobile"
                  maxFiles={1}
                />
              </Row>
              <Row label="Logo version claire">
                <ImageUploader
                  value={settings.logoLightUrl ? [settings.logoLightUrl] : []}
                  onChange={(urls) => set("logoLightUrl", urls[0] || "")}
                  label="Logo sur fond clair"
                  maxFiles={1}
                />
              </Row>
              <Row label="Logo version sombre">
                <ImageUploader
                  value={settings.logoDarkUrl ? [settings.logoDarkUrl] : []}
                  onChange={(urls) => set("logoDarkUrl", urls[0] || "")}
                  label="Logo sur fond sombre"
                  maxFiles={1}
                />
              </Row>
            </Section>

            <Section title="Favicon" icon={<Globe size={16} />}>
              <Row label="Favicon (URL)">
                <div className="space-y-2">
                  <Input value={settings.faviconUrl} onChange={(v) => set("faviconUrl", v)} placeholder="https://nova.ci/favicon.ico" />
                  {settings.faviconUrl && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={settings.faviconUrl} alt="favicon" className="w-6 h-6" />
                      Aperçu favicon
                    </div>
                  )}
                </div>
              </Row>
            </Section>

            <Section title="Texte du logo (fallback sans image)" icon={<Palette size={16} />}>
              <Row label="Texte principal">
                <Input value={settings.logoText} onChange={(v) => set("logoText", v)} placeholder="NOVA" />
              </Row>
              <Row label="Sous-texte">
                <Input value={settings.logoTagline} onChange={(v) => set("logoTagline", v)} placeholder="Auto & Immobilier" />
              </Row>
            </Section>

            {/* Preview */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aperçu logo
              </div>
              <div className="p-6 flex items-center gap-4 flex-wrap">
                {settings.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center">
                      <span className="text-white font-black text-lg">{(settings.logoText || "N").charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-nova-red font-black text-2xl tracking-tight">{settings.logoText || "NOVA"}</div>
                      <div className="text-gray-400 text-[9px] font-medium uppercase tracking-widest">{settings.logoTagline || "Auto & Immobilier"}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── HEADER TAB ── */}
        {tab === "header" && (
          <>
            <Section title="Navigation" icon={<Layout size={16} />}>
              <Row label="Couleur de fond navbar">
                <div className="flex items-center gap-3">
                  <input type="color" value={settings.navBg || "#ffffff"} onChange={(e) => set("navBg", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <Input value={settings.navBg} onChange={(v) => set("navBg", v)} placeholder="#ffffff" />
                </div>
              </Row>
              <Row label="Couleur du texte navbar">
                <div className="flex items-center gap-3">
                  <input type="color" value={settings.navTextColor || "#111827"} onChange={(e) => set("navTextColor", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <Input value={settings.navTextColor} onChange={(v) => set("navTextColor", v)} placeholder="#111827" />
                </div>
              </Row>
            </Section>

            <Section title="Bouton CTA de la navbar" icon={<Eye size={16} />}>
              <Row label="Texte du bouton">
                <Input value={settings.navCtaText} onChange={(v) => set("navCtaText", v)} placeholder="Nous contacter" />
              </Row>
              <Row label="Lien du bouton">
                <Input value={settings.navCtaHref} onChange={(v) => set("navCtaHref", v)} placeholder="/contact" />
              </Row>
            </Section>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Aperçu de la navbar</div>
              <div className="px-6 py-3 flex items-center justify-between" style={{ backgroundColor: settings.navBg || "#ffffff" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center">
                    <span className="text-white font-black text-sm">N</span>
                  </div>
                  <div>
                    <div className="font-black text-sm leading-none" style={{ color: settings.navTextColor || "#111827" }}>{settings.logoText || "NOVA"}</div>
                    <div className="text-[9px] uppercase tracking-widest opacity-50" style={{ color: settings.navTextColor || "#111827" }}>{settings.logoTagline || "Auto & Immobilier"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {["Accueil", "Automobile", "Immobilier"].map((item) => (
                    <span key={item} className="text-sm font-medium opacity-70" style={{ color: settings.navTextColor || "#111827" }}>{item}</span>
                  ))}
                  <span className="px-4 py-1.5 rounded-full text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #F97316, #FB923C)" }}>
                    {settings.navCtaText || "Nous contacter"}
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
                <div className="flex items-center gap-2"><Facebook size={16} className="text-blue-600 flex-shrink-0" />
                  <Input value={settings.facebook} onChange={(v) => set("facebook", v)} placeholder="https://facebook.com/novaci" />
                </div>
              </Row>
              <Row label="Instagram">
                <div className="flex items-center gap-2"><Instagram size={16} className="text-pink-500 flex-shrink-0" />
                  <Input value={settings.instagram} onChange={(v) => set("instagram", v)} placeholder="https://instagram.com/nova.ci" />
                </div>
              </Row>
              <Row label="Twitter / X">
                <div className="flex items-center gap-2"><Twitter size={16} className="text-sky-500 flex-shrink-0" />
                  <Input value={settings.twitter} onChange={(v) => set("twitter", v)} placeholder="https://twitter.com/novaci" />
                </div>
              </Row>
              <Row label="YouTube">
                <div className="flex items-center gap-2"><Youtube size={16} className="text-red-600 flex-shrink-0" />
                  <Input value={settings.youtube} onChange={(v) => set("youtube", v)} placeholder="https://youtube.com/@novaci" />
                </div>
              </Row>
            </Section>

            <Section title="Textes du pied de page" icon={<Monitor size={16} />}>
              <Row label="Description courte">
                <textarea value={settings.footerTagline} onChange={(e) => set("footerTagline", e.target.value)} rows={2}
                  placeholder="Votre partenaire premium..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nova-red/30 resize-none" />
              </Row>
              <Row label="Texte de copyright">
                <Input value={settings.footerCopyright} onChange={(v) => set("footerCopyright", v)} placeholder="NOVA Marketplace. Tous droits réservés." />
              </Row>
              <Row label="Titre bannière newsletter">
                <Input value={settings.newsletterTitle} onChange={(v) => set("newsletterTitle", v)} placeholder="Restez informé des meilleures offres" />
              </Row>
              <Row label="Sous-titre bannière newsletter">
                <Input value={settings.newsletterSubtitle} onChange={(v) => set("newsletterSubtitle", v)} placeholder="Recevez en avant-première..." />
              </Row>
              <Row label="Villes (JSON array)">
                <Input value={settings.footerCities} onChange={(v) => set("footerCities", v)} placeholder='["Abidjan","Cocody","Plateau"]' />
                <p className="text-xs text-gray-400 mt-1">Format : [&quot;Ville1&quot;, &quot;Ville2&quot;, ...]</p>
              </Row>
            </Section>
          </>
        )}

        {/* ── LIENS FOOTER TAB ── */}
        {tab === "liens" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Gérez les colonnes de liens du footer. Maximum 4 colonnes, 8 liens par colonne.</p>
              {columns.length < 4 && (
                <button onClick={addColumn} className="flex items-center gap-2 px-4 py-2 bg-nova-red text-white text-sm font-semibold rounded-xl hover:bg-nova-red/90 transition-colors">
                  <Plus size={15} /> Ajouter une colonne
                </button>
              )}
            </div>

            {columns.map((col, colIdx) => (
              <div key={colIdx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <input
                    value={col.title}
                    onChange={(e) => updateColumnTitle(colIdx, e.target.value)}
                    className="font-semibold text-sm text-gray-800 bg-transparent focus:outline-none focus:border-b-2 focus:border-nova-red"
                    placeholder="Titre de colonne"
                  />
                  <button onClick={() => removeColumn(colIdx)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {col.links.map((link, linkIdx) => (
                    <div key={linkIdx} className="flex items-center gap-2">
                      <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                      <input
                        value={link.label}
                        onChange={(e) => updateLink(colIdx, linkIdx, "label", e.target.value)}
                        placeholder="Texte du lien"
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nova-red/30"
                      />
                      <input
                        value={link.href}
                        onChange={(e) => updateLink(colIdx, linkIdx, "href", e.target.value)}
                        placeholder="/chemin"
                        className="w-40 px-3 py-1.5 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-nova-red/30"
                      />
                      <button onClick={() => removeLink(colIdx, linkIdx)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {col.links.length < 8 && (
                    <button onClick={() => addLink(colIdx)}
                      className="flex items-center gap-1.5 text-sm text-nova-red hover:text-nova-orange transition-colors mt-2">
                      <Plus size={14} /> Ajouter un lien
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
              <strong>Note :</strong> Cliquez sur &quot;Enregistrer&quot; en haut de page pour sauvegarder les colonnes du footer.
            </div>
          </div>
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
                <textarea value={settings.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={3}
                  placeholder="Description pour les moteurs de recherche..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nova-red/30 resize-none" />
                <p className="text-xs text-gray-400 mt-1">{settings.metaDescription?.length || 0} / 160 caractères recommandés</p>
              </Row>
            </Section>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Aperçu Google</div>
              <div className="p-4">
                <div className="text-xs text-green-700 mb-0.5">{settings.siteUrl || "https://nova.ci"}</div>
                <div className="text-blue-700 text-lg font-medium leading-tight hover:underline cursor-pointer">{settings.seoTitle || "NOVA — Automobile & Immobilier en Côte d'Ivoire"}</div>
                <div className="text-sm text-gray-600 mt-1 leading-relaxed">{settings.metaDescription || "Description de votre site..."}</div>
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

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nova-red/30" />
  );
}
