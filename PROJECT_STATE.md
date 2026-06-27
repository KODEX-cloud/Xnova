# PROJECT_STATE.md — NOVA MARKETPLACE
> Mis à jour : 27 juin 2026 — EPIC 01→08 complètes

---

## ÉTAT GLOBAL

| Dimension | Score | Évolution |
|-----------|-------|-----------|
| CMS Administrabilité | ~90% | ↑ depuis 82% |
| Architecture SaaS | 85/100 | ↑ (8 EPIC Enterprise) |
| SEO technique | 78/100 | stable |
| Production-readiness | 70/100 | ↑ (dashboard, CRM, payments, analytics) |

---

## EPIC 01 — SaaS Dashboard (27 juin 2026)

### Réalisé
- Dashboard layout : sidebar sombre 11 sections avec unread badges en temps réel
- Pages : tableau-de-bord, annonces, favoris, statistiques, messages, paiements, abonnement, factures, notifications, profil, paramètres
- APIs : /api/user/stats, /api/user/favorites, /api/user/notifications, /api/invoices, /api/messages (+ unread count), /api/promo
- Profile API étendue : bio, company, city, avatar, website, réseaux sociaux
- Prisma schema v4 : Favorite, Notification, Message, Invoice, PromoCode + champs sociaux User
- lib/plans.ts : 5 plans SaaS (FREE/STARTER/BUSINESS/PREMIUM/ENTERPRISE)
- lib/utils.ts : formatPrice, formatDate, slugify

---

## EPIC 02 — CRM Pipeline (27 juin 2026)

### Réalisé
- Lead model : pipelineStatus (6 étapes), priority, notes, expectedValue, assignedToId
- API leads [id] : GET + PATCH + DELETE avec CRM fields
- Admin leads page : vue inbox + vue Kanban pipeline, pipeline quick-move, notes internes, priority selector

---

## EPIC 03 — Messagerie Interne (27 juin 2026)

### Réalisé
- /api/admin/messages : GET (conversations admin) + POST (composer vers user + notification)
- Admin messages page : onglets Contact / Messages Internes, thread view, modal composer vers n'importe quel user

---

## EPIC 04 — Notifications (27 juin 2026)

### Réalisé
- /api/admin/notifications : broadcast (tous users ou IDs spécifiques) + stats unread par user
- Admin /notifications : formulaire broadcast (type, titre, body, lien, audience), statut canaux (in-app/email/SMS/WhatsApp)

---

## EPIC 05 — Monétisation (27 juin 2026)

### Réalisé
- /api/payments/webhook : handler CinetPay (status update, activation abonnement, auto-invoice, notification)
- /api/payments POST : auto-génère Invoice + Notification sur paiement abonnement
- Admin /paiements/gateways : toggles CMS (CinetPay, MTN MoMo, Orange Money, Wave, Stripe), config fields, webhook URL

---

## EPIC 06 — Back-Office Enterprise (27 juin 2026)

### Réalisé
- /api/stats : étendu avec revenue (total/mensuel/trend), subscriptions byPlan, croissance users, pending listings
- /api/admin/export : CSV export (users, payments, leads, listings) — admin seulement
- Admin /systeme : santé système, stats globales, export CSV, version info

---

## EPIC 07 — Media Center (27 juin 2026)

### Réalisé
- Upload API : video (mp4/webm), PDF, avif, folder param, alt text, limites par type, accès tous roles admin
- Media API : search, type filter, folder filter, bulk DELETE
- Admin medias : filtre par type (image/video/document)

---

## EPIC 08 — Analytics (27 juin 2026)

### Réalisé
- Admin /analytics : KPI cards avec trends, abonnements par plan (bar chart), pipeline leads, taux activation annonces, CTA Google Analytics

---

## MIGRATION SQL REQUISE EN PRODUCTION

Les tables suivantes ont été ajoutées au schéma Prisma mais nécessitent une migration en base :

```sql
-- Nouvelles tables (EPIC 01)
CREATE TABLE "Favorite" (...);
CREATE TABLE "Notification" (...);
CREATE TABLE "Message" (...);
CREATE TABLE "Invoice" (...);
CREATE TABLE "PromoCode" (...);

-- Champs ajoutés à User
ALTER TABLE "User" ADD COLUMN "bio" TEXT;
ALTER TABLE "User" ADD COLUMN "company" TEXT;
ALTER TABLE "User" ADD COLUMN "website" TEXT;
ALTER TABLE "User" ADD COLUMN "city" TEXT;
ALTER TABLE "User" ADD COLUMN "coverImage" TEXT;
ALTER TABLE "User" ADD COLUMN "address" TEXT;
ALTER TABLE "User" ADD COLUMN "isVerified" BOOLEAN DEFAULT false;
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "lastLoginAt" TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "facebook" TEXT;
ALTER TABLE "User" ADD COLUMN "instagram" TEXT;
ALTER TABLE "User" ADD COLUMN "twitter" TEXT;
ALTER TABLE "User" ADD COLUMN "linkedin" TEXT;
ALTER TABLE "User" ADD COLUMN "whatsapp" TEXT;

-- Champs ajoutés à Lead (EPIC 02)
ALTER TABLE "Lead" ADD COLUMN "pipelineStatus" TEXT DEFAULT 'NOUVEAU';
ALTER TABLE "Lead" ADD COLUMN "priority" TEXT DEFAULT 'MEDIUM';
ALTER TABLE "Lead" ADD COLUMN "notes" TEXT;
ALTER TABLE "Lead" ADD COLUMN "expectedValue" DOUBLE PRECISION;
ALTER TABLE "Lead" ADD COLUMN "assignedToId" TEXT;
ALTER TABLE "Lead" ADD COLUMN "updatedAt" TIMESTAMP;
```

Commande : `npx prisma migrate deploy` en production après avoir configuré DATABASE_URL.

---

## BUGS CONNUS

| Bug | Fichier | Gravité |
|-----|---------|---------|
| Cloudinary désactivé | `.env.local` | 🟡 Upload local seulement |
| Analytics non injectés | `app/layout.tsx` | 🟡 ID en DB, pas de script |
| SMTP non implémenté | API routes | 🟡 Config présente, pas nodemailer |
| Paiements Mobile Money simulés | `api/payments/route.ts` | 🔴 Webhook CinetPay à activer en prod |
| Migration DB non appliquée | Prisma | 🔴 Nouveaux modèles EPIC 01/02 inactifs en prod |

---

## PROCHAINES ÉTAPES RECOMMANDÉES

1. **Appliquer la migration SQL** sur Supabase (copier le SQL ci-dessus)
2. **Configurer SMTP** (nodemailer + Resend ou SendGrid)
3. **Configurer CinetPay** (apiKey + siteId dans Admin → Gateways)
4. **Auth utilisateur** : créer `/auth/login` et `/auth/register` pages (existe, à tester)
5. **Déploiement Hostinger** : suivre DEPLOYMENT.md + STAGING.md

---

## COMMITS RÉCENTS

```
b8a1c8f feat(epic08): analytics dashboard
b817280 feat(epic07): media center
246deb3 feat(epic06): enterprise back-office
b012b67 feat(epic05): monetization
e5d3696 feat(epic04): notification system
3a30cd7 feat(epic03): internal messaging
b6da83f feat(epic02): CRM pipeline
5c5e40c feat(epic01): SaaS dashboard
b6c0b2b feat: Phase 3 CMS complete
```
