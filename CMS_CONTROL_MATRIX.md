# CMS CONTROL MATRIX — NOVA MARKETPLACE
> Audit CMS Phase 2 | Généré le 24 juin 2026
> ✓ = administrable depuis le backend | ✗ = codé en dur dans le code source
> ⚠ = partiellement administrable (champ existe en admin mais non lu par le front)

---

## LÉGENDE

| Symbole | Signification |
|---------|--------------|
| ✓ | Administrable — champ modifiable depuis l'admin, lu par le front |
| ✗ | Hardcodé — valeur figée dans le code source |
| ⚠ | Configuré en admin mais NON lu par le front-end (orphelin) |
| 🔌 | Admin panel dédié |
| 📄 | Via Page Builder (admin > Pages > [slug]) |
| ⚙️ | Via Paramètres globaux (admin > Paramètres ou Apparence) |
| 🎨 | Via Design System (admin > Design) |
| 📰 | Via module dédié (admin > Blog / Auto / Immo...) |

---

## 1. PAGE ACCUEIL (/)

**Admin panel dédié :** 🔌 `/admin/homepage` + 📄 Page Builder (slug: home)

### 1.1 Section Hero

| Élément | Statut | Via |
|---------|--------|-----|
| Type de hero (split / video / slider) | ✓ | admin/homepage > Hero |
| Titre principal | ✓ | admin/homepage > Hero |
| Sous-titre | ✓ | admin/homepage > Hero |
| Badge (pill au-dessus) | ✓ | admin/homepage > Hero |
| Bouton CTA 1 — texte | ✓ | admin/homepage > Hero |
| Bouton CTA 1 — lien | ✓ | admin/homepage > Hero |
| Bouton CTA 2 — texte | ✓ | admin/homepage > Hero |
| Bouton CTA 2 — lien | ✓ | admin/homepage > Hero |
| Opacité overlay | ✓ | admin/homepage > Hero |
| URL vidéo (mode video) | ✓ | admin/homepage > Hero |
| Slides (images + titres + sous-titres) | ✓ | admin/homepage > Hero (JSON) |
| **Carte flottante droite (split mode)** | | |
| — Nom voiture ("BMW X5 2023") | ✗ | Hardcodé dans HomepageHero.tsx:402 |
| — Prix ("28 500 000 FCFA") | ✗ | Hardcodé dans HomepageHero.tsx:396 |
| — Specs ("2023, Essence, 12 500 km") | ✗ | Hardcodé dans HomepageHero.tsx:407 |
| — Badge "Coup de cœur" | ✗ | Hardcodé dans HomepageHero.tsx:388 |
| **Mini-stats flottantes** | | |
| — "1 200+" Voitures | ✗ | Hardcodé dans HomepageHero.tsx:424 |
| — "800+" Biens immo | ✗ | Hardcodé dans HomepageHero.tsx:424 |
| — "98%" Satisfaction | ✗ | Hardcodé dans HomepageHero.tsx:424 |
| **Activité en temps réel** | | |
| — "Nouvelle BMW X5 publiée" | ✗ | Hardcodé dans HomepageHero.tsx:440 |
| — "Villa Cocody réservée" | ✗ | Hardcodé dans HomepageHero.tsx:440 |
| — Badge "Populaire" (top droite) | ✗ | Hardcodé dans HomepageHero.tsx:452 |
| **Trust badges (split mode)** | | |
| — "Annonces vérifiées" | ✗ | Hardcodé dans HomepageHero.tsx:315 |
| — "Paiement sécurisé" | ✗ | Hardcodé dans HomepageHero.tsx:316 |
| — "Réponse en 2h" | ✗ | Hardcodé dans HomepageHero.tsx:317 |
| Barre de recherche | ✗ | Hardcodé (fonctionnel mais non configurable) |
| Villes liste (dropdown) | ✗ | Hardcodé dans HomepageHero.tsx:11 |

### 1.2 Section Statistiques

| Élément | Statut | Via |
|---------|--------|-----|
| Section visible/cachée | ✓ | admin/homepage > Sections |
| Position dans l'ordre | ✓ | admin/homepage > Sections (drag & drop) |
| Titre de section | ✓ | admin/homepage > Content > Stats |
| Sous-titre | ✓ | admin/homepage > Content > Stats |
| Données stats (JSON : icône, valeur, suffix, label, sub) | ✓ | admin/homepage > Content > Stats |
| Pill "NOVA en chiffres" | ✗ | Hardcodé dans StatsSection.tsx:63 |
| Texte "Données mises à jour en temps réel" | ✗ | Hardcodé dans StatsSection.tsx:135 |
| Couleur de fond (bg-slate-50) | ✗ | Hardcodé (classe Tailwind fixe) |

### 1.3 Section Catégories rapides

