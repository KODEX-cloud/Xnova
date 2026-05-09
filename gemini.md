# NOVA Marketplace — Référence Projet pour IA

> Ce fichier est un guide de référence permanent. Un modèle IA doit le lire en entier avant de toucher au code. Il couvre : ce que fait l'app, toutes les fonctionnalités, la structure des fichiers, les technologies, et les règles de design à respecter.

---

## 1. Ce que fait l'application

**NOVA** est une marketplace premium double-secteur ciblant la **Côte d'Ivoire (Abidjan)** :

- **Automobile** : vente, location courte/longue durée, pièces détachées, gestion de flotte
- **Immobilier** : vente, location, maisons, villas, studios, terrains

C'est à la fois un **site vitrine** (pages marketing éditables), un **marketplace de petites annonces** (utilisateurs publient des annonces payantes), et un **back-office complet** (CMS, gestion utilisateurs, paiements, statistiques).

Langue : **français**. Monnaie : **FCFA**. Paiements mobile money (MTN, Orange, Moov) + carte bancaire.

---

## 2. Fonctionnalités implémentées

### Côté public (visiteur)

| Zone | Fonctionnalité |
|---|---|
| Home | Hero animé, catégories rapides, annonces vedettes, témoignages, promotions, blog, CTA vendre |
| Automobile | Listing filtrable (marque, prix, carburant, transmission), page détail avec carrousel images |
| Immobilier | Listing filtrable (type, ville, chambres, surface), page détail avec galerie |
| Services | 5 services détaillés avec galerie, avantages, CTA WhatsApp |
| Blog | Articles par catégorie (auto, immo, guides, actualités), page article avec HTML riche |
| Contact | Formulaire (nom, email, téléphone, message) → stocké en DB + redirection success |
| Pricing | 3 plans (Gratuit 0 FCFA, Pro 15 000 FCFA, Premium 35 000 FCFA) |
| À propos | Page avec stats, histoire, valeurs, mission |
| Thème | Dark/light mode persisté en localStorage, détection OS, anti-FOUC |
| WhatsApp | Bouton flottant WhatsApp sur tout le site |

### Côté utilisateur connecté

| Zone | Fonctionnalité |
|---|---|
| Auth | Inscription (email + mot de passe), connexion, sessions JWT 30 jours |
| Dashboard | Résumé abonnement, liste annonces, actions rapides |
| Publier | Formulaire voiture (marque, modèle, année, kilométrage, carburant, images) et immobilier (type, chambres, surface, ville, images) |
| Annonces | CRUD propre : voir, modifier, supprimer ses annonces uniquement |
| Abonnement | Voir son plan, passer à Pro/Premium |
| Paiement | Sélection plan → choix méthode mobile money → simulation confirmation → redirection success |

### Côté admin

**URL de base : `/admin`** — protégé par middleware, rôles requis : SUPER_ADMIN, ADMIN, EDITOR, AGENT_AUTO, AGENT_IMMO.

| Module admin | Description |
|---|---|
| Dashboard | Stats (annonces, utilisateurs, revenus, leads) avec graphiques |
| Automobiles | CRUD complet voitures avec `CarForm` (rich form + upload images) |
| Immobilier | CRUD complet propriétés avec `PropertyForm` |
| Blog | CRUD articles avec éditeur TipTap (rich text), tags, statut DRAFT/PUBLISHED/SCHEDULED |
| Utilisateurs | Liste, activation/désactivation, changement de rôle |
| Pages | Éditeur de contenu par slug (`/admin/(panel)/pages/[...slug]`) — champs texte libres par clé `page.{slug}.{champ}` |
| Design | Palette de couleurs, typographie, header/footer du site |
| Homepage | Éditeur section par section de la page d'accueil |
| Médias | Bibliothèque d'images uploadées, suppression |
| Messages | Consultation des messages de contact |
| Leads | Contacts entrants (formulaires détail annonce/service) |
| Menus | Gestion de la navigation (MenuItem) |
| Promotions | Bannières/offres spéciales affichées sur le site |
| Témoignages | Avis clients affichés sur la home |
| Paiements | Historique de tous les paiements (montant, méthode, statut) |
| Abonnements | Suivi des abonnements utilisateurs |
| Annonces | Vue globale toutes annonces (filtre, changement statut) |
| Listings Editor | Éditeur inline des fiches annonces (preview + édition champs) |
| SEO | Méta-titres, descriptions, og:image par page |
| Apparence | Contrôle avancé styles globaux |
| UI Control | Paramètres interface |
| Paramètres | Configuration globale du site |

