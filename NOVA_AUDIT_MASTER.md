# NOVA MARKETPLACE — AUDIT MASTER COMPLET
> Généré le 24 juin 2026 | Architecte : Claude Sonnet 4.6
> Version du projet : 0.1.0 | Next.js 15.5.15 | Prisma 5.22 | PostgreSQL (Supabase)

---

## SOMMAIRE EXÉCUTIF

NOVA est une **marketplace premium automobile & immobilier** ciblant la Côte d'Ivoire (Abidjan). Le projet repose sur une stack moderne Next.js App Router + Prisma + PostgreSQL avec un CMS headless complet administrable depuis `/admin`. Le projet est **fonctionnellement avancé** pour un MVP mais présente plusieurs **zones incomplètes** nécessitant attention avant une mise en production professionnelle.

---

## PHASE 1 — ARCHITECTURE GÉNÉRALE

### Stack technique

| Couche | Technologie | Version |
|--------|------------|---------|
| Framework | Next.js (App Router) | 15.5.15 |
| Runtime | React | 18 |
| Base de données | PostgreSQL (Supabase) | via Prisma |
| ORM | Prisma Client | 5.22.0 |
| Authentification | NextAuth.js | 4.24.14 |
| Upload images | Cloudinary | 2.9.0 ⚠️ (désactivé dans .env) |
| Éditeur rich text | Tiptap | 3.22.3 |
| Animations | Framer Motion | 11.3.19 |
| Drag & Drop | DND Kit | 6.3.1 |
| Styles | Tailwind CSS | 3.4.1 |
| Formulaires | React Hook Form + Zod | 7.72 / 4.3.6 |
| Icônes | Lucide React | 0.414.0 |

### Variables d'environnement

```
DATABASE_URL       = PostgreSQL pooler (Supabase) ✅
DIRECT_URL         = PostgreSQL direct (migrations) ✅
NEXTAUTH_URL       = URL de l'app ✅
NEXTAUTH_SECRET    = Secret JWT ✅
CLOUDINARY_*       = ⚠️ COMMENTÉS dans .env.local — upload cloud désactivé
```

---

## PHASE 2 — CARTOGRAPHIE COMPLÈTE DES ROUTES

### 2.1 Pages publiques

```
/                              Homepage dynamique (CMS + DB)
├── /automobile                Catalogue voitures
│   ├── /automobile/[id]       Fiche détail voiture
│   ├── /automobile/vente      Filtre : vente uniquement
│   ├── /automobile/location   Filtre : location uniquement
│   └── /automobile/pieces     Pièces détachées
├── /immobilier                Catalogue immobilier
│   ├── /immobilier/[id]       Fiche détail propriété
│   ├── /immobilier/vente      Filtre : vente
│   ├── /immobilier/location   Filtre : location
│   ├── /immobilier/maisons    Filtre : maisons
│   ├── /immobilier/studios    Filtre : studios meublés
│   └── /immobilier/terrains   Filtre : terrains
├── /blog                      Liste articles
│   ├── /blog/[slug]           Article détail
│   ├── /blog/actualites       Catégorie actualités
│   ├── /blog/automobile       Catégorie auto
│   ├── /blog/guides           Catégorie guides
│   └── /blog/immobilier       Catégorie immo
├── /services                  Vue d'ensemble services
│   ├── /services/[id]         Service dynamique par ID
│   ├── /services/location-voiture
│   ├── /services/location-immo
│   ├── /services/achat-vente-immo
│   ├── /services/pieces-auto
│   └── /services/flotte
├── /annonces                  Toutes les annonces (auto + immo)
├── /about                     À propos ✅
├── /contact                   Contact + formulaire
│   ├── /contact/callback      Callback téléphonique
│   └── /contact/success       Confirmation envoi
├── /pricing                   Tarifs abonnements
├── /auth/login                Connexion utilisateur
├── /auth/register             Inscription utilisateur
└── /paiement                  Portail paiement
    ├── /paiement/success      Confirmation paiement
    └── /paiement/cancel       Annulation paiement
```

#### ⚠️ Pages référencées mais MANQUANTES dans app/ :
```
/a-propos          → Footer lie /a-propos, mais seul /about existe → 404
/faq               → Footer lie /faq → 404
/confidentialite   → Footer lie → 404
/cgu               → Footer lie → 404
/sitemap           → Footer lie → 404
```

### 2.2 Pages utilisateur connecté (dashboard)

```
/dashboard                       Tableau de bord personnel
├── /dashboard/annonces          Mes annonces
│   └── /dashboard/annonces/[id] Modifier mon annonce
├── /dashboard/abonnement        Mon abonnement & plan
├── /dashboard/paiements         Historique paiements
└── /dashboard/parametres        Mon profil

/publier                         Choisir catégorie à publier
├── /publier/automobile          Formulaire publication voiture
└── /publier/immobilier          Formulaire publication bien
```

### 2.3 Pages admin (/admin)

