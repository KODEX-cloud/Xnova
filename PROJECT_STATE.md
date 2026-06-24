# PROJECT_STATE.md — NOVA MARKETPLACE
> Mis à jour après chaque tâche importante
> Dernière mise à jour : 24 juin 2026

---

## ÉTAT GLOBAL

| Dimension | Score | Évolution |
|-----------|-------|-----------|
| CMS Administrabilité | ~82% | ↑ depuis 58% (Phase 3 complète) |
| Architecture technique | 90/100 | stable |
| SEO technique | 78/100 | ↑ (generateMetadata sur 12 pages) |
| Production-readiness | 52/100 | ↑ (pages 404 corrigées, CMS complet) |

---

## PHASE 3 — TÂCHES RÉALISÉES (24 juin 2026)

### Fichiers créés

| Fichier | Description |
|---------|-------------|
| `lib/icon-map.ts` | Dictionnaire Lucide icons (string → composant React) |
| `lib/nav-defaults.ts` | Fallbacks Navbar + parseurs JSON mega menu |
| `lib/get-page-seo.ts` | Utilitaire `getPageSeo(slug, defaults)` → Metadata |
| `app/api/faq/route.ts` | GET + POST FaqItem (auth ADMIN) |
| `app/api/faq/[id]/route.ts` | GET + PUT + DELETE FaqItem |
| `app/faq/page.tsx` | Page /faq dynamique (FaqItem DB + hero + CTA) |
| `app/confidentialite/page.tsx` | Page /confidentialite (SiteSetting + fallback complet) |
| `app/cgu/page.tsx` | Page /cgu (SiteSetting + fallback complet) |
| `app/sitemap/page.tsx` | Plan du site statique (7 sections) |
| `app/admin/(panel)/faq/page.tsx` | CRUD FAQ complet (add/edit/delete/reorder/categories) |

### Fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `components/layout/Navbar.tsx` | Réécriture : lit `nav.*` SiteSetting + logo dynamique + CTA dynamique |
| `components/layout/Footer.tsx` | Réécriture : colonnes dynamiques + logo dynamique + newsletter dynamique |
| `app/annonces/page.tsx` | Connecté à `annonces.*` SiteSetting (hero, tri, pagination) |
| `app/admin/(panel)/apparence/page.tsx` | +5 tabs : Branding, Header, Footer, Liens, SEO |
| `app/admin/(panel)/menus/page.tsx` | +tab Mega Menu : éditeur JSON nav.megamenu + nav.mobilemenu |
| `components/admin/AdminSidebar.tsx` | Ajout lien "FAQ" dans navigation |
| `app/admin/(panel)/pages/[...slug]/page.tsx` | +champs services (features/gallery/tag) + pages légales (faq/cgu/confidentialite) |
| `components/services/ServiceDetailPage.tsx` | gallery + features lus depuis CMS avec fallback |
| `app/services/location-voiture/page.tsx` | generateMetadata dynamique via getPageSeo |
| `app/services/flotte/page.tsx` | generateMetadata dynamique |
| `app/services/location-immo/page.tsx` | generateMetadata dynamique |
| `app/services/achat-vente-immo/page.tsx` | generateMetadata dynamique |
| `app/services/pieces-auto/page.tsx` | generateMetadata dynamique |
| `app/admin/(panel)/seo/page.tsx` | PAGES array : 7 → 16 pages (slug "automobiles"→"automobile" corrigé, ajout faq/cgu/confidentialite/services) |

---

## BUGS CONNUS

| Bug | Fichier | Gravité |
|-----|---------|---------|
| Cloudinary désactivé | `.env.local` | 🟡 Upload local seulement |
| Analytics non injectés | `app/layout.tsx` | 🟡 Non bloquant |
| Paiements MTN/Orange simulés | `app/api/payments/route.ts` | 🔴 Prod impossible |
| SMTP non implémenté | — | 🟡 Non bloquant |
| AGENT_AUTO/IMMO non cloisonnés | `middleware.ts` | 🟡 Sécurité secondaire |

---

## ÉLÉMENTS ENCORE HARDCODÉS