| Élément | Statut | Via |
|---------|--------|-----|
| Section visible/cachée | ✓ | admin/homepage > Sections |
| Position dans l'ordre | ✓ | admin/homepage > Sections |
| Titre de section | ✓ | admin/homepage > Content > Catégories |
| Sous-titre | ✓ | admin/homepage > Content > Catégories |
| Données catégories (JSON : icône, label, desc, href, badge…) | ✓ | admin/homepage > Content > Catégories |
| Pill "Catégories" | ✗ | Hardcodé dans QuickCategoriesSection.tsx:31 |

### 1.4 Section Annonces vedettes (FeaturedListings)

| Élément | Statut | Via |
|---------|--------|-----|
| Section visible/cachée | ✓ | admin/homepage > Sections |
| Position dans l'ordre | ✓ | admin/homepage > Sections |
| Titre "Nos meilleures offres" | ✗ | Hardcodé dans FeaturedListings.tsx |
| Sous-titre | ✗ | Hardcodé |
| Filtre (auto/immo/both) | ✗ | Hardcodé |
| Annonces affichées | ✓ | DB (Cars + Properties via API) |
| Nombre d'annonces | ✗ | Hardcodé (LIMIT = 9) |

### 1.5 Section Pourquoi NOVA

| Élément | Statut | Via |
|---------|--------|-----|
| Section visible/cachée | ✓ | admin/homepage > Sections |
| Position dans l'ordre | ✓ | admin/homepage > Sections |
| Titre de section | ✓ | admin/homepage > Content > Pourquoi NOVA |
| Sous-titre | ✓ | admin/homepage > Content > Pourquoi NOVA |
| Cartes avantages (JSON : icône, titre, desc, gradient, chip) | ✓ | admin/homepage > Content > Pourquoi NOVA |
| Pill "Pourquoi NOVA ?" | ✗ | Hardcodé dans WhyNovaSection.tsx:28 |

### 1.6 Section Blog

| Élément | Statut | Via |
|---------|--------|-----|
| Section visible/cachée | ✓ | admin/homepage > Sections |
| Position dans l'ordre | ✓ | admin/homepage > Sections |
| Titre/sous-titre section | ✗ | Hardcodé dans BlogSection.tsx |
| Articles affichés | ✓ | DB (BlogPost via API) |
| Nombre d'articles | ✗ | Hardcodé |

### 1.7 Section CTA Final

| Élément | Statut | Via |
|---------|--------|-----|
| Section visible/cachée | ✓ | admin/homepage > Sections |
| Position dans l'ordre | ✓ | admin/homepage > Sections |
| Titre | ✓ | admin/homepage > CTA |
| Sous-titre | ✓ | admin/homepage > CTA |
| Couleur de fond | ✓ | admin/homepage > CTA (hex color picker) |
| Bouton 1 texte | ✓ | admin/homepage > CTA |
| Bouton 1 lien | ✓ | admin/homepage > CTA |
| Bouton 2 texte | ✓ | admin/homepage > CTA |
| Bouton 2 lien | ✓ | admin/homepage > CTA |
| Pill "Rejoignez NOVA" | ✗ | Hardcodé dans HomepageCtaSection.tsx:36 |

### 1.8 SEO

| Élément | Statut | Via |
|---------|--------|-----|
| SEO Title | ✓ | admin/seo (slug: home) |
| Meta Description | ✓ | admin/seo |
| OG Image | ✓ | admin/seo |
| Canonical | ✓ | admin/seo |
| NoIndex | ✓ | admin/seo |
| ⚠️ Injection metadata front-end | ⚠ | Page lue depuis DB mais `layout.tsx` utilise metadata statique — front-end page.tsx n'a pas de `generateMetadata` |

---

## 2. PAGE AUTOMOBILE (/automobile et sous-pages)

**Admin panel dédié :** 📄 Page Builder (slug: automobile)

### 2.1 Hero catalogue

| Élément | Statut | Via |
|---------|--------|-----|
| Titre principal | ✓ | admin/pages > automobile |
| Sous-titre | ✓ | admin/pages > automobile |
| Badge | ✓ | admin/pages > automobile |
| Couleur de fond (dark gradient) | ✗ | Hardcodé dans CarListingShell.tsx:78 |
| Image de fond | ✗ | Absent (fond généré CSS) |

### 2.2 Catalogue & Filtres

| Élément | Statut | Via |
|---------|--------|-----|
| Onglets (Tous/Vente/Location/Pièces) | ✗ | Hardcodé dans CarListingShell.tsx:10-15 |
| Barre de recherche | ✗ | Hardcodé (fonctionnel) |
| Nombre par page | ✗ | Hardcodé (LIMIT = 9) |
| Tri par défaut | ✗ | Hardcodé |
| Annonces affichées | ✓ | DB (Cars via API) |
| Images annonces | ✓ | Via admin/automobiles (upload) |
| Badges annonces | ✓ | Via admin/automobiles |
| Bouton WhatsApp sur card | ✓ | Via SiteSetting.whatsapp |

### 2.3 Sous-pages automobile