---

## 3. Structure des fichiers

```
Nova/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (providers, fonts, anti-FOUC)
│   ├── page.tsx                  # Page d'accueil
│   ├── globals.css               # Styles globaux Tailwind
│   │
│   ├── about/page.tsx            # À propos
│   ├── pricing/page.tsx          # Tarifs abonnements
│   ├── annonces/page.tsx         # Toutes les annonces
│   ├── contact/                  # Formulaire contact + success + callback
│   ├── paiement/                 # Tunnel paiement + success + cancel
│   ├── auth/                     # Login et register utilisateurs
│   ├── dashboard/                # Espace utilisateur connecté
│   ├── publier/                  # Publication annonce auto/immo
│   │
│   ├── automobile/               # Section auto publique
│   │   ├── page.tsx              # Listing général
│   │   ├── vente/page.tsx        # Filtré vente
│   │   ├── location/page.tsx     # Filtré location
│   │   ├── pieces/page.tsx       # Pièces auto
│   │   └── [id]/page.tsx         # Détail voiture
│   │
│   ├── immobilier/               # Section immo publique
│   │   ├── page.tsx              # Listing général
│   │   ├── vente/ location/ maisons/ terrains/ studios/
│   │   └── [id]/page.tsx         # Détail propriété
│   │
│   ├── services/                 # Pages services
│   │   ├── page.tsx              # Hub services
│   │   ├── location-voiture/ flotte/ pieces-auto/
│   │   ├── achat-vente-immo/ location-immo/
│   │   └── [id]/page.tsx         # Détail service dynamique
│   │
│   ├── blog/                     # Blog
│   │   ├── page.tsx
│   │   ├── [slug]/page.tsx        # Article complet
│   │   └── automobile/ immobilier/ guides/ actualites/
│   │
│   ├── admin/                    # Back-office
│   │   ├── login/page.tsx
│   │   ├── page.tsx              # Redirect vers dashboard
│   │   ├── layout.tsx            # Layout admin (sidebar + header)
│   │   ├── automobiles/          # CRUD voitures (liste, nouveau, [id])
│   │   ├── immobilier/           # CRUD propriétés
│   │   ├── blog/                 # CRUD articles
│   │   └── (panel)/              # Route group — URL inchangée
│   │       ├── dashboard/
│   │       ├── design/ homepage/ medias/ messages/ leads/ seo/
│   │       ├── utilisateurs/ parametres/ menus/ promotions/
│   │       ├── temoignages/ paiements/ abonnements/
│   │       ├── annonces/ listings-editor/
│   │       ├── pages/[...slug]/  # Éditeur page par slug (catch-all)
│   │       ├── annonces-page/ ui-control/ apparence/
│   │       └── layout.tsx
│   │
│   └── api/                      # API Routes
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── register/             # Inscription utilisateur
│       ├── users/ [id]/          # CRUD utilisateurs (admin)
│       ├── user/profile/ listings/ # Utilisateur courant
│       ├── cars/ [id]/           # CRUD voitures
│       ├── properties/ [id]/     # CRUD propriétés
│       ├── annonces/ [id]/ upload/ # Annonces unifiées + upload images
│       ├── blog/ [id]/           # CRUD articles blog
│       ├── pages/ [slug]/sections/ # CMS pages + sections
│       ├── media/ [id]/          # Bibliothèque médias
│       ├── upload/               # Upload admin (avec auth)
│       ├── menus/ [id]/          # Navigation
│       ├── promotions/ [id]/     # Promotions/bannières
│       ├── testimonials/ [id]/   # Témoignages
│       ├── leads/ [id]/          # Leads contacts
│       ├── contact/              # Formulaire contact public
│       ├── subscriptions/        # Abonnements
│       ├── payments/             # Paiements
│       ├── settings/             # Clés SiteSetting (key/value store)
│       ├── stats/                # Statistiques dashboard admin
│       ├── design/               # Config design globale
│       └── homepage/             # Données page d'accueil
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Mega-menu desktop + drawer mobile
│   │   └── Footer.tsx
│   ├── admin/
│   │   ├── AdminSidebar.tsx      # Sidebar avec 20+ liens
│   │   ├── AdminHeader.tsx
│   │   ├── CarForm.tsx           # Formulaire voiture complet
│   │   ├── PropertyForm.tsx      # Formulaire propriété complet
│   │   ├── BlogForm.tsx          # Formulaire article avec TipTap
│   │   ├── ImageUploader.tsx     # Drag & drop multi-images
│   │   ├── RichTextEditor.tsx    # Wrapper TipTap
│   │   ├── DataTable.tsx         # Table générique avec tri/filtre
│   │   ├── StatCard.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── SessionProvider.tsx   # NextAuth SessionProvider wrapper
│   │   └── page-builder/        # Composants éditeur de pages
│   ├── automobile/
│   │   ├── CarCard.tsx           # Carte annonce voiture
│   │   └── CarListingShell.tsx   # Shell listing avec filtres
│   ├── immobilier/
│   │   ├── PropertyCard.tsx
│   │   └── ListingShell.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   └── BlogListingShell.tsx
│   ├── services/
│   │   ├── ServiceCard.tsx
│   │   └── ServiceDetailPage.tsx # Page détail service avec override settings
│   ├── sections/                 # Sections homepage/CMS (17 composants)
│   │   ├── HeroSection.tsx HomepageHero.tsx HomeHeroSection.tsx
│   │   ├── FeaturedListings.tsx FeaturedShowcase.tsx
│   │   ├── BlogSection.tsx TestimonialsSection.tsx
│   │   ├── ServicesSection.tsx StatsSection.tsx
│   │   ├── PromotionsSection.tsx QuickCategoriesSection.tsx
│   │   ├── SearchSection.tsx GallerySection.tsx
│   │   ├── ContactSection.tsx SellCTASection.tsx
│   │   ├── HomepageCtaSection.tsx WhyNovaSection.tsx
│   │   └── SectionRenderer.tsx  # Dispatch dynamique par type
│   ├── cms/
│   │   ├── CmsSectionRenderer.tsx
│   │   └── sections/            # Composants CMS spécialisés
│   ├── providers/
│   │   ├── AppProviders.tsx     # SessionProvider + ThemeProvider
│   │   └── ThemeProvider.tsx
│   ├── ui/
│   │   ├── ThemeToggle.tsx
│   │   ├── WhatsAppFloat.tsx    # Bouton WhatsApp flottant
│   │   ├── ImageModal.tsx       # Lightbox images
│   │   ├── image-carousel.tsx
│   │   ├── animated-hero.tsx
│   │   ├── mega-menu.tsx
│   │   ├── scroll-expansion.tsx
│   │   └── stagger-testimonials.tsx
│   └── DynamicStyles.tsx        # Injecte les couleurs custom depuis SiteSetting
│
├── lib/
│   ├── auth.ts                  # NextAuth authOptions (Credentials provider)
│   ├── prisma.ts                # Singleton Prisma client
│   ├── plans.ts                 # Plans tarifaires, boost options, helpers
│   ├── services-data.ts         # Données statiques des 5 services
│   ├── design-keys.ts           # Clés SiteSetting pour le design
│   ├── homepage-keys.ts         # Clés SiteSetting pour la homepage
│   ├── permissions.ts           # Helpers rôles/permissions
│   ├── utils.ts                 # Utilitaires généraux (cn, formatPrice…)
│   ├── types/page-builder.ts    # Types pour le CMS/page builder
│   └── utils/contrast.ts        # Calcul contraste couleur pour accessibilité
│
├── prisma/
│   ├── schema.prisma            # Schéma BDD (15 modèles)
│   ├── dev.db                   # SQLite (développement local)
│   └── seed.ts                  # Script de peuplement initial
│
├── contexts/
│   └── imageModal.tsx           # Context React pour lightbox
│
├── middleware.ts                # Protection routes /admin, /dashboard, /publier
├── .env.local                   # Variables d'environnement locales (ne pas committer)
├── .gitignore                   # Exclut .env*, prisma/*.db, .next/, uploads/
├── next.config.js               # Config Next.js (images remotePatterns)
├── tailwind.config.ts           # Config Tailwind (couleurs nova-*, dark mode)
├── tsconfig.json                # TypeScript strict
└── package.json                 # Dépendances
```