```
/admin                           → Redirect vers /admin/(panel)/dashboard
/admin/login                     Page connexion admin (publique)

/admin/(panel)/dashboard         Tableau de bord + stats
/admin/(panel)/annonces          Toutes les annonces (auto + immo)
/admin/(panel)/annonces-page     ⚠️ Page CMS pour la page /annonces
/admin/(panel)/homepage          CMS Homepage (hero, sections, CTA, content)
/admin/(panel)/design            Design System (couleurs, polices, espacement)
/admin/(panel)/ui-control        Contrôle UI composants (cartes, boutons)
/admin/(panel)/pages             Page Builder (sections par page)
/admin/(panel)/pages/[...slug]   Éditeur de page spécifique
/admin/(panel)/menus             Gestion menus (drag & drop)
/admin/(panel)/medias            Médiathèque (upload + gestion)
/admin/(panel)/leads             Gestion des leads
/admin/(panel)/messages          Messages de contact
/admin/(panel)/temoignages       Témoignages clients
/admin/(panel)/promotions        Promotions & offres spéciales
/admin/(panel)/seo               SEO par page
/admin/(panel)/abonnements       Gestion abonnements
/admin/(panel)/paiements         Historique paiements
/admin/(panel)/utilisateurs      Gestion utilisateurs
/admin/(panel)/parametres        Paramètres globaux du site

/admin/automobiles               Liste voitures admin
/admin/automobiles/nouveau       Créer voiture
/admin/automobiles/[id]          Modifier voiture

/admin/immobilier                Liste propriétés admin
/admin/immobilier/nouveau        Créer propriété
/admin/immobilier/[id]           Modifier propriété

/admin/blog                      Liste articles
/admin/blog/nouveau              Créer article
/admin/blog/[id]                 Modifier article
```

### 2.4 API Routes (35 endpoints)

```
Auth
  POST   /api/auth/[...nextauth]    NextAuth (login/logout/session)
  POST   /api/register              Inscription utilisateur

Annonces unifiées
  GET    /api/annonces              Toutes annonces (auto+immo), filtres, pagination
  POST   /api/annonces              Créer annonce
  GET    /api/annonces/[id]         Détail
  PUT    /api/annonces/[id]         Modifier
  DELETE /api/annonces/[id]         Supprimer
  POST   /api/annonces/upload       Upload image annonce

Automobiles
  GET    /api/cars                  Liste voitures
  POST   /api/cars                  Créer voiture (admin)
  GET    /api/cars/[id]             Détail voiture
  PUT    /api/cars/[id]             Modifier voiture
  DELETE /api/cars/[id]             Supprimer voiture

Propriétés
  GET    /api/properties            Liste propriétés
  POST   /api/properties            Créer propriété (admin)
  GET    /api/properties/[id]       Détail propriété
  PUT    /api/properties/[id]       Modifier propriété
  DELETE /api/properties/[id]       Supprimer propriété

Blog
  GET    /api/blog                  Liste articles
  POST   /api/blog                  Créer article (admin)
  GET    /api/blog/[id]             Détail article
  PUT    /api/blog/[id]             Modifier article
  DELETE /api/blog/[id]             Supprimer article

CMS / Design
  GET    /api/design                Récupérer settings design
  PUT    /api/design                Sauvegarder settings design
  GET    /api/homepage              Récupérer config homepage
  PUT    /api/homepage              Sauvegarder config homepage
  GET    /api/settings              Paramètres globaux site
  PUT    /api/settings              Sauvegarder paramètres
  GET    /api/pages                 Liste pages CMS
  POST   /api/pages                 Créer page CMS
  GET    /api/pages?slug=X          Page CMS par slug
  GET    /api/pages/[slug]/sections Sections d'une page
  PUT    /api/pages/[slug]/sections Sauvegarder sections

Médias
  GET    /api/media                 Liste médias
  POST   /api/media                 Upload média
  PUT    /api/media/[id]            Modifier métadonnées
  DELETE /api/media/[id]            Supprimer média
  POST   /api/upload                Upload général (Cloudinary)

Menus
  GET    /api/menus                 Liste menu items
  POST   /api/menus                 Créer item
  PUT    /api/menus/[id]            Modifier item
  DELETE /api/menus/[id]            Supprimer item

Leads & Messages
  GET    /api/leads                 Liste leads
  POST   /api/leads                 Créer lead
  PATCH  /api/leads/[id]            Marquer lu
  POST   /api/contact               Message de contact

Témoignages & Promotions
  GET    /api/testimonials          Liste témoignages
  POST   /api/testimonials          Créer témoignage
  PUT    /api/testimonials/[id]     Modifier
  DELETE /api/testimonials/[id]     Supprimer
  GET    /api/promotions            Liste promotions
  POST   /api/promotions            Créer promotion
  PUT    /api/promotions/[id]       Modifier
  DELETE /api/promotions/[id]       Supprimer

Paiements & Abonnements
  POST   /api/payments              Créer paiement (simulation)
  GET    /api/subscriptions         Mon abonnement actuel
  POST   /api/subscriptions         Souscrire à un plan

Utilisateurs
  GET    /api/users                 Liste utilisateurs (admin)
  PUT    /api/users/[id]            Modifier utilisateur (admin)
  DELETE /api/users/[id]            Supprimer utilisateur (admin)
  GET    /api/user/listings         Mes annonces (utilisateur)
  GET    /api/user/profile          Mon profil
  PUT    /api/user/profile          Modifier mon profil

Stats
  GET    /api/stats                 Dashboard stats (admin)
```