| Page | Titre | Sous-titre | Filtres | Annonces |
|------|-------|-----------|---------|---------|
| /automobile/vente | ✗ Hardcodé | ✗ Hardcodé | ✗ Hardcodé | ✓ DB |
| /automobile/location | ✗ Hardcodé | ✗ Hardcodé | ✗ Hardcodé | ✓ DB |
| /automobile/pieces | ✗ Hardcodé | ✗ Hardcodé | ✗ Hardcodé | ✓ DB |

### 2.4 Fiche détail voiture (/automobile/[id])

| Élément | Statut | Via |
|---------|--------|-----|
| Titre, description, prix | ✓ | admin/automobiles/[id] |
| Marque, modèle, année, kilométrage | ✓ | admin/automobiles/[id] |
| Carburant, transmission, couleur | ✓ | admin/automobiles/[id] |
| Ville, localisation | ✓ | admin/automobiles/[id] |
| Images galerie | ✓ | admin/automobiles/[id] (upload) |
| Badge (En avant / Premium) | ✓ | admin/automobiles/[id] |
| Statut (Actif/Pending/Rejeté) | ✓ | admin/automobiles/[id] |
| Featured (mis en avant) | ✓ | admin/automobiles/[id] |
| SEO (seoTitle, metaDesc, ogImage) | ✓ | admin/automobiles/[id] |

### 2.5 SEO global automobile

| Élément | Statut | Via |
|---------|--------|-----|
| SEO page /automobile | ✓ | admin/seo (slug: automobile) |
| SEO fiche /automobile/[id] | ✓ | admin/automobiles/[id] |

---

## 3. PAGE IMMOBILIER (/immobilier et sous-pages)

**Admin panel dédié :** 📄 Page Builder (slug: immobilier)

### 3.1 Hero catalogue

| Élément | Statut | Via |
|---------|--------|-----|
| Titre principal | ✓ | admin/pages > immobilier |
| Sous-titre | ✓ | admin/pages > immobilier |
| Badge | ✓ | admin/pages > immobilier |
| Couleur de fond | ✗ | Hardcodé |
| Image de fond | ✗ | Absent |

### 3.2 Catalogue & Filtres

| Élément | Statut | Via |
|---------|--------|-----|
| Onglets (Tous/Vente/Location/Maisons/Studios/Terrains) | ✗ | Hardcodé dans ListingShell.tsx |
| Barre de recherche | ✗ | Hardcodé (fonctionnel) |
| Nombre par page | ✗ | Hardcodé |
| Annonces affichées | ✓ | DB (Properties via API) |
| Images annonces | ✓ | Via admin/immobilier (upload) |
| Badges annonces | ✓ | Via admin/immobilier |

### 3.3 Sous-pages immobilier

| Page | Titre | Sous-titre | Filtres | Annonces |
|------|-------|-----------|---------|---------|
| /immobilier/vente | ✗ Hardcodé | ✗ Hardcodé | ✗ Hardcodé | ✓ DB |
| /immobilier/location | ✗ Hardcodé | ✗ Hardcodé | ✗ Hardcodé | ✓ DB |
| /immobilier/maisons | ✗ Hardcodé | ✗ Hardcodé | ✗ Hardcodé | ✓ DB |
| /immobilier/studios | ✗ Hardcodé | ✗ Hardcodé | ✗ Hardcodé | ✓ DB |
| /immobilier/terrains | ✗ Hardcodé | ✗ Hardcodé | ✗ Hardcodé | ✓ DB |

### 3.4 Fiche détail bien (/immobilier/[id])

| Élément | Statut | Via |
|---------|--------|-----|
| Titre, description, prix | ✓ | admin/immobilier/[id] |
| Type, chambres, SDB, surface, terrain | ✓ | admin/immobilier/[id] |
| Ville, localisation, quartier | ✓ | admin/immobilier/[id] |
| Commodités | ✓ | admin/immobilier/[id] |
| Images galerie | ✓ | admin/immobilier/[id] (upload) |
| Badge, statut, featured | ✓ | admin/immobilier/[id] |
| SEO | ✓ | admin/immobilier/[id] |

---

## 4. PAGE SERVICES (/services)

**Admin panel dédié :** 📄 Page Builder (slug: services)

### 4.1 Section Hero

| Élément | Statut | Via |
|---------|--------|-----|
| Badge (pill) | ✓ | admin/pages > services |
| Titre ligne 1 | ✓ | admin/pages > services |
| Titre ligne 2 (colorée) | ✓ | admin/pages > services |
| Sous-titre | ✓ | admin/pages > services |
| Avantage 1 (ex: "Disponible 24h/24") | ✓ | admin/pages > services |
| Avantage 2 | ✓ | admin/pages > services |
| Avantage 3 | ✓ | admin/pages > services |
| Avantage 4 | ✓ | admin/pages > services |
| Couleur de fond | ✗ | Hardcodé (bg-gradient from-white via-orange-50) |
| Image hero | ✗ | Absent |

### 4.2 Cartes services