---

## 4. Base de données — Modèles Prisma

**Provider :** SQLite (dev) → prévu pour migrer vers PostgreSQL (prod)

| Modèle | Description | Champs clés |
|---|---|---|
| `User` | Comptes utilisateurs et admins | role, userType, subscriptionPlan, isActive |
| `Car` | Annonces voitures | title, slug, price, priceType, brand, model, year, mileage, fuel, transmission, images(JSON), status, featured, isBoosted, planType |
| `Property` | Annonces immobilier | title, slug, price, type, bedrooms, surface, city, images(JSON), amenities(JSON), status, featured |
| `BlogPost` | Articles | title, slug, content(HTML), category, tags(JSON), status(DRAFT/PUBLISHED/SCHEDULED), publishedAt |
| `Payment` | Transactions | amount, method(MTN/ORANGE/MOOV/CARD), status(PENDING/SUCCESS/FAILED), reference, type(ANNONCE/BOOST/SUBSCRIPTION) |
| `Subscription` | Abonnements | plan(FREE/PRO/PREMIUM), status(ACTIVE/EXPIRED), expiresAt |
| `SiteSetting` | Clé-valeur config | key (unique), value — pattern universel de configuration |
| `Page` | Pages CMS | slug, sections(JSON), heroTitle, heroSubtitle, isPublished |
| `MenuItem` | Navigation | label, href, parentId, order |
| `Media` | Fichiers uploadés | url, filename, mimetype, size |
| `Promotion` | Bannières | title, image, link, isActive, expiresAt |
| `Testimonial` | Avis clients | name, role, content, rating, isActive |
| `Lead` | Contacts entrants | type, name, email, phone, listingType, listingId, isRead |
| `ContactMessage` | Formulaire contact | name, email, message, isRead |
| `FaqItem` | FAQ | question, answer, category, order |