---

## PHASE 3 — BASE DE DONNÉES

### 3.1 Modèles Prisma (14 tables)

```
User
  ├── id              String  CUID (PK)
  ├── email           String  UNIQUE
  ├── password        String  (bcrypt)
  ├── name            String?
  ├── phone           String?
  ├── userType        String  VENDEUR | AGENCE
  ├── role            String  SUPER_ADMIN | ADMIN | EDITOR | AGENT_AUTO | AGENT_IMMO | USER
  ├── avatar          String?
  ├── isActive        Boolean default true
  ├── subscriptionPlan String  FREE | PRO | PREMIUM
  ├── subscriptionExpiresAt DateTime?
  ├── payments        Payment[]
  ├── subscriptions   Subscription[]
  ├── cars            Car[]
  └── properties      Property[]

Payment
  ├── id              String  CUID (PK)
  ├── userId          → User
  ├── amount          Float
  ├── currency        String  FCFA
  ├── method          String  MTN | ORANGE | MOOV | CARD
  ├── status          String  PENDING | SUCCESS | FAILED | REFUNDED
  ├── reference       String  UNIQUE
  ├── type            String  ANNONCE | BOOST | SUBSCRIPTION
  ├── planType        String? GRATUIT | EN_AVANT | PREMIUM | PRO
  ├── relatedId       String? (Car or Property id)
  └── subscriptions   Subscription[]

Subscription
  ├── id              String  CUID (PK)
  ├── userId          → User
  ├── plan            String  FREE | PRO | PREMIUM
  ├── status          String  ACTIVE | EXPIRED | CANCELLED
  ├── startsAt        DateTime
  ├── expiresAt       DateTime?
  └── paymentId       → Payment?

Car
  ├── id, title, slug (UNIQUE), description
  ├── price, priceType (SALE | RENT)
  ├── year, mileage, fuel, transmission, color, brand, model
  ├── city, location
  ├── images          String  JSON array de URLs
  ├── category, condition, badge, badgeColor
  ├── status          PENDING | ACTIVE | EXPIRED | REJECTED
  ├── featured        Boolean
  ├── views           Int
  ├── userId          → User?
  ├── planType        GRATUIT | EN_AVANT | PREMIUM
  ├── isBoosted, boostedUntil
  ├── publishedAt, createdAt, updatedAt
  └── seoTitle, metaDescription, ogImage

Property
  ├── id, title, slug (UNIQUE), description
  ├── price, priceType (SALE | RENT)
  ├── type            (Villa, Appartement, Terrain, Studio...)
  ├── bedrooms, bathrooms, surface, land
  ├── city, location, district
  ├── images          String  JSON array
  ├── amenities       String  JSON array
  ├── badge, badgeColor
  ├── status          PENDING | ACTIVE | EXPIRED | REJECTED
  ├── featured, views
  ├── userId          → User?
  ├── planType, isBoosted, boostedUntil
  ├── publishedAt
  └── seoTitle, metaDescription, ogImage

BlogPost
  ├── id, title, slug (UNIQUE)
  ├── content         String? (HTML Tiptap)
  ├── excerpt, coverImage, category, tags (JSON)
  ├── author, status (DRAFT | PUBLISHED)
  ├── publishedAt, scheduledAt
  ├── views, readTime
  └── seoTitle, metaDescription, ogImage, canonical, noIndex

Page
  ├── id, slug (UNIQUE), title
  ├── sections        String  JSON (PageSection[])
  ├── heroTitle, heroSubtitle, heroImage
  ├── content, isPublished
  └── seoTitle, metaDescription, ogImage, canonical, noIndex

MenuItem
  ├── id, label, href, icon
  ├── parentId        String? (hierarchie)
  ├── order, isActive, target

Media
  ├── id, url, publicId (Cloudinary)
  ├── filename, mimetype, size
  ├── alt, folder, width, height

SiteSetting
  ├── id, key (UNIQUE), value
  └── (table clé-valeur pour tout le CMS)

Promotion
  ├── id, title, subtitle, description
  ├── image, link, badge, discount, countdown, cta
  ├── gradient, bgColor, isActive, expiresAt, order

Testimonial
  ├── id, name, role, company, avatar
  ├── content, rating (1-5)
  ├── isActive, order

FaqItem
  ├── id, question, answer, category
  ├── order, isActive

Lead
  ├── id, type, name, email, phone, subject, message
  ├── source, listingType, listingId
  └── isRead

ContactMessage
  ├── id, name, email, phone, subject, message
  └── isRead
```

### 3.2 Relations clés

```
User ──< Payment ──< Subscription
User ──< Car
User ──< Property
Payment >── Subscription
```