| Élément | Statut | Via |
|---------|--------|-----|
| Titre de chaque service | ✗ | Hardcodé dans lib/services-data.ts |
| Sous-titre de chaque service | ✗ | Hardcodé |
| Description courte | ✗ | Hardcodé |
| Image principale | ✗ | URL hardcodée dans services-data.ts |
| Tag / couleur tag | ✗ | Hardcodé |
| Dégradé icône | ✗ | Hardcodé |
| Icône (LucideIcon) | ✗ | Hardcodé |
| Catégorie (auto/immo) | ✗ | Hardcodé |

### 4.3 Bannière CTA finale

| Élément | Statut | Via |
|---------|--------|-----|
| Titre | ✓ | admin/pages > services |
| Sous-titre | ✓ | admin/pages > services |
| Texte du bouton | ✓ | admin/pages > services |
| Texte sous le bouton | ✓ | admin/pages > services |
| Couleur de fond | ✗ | Hardcodé (orange) |

---

## 5. SOUS-PAGES SERVICES

### 5.1 /services/location-voiture

**Admin panel dédié :** 📄 Page Builder (slug: services/location-voiture)

| Élément | Statut | Via |
|---------|--------|-----|
| Titre du service | ✓ | admin/pages > services/location-voiture |
| Sous-titre | ✓ | admin/pages > services/location-voiture |
| Description complète | ✓ | admin/pages > services/location-voiture |
| Texte bouton de contact | ✓ | admin/pages > services/location-voiture |
| **Contenu hardcodé (services-data.ts) :** | | |
| — Features (liste de fonctionnalités) | ✗ | Hardcodé dans services-data.ts |
| — Avantages (titre, texte, icône) | ✗ | Hardcodé |
| — Galerie d'images | ✗ | URLs hardcodées (Unsplash) |
| — Prix | ✗ | Hardcodé |
| — Tag couleur | ✗ | Hardcodé |
| — Gradient | ✗ | Hardcodé |
| SEO title | ✗ | Hardcodé dans le fichier page.tsx |
| SEO description | ✗ | Hardcodé dans le fichier page.tsx |

### 5.2 /services/achat-vente-immo

| Élément | Statut | Via |
|---------|--------|-----|
| Titre | ✓ | admin/pages > services/achat-vente-immo |
| Sous-titre | ✓ | admin/pages > services/achat-vente-immo |
| Description | ✓ | admin/pages > services/achat-vente-immo |
| CTA bouton | ✓ | admin/pages > services/achat-vente-immo |
| Contenu (features, avantages, galerie, prix) | ✗ | Hardcodé dans services-data.ts |
| SEO | ✗ | Hardcodé dans page.tsx |

### 5.3 /services/location-immo

| Élément | Statut | Via |
|---------|--------|-----|
| Titre | ✓ | admin/pages > services/location-immo |
| Sous-titre | ✓ | admin/pages > services/location-immo |
| Description | ✓ | admin/pages > services/location-immo |
| CTA bouton | ✓ | admin/pages > services/location-immo |
| Contenu (features, avantages, galerie) | ✗ | Hardcodé |
| SEO | ✗ | Hardcodé dans page.tsx |

### 5.4 /services/pieces-auto

| Élément | Statut | Via |
|---------|--------|-----|
| Titre | ✓ | admin/pages > services/pieces-auto |
| Sous-titre | ✓ | admin/pages > services/pieces-auto |
| Description | ✓ | admin/pages > services/pieces-auto |
| CTA bouton | ✓ | admin/pages > services/pieces-auto |
| Contenu | ✗ | Hardcodé |
| SEO | ✗ | Hardcodé dans page.tsx |

### 5.5 /services/flotte

| Élément | Statut | Via |
|---------|--------|-----|
| Titre | ✓ | admin/pages > services/flotte |
| Sous-titre | ✓ | admin/pages > services/flotte |
| Description | ✓ | admin/pages > services/flotte |
| CTA bouton | ✓ | admin/pages > services/flotte |
| Contenu | ✗ | Hardcodé |
| SEO | ✗ | Hardcodé dans page.tsx |

> **Conclusion sous-pages services :** Aucune des 5 sous-pages n'a d'écran admin complet dédié à la gestion du contenu riche (features, avantages, galerie, prix). Seuls 4 champs texte sont contrôlables via le Page Builder.

---

## 6. PAGE BLOG (/blog et sous-pages)

**Admin panel dédié :** 📄 Page Builder (slug: blog) + 🔌 admin/blog

### 6.1 Header de la page blog

| Élément | Statut | Via |
|---------|--------|-----|
| Badge | ✓ | admin/pages > blog |
| Titre | ✓ | admin/pages > blog |
| Sous-titre | ✓ | admin/pages > blog |
| Couleur de fond | ✗ | Hardcodé |

### 6.2 Catalogue articles

| Élément | Statut | Via |
|---------|--------|-----|
| Onglets catégories | ✗ | Hardcodé dans BlogListingShell.tsx |
| Articles affichés | ✓ | DB (BlogPost via API) |
| Nombre par page | ✗ | Hardcodé |
| Tri par défaut | ✗ | Hardcodé |

### 6.3 Article détail (/blog/[slug])

