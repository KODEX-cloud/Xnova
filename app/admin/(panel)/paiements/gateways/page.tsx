"use client";

import { useEffect, useState } from "react";
import { CreditCard, Save, Loader2, CheckCircle, ToggleLeft, ToggleRight } from "lucide-react";

interface Gateway {
  id: string;
  label: string;
  desc: string;
  configFields: { key: string; label: string; secret?: boolean }[];
}

const GATEWAYS: Gateway[] = [
  {
    id: "cinetpay",
    label: "CinetPay",
    desc: "Agrégateur de paiements africain (MoMo, Orange, Wave, Carte)",
    configFields: [
      { key: "cinetpay.apiKey", label: "API Key", secret: true },
      { key: "cinetpay.siteId", label: "Site ID" },
    ],
  },
  {
    id: "mtn",
    label: "MTN MoMo",
    desc: "MTN Mobile Money — Côte d'Ivoire, Cameroun, Congo",
    configFields: [
      { key: "mtn.subscriptionKey", label: "Subscription Key", secret: true },
      { key: "mtn.apiUser", label: "API User" },
      { key: "mtn.apiKey", label: "API Key", secret: true },
    ],
  },
  {
    id: "orange",
    label: "Orange Money",
    desc: "Orange Money — Côte d'Ivoire et UEMOA",
    configFields: [
      { key: "orange.clientId", label: "Client ID", secret: true },
      { key: "orange.clientSecret", label: "Client Secret", secret: true },
    ],
  },
  {
    id: "wave",
    label: "Wave",
    desc: "Wave — Sénégal, Côte d'Ivoire",
    configFields: [
      { key: "wave.apiKey", label: "API Key", secret: true },
    ],
  },
  {
    id: "stripe",
    label: "Stripe",
    desc: "Carte bancaire internationale (Visa, Mastercard)",
    configFields: [
      { key: "stripe.publishableKey", label: "Publishable Key" },
      { key: "stripe.secretKey", label: "Secret Key", secret: true },
      { key: "stripe.webhookSecret", label: "Webhook Secret", secret: true },
    ],
  },
];

export default function GatewaysPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings?prefix=payment.")
      .then(r => r.json())
      .then(d => { setSettings(d || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    const k = `payment.${id}.enabled`;
    setSettings(p => ({ ...p, [k]: p[k] === "true" ? "false" : "true" }));
  };

  const set = (key: string, val: string) => setSettings(p => ({ ...p, [key]: val }));

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <CreditCard size={20} className="text-nova-red" /> Gateways de paiement
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Activez et configurez vos moyens de paiement</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-all">
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? "Enregistré !" : "Enregistrer"}
        </button>
      </div>

      <div className="space-y-4">
        {GATEWAYS.map(gw => {
          const enabled = settings[`payment.${gw.id}.enabled`] === "true";
          return (
            <div key={gw.id} className={`bg-[#111827] border rounded-2xl p-5 transition-all ${enabled ? "border-nova-red/30" : "border-white/5"}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold">{gw.label}</h3>
                    {enabled && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/20">Actif</span>}
                  </div>
                  <p className="text-white/40 text-sm mt-0.5">{gw.desc}</p>
                </div>
                <button onClick={() => toggle(gw.id)}
                  className={`flex-shrink-0 transition-colors ${enabled ? "text-emerald-400 hover:text-emerald-300" : "text-white/20 hover:text-white/40"}`}>
                  {enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>

              {enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/5">
                  {gw.configFields.map(f => (
                    <div key={f.key}>
                      <label className="text-white/40 text-xs mb-1 block">{f.label}</label>
                      <input
                        type={f.secret ? "password" : "text"}
                        value={settings[`payment.${f.key}`] || ""}
                        onChange={e => set(`payment.${f.key}`, e.target.value)}
                        placeholder={f.secret ? "••••••••" : ""}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-nova-red/40 placeholder-white/20"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="text-white/40 text-xs mb-1 block">Webhook URL</label>
                    <p className="text-white/30 text-xs font-mono bg-white/[0.03] rounded-lg px-3 py-2 border border-white/5 select-all">
                      {typeof window !== "undefined" ? window.location.origin : "https://votre-domaine.com"}/api/payments/webhook
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
