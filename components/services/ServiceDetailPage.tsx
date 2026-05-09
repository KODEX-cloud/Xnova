"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Phone, MessageCircle, Calendar, CheckCircle2,
  ChevronLeft, ChevronRight, Home, Loader2, Share2,
} from "lucide-react";
import { getService, SERVICES } from "@/lib/services-data";
import ServiceCard from "./ServiceCard";

interface ServiceDetailPageProps {
  serviceId: string;
}

export default function ServiceDetailPage({ serviceId }: ServiceDetailPageProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  const service = getService(serviceId);
  const related = SERVICES.filter(s => s.id !== serviceId).slice(0, 3);
  const [pageContent, setPageContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => setSettings(d || {})).catch(() => {});
    fetch(`/api/settings?prefix=${encodeURIComponent(`page.services/${serviceId}.`)}`)
      .then(r => r.json())
      .then(d => setPageContent(typeof d === "object" && d !== null ? d : {}))
      .catch(() => {});
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-center px-4 pt-20">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          <Home className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="text-gray-900 text-xl font-bold">Service introuvable</h1>
        <p className="text-gray-500 text-sm">Ce service n'existe pas.</p>
        <Link href="/services" className="px-5 py-2.5 bg-nova-red text-white rounded-xl text-sm font-semibold hover:bg-nova-red/90 transition-colors">
          Voir tous les services
        </Link>
      </div>
    );
  }

  const gallery = service.gallery;
  const Icon = service.icon;
  const phone = settings.phone || "+225 07 00 00 00 00";
  const waNumber = (settings.whatsapp || settings.phone || "2250700000000").replace(/\D/g, "");
  const waMsg = encodeURIComponent(service.whatsappText);

  const sendLead = async () => {
    if (!form.name || !form.phone) return;
    setSending(true);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "SERVICE",
        name: form.name,
        phone: form.phone,
        message: form.message || `Demande pour le service : ${service.title}`,
        source: "service_detail",
        listingType: "SERVICE",
      }),
    }).catch(() => {});
    setSending(false);
    setSent(true);
    setTimeout(() => { setSent(false); setShowModal(false); }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-gray-900 transition-colors">Services</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{pageContent["hero.title"] || service.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link href="/services" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Retour aux services
        </Link>

        {/* Hero — keep white text, has colored gradient */}
        <div className="mb-10 relative rounded-3xl overflow-hidden shadow-lg">
          <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient}`} />
          <div className="relative z-10 px-8 py-12 md:py-16 flex flex-col md:flex-row md:items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl ${service.iconBg} flex items-center justify-center shadow-2xl flex-shrink-0`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border mb-3 ${service.tagColor}`}>{service.tag}</span>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{pageContent["hero.title"] || service.title}</h1>
              <p className="text-white/80 text-lg">{pageContent["hero.subtitle"] || service.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="relative aspect-video overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIdx}
                    src={gallery[imgIdx]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {gallery.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx(i => (i - 1 + gallery.length) % gallery.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={() => setImgIdx(i => (i + 1) % gallery.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs">
                      {imgIdx + 1} / {gallery.length}
                    </span>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="p-3 flex gap-2 overflow-x-auto bg-gray-50">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? "border-nova-red" : "border-transparent opacity-50 hover:opacity-80"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <h2 className="text-gray-900 font-bold text-xl mb-4">À propos de ce service</h2>
              <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                {(pageContent["description"] || service.description).split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <h2 className="text-gray-900 font-bold text-xl mb-5">Ce qui est inclus</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map(f => (
                  <div key={f} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Avantages */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <h2 className="text-gray-900 font-bold text-xl mb-6">Pourquoi choisir NOVA</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.avantages.map((av, i) => {
                  const AvIcon = av.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-nova-red/20 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl ${service.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <AvIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold text-sm mb-1">{av.titre}</p>
                        <p className="text-gray-500 text-xs leading-relaxed">{av.texte}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-gray-900 font-bold text-lg mb-1">{service.title}</h2>
              <p className="text-gray-500 text-sm mb-5">{service.subtitle}</p>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/${waNumber}?text=${waMsg}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm shadow-emerald-500/20"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 border border-gray-200 hover:border-nova-red/30 hover:bg-nova-red/5 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  <Phone className="h-5 w-5 text-nova-red" />
                  {phone}
                </a>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-xl transition-colors shadow-sm shadow-nova-red/20"
                >
                  <Calendar className="h-5 w-5" />
                  {pageContent["cta.btn"] || service.cta}
                </button>
              </div>

              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="flex items-center justify-center gap-2 w-full py-2.5 mt-3 text-gray-400 hover:text-gray-700 text-sm transition-colors"
              >
                <Share2 className="h-4 w-4" /> Partager ce service
              </button>

              {/* Quick features */}
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                {service.features.slice(0, 4).map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* All services */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-3 font-semibold">Autres services</p>
              <div className="space-y-1">
                {SERVICES.filter(s => s.id !== serviceId).map(s => {
                  const SI = s.icon;
                  return (
                    <Link key={s.id} href={`/services/${s.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <SI className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-gray-600 group-hover:text-gray-900 text-sm transition-colors">{s.title}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900 font-bold text-xl">Autres services NOVA</h2>
              <Link href="/services" className="text-nova-red text-sm hover:underline">Tout voir →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              className="bg-white border border-gray-100 rounded-2xl w-full max-w-md p-6 shadow-xl"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${service.iconBg} flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold">{pageContent["cta.btn"] || service.cta}</h3>
                  <p className="text-gray-500 text-xs">{service.title}</p>
                </div>
              </div>

              {sent ? (
                <div className="flex flex-col items-center py-8 gap-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  <p className="text-gray-900 font-semibold">Demande envoyée !</p>
                  <p className="text-gray-500 text-sm text-center">Nous vous contacterons dans les plus brefs délais.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Votre nom *"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nova-red/30 focus:border-nova-red/50" />
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Téléphone / WhatsApp *"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nova-red/30 focus:border-nova-red/50" />
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Précisez votre demande (optionnel)" rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nova-red/30 focus:border-nova-red/50 resize-none" />
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setShowModal(false)}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm hover:text-gray-900 hover:border-gray-300 transition-colors">
                      Annuler
                    </button>
                    <button onClick={sendLead} disabled={sending || !form.name || !form.phone}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-nova-red hover:bg-nova-red/90 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50">
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                      Envoyer
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