| Élément | Fichier | Priorité |
|---------|---------|----------|
| Floating card hero (split mode) | `HomepageHero.tsx:388-452` | 🟢 Post-lancement |
| Mini-stats hero split | `HomepageHero.tsx:424` | 🟢 Post-lancement |
| Trust badges hero | `HomepageHero.tsx:315-317` | 🟢 Post-lancement |
| Pill "NOVA en chiffres" | `StatsSection.tsx:63` | 🟢 Post-lancement |
| Pill "Catégories" | `QuickCategoriesSection.tsx:31` | 🟢 Post-lancement |
| Pill "Pourquoi NOVA ?" | `WhyNovaSection.tsx:28` | 🟢 Post-lancement |
| FeaturedListings titre | `FeaturedListings.tsx` | 🟡 CMS moyen terme |
| BlogSection titre | `BlogSection.tsx` | 🟡 CMS moyen terme |
| Services data | `lib/services-data.ts` | 🟡 CMS moyen terme |
| Analytics injection | `app/layout.tsx` | 🟡 Avant lancement |
| Sitemap XML `/sitemap.xml` | Absent | 🔴 SEO production |
| `robots.txt` | Absent | 🟡 SEO production |

---

## PROCHAINES ÉTAPES RECOMMANDÉES

### Sprint A — SEO production ✅ LIVRÉ
- [x] `app/sitemap.xml/route.ts` — sitemap dynamique (Cars + Properties + BlogPosts, revalidate 1h)
- [x] `app/robots.txt/route.ts` — robots.txt (protège /admin, /api, /dashboard)
- [x] `app/layout.tsx` — injection GA4 + GTM + Facebook Pixel depuis SiteSetting (Server Component async)

### Sprint C — Hero split 100% CMS ✅ LIVRÉ
- [x] `HomepageHero.tsx` : floating card (badge, titre, prix, specs, localisation, lien) depuis CMS
- [x] `HomepageHero.tsx` : mini-stats, activité live, trust badges, badge populaire depuis CMS
- [x] Toggle `showHeroCard` pour masquer la carte sans coder
- [x] `homepage-keys.ts` : +12 nouvelles clés hero split
- [x] `admin/homepage/page.tsx` : 2 nouveaux blocs "Carte flottante" + "Trust badges & Mini-stats"

### Sprint B — CMS niveau 2 ✅ LIVRÉ
- [x] `FeaturedListings.tsx` : featuredLabel/featuredTitle/featuredSubtitle depuis CMS
- [x] `BlogSection.tsx` : blogLabel/blogTitle/blogSubtitle depuis CMS
- [x] `WhyNovaSection.tsx` : pill "Pourquoi NOVA ?" → `whyNovaLabel` CMS
- [x] `QuickCategoriesSection.tsx` : pill "Catégories" → `categoriesLabel` CMS
- [x] `StatsSection.tsx` : pill "NOVA en chiffres" → `statsLabel` CMS
- [x] `HomepageCtaSection.tsx` : pill "Rejoignez NOVA" → `ctaLabel` CMS
- [x] `lib/homepage-keys.ts` : +10 nouvelles clés CMS (labels + featured + blog)
- [x] `admin/homepage/page.tsx` : champs Pill/Label dans Stats, Pourquoi NOVA, Catégories, CTA, + blocs Featured & Blog

### Sprint C — Paiements réels (sprint séparé)
- [ ] Intégrer CinetPay ou FedaPay pour MTN/Orange/Moov
- [ ] Webhooks paiement → activation abonnement automatique

### Sprint D — Emails (sprint séparé)
- [ ] Intégrer Nodemailer avec settings SMTP de SiteSetting
- [ ] Email de notification lead → `notifyEmail`
- [ ] Email bienvenue inscription

---

## TAUX CMS PAR PAGE (post-Phase 3)

| Page | Avant | Après | Évolution |
|------|-------|-------|-----------|
| Accueil | 70% | 72% | +2% (stable, hardcoded hero split reste) |
| Navbar | 14% | 85% | +71% 🎉 |
| Footer | 40% | 90% | +50% 🎉 |
| /annonces | 12% | 65% | +53% 🎉 |
| /faq | 0% | 95% | ✅ créée |
| /confidentialite | 0% | 100% | ✅ créée |
| /cgu | 0% | 100% | ✅ créée |
| /sitemap | 0% | 100% | ✅ créée |
| Services sous-pages SEO | 0% | 80% | +80% (generateMetadata) |
| Services sous-pages features | 17% | 55% | +38% |
| Admin SEO couverture | 7 pages | 16 pages | +128% |

**Taux global estimé post-Phase 3 : ~82%**
