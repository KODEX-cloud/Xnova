"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Zap, Shield, Phone, CreditCard, ChevronRight,
  Loader2, ArrowLeft, Lock,
} from "lucide-react";

type Plan = "GRATUIT" | "EN_AVANT" | "PREMIUM";
type PayMethod = "MTN" | "ORANGE" | "MOOV" | "CARD";
type Step = "plan" | "method" | "confirm" | "processing" | "done";

const PLANS = [
  {
    id: "GRATUIT" as Plan,
    label: "Gratuit",
    price: 0,
    duration: "30 jours",
    color: "border-gray-200 hover:border-gray-300",
    badge: null,
    features: [
      "Publication standard",
      "Visible dans la liste",
      "Pas de mise en avant",
    ],
  },
  {
    id: "EN_AVANT" as Plan,
    label: "En avant",
    price: 10000,
    duration: "30 jours",
    color: "border-purple-200 hover:border-purple-400",
    badge: "Populaire",
    badgeColor: "bg-purple-500",
    features: [
      "Badge \"En avant\"",
      "Position prioritaire",
      "Mise en avant 30 jours",
      "Statistiques basiques",
    ],
  },
  {
    id: "PREMIUM" as Plan,
    label: "Premium",
    price: 25000,
    duration: "60 jours",
    color: "border-yellow-300 hover:border-yellow-500",
    badge: "Meilleur",
    badgeColor: "bg-yellow-500",
    features: [
      "Badge \"Premium\"",
      "1ère position garantie",
      "Mise en avant 60 jours",
      "WhatsApp prioritaire",
      "Statistiques avancées",
    ],
  },
];

const METHODS = [
  { id: "MTN" as PayMethod, label: "MTN Mobile Money", icon: "🟡", prefix: "+225 07" },
  { id: "ORANGE" as PayMethod, label: "Orange Money", icon: "🟠", prefix: "+225 07" },
  { id: "MOOV" as PayMethod, label: "Moov Money", icon: "🔵", prefix: "+225 01" },
  { id: "CARD" as PayMethod, label: "Carte bancaire", icon: "💳", prefix: null },
];