| Élément | Statut | Via |
|---------|--------|-----|
| Titre | ✓ | admin/blog/[id] |
| Contenu (Tiptap HTML) | ✓ | admin/blog/[id] |
| Extrait | ✓ | admin/blog/[id] |
| Image de couverture | ✓ | admin/blog/[id] (upload) |
| Catégorie | ✓ | admin/blog/[id] |
| Tags | ✓ | admin/blog/[id] |
| Auteur | ✓ | admin/blog/[id] |
| Statut (DRAFT/PUBLISHED) | ✓ | admin/blog/[id] |
| Date de publication | ✓ | admin/blog/[id] |
| Date planifiée | ✓ | admin/blog/[id] |
| Temps de lecture | ✓ | admin/blog/[id] |
| SEO (seoTitle, metaDesc, ogImage, canonical, noIndex) | ✓ | admin/blog/[id] |

### 6.4 Sous-pages blog filtrées

| Page | Titre/Header | Articles |
|------|-------------|---------|
| /blog/actualites | ✗ Hardcodé | ✓ DB (filtrés) |
| /blog/automobile | ✗ Hardcodé | ✓ DB (filtrés) |
| /blog/guides | ✗ Hardcodé | ✓ DB (filtrés) |
| /blog/immobilier | ✗ Hardcodé | ✓ DB (filtrés) |

---

## 7. PAGE CONTACT (/contact)

**Admin panel dédié :** 📄 Page Builder (slug: contact)

| Élément | Statut | Via |
|---------|--------|-----|
| Titre de la page | ✓ | admin/pages > contact |
| Sous-titre | ✓ | admin/pages > contact |
| Horaires d'ouverture | ✓ | admin/pages > contact |
| Note sur les horaires | ✓ | admin/pages > contact |
| Numéro de téléphone | ✓ | admin/parametres (phone) |
| Email | ✓ | admin/parametres (email) |
| Adresse | ✓ | admin/parametres (address) |
| WhatsApp | ✓ | admin/parametres (whatsapp) |
| Titre bandeau final | ✓ | admin/pages > contact |
| Sous-titre bandeau final | ✓ | admin/pages > contact |
| **Types de demandes (formulaire)** | | |
| — "Automobile" | ✗ | Hardcodé dans contact/page.tsx |
| — "Immobilier" | ✗ | Hardcodé |
| — "Support" | ✗ | Hardcodé |
| — "Partenariat" | ✗ | Hardcodé |
| Labels champs formulaire | ✗ | Hardcodés |
| Bouton "Envoyer" | ✗ | Hardcodé |
| Google Maps embed | ✗ | Absent |

---

## 8. PAGE ANNONCES (/annonces)

**Admin panel dédié :** 🔌 `/admin/annonces-page`

> **⚠️ Attention critique :** Le panneau admin/annonces-page sauvegarde ses settings dans la table SiteSetting (prefix `annonces.*`), mais la page front-end `/annonces/page.tsx` ne lit **pas** ces clés. Il y a une **déconnexion complète** entre l'admin et le front.

| Élément | Admin (écrit) | Front (lu) | Statut réel |
|---------|--------------|-----------|------------|
| Titre hero | ✓ admin écrit | ✗ front ne lit pas | ⚠ Orphelin |
| Sous-titre hero | ✓ admin écrit | ✗ front ne lit pas | ⚠ Orphelin |
| Afficher hero | ✓ admin écrit | ✗ front ne lit pas | ⚠ Orphelin |
| Catégorie par défaut | ✓ admin écrit | ✗ front ne lit pas | ⚠ Orphelin |
| Tri par défaut | ✓ admin écrit | ✗ front ne lit pas | ⚠ Orphelin |
| Taille de page | ✓ admin écrit | ✗ front ne lit pas | ⚠ Orphelin |
| Style cartes | ✓ admin écrit | ✗ front ne lit pas | ⚠ Orphelin |
| Filtres actifs | ✓ admin écrit | ✗ front ne lit pas | ⚠ Orphelin |
| Label "Premium" | ✓ admin écrit | ✗ front ne lit pas | ⚠ Orphelin |
| Sidebar dark/slate/navy | ✓ admin écrit | ✗ front ne lit pas | ⚠ Orphelin |
| Annonces affichées | — | ✓ DB via API | ✓ |

---

## 9. PAGE À PROPOS (/about)

**Admin panel dédié :** 📄 Page Builder (slug: about)

