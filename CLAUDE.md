# CLAUDE.md — NOVA MARKETPLACE
> Source de vérité architecturale pour l'assistant IA (CTO mode)
> Mis à jour : 24 juin 2026

---

## RÔLE DE L'ASSISTANT

Tu es le CTO Principal du projet NOVA Marketplace.
Tu dois toujours : **Comprendre → Analyser → Planifier → Modifier → Tester → Documenter**
Avant toute modification, lire ce fichier + PROJECT_STATE.md.

---

## RÈGLES ABSOLUES

1. **Ne jamais casser** les routes existantes, le SEO, Prisma, les pages dynamiques
2. **Ne jamais restructurer massivement** sans validation explicite de l'utilisateur
3. **Ne jamais déployer, supprimer, migrer** sans instruction explicite
4. **Ne jamais modifier plusieurs modules simultanément** sans plan validé
5. **Ne jamais générer de migration Prisma inutile**
6. Toujours fournir : Analyse → Fichiers concernés → Risques → Plan → Exécution

---

## STACK TECHNIQUE

| Couche | Technologie | Version |
|--------|------------|---------|
| Framework | Next.js App Router | 15.5.15 |
| Runtime | React | 18 |
| ORM | Prisma | 5.22.0 |
| Base de données | PostgreSQL via Supabase | — |
| Auth | NextAuth.js | 4.24.14 |
| Styles | Tailwind CSS | 3.4.1 |
| Upload | Local (/api/upload) | Cloudinary désactivé |
| Animations | Framer Motion | 11.3.19 |
| Drag & Drop | DND Kit | 6.3.1 |
| Éditeur | Tiptap | 3.22.3 |

---

## ARCHITECTURE CMS

### Source unique de vérité CMS : table `SiteSetting` (clé-valeur)

Préfixes de clés actifs :
- `design.*` → Design System (28 variables CSS)
- `homepage.*` → Configuration page d'accueil (40+ clés)
- `nav.*` → Navbar (megamenu JSON, mobilemenu JSON, logo, CTA)
- `annonces.*` → Page /annonces (hero, tri, filtres, pagination)
- `page.{slug}.*` → Contenu par page (Page Builder)
- `footer*` → Footer (tagline, copyright, colonnes, villes, newsletter)
- `logo*` → Branding (logoUrl, logoText, logoTagline)
- `siteName`, `phone`, `email`, `address` → Paramètres globaux
- `facebook`, `instagram`, `twitter`, `youtube` → Réseaux sociaux
- `googleAnalyticsId` → Analytics

### Fichiers CMS clés

| Fichier | Rôle |
|---------|------|
| `components/ui/DynamicStyles.tsx` | Injecte CSS custom properties depuis DB (revalidate=60s) |
| `lib/get-page-seo.ts` | Utilitaire SEO : lit prisma.page.findUnique pour generateMetadata |
| `lib/nav-defaults.ts` | Fallbacks Navbar (NAV_ITEMS_DEFAULT, parseNavJson) |
| `lib/icon-map.ts` | Dictionnaire Lucide icons (string → composant) |
| `lib/services-data.ts` | Données services hardcodées (fallback, non en DB) |

### API CMS

| Endpoint | Usage |
|----------|-------|
| `GET/PUT /api/settings` | Lire/écrire SiteSetting (paramètres globaux) |
| `GET/PUT /api/design` | Design System |
| `GET/PUT /api/homepage` | Config homepage |
| `GET/PUT /api/pages/[slug]/sections` | Sections Page Builder |
| `GET /api/settings?prefix=X.` | Filtrer par préfixe |

---

## MODÈLE PRISMA — 14 TABLES

```
User, Payment, Subscription, Car, Property, BlogPost,
Page, MenuItem, Media, SiteSetting, Promotion, Testimonial, FaqItem, Lead, ContactMessage
```

Indexes UNIQUE critiques : `Car.slug`, `Property.slug`, `BlogPost.slug`, `Page.slug`, `Payment.reference`, `SiteSetting.key`

---

## CONVENTIONS CODE

### SEO — generateMetadata
Toujours utiliser `getPageSeo(slug, defaults)` depuis `lib/get-page-seo.ts` :
```tsx
export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("mon-slug", { title: "...", description: "..." });
}
```