export default function PaiementPage() {
  const router = useRouter();
  const [pendingTitle, setPendingTitle] = useState("votre annonce");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<string>("AUTOMOBILE");

  const [step, setStep] = useState<Step>("plan");
  const [plan, setPlan] = useState<Plan>("EN_AVANT");
  const [method, setMethod] = useState<PayMethod>("MTN");
  const [phone, setPhone] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const id = localStorage.getItem("nova_pending_id");
      const type = localStorage.getItem("nova_pending_type");
      const title = localStorage.getItem("nova_pending_title");
      if (id) setPendingId(id);
      if (type) setPendingType(type);
      if (title) setPendingTitle(title);
    } catch {}
  }, []);

  const selectedPlan = PLANS.find((p) => p.id === plan)!;

  function updatePlanInStorage(newPlan: Plan) {
    try {
      const raw = localStorage.getItem("nova_listings");
      if (!raw || !pendingId) return;
      const list = JSON.parse(raw);
      const updated = list.map((l: { id: string; plan?: string; paidAt?: string }) =>
        l.id === pendingId ? { ...l, plan: newPlan, paidAt: new Date().toISOString() } : l
      );
      localStorage.setItem("nova_listings", JSON.stringify(updated));
    } catch {}
  }

  function handleFreeSubmit() {
    updatePlanInStorage("GRATUIT");
    router.push("/dashboard/annonces");
  }

  function handleMethodNext() {
    setError("");
    if (method !== "CARD" && phone.replace(/\s/g, "").length < 8) {
      setError("Veuillez entrer un numéro de téléphone valide.");
      return;
    }
    if (method === "CARD") {
      if (cardNum.replace(/\s/g, "").length < 16) { setError("Numéro de carte invalide."); return; }
      if (!cardExp) { setError("Date d'expiration requise."); return; }
      if (cardCvc.length < 3) { setError("CVC invalide."); return; }
    }
    setStep("confirm");
  }

  async function handleConfirm() {
    setStep("processing");
    await new Promise((r) => setTimeout(r, 3000));
    updatePlanInStorage(plan);
    setStep("done");
    setTimeout(() => router.push("/paiement/success"), 800);
  }

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-label">
            <Zap className="h-3.5 w-3.5" /> Booster votre annonce
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Choisissez votre plan</h1>
          <p className="text-gray-500 text-sm">
            Annonce : <span className="text-gray-700 font-semibold">{pendingTitle}</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1 — Plan selection */}
          {step === "plan" && (
            <motion.div key="plan" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="grid gap-4 mb-8">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    className={`relative w-full text-left p-5 rounded-2xl bg-white border-2 transition-all duration-200 ${
                      plan === p.id ? p.color.replace("hover:", "") : p.color
                    } ${plan === p.id ? "shadow-lg" : ""}`}
                  >
                    {p.badge && (
                      <span className={`absolute -top-2.5 right-4 ${p.badgeColor} text-white text-xs font-bold px-3 py-0.5 rounded-full`}>
                        {p.badge}
                      </span>
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-900 font-black text-lg">{p.label}</span>
                          {plan === p.id && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        </div>
                        <p className="text-gray-400 text-xs mb-3">{p.duration}</p>
                        <ul className="space-y-1.5">
                          {p.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-black text-gray-900">{p.price === 0 ? "Gratuit" : `${p.price.toLocaleString("fr-FR")}`}</p>
                        {p.price > 0 && <p className="text-gray-400 text-xs">FCFA</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                {plan === "GRATUIT" ? (
                  <button
                    onClick={handleFreeSubmit}
                    className="flex-1 py-3.5 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-2xl transition-all hover:bg-gray-50"
                  >
                    Continuer gratuitement
                  </button>
                ) : (
                  <button
                    onClick={() => setStep("method")}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-2xl transition-all hover:shadow-lg hover:shadow-nova-red/30"
                  >
                    Payer {selectedPlan.price.toLocaleString("fr-FR")} FCFA
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Payment method */}
          {step === "method" && (
            <motion.div key="method" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <button onClick={() => setStep("plan")} className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Retour
              </button>

              <div className="p-5 rounded-2xl bg-gray-50 border-2 border-gray-200 mb-6">
                <p className="text-gray-400 text-xs mb-1">Plan sélectionné</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-black text-lg">{selectedPlan.label}</span>
                  <span className="text-nova-red font-black text-xl">{selectedPlan.price.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>

              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">Mode de paiement</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      method === m.id
                        ? "border-nova-red bg-orange-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-gray-800 font-semibold text-sm">{m.label}</span>
                    {method === m.id && <CheckCircle2 className="h-4 w-4 text-nova-red ml-auto" />}
                  </button>
                ))}
              </div>

              {/* Phone input for mobile money */}
              {method !== "CARD" && (
                <div className="mb-6">
                  <label className="text-gray-600 text-sm font-medium block mb-2">Numéro de téléphone</label>
                  <div className="flex">
                    <span className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 text-sm">
                      <Phone className="h-4 w-4 mr-1.5" />
                      {METHODS.find((m) => m.id === method)?.prefix}
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="XX XX XX XX"
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-r-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-nova-red/40"
                    />
                  </div>
                </div>
              )}

              {/* Card inputs */}
              {method === "CARD" && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-gray-600 text-sm font-medium block mb-2">Numéro de carte</label>
                    <input
                      type="text"
                      value={cardNum}
                      onChange={(e) => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-nova-red/40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-600 text-sm font-medium block mb-2">Expiration</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-nova-red/40"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium block mb-2">CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.slice(0, 4))}
                        placeholder="123"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-nova-red/40"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
                <Lock className="h-3.5 w-3.5" />
                Paiement 100% sécurisé — Vos données ne sont jamais partagées
              </div>

              <button
                onClick={handleMethodNext}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-2xl transition-all hover:shadow-lg hover:shadow-nova-red/30"
              >
                Confirmer le paiement
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 3 — Confirm */}
          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <button onClick={() => setStep("method")} className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Retour
              </button>

              <div className="p-6 rounded-3xl bg-white border-2 border-gray-200 shadow-sm mb-6">
                <h2 className="text-gray-900 font-black text-xl mb-6 text-center">Récapitulatif</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Annonce</span>
                    <span className="text-gray-800 font-semibold truncate max-w-[200px]">{pendingTitle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Plan</span>
                    <span className="text-gray-800 font-semibold">{selectedPlan.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Durée</span>
                    <span className="text-gray-800 font-semibold">{selectedPlan.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Méthode</span>
                    <span className="text-gray-800 font-semibold">{METHODS.find((m) => m.id === method)?.label}</span>
                  </div>
                  {phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Téléphone</span>
                      <span className="text-gray-800 font-semibold">{phone}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="text-gray-800 font-bold">Total</span>
                    <span className="text-nova-red font-black text-xl">{selectedPlan.price.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200 mb-6">
                <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 text-sm">
                  Un SMS de confirmation vous sera envoyé après le paiement. Votre annonce sera boostée immédiatement.
                </p>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold text-base rounded-2xl transition-all hover:shadow-xl hover:shadow-nova-red/30"
              >
                <CreditCard className="h-5 w-5" />
                Payer {selectedPlan.price.toLocaleString("fr-FR")} FCFA
              </button>
            </motion.div>
          )}

          {/* STEP 4 — Processing */}
          {(step === "processing" || step === "done") && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              {step === "processing" ? (
                <>
                  <Loader2 className="h-16 w-16 text-nova-red animate-spin mx-auto mb-6" />
                  <h2 className="text-gray-900 font-black text-2xl mb-3">Traitement en cours…</h2>
                  <p className="text-gray-400">Veuillez ne pas fermer cette page.</p>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                  <h2 className="text-gray-900 font-black text-2xl mb-3">Paiement accepté !</h2>
                  <p className="text-gray-400">Redirection en cours…</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