### 3.3 Indexes notables
- `User.email` UNIQUE
- `Car.slug` UNIQUE
- `Property.slug` UNIQUE
- `BlogPost.slug` UNIQUE
- `Page.slug` UNIQUE
- `Payment.reference` UNIQUE
- `SiteSetting.key` UNIQUE
- `MenuItem` (pas d'index sur parentId — possible lenteur sur grands menus)

---

## PHASE 4 — AUTHENTIFICATION & SÉCURITÉ

### Système d'auth
- **Provider** : NextAuth v4, Credentials (email + mot de passe)
- **Hachage** : bcryptjs
- **Strategy** : JWT, maxAge 30 jours
- **Pages custom** : /admin/login (admin), /auth/login (utilisateur)

### Rôles (6 niveaux)
```
SUPER_ADMIN  → Accès total
ADMIN        → Admin panel complet
EDITOR       → Admin panel (contenu)
AGENT_AUTO   → Admin panel (voitures uniquement en théorie)
AGENT_IMMO   → Admin panel (immobilier uniquement en théorie)
USER         → Dashboard personnel uniquement
```

### Middleware
```typescript
// Protection routes
/admin/*      → require: role in [SUPER_ADMIN, ADMIN, EDITOR, AGENT_AUTO, AGENT_IMMO]
/dashboard/*  → require: any authenticated user
/publier/*    → require: any authenticated user
```

### ⚠️ Problème sécurité identifié
- Les rôles `AGENT_AUTO` et `AGENT_IMMO` ont accès à l'ensemble du panel admin (pas de restriction par module dans le middleware). La logique de cloisonnement est **absente** du middleware et des API.

---

## PHASE 5 — SYSTÈME CMS / DESIGN

### 5.1 Architecture CMS (table SiteSetting : clé-valeur)

La table `SiteSetting` est le cœur du CMS. Toutes les clés suivantes sont gérées depuis l'admin :

#### Design System (28 clés — `/api/design`)
```
design.colorPrimary         Couleur principale (nova-red)
design.colorSecondary       Couleur secondaire (nova-orange)
design.colorAccent          Couleur accent (nova-yellow)
design.colorText            Couleur texte global
design.colorBg              Fond global
design.colorHeading         Couleur des titres h1-h6
design.colorSectionAlt      Fond sections alternées
design.colorButton          Couleur bouton principal
design.colorButtonText      Texte bouton (auto-calculé)
design.colorButtonHover     Hover bouton
design.colorCard            Fond cartes
design.colorCardBorder      Bordure cartes
design.colorNavBg           Fond navbar
design.colorNavText         Texte navbar
design.colorNavHover        Hover liens navbar
design.colorFooterBg        Fond footer
design.colorFooterText      Texte footer
design.colorFooterHeading   Titres footer
design.colorFooterHover     Hover liens footer
design.heroStyle            Style hero (gradient | flat | video | slider)
design.overlayOpacity       Opacité overlay hero (0-100)
design.spacingMain          Espacement vertical principal (px)
design.borderRadius         Border-radius global
design.fontFamily           Police globale
design.shadowStrength       Intensité ombres (none|light|medium|heavy)
design.defaultTheme         Thème par défaut (light|dark|system)
design.animationsEnabled    Activer/désactiver animations
```

#### Homepage Config (40+ clés — `/api/homepage`)
```
homepage.heroType           Type hero (split | video | slider)
homepage.heroTitle          Titre principal hero
homepage.heroSubtitle       Sous-titre hero
homepage.heroBadge          Badge hero
homepage.heroCta1Text/Link  Bouton CTA 1
homepage.heroCta2Text/Link  Bouton CTA 2
homepage.heroOverlay        Opacité overlay (0.0-1.0)
homepage.heroVideoUrl       URL vidéo (mode video)
homepage.heroSlides         JSON: slides (mode slider)
homepage.sectionStats       Toggle section stats
homepage.sectionCategories  Toggle section catégories
homepage.sectionOffers      Toggle section offres
homepage.sectionWhyNova     Toggle section pourquoi Nova
homepage.sectionBlog        Toggle section blog
homepage.sectionCta         Toggle section CTA
homepage.sectionsOrder      JSON: ordre des sections
homepage.ctaTitle/Subtitle  Textes section CTA
homepage.ctaBg              Couleur fond CTA
homepage.ctaBtn1/2 Text/Link Boutons section CTA
homepage.statsTitle/Subtitle/stats  JSON: statistiques
homepage.whyNovaTitle/Subtitle/whyNova JSON: cartes avantages
homepage.categoriesTitle/Subtitle/categories JSON: catégories
```

#### Paramètres globaux (— `/api/settings`)
```
siteName          Nom du site
tagline           Slogan
siteUrl           URL
phone             Téléphone
email             Email contact
address           Adresse
whatsapp          Numéro WhatsApp
facebook/instagram/linkedin/twitter/youtube/tiktok  Réseaux sociaux
googleAnalyticsId Google Analytics
googleTagManagerId GTM
facebookPixelId   Facebook Pixel
googleVerification Search Console
smtpHost/Port/User  Config email SMTP
notifyEmail       Email de notification leads
```

### 5.2 DynamicStyles — Injection CSS server-side

`DynamicStyles.tsx` (Server Component) lit la DB à chaque requête (revalidate=60s implicite via layout) et injecte ~580 lignes de CSS custom properties + overrides Tailwind directement dans le `<head>`. Système intelligent avec :
- Auto-contrast computation côté serveur
- Dark mode complet (html.dark)
- Admin light theme forcé (admin-shell)
- Kill-switch animations (body.no-animations)

### 5.3 Page Builder

**13 types de sections** disponibles :
```
hero          Banner d'accueil
listings      Grille d'annonces (auto/immo/both)
stats         Compteurs animés
testimonials  Carousel témoignages
blog          Derniers articles
faq           Accordéon FAQ
cta           Appel à l'action
promotions    Offres en cours
services      Liste services
gallery       Galerie images
contact       Formulaire contact
richtext      Contenu HTML libre
search        Barre de recherche
```

Pages CMS gérées dans le Page Builder admin :
- home, services, contact, about
- automobile, immobilier, blog
- services/location-voiture, services/location-immo, services/achat-vente-immo, services/pieces-auto, services/flotte

---

## PHASE 6 — INVENTAIRE CMS

### Pages déjà éditables (depuis l'admin)

| Page | Module Admin | Niveau d'édition |
|------|-------------|-----------------|
| `/` Homepage | Admin > Homepage | ✅ COMPLET (hero, sections, CTA, stats, catégories, avantages) |
| `/admin/design` | Admin > Design | ✅ COMPLET (28 variables CSS) |
| `/admin/parametres` | Admin > Paramètres | ✅ COMPLET (site, contact, réseaux, analytics, SMTP) |
| `/admin/automobiles` | Admin > Automobiles | ✅ COMPLET (CRUD + SEO + images + boost) |
| `/admin/immobilier` | Admin > Immobilier | ✅ COMPLET (CRUD + SEO + images + boost) |
| `/admin/blog` | Admin > Blog | ✅ COMPLET (CRUD + Tiptap + SEO + planification) |
| `/admin/temoignages` | Admin > Témoignages | ✅ COMPLET (CRUD + ordre + activation) |
| `/admin/promotions` | Admin > Promotions | ✅ COMPLET (CRUD + countdown + activation) |
| `/admin/menus` | Admin > Menus | ✅ COMPLET (CRUD + drag&drop + activation) |
| `/admin/medias` | Admin > Médias | ✅ COMPLET (upload + suppression + métadonnées) |
| `/admin/seo` | Admin > SEO | ✅ PAR PAGE (title, meta, og, canonical, noIndex) |

### Sections déjà administrables

| Section | Administrable | Via |
|---------|--------------|-----|
| Hero homepage | ✅ | Admin > Homepage (type, titre, sous-titre, badge, CTA, overlay, slides, vidéo) |
| Statistiques homepage | ✅ | Admin > Homepage > Content (JSON icons, valeurs, labels) |
| Catégories rapides | ✅ | Admin > Homepage > Content (JSON) |
| Pourquoi Nova | ✅ | Admin > Homepage > Content (JSON) |
| Section CTA | ✅ | Admin > Homepage > CTA |
| Ordre sections | ✅ | Admin > Homepage > Sections (drag & drop) |
| Toggle sections | ✅ | Admin > Homepage (on/off par section) |
| Couleurs globales | ✅ | Admin > Design (28 variables) |
| Navbar couleurs | ✅ | Admin > Design (nav bg, text, hover) |
| Footer couleurs | ✅ | Admin > Design (footer bg, text, heading, hover) |
| Boutons | ✅ | Admin > Design (couleur, hover, radius) |
| Cartes | ✅ | Admin > Design (fond, bordure) |
| Typographie | ✅ | Admin > Design (police, bordures, ombres) |
| Animations | ✅ | Admin > Design (on/off) |
| Dark mode par défaut | ✅ | Admin > Design |
| Témoignages | ✅ | Admin > Témoignages |
| Promotions | ✅ | Admin > Promotions |
| Pages CMS (sections) | ✅ | Admin > Pages > Page Builder |
| Menus de navigation | ✅ DB | Admin > Menus ⚠️ (non connectés à la Navbar front-end) |
| Nom site, logo, coordonnées | ✅ | Admin > Paramètres |
| Réseaux sociaux | ✅ | Admin > Paramètres |
| Analytics pixels | ✅ | Admin > Paramètres (champs présents, pas d'injection auto) |

### Sections encore codées en dur (HARDCODÉ)

| Élément | Fichier | Problème |
|---------|---------|---------|
| Navbar liens | `components/layout/Navbar.tsx` | NAV_ITEMS statique, ignore la table MenuItem DB |
| Footer liens | `components/layout/Footer.tsx` | footerLinks statique |
| Footer infos contact | `components/layout/Footer.tsx` | Lire les SiteSettings mais partiellement |
| Logo | Non trouvé dans CMS | Pas de champ logo dans SiteSetting |
| Services data | `lib/services-data.ts` | 100% hardcodé (pas en DB) |
| Pages services front | `app/services/[id]/page.tsx` etc. | Données depuis services-data.ts |
| WhatsApp float button | `components/ui/WhatsAppFloat.tsx` | Lit SiteSetting.whatsapp ✅ |

### Images encore statiques

| Élément | Statut |
|---------|--------|
| Hero images (mode slider) | ✅ Editables via Admin > Homepage |
| Images annonces | ✅ Upload admin + utilisateur |
| Images blog | ✅ Upload admin (Cloudinary ou local) |
| Images promotions | ✅ Upload admin |
| Logo site | ❌ Aucun champ dans SiteSetting |
| Favicon | ❌ Hardcodé (ou non configuré) |
| Images services | ❌ Hardcodé dans services-data.ts |
| OG images | ✅ Champ ogImage par page (SEO admin) |

---

## PHASE 7 — DESIGN SYSTEM

### Variables CSS actives (CSS Custom Properties)

```css
/* Brand */
--nova-primary        #F97316 (orange) — contrôlable
--nova-secondary      #FB923C — contrôlable
--nova-accent         #FBBF24 — contrôlable

/* Typography */
--nova-text           #1F2937
--nova-heading        #111827
--nova-font           'Inter', sans-serif
--nova-bg             #FFFFFF
--nova-section-alt    #F9FAFB

/* Components */
--nova-btn            #F97316
--nova-btn-text       auto-contrast
--nova-btn-hover      #FB923C
--nova-card           #FFFFFF
--nova-card-border    #E5E7EB
--nova-shadow         0 4px 20px rgba(0,0,0,0.10)
--nova-radius         12px

/* Nav */
--nova-nav-bg         #FFFFFF
--nova-nav-text       #1F2937
--nova-nav-hover      #F97316

/* Footer */
--nova-footer-bg      #F9FAFB
--nova-footer-text    #6B7280
--nova-footer-heading #1F2937
--nova-footer-hover   #F97316

/* Layout */
--nova-spacing-main   80px
--nova-overlay-opacity 0.30
--nova-hero-style     gradient
```

### Thèmes

| Thème | Status |
|-------|--------|
| Light (défaut) | ✅ Complet, contrôlable |
| Dark (html.dark) | ✅ Complet (Slate 900/800) |
| Admin (admin-shell) | ✅ Toujours light, isolation complète |

### Classes utilitaires custom

```
.nova-btn, .nova-card, .nova-nav     → Appliquent les variables CSS
.admin-shell                          → Override complet light theme admin
.gradient-text-nova                   → Dégradé texte
.section-label                        → Pill label de section
.bg-nova-red/.text-nova-red etc.     → Synonymes contrôlables
```

---

## PHASE 8 — AUDIT DE STABILITÉ

### ⚠️ Liens cassés (404 potentiels)

| Route | Source | Gravité |
|-------|--------|---------|
| `/a-propos` | Footer "À propos de nous" | 🔴 CRITIQUE — devrait être `/about` |
| `/faq` | Footer Support | 🔴 CRITIQUE — page manquante |
| `/confidentialite` | Footer Support | 🟡 IMPORTANTE |
| `/cgu` | Footer Support | 🟡 IMPORTANTE |
| `/sitemap` | Footer Support | 🟡 IMPORTANTE |
| `#about` | Navbar "À propos" | 🟡 Anchor scroll — peut fonctionner si section existe |

### ⚠️ Incohérences identifiées

| Problème | Détail | Fichier |
|----------|--------|---------|
| Navbar non connectée à la DB | NAV_ITEMS hardcodé, table MenuItem ignorée | `Navbar.tsx` |
| Footer hardcodé | footerLinks ignorent la DB | `Footer.tsx` |
| Cloudinary désactivé | Variables commentées dans .env.local | `.env.local` |
| Services 100% statiques | Pas de CRUD admin pour les services | `lib/services-data.ts` |
| UI-Control vs Design | Double panneau overlappant (cartes, boutons) | admin/ui-control + admin/design |
| SEO slug "automobiles" | Admin SEO utilise "automobiles" mais route = "/automobile" | `admin/seo/page.tsx` |
| Analytics non injectés | Champs Google Analytics dans settings, mais injection dans `<head>` absente | `layout.tsx` |
| SMTP non implémenté | Champs SMTP présents dans settings, mais aucun emailer intégré | Aucun |
| Mobile Money simulation | Paiements MTN/Orange/Moov non connectés à de vraies API | `api/payments/route.ts` |
| Prisma FaqItem orpheline | Modèle FaqItem en DB, aucun panneau admin dédié visible | `schema.prisma` |
| Menus DB ignorés | Admin menus opérationnel en DB, Navbar ne les lit pas | `Navbar.tsx` |

### ⚠️ Composants potentiellement orphelins

| Composant | Usage suspect |
|-----------|--------------|
| `components/sections/HomeHeroSection.tsx` | Existe + `HomepageHero.tsx` — duplication possible |
| `components/sections/HeroSection.tsx` | Utilisé par SectionRenderer (Page Builder) |
| `components/sections/HomepageHero.tsx` | Utilisé par la homepage directement |
| `components/cms/CmsSectionRenderer.tsx` | Existe + `SectionRenderer.tsx` — duplication |
| `components/sections/FeaturedShowcase.tsx` | Non référencé dans SectionRenderer |
| `components/sections/SellCTASection.tsx` | Non référencé dans SectionRenderer |

---

## PHASE 9 — FORCES DU PROJET

1. **Architecture moderne** — Next.js 15 App Router, Server Components, revalidation ISR
2. **CMS complet** — 70+ clés SiteSetting couvrant tout le design et le contenu
3. **Design System dynamique** — 28 variables CSS injectées server-side avec auto-contrast
4. **Page Builder fonctionnel** — 13 types de sections, stockage JSON en DB
5. **Monétisation intégrée** — 3 plans (FREE/PRO/PREMIUM), 3 boost types, 4 méthodes paiement
6. **SEO par page** — title, meta, og, canonical, noIndex pour chaque page
7. **Dark mode complet** — implémentation robuste anti-FOUC
8. **Médiathèque** — upload + gestion assets (Cloudinary ready)
9. **Gestion leads** — capture et suivi des contacts
10. **Authentification sécurisée** — JWT 30j, bcrypt, 6 rôles
11. **Admin shell isolé** — thème light forcé, indépendant du thème public
12. **Blog avec Tiptap** — éditeur rich-text complet avec médias, liens, couleurs
13. **Annonces avec slug + SEO** — Car/Property ont seoTitle, metaDescription, ogImage
14. **Témoignages dynamiques** — DB-backed avec ordre, rating, activation

---

## PHASE 10 — FAIBLESSES & PRIORITÉS

### 🔴 Critique (bloquant pour la production)

1. **5 pages 404** dans le footer (`/a-propos`, `/faq`, `/confidentialite`, `/cgu`, `/sitemap`)
2. **Cloudinary désactivé** — uploads d'images impossibles en production cloud
3. **Mobile Money non intégré** — paiements MTN/Orange/Moov sont des simulations
4. **Analytics non injectés** — Google Analytics ID dans settings mais aucun script dans `<head>`
5. **Emails non fonctionnels** — SMTP configuré mais aucun emailer (nodemailer) intégré

### 🟡 Important (à traiter avant lancement)

6. **Navbar hardcodée** — ignore complètement la table MenuItem DB
7. **Footer hardcodé** — liens et contacts partiellement statiques
8. **Logo non administrable** — aucun champ logo dans SiteSetting
9. **Services hardcodés** — `services-data.ts` non gérable depuis l'admin
10. **Rôles AGENT_AUTO/IMMO non cloisonnés** — accès à l'ensemble du panel
11. **FaqItem sans panneau admin** — modèle DB orphelin (CRUD manquant)

### 🟢 Améliorations (post-lancement)

12. **Double panneau design** — admin/design et admin/ui-control chevauchants
13. **Blog categories** — sous-pages filtrées statiquement, pas dynamiquement
14. **Composants dupliqués** — HomeHeroSection + HomepageHero, CmsSectionRenderer + SectionRenderer
15. **Pas de recherche globale** — SearchSection défini mais barre de recherche front incomplète
16. **Pas de notifications** — admin ne reçoit pas d'alerte email/push pour nouveaux leads
17. **Pas de pagination SEO-friendly** — annonces sans URL `/page/2` (SEO crawl)
18. **Images locales vs Cloudinary** — système hybride ambigu

---

## SCORE DE MATURITÉ

```
┌─────────────────────────────────────────────────┐
│   NOVA MARKETPLACE — Score de Maturité          │
├──────────────────────────┬──────────┬───────────┤
│ Dimension                │ Score    │ Statut    │
├──────────────────────────┼──────────┼───────────┤
│ Architecture technique   │  90/100  │ ✅ Fort   │
│ Backend / API            │  80/100  │ ✅ Bon    │
│ Base de données          │  85/100  │ ✅ Bon    │
│ Authentification         │  75/100  │ 🟡 Moyen  │
│ CMS / Page Builder       │  80/100  │ ✅ Bon    │
│ Design System            │  90/100  │ ✅ Fort   │
│ Gestion annonces         │  85/100  │ ✅ Bon    │
│ Blog                     │  80/100  │ ✅ Bon    │
│ Paiements                │  30/100  │ 🔴 Faible │
│ Emails / Notifs          │  10/100  │ 🔴 Absent │
│ SEO technique            │  70/100  │ 🟡 Moyen  │
│ Intégration front/CMS    │  60/100  │ 🟡 Partiel│
│ Qualité du code          │  80/100  │ ✅ Bon    │
│ Couverture routes        │  75/100  │ 🟡 Moyen  │
│ Production-readiness     │  45/100  │ 🔴 Partiel│
├──────────────────────────┼──────────┼───────────┤
│ SCORE GLOBAL             │  68/100  │ 🟡 MVP+   │
└──────────────────────────┴──────────┴───────────┘
```

**Interprétation** : NOVA est un **MVP avancé solidement architecturé**. La plateforme est impressionnante pour son niveau de maturité CMS, son design system et sa gestion de contenu. Les freins à la production sont surtout dans l'**intégration des services tiers** (paiements, emails, Cloudinary) et quelques **pages manquantes**.

---

## FEUILLE DE ROUTE VERS UNE VERSION PRODUCTION

### SPRINT 1 — Corrections critiques (2-3 jours)

- [ ] **Activer Cloudinary** : Décommenter les variables dans `.env.local`, tester upload
- [ ] **Créer les pages manquantes** : `/faq`, `/confidentialite`, `/cgu`, `/sitemap` (simples pages statiques)
- [ ] **Corriger lien Footer** : `/a-propos` → `/about` (ou créer une redirection)
- [ ] **Corriger Navbar** : "À propos" → lien `/about` (pas `#about`)
- [ ] **Injection analytics** : Lire `googleAnalyticsId` dans `layout.tsx` et injecter le script GA4

### SPRINT 2 — CMS complet (3-5 jours)

- [ ] **Connecter la Navbar à la DB** : Lire la table `MenuItem` dans `Navbar.tsx` (avec fallback hardcodé)
- [ ] **Connecter le Footer à la DB** : Lire `SiteSetting` pour infos contact, réseaux, copyright
- [ ] **Ajouter champ Logo** dans `SiteSetting` + admin/parametres + Navbar/Footer
- [ ] **Ajouter panneau FAQ admin** : CRUD complet pour `FaqItem`
- [ ] **Panel admin Services** : CRUD pour les services (remplace `services-data.ts`)
- [ ] **Consolider design panels** : Fusionner admin/ui-control dans admin/design

### SPRINT 3 — Emails & Notifications (2-3 jours)

- [ ] **Intégrer Nodemailer** : Utiliser les settings SMTP pour envoyer des emails
- [ ] **Notification lead** : Email auto à `notifyEmail` à chaque nouveau lead
- [ ] **Email de bienvenue** : Confirmation inscription utilisateur
- [ ] **Email de confirmation paiement** : Reçu après abonnement

### SPRINT 4 — Paiements réels (3-5 jours)

- [ ] **Intégrer CinetPay ou FedaPay** : API paiement mobile money Côte d'Ivoire (MTN, Orange, Moov)
- [ ] **Webhooks paiement** : Traitement statut SUCCESS/FAILED automatique
- [ ] **Activation abonnement automatique** : Upgrade plan après paiement confirmé

### SPRINT 5 — SEO & Performance (2-3 jours)

- [ ] **Metadata dynamique** par page (generateMetadata) dans les routes automobile/[id], immobilier/[id], blog/[slug]
- [ ] **Sitemap XML** : Route `/sitemap.xml` générée dynamiquement depuis la DB
- [ ] **robots.txt** : Fichier ou route Next.js
- [ ] **Pagination SEO-friendly** : `/automobile/vente?page=2` avec canonical
- [ ] **OpenGraph complet** : og:image dynamique pour chaque annonce

### SPRINT 6 — Polissage production (2-3 jours)

- [ ] **Cloisonnement rôles** : AGENT_AUTO → seulement voitures, AGENT_IMMO → seulement immobilier
- [ ] **Supprimer composants orphelins** : Nettoyer FeaturedShowcase, SellCTASection, HomeHeroSection
- [ ] **Corriger SEO admin** : Slug "automobiles" → "automobile"
- [ ] **Tests** : Tester toutes les routes publiques, admin, API
- [ ] **Variables d'environnement production** : Vérifier que toutes les clés sont définies

### SPRINT 7 — Fonctionnalités avancées (optionnel)

- [ ] **Recherche fulltext** : Barre de recherche fonctionnelle auto/immo
- [ ] **Comparaison** : Comparer 2-3 voitures ou biens
- [ ] **Favoris** : Sauvegarder annonces (côté utilisateur)
- [ ] **Notifications temps réel** : Admin push notifications (nouveaux leads)
- [ ] **Multi-images upload** : Drag & drop multi-fichiers
- [ ] **Galerie immersive** : Lightbox images haute qualité
- [ ] **Chat WhatsApp auto** : CTA dynamique par annonce

---

## RÉCAPITULATIF DES MODULES

| Module | Backend API | Admin CMS | Front public | Complet ? |
|--------|------------|-----------|-------------|-----------|
| Automobile | ✅ | ✅ | ✅ | ✅ ~90% |
| Immobilier | ✅ | ✅ | ✅ | ✅ ~90% |
| Blog | ✅ | ✅ | ✅ | ✅ ~85% |
| Services | ✅ partiel | ❌ | ✅ | 🟡 ~60% |
| Homepage CMS | ✅ | ✅ | ✅ | ✅ ~95% |
| Design System | ✅ | ✅ | ✅ | ✅ ~95% |
| Page Builder | ✅ | ✅ | ✅ | ✅ ~80% |
| Témoignages | ✅ | ✅ | ✅ | ✅ ~90% |
| Promotions | ✅ | ✅ | ✅ | ✅ ~85% |
| Médiathèque | ✅ | ✅ | ✅ | 🟡 ~70% (Cloudinary off) |
| Menus | ✅ | ✅ | ❌ non connecté | 🟡 ~50% |
| FAQ | ✅ DB | ❌ pas d'admin | ❌ | 🔴 ~20% |
| SEO | ✅ | ✅ | 🟡 partiel | 🟡 ~65% |
| Paiements | ✅ simulé | ✅ vue | ✅ | 🔴 ~30% |
| Abonnements | ✅ | ✅ | ✅ | 🟡 ~60% |
| Utilisateurs | ✅ | ✅ | ✅ | ✅ ~80% |
| Leads | ✅ | ✅ | ✅ | ✅ ~85% |
| Emails | ❌ | ✅ config | — | 🔴 ~10% |
| Analytics | ❌ injection | ✅ config | — | 🔴 ~20% |

---

*Rapport généré automatiquement par analyse statique complète du codebase NOVA.*
*Aucune modification n'a été apportée au projet.*
