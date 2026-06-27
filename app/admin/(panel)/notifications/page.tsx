"use client";

import { useState } from "react";
import { Bell, Send, Users, Megaphone, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

const TYPES = [
  { id: "SYSTEM", label: "Système" },
  { id: "PAYMENT", label: "Paiement" },
  { id: "SUBSCRIPTION", label: "Abonnement" },
  { id: "LISTING", label: "Annonce" },
  { id: "MESSAGE", label: "Message" },
];

export default function NotificationsAdminPage() {
  const [form, setForm] = useState({
    type: "SYSTEM", title: "", body: "", link: "",
    broadcast: true, userIds: "",
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent?: number; error?: string } | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    const payload: any = {
      type: form.type,
      title: form.title,
      body: form.body || undefined,
      link: form.link || undefined,
      broadcast: form.broadcast,
    };
    if (!form.broadcast && form.userIds) {
      payload.userIds = form.userIds.split(",").map(s => s.trim()).filter(Boolean);
    }
    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setResult(data);
    setSending(false);
    if (res.ok) setForm(p => ({ ...p, title: "", body: "", link: "", userIds: "" }));
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-white text-xl font-bold flex items-center gap-2">
          <Bell size={20} className="text-violet-400" /> Notifications
        </h1>
        <p className="text-white/40 text-sm mt-0.5">Envoyer des notifications push à vos utilisateurs</p>
      </div>

      <form onSubmit={send} className="bg-[#111827] border border-white/5 rounded-2xl p-6 space-y-4">
        {/* Type */}
        <div>
          <label className="text-white/50 text-xs mb-1.5 block">Type</label>
          <select value={form.type} onChange={set("type")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/40 appearance-none">
            {TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="text-white/50 text-xs mb-1.5 block">Titre <span className="text-nova-red">*</span></label>
          <input value={form.title} onChange={set("title")} required
            placeholder="Titre de la notification"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/40 placeholder-white/20" />
        </div>

        {/* Body */}
        <div>
          <label className="text-white/50 text-xs mb-1.5 block">Message (optionnel)</label>
          <textarea value={form.body} onChange={set("body")} rows={3}
            placeholder="Contenu de la notification..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/40 placeholder-white/20 resize-none" />
        </div>

        {/* Link */}
        <div>
          <label className="text-white/50 text-xs mb-1.5 block">Lien (optionnel)</label>
          <input value={form.link} onChange={set("link")}
            placeholder="/dashboard/abonnement"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/40 placeholder-white/20" />
        </div>

        {/* Audience */}
        <div>
          <label className="text-white/50 text-xs mb-2 block">Audience</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setForm(p => ({ ...p, broadcast: true }))}
              className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${form.broadcast ? "border-nova-red bg-nova-red/10 text-nova-red" : "border-white/10 text-white/40 hover:border-white/20"}`}>
              <Megaphone size={14} /> Tous les utilisateurs
            </button>
            <button type="button" onClick={() => setForm(p => ({ ...p, broadcast: false }))}
              className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${!form.broadcast ? "border-nova-red bg-nova-red/10 text-nova-red" : "border-white/10 text-white/40 hover:border-white/20"}`}>
              <Users size={14} /> Utilisateurs spécifiques
            </button>
          </div>
          {!form.broadcast && (
            <div className="mt-2">
              <label className="text-white/40 text-xs mb-1 block">IDs utilisateurs (séparés par virgule)</label>
              <input value={form.userIds} onChange={set("userIds")}
                placeholder="id1, id2, id3"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/40 placeholder-white/20" />
            </div>
          )}
        </div>

        {result && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${result.sent !== undefined ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
            {result.sent !== undefined ? <><CheckCircle size={14} /> {result.sent} notification{result.sent > 1 ? "s" : ""} envoyée{result.sent > 1 ? "s" : ""}</> : <><AlertTriangle size={14} /> {result.error}</>}
          </div>
        )}

        <button type="submit" disabled={sending || !form.title.trim()}
          className="w-full py-3 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2">
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {sending ? "Envoi en cours..." : "Envoyer la notification"}
        </button>
      </form>

      {/* Info */}
      <div className="mt-4 bg-[#111827] border border-white/5 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2"><Bell size={15} className="text-white/40" /> Canaux disponibles</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "In-app", desc: "Centre de notifications", status: "Actif" },
            { label: "Email", desc: "SMTP (à configurer)", status: "Inactif" },
            { label: "SMS", desc: "Twilio (à configurer)", status: "Inactif" },
            { label: "WhatsApp", desc: "Meta Business API", status: "Inactif" },
          ].map(ch => (
            <div key={ch.label} className="bg-white/[0.03] rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white text-sm font-medium">{ch.label}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${ch.status === "Actif" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                  {ch.status}
                </span>
              </div>
              <p className="text-white/30 text-xs">{ch.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
