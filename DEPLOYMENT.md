# Guide de Déploiement et Recette de Production — NOVA (Direct Production)

Ce document détaille la procédure de déploiement en production directe du CMS PHP Native de NOVA sur `nova-ci.com`, la checklist de mise en ligne, et le plan de validation post-déploiement.

---

## 1. Checklist de Mise en Ligne Hostinger

Avant de lancer le déploiement sur `nova-ci.com`, connectez-vous au hPanel Hostinger et validez les prérequis suivants dans **Avancé &rarr; Configuration PHP** :

- [ ] **Version PHP** : Sélectionner **PHP 8.2** (ou PHP 8.3).
- [ ] **Extensions PHP actives** :
  - `pdo_mysql` (liaison de la base de données)
  - `fileinfo` (détection du type MIME réel pour la bibliothèque de médias)
  - `mbstring` (support de l'encodage multi-octets pour UTF-8)
  - `openssl` (sécurisation des échanges)
  - `json` (encodage/décodage des configurations JSON)
- [ ] **Certificat SSL** : S'assurer que le certificat SSL est actif pour `nova-ci.com`.
- [ ] **Permissions de Fichiers (Chmod)** :
  - Le répertoire `/public_html/php/public/uploads` doit avoir les droits d'écriture (**755** ou **775**).
  - Tous les fichiers PHP doivent être lisibles (**644**).
- [ ] **Redirection de Dossier (Document Root)** :
  - Par défaut, Hostinger fait pointer le domaine sur le répertoire `/public_html`. Pour la sécurité du framework PHP MVC, configurez le Document Root de votre domaine `nova-ci.com` sur le sous-dossier `/public_html/php/public`.
  - *Note* : Si vous ne pouvez pas rediriger le Document Root sur le hPanel, placez un fichier `.htaccess` à la racine de `/public_html` pour rediriger les requêtes de manière transparente (voir Section 4).

---

## 2. Configuration d'Infrastructure de Production

| Élément | Paramètre | Détails / Action |
|---|---|---|
| **Domaine de Production** | URL | `https://nova-ci.com` |
| **Dossier d'Installation** | Répertoire Hostinger | `public_html` |
| **Git Hostinger** | URL du dépôt | `https://github.com/KODEX-cloud/Xnova.git` |
| | Branche Git | `main` |
| | Répertoire cible | `public_html` |
| **Base MySQL de Production**| Nom de la base | ex: `u123456789_nova_db` |
| | Utilisateur MySQL | ex: `u123456789_nova_user` |
| | Hôte de la base | `127.0.0.1` (ou `localhost`) |

---

## 3. Fichier `.env` de Production

Créez le fichier `.env` dans le répertoire `public_html/php/.env` de production :

```env
# ── Configuration de la Base de Données de Production
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_NAME="u123456789_nova_db"       # Remplacer par le nom réel de votre BDD de production
DB_USER="u123456789_nova_user"     # Remplacer par l'utilisateur de votre BDD
DB_PASS="VotreMotDePasseProductionSecurise" # Remplacer par le mot de passe réel

# ── Mode d'exécution
APP_DEBUG="false"                 # Doit être à false pour bloquer l'affichage des erreurs aux visiteurs
```

---

## 4. Procédure d'Installation Pas-à-Pas (Hostinger)

### Étape 1 : Création et Importation de la Base de Données
1. Accédez à votre **hPanel Hostinger &rarr; Bases de données MySQL**.
2. Créez la base de données de production et son utilisateur, puis notez les mots de passe.
3. Ouvrez **phpMyAdmin** pour cette base.
4. Cliquez sur **Importer** et sélectionnez les fichiers du projet dans cet ordre :
   1. `php/database/schema.sql` (Structure des 15 tables)
   2. `php/database/seed.sql` (Données initiales et accès d'administration)

### Étape 2 : Déploiement du Code via Git Hostinger
1. S'assurer que le code local nettoyé est bien poussé sur GitHub sur la branche `main`.
2. Dans **hPanel Hostinger &rarr; Avancé &rarr; Git**, configurez :
   * **Repository URL** : `https://github.com/KODEX-cloud/Xnova.git`
   * **Branche** : `main`
   * **Dossier d'installation** : `public_html`
3. Cliquez sur **Créer**.
4. Repérez le dépôt, cliquez sur **Auto-Déploiement**, copiez l'URL du Webhook et collez-la dans les paramètres de votre dépôt GitHub (**Settings &rarr; Webhooks**).
5. Dans le gestionnaire de fichiers Hostinger, naviguez vers `public_html/php/` et créez le fichier `.env` avec les accès de la base de production (Section 3).

### Étape 3 : Gestion de la Redirection (Optionnelle si Document Root non modifiable)
Si vous ne pouvez pas modifier le Document Root de votre domaine sur le hPanel, créez un fichier `.htaccess` à la racine de `/public_html` pour rediriger silencieusement le trafic vers `/php/public/` :
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/php/public/
    RewriteRule ^(.*)$ php/public/$1 [L]
</IfModule>
```

---

## 5. Commandes Git pour la Mise en Ligne

Commandes à exécuter localement pour déployer sur la branche de production `main` :

```bash
# Se placer sur la branche principale
git checkout main

# S'assurer d'être à jour
git pull origin main

# Ajouter et committer
git add .
git commit -m "chore: préparer la mise en ligne finale de production"

# Pousser sur GitHub (déclenche le déploiement sur nova-ci.com via Webhook)
git push origin main
```

---

## 6. Plan d'Audit & Recette Post-Déploiement

Dès que le site est déployé en production sur `nova-ci.com`, effectuez les tests et validations suivants :

### A. Validation des Pages & Routes publiques
Ouvrez les liens ci-dessous et vérifiez que le site se charge en HTTPS sans erreur :
*   `https://nova-ci.com/` (Page d'accueil)
*   `https://nova-ci.com/automobile` (Listing automobile)
*   `https://nova-ci.com/immobilier` (Listing immobilier)
*   `https://nova-ci.com/services` (Page des services)
*   `https://nova-ci.com/blog` (Articles de blog)
*   `https://nova-ci.com/contact` (Formulaire de contact)
*   `https://nova-ci.com/annonces` (Tous les listings)

### B. Validation Administrative (CMS Back-office)
Connectez-vous à l'adresse `https://nova-ci.com/auth/login` (Identifiants : `admin@nova.ci` / `admin123`) :
1.  **Création d'Annonce & Médias** : Créez une annonce témoin et téléversez des photos. Assurez-vous qu'elles apparaissent bien en frontend et que la Bibliothèque de Médias s'affiche en grille.
2.  **Page Builder** : Modifiez les blocs de la page d'accueil (réorganisez ou désactivez une section) et vérifiez le rendu frontend.
3.  **Design Manager** : Changez une couleur de marque en back-office et vérifiez sa mise à jour en direct.
4.  **SEO Manager** : Mettez à jour le titre SEO ou la description d'une page et examinez la source de la page (Ctrl+U) en frontend.

---

## 7. Procédure de Restauration Rapide (Rollback)

En cas de problème bloquant en production (erreur 500, plantage de la base de données, etc.), vous pouvez exécuter le rollback en moins de 10 secondes :

### A. Code PHP
Double-cliquez sur le script local [rollback.bat](file:///c:/Users/PC/AppData/Local/Packages/Claude_pzs8sxrjxfjjc/LocalCache/Roaming/Claude/Nova/rollback.bat) ou exécutez dans votre terminal :
```bash
git checkout main
git reset --hard nova-nextjs-final-backup
git push origin main --force
```
Cela forcera GitHub et Hostinger à recharger l'ancienne version stable Next.js.

### B. Base de Données MySQL
Si la base de données a été altérée :
1. Ouvrez phpMyAdmin sur Hostinger.
2. Sélectionnez toutes les tables et choisissez l'option **Supprimer** (Drop) pour vider la base.
3. Cliquez sur **Importer** et sélectionnez votre fichier de sauvegarde local `backup_local_nova_db.sql`.