**Important :** Les champs `images`, `tags`, `amenities`, `sections` sont stockés en **JSON stringifié** (SQLite ne supporte pas les arrays natifs). Toujours parser avec `JSON.parse()` et écrire avec `JSON.stringify()`.

---

## 5. Technologies utilisées

### Core
- **Next.js 15.5** — App Router, Server Components, Route Handlers
- **React 18** — Hooks, Context, Suspense
- **TypeScript** — strict mode activé
- **Tailwind CSS 3.4** — utility-first, dark mode via class

### Auth & DB
- **NextAuth v4** — stratégie JWT, Credentials provider, pages custom
- **Prisma 5.22** — ORM, migrations, client type-safe
- **SQLite** — dev local (fichier `prisma/dev.db`)
- **bcryptjs** — hash passwords, cost 12

### Formulaires & Validation
- **React Hook Form 7** — formulaires performants
- **Zod 4** — validation de schémas TypeScript-first

### Éditeur riche
- **TipTap 3** — éditeur WYSIWYG (articles blog, descriptions) avec extensions : image, link, underline, color, placeholder, character count

### UI & Animations
- **Lucide React** — bibliothèque d'icônes
- **Framer Motion 11** — animations (hero, menu mobile, transitions)
- **clsx + tailwind-merge** — composition className conditionnelle
- **dnd-kit** — drag & drop (réordonnancement sections CMS)

### Upload & Médias
- **Next.js Image** — optimisation automatique
- **`fs/promises`** — stockage local dans `public/uploads/`
- **Cloudinary** — configuré mais optionnel (variables commentées dans `.env.local`)

### Dev
- **Port par défaut : 4000** (`next dev -p 4000`)
- Seed : `npm run seed` (tsx prisma/seed.ts)

---

## 6. Patterns architecturaux importants

### Pattern settings (SiteSetting)

Toutes les pages publiques ont leur contenu éditable via le CMS. Le pattern est **identique partout** :

```tsx
// 1. Définir les valeurs par défaut (textes hardcodés)
const DEFAULTS: Record<string, string> = {
  "hero.title": "Titre par défaut",
  "hero.subtitle": "Sous-titre par défaut",
};

// 2. Fetcher au mount depuis /api/settings?prefix=page.{slug}.
const [c, setC] = useState<Record<string, string>>({});
useEffect(() => {
  fetch("/api/settings?prefix=page.monslug.")
    .then(r => r.json())
    .then(data => setC(typeof data === "object" && data !== null ? data : {}))
    .catch(() => {});
}, []);

// 3. Helper : settings CMS > défaut hardcodé > chaîne vide
const g = (key: string) => c[key] || DEFAULTS[key] || "";

// 4. Utiliser dans le JSX
<h1>{g("hero.title")}</h1>
```

**Clés utilisées par page :**
- `page.home.*` — page d'accueil
- `page.services.*` — hub services
- `page.services/{id}.*` — détail service (ex: `page.services/location-voiture.hero.title`)
- `page.automobile.*`, `page.immobilier.*`, `page.blog.*`, `page.about.*`, `page.contact.*`

L'API `/api/settings?prefix=page.automobile.` renvoie un objet avec les **clés sans le préfixe** (ex: `{ "hero.title": "Mon titre" }`).

