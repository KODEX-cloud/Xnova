"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Send, Car, Home, MessageSquare,
  CheckCircle2, Loader2, MessageCircle, PhoneCall,
} from "lucide-react";
import Link from "next/link";

interface Settings { phone?: string; email?: string; address?: string; whatsapp?: string; }

const subjects = [
  { icon: Car, label: "Automobile" },
  { icon: Home, label: "Immobilier" },
  { icon: MessageSquare, label: "Autre" },
];

export default function ContactSection() {
  const [subject, setSubject] = useState("Automobile");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<Settings>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) { setError("Nom et message requis."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "CONTACT", name: form.name, email: form.email, phone: form.phone, subject, message: form.message, source: "HOME_CONTACT" }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: "Téléphone", value: settings.phone || "+225 22 00 00 00", sub: "Lun–Sam, 8h–20h", href: `tel:${settings.phone || "+22522000000"}` },
    { icon: Mail, label: "Email", value: settings.email || "contact@nova-ci.com", sub: "Réponse en moins de 2h", href: `mailto:${settings.email || "contact@nova-ci.com"}` },
    { icon: MapPin, label: "Adresse", value: settings.address || "Plateau, Av. Botreau-Roussel", sub: "Abidjan, Côte d'Ivoire", href: "#" },
  ];

  const waUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent("Bonjour NOVA, je souhaite plus d'informations.")}`
    : "#";

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Contactez-nous
          </motion.span>
          <motion.h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            Parlons de <span className="gradient-text-nova">votre projet</span>
          </motion.h2>
          <motion.p className="text-gray-500 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Notre équipe d&apos;experts est disponible pour vous accompagner dans votre projet automobile ou immobilier
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left — Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              return (
                <motion.a key={info.label} href={info.href}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all group"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                    <Icon className="h-5 w-5 text-nova-red" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-0.5">{info.label}</p>
                    <p className="text-gray-800 font-semibold text-sm">{info.value}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{info.sub}</p>
                  </div>
                </motion.a>
              );
            })}

            <motion.div className="space-y-3 pt-2"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              {settings.whatsapp && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <MessageCircle className="h-5 w-5 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-sm">WhatsApp direct</p>
                    <p className="text-gray-400 text-xs">Réponse en quelques minutes</p>
                  </div>
                </a>
              )}
              <Link href="/contact/callback"
                className="flex items-center gap-3 p-4 rounded-2xl bg-orange-50 border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center flex-shrink-0 shadow-md">
                  <PhoneCall className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-800 font-bold text-sm">Être rappelé</p>
                  <p className="text-gray-400 text-xs">Nous vous contactons sous 2h</p>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Right — Form */}
          <motion.div className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-xl">
              <h3 className="text-xl font-black text-gray-900 mb-6">Envoyez-nous un message</h3>

              {submitted ? (
                <motion.div className="flex flex-col items-center justify-center py-16 text-center"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h4 className="text-gray-900 font-black text-xl mb-2">Message envoyé !</h4>
                  <p className="text-gray-500 mb-6">Notre équipe vous répondra dans les prochaines 2 heures.</p>
                  <button onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-nova-red to-nova-orange text-white text-sm font-semibold transition-all hover:shadow-lg">
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sujet</label>
                    <div className="flex gap-2 flex-wrap">
                      {subjects.map(s => {
                        const Icon = s.icon;
                        return (
                          <button type="button" key={s.label} onClick={() => setSubject(s.label)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                              subject === s.label
                                ? "border-nova-red bg-orange-50 text-nova-red"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}>
                            <Icon className="h-3.5 w-3.5" /> {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nom *</label>
                      <input type="text" required value={form.name} onChange={e => set("name", e.target.value)}
                        placeholder="Jean Kouassi"
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                      <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                        placeholder="jean@example.com"
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Téléphone</label>
                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                      placeholder="+225 07 00 00 00"
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message *</label>
                    <textarea required rows={4} value={form.message} onChange={e => set("message", e.target.value)}
                      placeholder="Décrivez votre projet ou votre demande..."
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all resize-none" />
                  </div>

                  {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>}

                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-nova-red to-nova-orange hover:from-nova-orange hover:to-nova-red text-white font-bold rounded-xl text-base transition-all hover:shadow-xl hover:shadow-orange-300/50 hover:scale-[1.01] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Envoi…</> : <><Send className="h-5 w-5" /> Envoyer le message</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
