# PIPELINE.md — NOVA Marketplace
**Deployment Pipeline — Guide d utilisation**

---

## Vue d ensemble

Le NOVA Deployment Pipeline est un script Node.js autonome qui orchestre
toute la chaine de deploiement en une seule commande.

```
npm run deploy        # Production (avec build)
npm run deploy:dev    # Developpement (sans build)
npm run deploy:dry    # Simulation (aucune modification)
```

---

## Pipeline en 10 etapes

| # | Etape | Action |
|---|-------|--------|
| 1 | Pre-flight | Verifie Node, env vars, package.json |
| 2 | Git rollback | Sauvegarde le hash HEAD dans .rollback |
| 3 | Git sync | Pull (prod) ou check (dev) |
| 4 | Prisma migrate | `npx prisma migrate deploy` |
| 5 | Business migrate | `node scripts/business-migrate.js` |
| 6 | Cache clear | Supprime `.next/cache` |
| 7 | TypeScript | `npx tsc --noEmit` |
| 8 | Build | `npm run build` (prod only) |
| 9 | Health check | Ping /api/settings, /api/pages |
| 10 | Report | Genere DEPLOY_REPORT.md + log |

---

## Options

```bash
node scripts/pipeline.js [options]

--mode=dev|prod     Mode (default: dev)
--skip=step1,step2  Ignorer des etapes (git, migrate, build, types, health, business)
--dry-run           Simulation — aucune modification
```

Exemples :
```bash
# Production sans health check
node scripts/pipeline.js --mode=prod --skip=health

# Juste les migrations
node scripts/pipeline.js --skip=git,build,types,health

# Simulation complete
node scripts/pipeline.js --dry-run
```

---

## Rollback automatique

En cas d echec lors du build (etape 8) :
1. Le pipeline detecte l erreur
2. Appelle `rollback()` automatiquement
3. Fait `git reset --hard <hash-avant-deploy>`
4. Arrête le processus avec exit code 1

**Rollback manuel :**
```bash
# Le hash est sauvegarde dans .rollback
cat .rollback
git reset --hard <hash>
```

---

## Webhook Hostinger

Configurer `HOSTINGER_DEPLOY_WEBHOOK` dans `.env.local` :

```env
DEPLOY_WEBHOOK_SECRET=secret_aleatoire_long
HOSTINGER_DEPLOY_WEBHOOK=https://votre-url-webhook-hostinger
```

**Declencher via API :**
```bash
curl -X POST https://nova.ci/api/admin/deploy \
  -H "x-deploy-secret: votre_secret" \
  -H "Content-Type: application/json" \
  -d '{"action": "deploy"}'
```

**Depuis le panel admin :** `/admin/parametres` → bouton "Deployer"

---

## Logs

```
.pipeline.log    # Log complet de tous les runs
DEPLOY_REPORT.md # Rapport du dernier deploiement
.rollback        # Point de rollback (JSON: hash + branch + timestamp)
.migration-state.json  # Etat des business migrations (fallback sans DB)
```

---

## Compatibilite CI/CD

Pour GitHub Actions, creer `.github/workflows/deploy.yml` :

```yaml
name: Deploy NOVA
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: node scripts/pipeline.js --mode=prod --skip=git
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          HOSTINGER_DEPLOY_WEBHOOK: ${{ secrets.HOSTINGER_DEPLOY_WEBHOOK }}
```

---

## Architecture du pipeline

```
scripts/
  pipeline.js           Orchestrateur principal
  business-migrate.js   Moteur migrations donnees

app/api/admin/
  deploy/route.ts       Webhook API (revalidation ISR + Hostinger)
  migrations/route.ts   Liste + historique migrations

prisma/
  migrations/           Migrations SQL (structure)
  business-migrations/  Migrations donnees (contenu)

.pipeline.log           Journal d execution
.rollback               Point de retour arriere
DEPLOY_REPORT.md        Rapport dernier deploiement
.migration-state.json   Etat business migrations (fallback)
```