### Pattern catch-all route admin pages

Le chemin `/admin/(panel)/pages/[...slug]/page.tsx` gère tous les slugs multi-segments :
- `/admin/pages/home` → `slug = "home"`
- `/admin/pages/services/achat-vente-immo` → `slug = "services/achat-vente-immo"`

```tsx
const params = useParams<{ slug: string[] }>();
const slug = Array.isArray(params.slug)
  ? params.slug.join("/")
  : (params.slug || "home");
```

### Sécurité des routes API

**Règle absolue :**
- Toute route qui **modifie** ou **supprime** des données doit appeler `getServerSession(authOptions)` en premier.
- Le `DELETE /api/annonces/[id]` vérifie la propriété de l'annonce avant de supprimer (sauf ADMIN).
- Les uploads vérifient le type MIME côté serveur (`file.type`, jamais `file.name.split(".")`).
- Ne jamais retourner `e.message` dans une réponse d'erreur (fuite d'informations internes).

```ts
// Pattern type sécurisé pour les erreurs
} catch {
  return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
}
```

### Middleware de protection

`middleware.ts` protège :
- `/admin/**` → rôles SUPER_ADMIN, ADMIN, EDITOR, AGENT_AUTO, AGENT_IMMO requis
- `/dashboard/**` et `/publier/**` → toute session valide

Redirection automatique vers `/admin/login` ou `/auth/login` si non connecté.

### Thème dark/light

- Détection OS + stockage `localStorage('nova-theme')` valeurs : `"dark"`, `"light"`, `"system"`
- Script inline dans `<head>` pour éviter le flash (FOUC) avant hydratation React
- Tailwind utilise le mode `class` → `dark:` préfixe CSS appliqué via `<html class="dark">`

### Images et arrays en SQLite

Prisma + SQLite ne supporte pas les types array natifs. Convention du projet :
- `images` : `String @default("[]")` — JSON stringifié → `JSON.parse(car.images)`
- `tags` : idem
- `amenities` : idem
- `sections` : idem (pour les pages CMS)

---

## 7. Rôles et permissions

| Rôle | Accès |
|---|---|
| `SUPER_ADMIN` | Tout sans restriction |
| `ADMIN` | Tout l'admin + actions sur les annonces des autres |
| `EDITOR` | Blog, pages CMS, médias |
| `AGENT_AUTO` | Gestion voitures uniquement |
| `AGENT_IMMO` | Gestion propriétés uniquement |
| `USER` | Dashboard perso, ses propres annonces |

Les rôles sont stockés dans le token JWT et transmis à chaque requête via le callback `session` de NextAuth. Accès dans les Server Components et API Routes via `(session.user as any).role`.

---

## 8. Plans et monétisation

Définis dans `lib/plans.ts` :

| Plan | Prix | Annonces max | Boost | Visibilité |
|---|---|---|---|---|
| FREE | 0 FCFA | 1 | Non | 30 jours |
| PRO | 15 000 FCFA | 10 | Oui | 60 jours |
| PREMIUM | 35 000 FCFA | Illimité | Inclus | 90 jours |

**Boosts d'annonces :**
- GRATUIT : 0 FCFA, standard
- EN_AVANT : 10 000 FCFA, position prioritaire
- PREMIUM : 25 000 FCFA, 1ère position garantie, 60 jours

**Méthodes de paiement :** MTN Mobile Money, Orange Money, Moov Money, Carte bancaire

**⚠️ Avertissement :** Le flux de paiement actuel est **simulé** (setTimeout + redirect). Il n'y a pas d'intégration avec un vrai prestataire de paiement. La table `Payment` est créée avec `status: "PENDING"` par défaut mais rien ne la met à `SUCCESS` de façon vérifiée.

---

## 9. Services NOVA (données statiques)

Définis dans `lib/services-data.ts`, non stockés en base :

| ID | Titre | Catégorie |
|---|---|---|
| `location-voiture` | Location de Voiture | automobile |
| `flotte` | Gestion de Flotte | automobile |
| `pieces-auto` | Vente de Pièces Auto | automobile |
| `achat-vente-immo` | Achat & Vente Immobilier | immobilier |
| `location-immo` | Location Immobilier | immobilier |

Chaque service a : titre, sous-titre, description longue, galerie Unsplash, features[], avantages[], CTA, texte WhatsApp.

Le composant `ServiceDetailPage.tsx` peut **surcharger** ces valeurs statiques avec les settings CMS (`page.services/{id}.*`).