### Fallback pattern
Toutes les données dynamiques ont un fallback hardcodé. Le site ne plante jamais si la DB est vide.
```tsx
const title = pageContent["hero.title"] || service.title; // DB → fallback
```

### Settings fetch côté client
```tsx
useEffect(() => {
  fetch("/api/settings?prefix=maPrefixe.")
    .then(r => r.json())
    .then(data => setState(data || {}))
    .catch(() => {});
}, []);
```

---

## ROUTES PUBLIQUES

```
/                     Homepage CMS dynamique
/automobile           Catalogue voitures
/automobile/[id]      Fiche voiture (slug SEO)
/immobilier           Catalogue propriétés
/immobilier/[id]      Fiche propriété (slug SEO)
/blog                 Liste articles
/blog/[slug]          Article (slug SEO)
/services             Vue d'ensemble services
/services/[id]        Service dynamique
/services/location-voiture | /location-immo | /achat-vente-immo | /pieces-auto | /flotte
/annonces             Toutes annonces (auto + immo)
/about                À propos
/contact              Contact + formulaire
/faq                  FAQ dynamique (FaqItem DB)
/confidentialite      Politique confidentialité (SiteSetting)
/cgu                  Conditions générales (SiteSetting)
/sitemap              Plan du site
/pricing              Tarifs
```

---

## ADMIN PANEL (/admin)

| Route | Module |
|-------|--------|
| `/admin/dashboard` | Stats globales |
| `/admin/homepage` | CMS page d'accueil |
| `/admin/pages/[...slug]` | Page Builder (toutes pages) |
| `/admin/apparence` | Branding + Header + Footer + Liens + SEO |
| `/admin/menus` | Menus drag&drop + Mega Menu JSON |
| `/admin/faq` | CRUD FaqItem |
| `/admin/medias` | Médiathèque |
| `/admin/seo` | SEO par page (16 pages) |
| `/admin/design` | Design System (28 variables CSS) |
| `/admin/automobiles` | CRUD voitures |
| `/admin/immobilier` | CRUD propriétés |
| `/admin/blog` | CRUD articles |
| `/admin/temoignages` | CRUD témoignages |
| `/admin/promotions` | CRUD promotions |
| `/admin/utilisateurs` | Gestion utilisateurs |
| `/admin/leads` | Leads & messages |
| `/admin/paiements` | Historique paiements |
| `/admin/parametres` | Paramètres globaux |

---

## FICHIERS STRATÉGIQUES À CONSULTER EN PRIORITÉ

1. `CLAUDE.md` (ce fichier) — règles du projet
2. `PROJECT_STATE.md` — état actuel, tâches récentes, prochaines étapes
3. `NOVA_AUDIT_MASTER.md` — audit architecture complet
4. `CMS_CONTROL_MATRIX.md` — matrice CMS (pré-Phase 3)
5. `CMS_100_PERCENT_REPORT.md` — rapport CMS post-Phase 3 (à générer)

---

## PROBLÈMES CONNUS (non bloquants)

| Problème | Gravité | Fichier |
|----------|---------|---------|
| Cloudinary désactivé (.env commenté) | 🟡 Upload local seulement | `.env.local` |
| Analytics non injectés | 🟡 ID en DB, pas de script dans layout | `app/layout.tsx` |
| SMTP non implémenté | 🟡 Config présente, pas de nodemailer | API routes |
| Paiements Mobile Money simulés | 🔴 Prod impossible | `api/payments/route.ts` |
| Rôles AGENT non cloisonnés | 🟡 AGENT_AUTO/IMMO voient tout | `middleware.ts` |
| `services-data.ts` hardcodé | 🟡 Données services non en DB | `lib/services-data.ts` |

---

## MÉMOIRE RAPIDE

- **Carousel hero homepage** : `HomepageHero.tsx` (split mode) a une floating card et mini-stats HARDCODÉES
- **FeaturedListings** : titre "Nos meilleures offres" hardcodé dans `FeaturedListings.tsx`
- **BlogSection** : titre/sous-titre hardcodés dans `BlogSection.tsx`
- **StatsSection** : pill "NOVA en chiffres" hardcodé dans `StatsSection.tsx`
- **WhatsApp float** : lit `SiteSetting.whatsapp` ✅ opérationnel
- **DynamicStyles** : Server Component, revalidate implicite 60s via ISR layout