| Élément | Statut | Via |
|---------|--------|-----|
| Titre principal | ✓ | admin/pages > about |
| Sous-titre | ✓ | admin/pages > about |
| Titre "Notre histoire" | ✓ | admin/pages > about |
| Texte "Notre histoire" | ✓ | admin/pages > about |
| Titre "Notre mission" | ✓ | admin/pages > about |
| Texte "Notre mission" | ✓ | admin/pages > about |
| Titre "Nos valeurs" | ✓ | admin/pages > about |
| Valeur 1 (nom + texte) | ✓ | admin/pages > about |
| Valeur 2 (nom + texte) | ✓ | admin/pages > about |
| Valeur 3 (nom + texte) | ✓ | admin/pages > about |
| Titre bannière finale | ✓ | admin/pages > about |
| Sous-titre bannière | ✓ | admin/pages > about |
| Texte bouton CTA | ✓ | admin/pages > about |
| **Stats bloc (chiffres clés) :** | | |
| — "1 200+" Voitures | ✗ | Hardcodé dans about/page.tsx:30 |
| — "800+" Biens immobiliers | ✗ | Hardcodé dans about/page.tsx:31 |
| — "5 000+" Clients | ✗ | Hardcodé dans about/page.tsx:32 |
| — "4.9/5" Note moyenne | ✗ | Hardcodé dans about/page.tsx:33 |
| Icônes valeurs | ✗ | Hardcodé (Heart, Star, Zap) |
| Image hero / bannière | ✗ | Absent (fond CSS) |
| Couleur fond hero | ✗ | Hardcodé |

---

## 10. HEADER / NAVBAR

**Admin panel dédié :** 🔌 `admin/apparence > En-tête` (⚠ partiellement orphelin)

| Élément | Admin | Front lit | Statut |
|---------|-------|----------|--------|
| Logo texte ("N") | ⚠ logoText enregistré | ✗ Navbar ne lit pas | ⚠ Orphelin |
| Logo tagline ("Auto & Immobilier") | ⚠ logoTagline enregistré | ✗ Navbar ne lit pas | ⚠ Orphelin |
| CTA navbar texte ("Publier une annonce") | ⚠ navCtaText enregistré | ✗ Navbar ne lit pas | ⚠ Orphelin |
| CTA navbar lien ("/publier") | ⚠ navCtaHref enregistré | ✗ Navbar ne lit pas | ⚠ Orphelin |
| Couleur fond navbar | ⚠ navBg enregistré | ✗ Navbar ne lit pas | ⚠ Orphelin |
| Couleur texte navbar | ⚠ navTextColor enregistré | ✗ Navbar ne lit pas | ⚠ Orphelin |
| Liens navigation (menus) | ✓ MenuItem DB | ✗ Navbar utilise NAV_ITEMS const | ⚠ Orphelin |
| "Nous contacter" bouton | ✗ | ✗ Hardcodé JSX Navbar:170 | ✗ |
| "Mon espace" bouton | ✗ | ✗ Hardcodé JSX Navbar:162 | ✗ |
| "Publier" bouton | ✗ | ✗ Hardcodé JSX Navbar:155 | ✗ |
| Dark mode toggle | ✓ | ✓ Fonctionnel (ThemeToggle) | ✓ |
| Couleur primaire (scrolled/non-scrolled) | ✗ | ✗ Hardcodé (toujours blanc) | ✗ |
| Mobile menu — liens | ✗ | ✗ MOBILE_NAV const hardcodé | ✗ |
| Logo image (fichier PNG/SVG) | ✗ | ✗ Absent | ✗ |

---

## 11. FOOTER

**Admin panel dédié :** 🔌 `admin/apparence > Pied de page` + ⚙️ `admin/parametres`