---

## 10. Décisions de design

### Couleurs brand (`tailwind.config.ts`)
Les couleurs NOVA sont définies comme variables CSS custom et des tokens Tailwind :
- `nova-red` — couleur principale
- `nova-orange` — secondaire
- `nova-yellow` — accent
- Toutes les couleurs peuvent être modifiées dynamiquement via l'admin "Design" → stockées dans `SiteSetting` → injectées par `DynamicStyles.tsx`

### Composants shell listing

`CarListingShell`, `ListingShell`, `BlogListingShell` partagent la même architecture :
- Props : `title`, `subtitle`, `badge`, `apiQuery` (paramètres URL pour filtrer l'API), `activeTab`
- Filtres côté client sur les résultats fetchés
- Pagination incluse

### Architecture "sections" CMS

La homepage et certaines pages sont construites par assemblage de sections. `SectionRenderer.tsx` fait le dispatch :
```tsx
switch (section.type) {
  case "hero": return <HeroSection {...section} />;
  case "blog": return <BlogSection {...section} />;
  // ...
}
```

### Navigation

`Navbar.tsx` contient un **mega-menu** desktop (colonnes par catégorie) et un **drawer mobile** (Framer Motion). La navigation est hardcodée dans le composant mais peut être enrichie via `MenuItem` en DB (non encore branché dynamiquement sur le menu principal).

---

## 11. Variables d'environnement requises

```env
# .env.local (ne jamais committer)
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="<32 bytes base64 généré par openssl rand -base64 32>"

# Optionnel — Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
```

---

## 12. Instructions pour un futur modèle IA

### Ce qu'il faut toujours faire

1. **Lire le fichier avant de modifier** — ne jamais éditer sans lire le fichier cible d'abord
2. **Respecter le pattern settings** — toute nouvelle page publique doit suivre le pattern `useEffect fetch + DEFAULTS + g(key)`
3. **Authentifier toutes les mutations API** — `getServerSession(authOptions)` en tête de tout POST/PUT/DELETE
4. **Vérifier la propriété avant suppression** — un utilisateur ne peut supprimer que ses propres annonces
5. **Parser le JSON correctement** — `images`, `tags`, `amenities`, `sections` sont des strings JSON dans SQLite
6. **Utiliser les types Prisma** — le client est typé, profiter de l'autocomplétion
7. **Ne jamais exposer `e.message`** dans les réponses d'erreur API

### Ce qu'il ne faut pas faire

1. **Ne pas créer de fichiers `.env`** versionnés ou les committer
2. **Ne pas modifier `prisma/dev.db`** directement — passer par Prisma migrations ou le seed
3. **Ne pas ajouter de routes sous `app/admin/pages/`** (hors du route group `(panel)`) — ça crée des conflits de routes parallèles
4. **Ne pas utiliser `[slug]` pour les routes admin pages** — utiliser `[...slug]` (catch-all multi-segments)
5. **Ne pas utiliser `dangerouslySetInnerHTML` sans DOMPurify** — XSS risk (dette technique connue)
6. **Ne pas appeler `file.name.split(".")` pour valider les types** — utiliser `file.type` (contrôlé par le serveur)

### Tâches encore à faire (dette technique connue)

- [ ] Intégrer un vrai prestataire de paiement (CinetPay, FedaPay ou Stripe)
- [ ] Ajouter DOMPurify pour assainir le HTML dans `dangerouslySetInnerHTML` (4 endroits)
- [ ] Implémenter le rate limiting (ex: `upstash/ratelimit` ou middleware personnalisé)
- [ ] Migrer SQLite → PostgreSQL pour la production
- [ ] Connecter les `MenuItem` de la DB à la `Navbar.tsx` dynamiquement
- [ ] Ajouter la validation Zod sur les API routes (body parsing)
- [ ] Mettre en place les emails transactionnels (confirmation contact, paiement, etc.)
- [ ] Réduire la durée de session JWT (actuellement 30 jours, recommandé 7 jours)
- [ ] Ajouter un vrai système de recherche full-text (actuellement filtres côté client)

### Commandes utiles

```bash
npm run dev          # Lance le serveur sur http://localhost:4000
npm run build        # Build de production
npm run seed         # Peuple la BDD avec des données initiales
npx prisma studio    # Interface graphique pour la DB
npx prisma migrate dev --name <nom>  # Crée une migration après modif du schema
npx kill-port 4000   # Si le port est déjà occupé
```

---

*Dernière mise à jour : 2026-05-09*
