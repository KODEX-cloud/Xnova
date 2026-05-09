import Link from "next/link";
import { Check, Zap, Star, ArrowRight, Shield, Car, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SUBSCRIPTION_PLANS, BOOST_OPTIONS, formatPrice } from "@/lib/plans";

export const metadata = {
  title: "Tarifs & Abonnements — NOVA Marketplace",
  description: "Choisissez le plan adapté à vos besoins et publiez vos annonces avec NOVA.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-rose-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-nova-red via-nova-orange to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label">Tarifs</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-4">
            Des plans adaptés à{" "}
            <span className="gradient-text-nova">chaque besoin</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Commencez gratuitement et évoluez selon votre activité.
            Publiez vos premières annonces sans engagement.
          </p>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl border-2 p-8 flex flex-col ${
                plan.popular
                  ? "border-nova-red shadow-2xl shadow-orange-200/60 scale-105"
                  : "border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all"
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold whitespace-nowrap"
                  style={{ background: plan.popular ? "linear-gradient(135deg, #F97316, #FB923C)" : "#7C3AED" }}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-gray-900">
                    {plan.price === 0 ? "0" : plan.price.toLocaleString("fr-FR")}
                  </span>
                  <span className="text-gray-500 text-sm pb-1.5">{plan.price === 0 ? "FCFA" : "FCFA/mois"}</span>
                </div>
                {plan.price === 0 && <p className="text-emerald-600 text-xs font-semibold mt-1">Toujours gratuit</p>}
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-gray-600 text-sm">
                    <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.popular ? "text-nova-red" : "text-emerald-500"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.price === 0 ? "/auth/register" : `/paiement?plan=${plan.id}`}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all group ${
                  plan.popular
                    ? "bg-gradient-to-r from-nova-red to-nova-orange text-white hover:shadow-xl hover:shadow-orange-300/50 hover:scale-[1.02]"
                    : "bg-gray-900 text-white hover:bg-gray-800 hover:scale-[1.02]"
                }`}
              >
                {plan.price === 0 ? "Commencer gratuitement" : `Choisir ${plan.name}`}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Boost options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label">Boosts d'annonces</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-4">
              Boostez la visibilité de vos annonces
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Payez à l'annonce selon votre besoin — sans abonnement obligatoire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BOOST_OPTIONS.map((boost) => (
              <div key={boost.id}
                className="bg-white rounded-3xl border-2 border-gray-100 hover:border-gray-200 p-7 hover:shadow-xl transition-all flex flex-col">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${boost.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">{boost.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{boost.description}</p>
                <div className="text-2xl font-black text-gray-900 mb-5">
                  {boost.price === 0 ? "Gratuit" : `${boost.price.toLocaleString("fr-FR")} FCFA`}
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {boost.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={boost.price === 0 ? "/publier" : `/paiement?boost=${boost.id}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors group">
                  {boost.price === 0 ? "Publier gratuitement" : `Booster pour ${formatPrice(boost.price)}`}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Questions fréquentes</h2>
        <div className="space-y-4">
          {[
            { q: "Puis-je annuler mon abonnement ?", a: "Oui, vous pouvez annuler à tout moment depuis votre tableau de bord. Votre abonnement reste actif jusqu'à la fin de la période payée." },
            { q: "Quels moyens de paiement sont acceptés ?", a: "Nous acceptons MTN Mobile Money, Orange Money, Moov Money et les cartes bancaires Visa/Mastercard." },
            { q: "Que se passe-t-il à l'expiration ?", a: "Vos annonces passent en statut « expiré » mais ne sont pas supprimées. Vous pouvez les réactiver en renouvelant votre abonnement." },
            { q: "Y a-t-il des frais cachés ?", a: "Non. Les prix affichés sont tout compris. Aucune surprise sur votre facture." },
            { q: "Comment fonctionne le boost d'annonce ?", a: "Le boost propulse votre annonce en première position et lui ajoute un badge visible. La durée dépend du boost choisi (30 ou 60 jours)." },
          ].map(({ q, a }) => (
            <details key={q} className="group bg-white border-2 border-gray-100 rounded-2xl p-5 cursor-pointer hover:border-gray-200 transition-colors">
              <summary className="flex items-center justify-between font-bold text-gray-800 text-sm list-none">
                {q}
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-nova-red to-nova-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Prêt à commencer ?</h2>
          <p className="text-white/80 text-lg mb-8">Créez votre compte gratuit et publiez votre première annonce en moins de 5 minutes.</p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-black hover:shadow-2xl hover:scale-105 transition-all group">
            Créer un compte gratuit
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
