"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2,
  Car, Home, HelpCircle, Handshake, PhoneCall, ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Settings { whatsapp?: string; phone?: string; email?: string; address?: string; }

const CONTACT_DEFAULTS: Record<string, string> = {
  "hero.title":    "Contactez NOVA",
  "hero.subtitle": "Nous sommes disponibles pour vous accompagner dans tous vos projets automobile et immobilier.",
  "hours":         "Lun – Sam : 8h – 19h",
  "hours.note":    "Dimanche sur rendez-vous",
};

const TYPES = [
  { value: "AUTO", label: "Automobile", icon: Car, description: "Vente, location, pièces auto" },
  { value: "IMMO", label: "Immobilier", icon: Home, description: "Maisons, terrains, studios" },
  { value: "SUPPORT", label: "Support", icon: HelpCircle, description: "Aide et assistance" },
  { value: "PARTNERSHIP", label: "Partenariat", icon: Handshake, description: "Collaboration professionnelle" },
];

const ERRORS_INIT = { name: "", email: "", phone: "", type: "", message: "" };

export default function ContactPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({});
  const [pageContent, setPageContent] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", message: "" });
  const [errors, setErrors] = useState(ERRORS_INIT);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {});
    fetch("/api/settings?prefix=page.contact.")
      .then(r => r.json())
      .then(data => setPageContent(typeof data === "object" && data !== null ? data : {}))
      .catch(() => {});
  }, []);

  const pg = (key: string) => pageContent[key] || CONTACT_DEFAULTS[key] || "";

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: typeof errors = { ...ERRORS_INIT };
    if (!form.name.trim()) e.name = "Le nom est requis.";
    if (!form.email.trim()) e.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide.";
    if (!form.phone.trim()) e.phone = "Le téléphone est requis.";
    if (!form.type) e.type = "Choisissez un type de demande.";
    if (!form.message.trim()) e.message = "Le message est requis.";
    else if (form.message.trim().length < 10) e.message = "Message trop court (min. 10 caractères).";
    setErrors(e);
    return Object.values(e).every(v => !v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONTACT",
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.type,
          message: form.message,
          source: "CONTACT_PAGE",
        }),
      });
      if (!res.ok) throw new Error();
      router.push("/contact/success");
    } catch {
      setSubmitError("Une erreur est survenue. Veuillez réessayer ou nous contacter directement.");
    } finally {
      setLoading(false);
    }
  };

  const waUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Bonjour NOVA, je souhaite plus d'informations.")}`
    : "#";

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-white via-orange-50 to-rose-50 border-b border-gray-100 pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-rose-200/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="section-label"
          >
            <Phone className="h-3.5 w-3.5" /> Contactez-nous
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight"
          >
            <span className="gradient-text-nova">{pg("hero.title")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-xl mx-auto mb-8"
          >
            {pg("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {settings.whatsapp && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-green-600/30">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
            {settings.phone && (
              <a href={`tel:${settings.phone}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold text-sm transition-all shadow-sm">
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
            )}
            <Link href="/contact/callback"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-nova-red font-semibold text-sm transition-all">
              <PhoneCall className="h-4 w-4" /> Être rappelé
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-gray-900 font-black text-2xl mb-2">Envoyez-nous un message</h2>
          <p className="text-gray-400 text-sm mb-8">Réponse garantie sous 24h ouvrables.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                  Nom complet <span className="text-nova-red">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  placeholder="Jean Kouassi"
                  className={`w-full bg-gray-50 border-2 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm focus:outline-none transition-colors ${errors.name ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-nova-red/50"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                  Email <span className="text-nova-red">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="jean@example.com"
                  className={`w-full bg-gray-50 border-2 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm focus:outline-none transition-colors ${errors.email ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-nova-red/50"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Téléphone <span className="text-nova-red">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => set("phone", e.target.value)}
                placeholder="+225 07 00 00 00 00"
                className={`w-full bg-gray-50 border-2 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm focus:outline-none transition-colors ${errors.phone ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-nova-red/50"}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
            </div>

            {/* Type of request */}
            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wide">
                Type de demande <span className="text-nova-red">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TYPES.map(t => {
                  const Icon = t.icon;
                  const active = form.type === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set("type", t.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all ${
                        active
                          ? "bg-orange-50 border-nova-red/40 text-gray-900"
                          : "bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? "text-nova-red" : ""}`} />
                      <span className="text-xs font-semibold leading-tight">{t.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.type && <p className="text-red-500 text-xs mt-1.5">{errors.type}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                Message <span className="text-nova-red">*</span>
              </label>
              <textarea
                rows={5}
                value={form.message}
                onChange={e => set("message", e.target.value)}
                placeholder="Décrivez votre demande en détail…"
                className={`w-full bg-gray-50 border-2 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm focus:outline-none transition-colors resize-none ${errors.message ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-nova-red/50"}`}
              />
              <div className="flex items-center justify-between mt-1.5">
                {errors.message ? <p className="text-red-500 text-xs">{errors.message}</p> : <span />}
                <span className="text-gray-400 text-xs">{form.message.length} caractères</span>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-nova-red to-nova-orange disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base transition-all hover:shadow-xl hover:shadow-nova-red/30"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Envoi en cours…</>
              ) : (
                <><Send className="h-5 w-5" /> Envoyer le message</>
              )}
            </button>
          </form>
        </motion.div>

        {/* Sidebar info */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="space-y-5"
        >
          {/* Contact info card */}
          <div className="rounded-3xl bg-white border-2 border-gray-100 p-6 space-y-5 shadow-sm">
            <h3 className="text-gray-900 font-black text-lg">Nos coordonnées</h3>
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                  <Phone className="h-4 w-4 text-nova-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Téléphone</p>
                  <p className="text-gray-800 font-semibold text-sm group-hover:text-nova-red transition-colors">{settings.phone}</p>
                </div>
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Mail className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Email</p>
                  <p className="text-gray-800 font-semibold text-sm group-hover:text-blue-500 transition-colors">{settings.email}</p>
                </div>
              </a>
            )}
            {settings.address ? (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-nova-orange" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Adresse</p>
                  <p className="text-gray-800 font-semibold text-sm">{settings.address}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-nova-orange" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Adresse</p>
                  <p className="text-gray-800 font-semibold text-sm">Abidjan, Côte d'Ivoire</p>
                  <p className="text-gray-400 text-xs">Cocody, Riviera</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Horaires</p>
                <p className="text-gray-800 font-semibold text-sm">{pg("hours")}</p>
                <p className="text-gray-400 text-xs">{pg("hours.note")}</p>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          {settings.whatsapp && (
            <a
              href={waUrl}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-3xl bg-green-50 border-2 border-green-200 hover:border-green-300 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6 text-white fill-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-bold text-sm">WhatsApp direct</p>
                <p className="text-gray-500 text-xs">Réponse en quelques minutes</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
            </a>
          )}

          {/* Callback CTA */}
          <Link
            href="/contact/callback"
            className="flex items-center gap-4 p-5 rounded-3xl bg-orange-50 border-2 border-orange-200 hover:border-orange-300 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-nova-red flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <PhoneCall className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-bold text-sm">Demander un rappel</p>
              <p className="text-gray-500 text-xs">Nous vous appelons dès que possible</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-nova-red transition-colors" />
          </Link>

          {/* Google Maps embed */}
          <div className="rounded-3xl overflow-hidden border-2 border-gray-100 h-52 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127477.48376386397!2d-4.080016599999999!3d5.3599517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311959ef3%3A0xa8e40fd3c4f4253b!2sAbidjan!5e0!3m2!1sfr!2sci!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="NOVA Abidjan"
            />
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