| Élément | Statut | Via |
|---------|--------|-----|
| **Bloc identité :** | | |
| Nom du site | ✓ | admin/parametres (siteName) |
| Tagline | ✓ | admin/apparence (footerTagline) |
| **Coordonnées :** | | |
| Téléphone | ✓ | admin/parametres (phone) |
| Email | ✓ | admin/parametres (email) |
| Adresse | ✓ | admin/parametres (address) |
| **Réseaux sociaux :** | | |
| Facebook | ✓ | admin/parametres (facebook) |
| Instagram | ✓ | admin/parametres (instagram) |
| Twitter / X | ✓ | admin/parametres (twitter) |
| YouTube | ✓ | admin/parametres (youtube) |
| LinkedIn | ✗ | Champ dans admin mais non lu par Footer |
| TikTok | ✗ | Champ dans admin mais non lu par Footer |
| **Copyright :** | | |
| Texte copyright | ✓ | admin/apparence (footerCopyright) |
| **Colonnes de liens :** | | |
| Colonne "Automobile" (5 liens) | ✗ | Hardcodé dans Footer.tsx:8-16 |
| Colonne "Immobilier" (5 liens) | ✗ | Hardcodé dans Footer.tsx:17-26 |
| Colonne "Société" (5 liens) | ✗ | Hardcodé dans Footer.tsx:27-36 |
| Colonne "Support" (5 liens) | ✗ | Hardcodé dans Footer.tsx:37-46 |
| **Villes desservies :** | | |
| Liste des villes | ✗ | Hardcodé (7 villes) dans Footer.tsx:50 |
| **Newsletter banner :** | | |
| Titre banner | ✗ | Hardcodé "Restez informé des meilleures offres" |
| Sous-titre banner | ✗ | Hardcodé |
| Formulaire email | ✗ | Hardcodé (non fonctionnel, pas d'API) |
| **Couleurs footer :** | | |
| Fond footer | ✓ | admin/design (colorFooterBg) |
| Texte footer | ✓ | admin/design (colorFooterText) |
| Titres footer | ✓ | admin/design (colorFooterHeading) |
| Hover liens | ✓ | admin/design (colorFooterHover) |
| **Logo footer :** | | |
| Logo (image) | ✗ | Absent — texte "N" hardcodé |

---

## 12. DESIGN SYSTEM GLOBAL

**Admin panel dédié :** 🔌 `admin/design` + 🔌 `admin/ui-control`

| Élément | Statut | Via |
|---------|--------|-----|
| Couleur primaire (nova-red) | ✓ | admin/design |
| Couleur secondaire (nova-orange) | ✓ | admin/design |
| Couleur accent (nova-yellow) | ✓ | admin/design |
| Couleur texte global | ✓ | admin/design |
| Couleur fond global | ✓ | admin/design |
| Couleur titres (h1-h6) | ✓ | admin/design |
| Couleur sections alternées | ✓ | admin/design |
| Couleur bouton | ✓ | admin/design |
| Couleur texte bouton (auto-contrast) | ✓ | admin/design (calculé serveur) |
| Couleur hover bouton | ✓ | admin/design |
| Couleur fond cartes | ✓ | admin/design |
| Couleur bordure cartes | ✓ | admin/design |
| Couleur fond navbar | ✓ | admin/design (CSS var) |
| Couleur texte navbar | ✓ | admin/design (CSS var) |
| Couleur hover navbar | ✓ | admin/design (CSS var) |
| Couleur fond footer | ✓ | admin/design |
| Couleur texte footer | ✓ | admin/design |
| Couleur titres footer | ✓ | admin/design |
| Couleur hover footer | ✓ | admin/design |
| Style hero (gradient/flat/video/slider) | ✓ | admin/design |
| Opacité overlay | ✓ | admin/design |
| Espacement vertical principal | ✓ | admin/design (spacingMain) |
| Border-radius global | ✓ | admin/design |
| Police de caractères | ✓ | admin/design |
| Intensité ombres | ✓ | admin/design |
| Thème par défaut (light/dark/system) | ✓ | admin/design |
| Animations (on/off) | ✓ | admin/design |
| Dark mode (bascule utilisateur) | ✓ | ThemeToggle |

---

## 13. BIBLIOTHÈQUE MÉDIAS (admin/medias)

**Admin panel dédié :** 🔌 `/admin/medias`

| Fonctionnalité | Statut | Détail |
|----------------|--------|--------|
| **Existence** | ✓ | Page /admin/medias opérationnelle |
| **Upload de fichiers** | ⚠ | Code présent via POST /api/media / /api/upload — MAIS Cloudinary désactivé (.env commenté) → images probablement non persistées en production |
| **Suppression** | ✓ | DELETE /api/media/[id] opérationnel |
| **Remplacement (overwrite)** | ✓ | PUT /api/media/[id] — fonctionnalité "remplacer l'image" |
| **Copier l'URL** | ✓ | Bouton copie disponible |
| **Réutilisation (ImagePickerModal)** | ✓ | MediaLibraryModal dans formulaires admin |
| **Recherche** | ✓ | Recherche par nom de fichier |
| **Vue grille / liste** | ✓ | Toggle grid/list |
| **Métadonnées** | ✓ | filename, mimetype, taille, date |
| **Prévisualisation** | ✓ | Panel latéral au clic |
| **Dossiers** | ✗ | Champ folder en DB mais non implémenté dans l'UI |
| **Alt text** | ✗ | Champ alt en DB mais non éditable dans l'UI |
| **Dimensions** | ✓ | Stockées (width, height) |

---

## 14. MODULES ADMIN COMPLETS

| Module | Écran dédié | CRUD | Ordre | Toggle | SEO | Boost |
|--------|------------|------|-------|--------|-----|-------|
| Voitures | ✓ | ✓ | ✗ | ✓ (status) | ✓ | ✓ |
| Propriétés | ✓ | ✓ | ✗ | ✓ (status) | ✓ | ✓ |
| Articles Blog | ✓ | ✓ | ✗ | ✓ (status) | ✓ | ✗ |
| Témoignages | ✓ | ✓ | ✓ (drag) | ✓ | ✗ | ✗ |
| Promotions | ✓ | ✓ | ✓ (order) | ✓ | ✗ | ✗ |
| Menus | ✓ | ✓ | ✓ (drag) | ✓ | ✗ | ✗ |
| Médias | ✓ | ✓ create/delete | ✗ | ✗ | ✗ | ✗ |
| Leads | ✓ | ✓ read/mark-read | ✗ | ✗ | ✗ | ✗ |
| Messages contact | ✓ | ✓ read/mark-read | ✗ | ✗ | ✗ | ✗ |
| Utilisateurs | ✓ | ✓ | ✗ | ✓ (isActive) | ✗ | ✗ |
| Paiements | ✓ (vue) | read only | ✗ | ✗ | ✗ | ✗ |
| Abonnements | ✓ (vue) | read only | ✗ | ✗ | ✗ | ✗ |
| **FAQ** | ✗ ABSENT | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Services** | ✗ ABSENT | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## 15. SEO — MATRICE PAR PAGE

| Page | seoTitle | metaDesc | ogImage | canonical | noIndex | Injection front |
|------|----------|----------|---------|-----------|---------|----------------|
| / Accueil | ✓ admin/seo | ✓ | ✓ | ✓ | ✓ | ⚠ partielle |
| /automobile | ✓ admin/seo | ✓ | ✓ | ✓ | ✓ | ⚠ partielle |
| /immobilier | ✓ admin/seo | ✓ | ✓ | ✓ | ✓ | ⚠ partielle |
| /blog | ✓ admin/seo | ✓ | ✓ | ✓ | ✓ | ⚠ partielle |
| /services | ✓ admin/seo | ✓ | ✓ | ✓ | ✓ | ⚠ partielle |
| /contact | ✓ admin/seo | ✓ | ✓ | ✓ | ✓ | ⚠ partielle |
| /about | ✓ admin/seo | ✓ | ✓ | ✓ | ✓ | ⚠ partielle |
| /automobile/[id] | ✓ admin auto | ✓ | ✓ | ✗ | ✗ | ⚠ partielle |
| /immobilier/[id] | ✓ admin immo | ✓ | ✓ | ✗ | ✗ | ⚠ partielle |
| /blog/[slug] | ✓ admin blog | ✓ | ✓ | ✓ | ✓ | ⚠ partielle |
| /services/location-voiture | ✗ hardcodé | ✗ | ✗ | ✗ | ✗ | ✗ |
| /services/flotte | ✗ hardcodé | ✗ | ✗ | ✗ | ✗ | ✗ |
| /services/achat-vente-immo | ✗ hardcodé | ✗ | ✗ | ✗ | ✗ | ✗ |
| /services/pieces-auto | ✗ hardcodé | ✗ | ✗ | ✗ | ✗ | ✗ |
| /services/location-immo | ✗ hardcodé | ✗ | ✗ | ✗ | ✗ | ✗ |
| /annonces | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| /pricing | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

> ⚠️ Note injection : Les champs SEO sont enregistrés en DB pour la plupart des pages, mais le front-end Next.js utilise `layout.tsx` avec des métadonnées statiques. Il manque `generateMetadata()` sur les page.tsx publiques pour injecter les données de la DB dans les balises `<head>`.

---

## 16. RÉSUMÉ GLOBAL — TAUX D'ADMINISTRATION

### Comptage par page

| Page | Éléments CMS | Éléments hardcodés | Taux admin |
|------|-------------|-------------------|-----------|
| Accueil | ~35 | ~15 | **70%** |
| Automobile (catalogue) | ~8 | ~8 | **50%** |
| Immobilier (catalogue) | ~8 | ~8 | **50%** |
| Blog (liste) | ~5 | ~5 | **50%** |
| Services | ~12 | ~15 | **44%** |
| Contact | ~10 | ~8 | **55%** |
| Annonces | ~2 | ~15 | **12%** ⚠ |
| À propos | ~16 | ~6 | **73%** |
| Fiche voiture | ~15 | 0 | **100%** |
| Fiche bien | ~15 | 0 | **100%** |
| Article blog | ~12 | 0 | **100%** |
| Services sous-pages | ~4 | ~20 | **17%** |
| Navbar | ~2 | ~12 | **14%** |
| Footer | ~10 | ~15 | **40%** |
| Design System | ~28 | ~0 | **100%** |

### Taux global estimé : **~58%**

---

## 17. TOP PRIORITÉS POUR COMPLÉTER LE CMS

| Priorité | Action | Impact |
|----------|--------|--------|
| 🔴 P1 | Connecter Navbar à la DB (lire MenuItem + SiteSetting navCtaText/navCtaHref) | Débloquer menu admin |
| 🔴 P1 | Connecter /annonces au panneau admin/annonces-page (lire `annonces.*`) | Activer 9 réglages orphelins |
| 🔴 P1 | Ajouter `generateMetadata()` aux pages publiques pour injecter SEO DB | SEO réel |
| 🟡 P2 | Connecter logo (SiteSetting.logoUrl) dans Navbar + Footer | Brand contrôlable |
| 🟡 P2 | Créer module CRUD services (remplacer services-data.ts par DB) | 5 sous-pages éditables |
| 🟡 P2 | Rendre les colonnes Footer dynamiques (Table MenuItem ou SiteSetting) | Footer 100% CMS |
| 🟡 P2 | Ajouter champ logo / logo upload dans admin/apparence | Favicon + logo |
| 🟠 P3 | Ajouter panneau FAQ (CRUD FaqItem, déjà en DB) | Module orphelin |
| 🟠 P3 | Rendre hardcoded splits hero (floating card, trust badges) optionnels | Hero plus personnalisable |
| 🟠 P3 | SEO sous-pages services — lire depuis DB via `generateMetadata()` | 5 pages SEO-ready |

---

*Aucune modification n'a été apportée au projet.*
*Rapport basé sur l'analyse statique du code source — juin 2026.*
