# BUSINESS_MIGRATION.md — NOVA Marketplace
**Moteur de Business Migration — Guide Complet**

---

## Vue d ensemble

Le Business Migration Engine permet d appliquer des transformations de donnees versionnees,
de facon idempotente, avec suivi d etat dans la base de donnees.

Contrairement aux migrations SQL Prisma (structure), les Business Migrations operent sur
les DONNEES : seeding, transformation, renommage de cles CMS, mise a jour de relations.

---

## Architecture

```
prisma/business-migrations/
  001_seed_cms_defaults.js     # Seed SiteSetting initiaux
  002_seed_plans.js            # Seed configuration plans
  003_xxx.js                   # Futures migrations ...

scripts/
  business-migrate.js          # Moteur d execution

app/api/admin/migrations/      # API REST pour lister/executer via dashboard
```

---

## Etat des migrations

Stocke dans :
1. **Table `BusinessMigration`** (prioritaire, si migree)
2. **Fichier `.migration-state.json`** (fallback si table absente)

---

## Creer une Business Migration

Creer un fichier `prisma/business-migrations/NNN_nom_description.js` :

```js
async function up(prisma) {
  // Vos transformations ici
  await prisma.siteSetting.upsert({
    where:  { key: "ma.cle" },
    update: {},            // Ne pas ecraser si existe
    create: { key: "ma.cle", value: "valeur" },
  });
  console.log("  [NNN] Description de ce qui a ete fait");
}

// Optionnel — rollback
async function down(prisma) {
  await prisma.siteSetting.delete({ where: { key: "ma.cle" } });
}

module.exports = { up, down };
```

**Regles :**
- Prefixer avec un numero a 3 chiffres (`001`, `002`, etc.)
- La fonction `up` est idempotente (utiliser upsert, IF NOT EXISTS)
- Ne jamais supprimer de donnees utilisateur
- Toujours logger ce qui est fait

---

## Commandes

```bash
# Lister toutes les migrations et leur statut
npm run migrate:biz:list

# Appliquer les migrations en attente
npm run migrate:biz

# Depuis le pipeline complet
npm run deploy:dev    # Sans build
npm run deploy        # Avec build (prod)
```

---

## Migrations incluses

| Version | Nom | Description | Statut |
|---------|-----|-------------|--------|
| 001 | seed_cms_defaults | SiteSetting essentiels (siteName, phone, footer, etc.) | READY |
| 002 | seed_plans | Configuration des 5 plans SaaS | READY |

---

## Ecrire une migration de transformation

Exemple : renommer une cle CMS existante.

```js
async function up(prisma) {
  const old = await prisma.siteSetting.findUnique({ where: { key: "ancien.nom" } });
  if (!old) return; // Deja migre
  await prisma.$transaction([
    prisma.siteSetting.create({ data: { key: "nouveau.nom", value: old.value } }),
    prisma.siteSetting.delete({ where: { key: "ancien.nom" } }),
  ]);
}
module.exports = { up };
```

---

## API REST (Admin)

```
GET  /api/admin/migrations          — Lister SQL + Business + historique
POST /api/admin/migrations          — Executer business migrations (SUPER_ADMIN)
     body: { "action": "run-business" }
```