# Guide et Cahier de Recette de Préproduction Hostinger — NOVA

Ce guide de référence décrit la procédure pas-à-pas pour déployer et configurer la version PHP Native CMS de NOVA sur l'environnement de préproduction `staging.nova-ci.com` sur votre hébergement Hostinger.

---

## 1. Checklist Technique Hostinger (Staging)

Avant d'initier le déploiement, connectez-vous au hPanel Hostinger et validez les points suivants dans la section **Avancé &rarr; Configuration PHP** :

- [ ] **Version PHP** : Sélectionner **PHP 8.2** (ou PHP 8.3).
- [ ] **Extensions PHP requises** :
  - `pdo_mysql` (liaison MySQL)
  - `fileinfo` (validation stricte du type MIME des uploads)
  - `mbstring` (gestion des encodages de caractères UTF-8)
  - `openssl` (chiffrement et sécurité)
  - `json` (lecture et écriture des sections CMS au format JSON)
- [ ] **Certificat SSL** : Installer SSL gratuit sur le sous-domaine `staging.nova-ci.com`.
- [ ] **Permissions de Fichiers (Chmod)** :
  - Répertoire `/public_html/staging/php/public/uploads` : Droits d'écriture requis (**755** ou **775**).
  - Autres fichiers PHP : Droits de lecture (**644**).
- [ ] **Redirection Document Root** : Configurer le sous-domaine `staging.nova-ci.com` pour qu'il pointe directement vers le sous-dossier `public_html/staging/php/public` (ceci évite d'avoir à saisir `/php/public/` dans l'URL).

---

## 2. Fiche de Configuration de l'Infrastructure

| Élément | Paramètre | Détails / Action |
|---|---|---|
| **Sous-domaine** | Nom d'hôte | `staging.nova-ci.com` |
| | Dossier cible | `public_html/staging` |
| **Git Hostinger** | URL du dépôt | `https://github.com/KODEX-cloud/Xnova.git` |
| | Branche Git | `staging` |
| | Dossier d'installation | `public_html/staging` |
| **Base MySQL** | Nom de la base | ex: `u123456789_staging_db` |
| | Utilisateur MySQL | ex: `u123456789_staging_user` |
| | Hôte de la base | `127.0.0.1` (ou `localhost`) |
| | Port MySQL | `3306` |

---

## 3. Fichier `.env` de Staging Complet

Créez le fichier `.env` dans le répertoire `public_html/staging/php/.env` via le Gestionnaire de Fichiers d'Hostinger :

```env
# ── Configuration de la Base de Données Staging
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_NAME="u123456789_staging_db"      # Remplacer par votre nom de base réel
DB_USER="u123456789_staging_user"    # Remplacer par votre utilisateur réel
DB_PASS="VotreMotDePasseBaseStaging" # Remplacer par votre mot de passe réel

# ── Mode Débogage
APP_DEBUG="true"  # Activé en préproduction pour loguer les erreurs et warning
```

> [!WARNING]
> N'ajoutez jamais de guillemets autour du mot de passe s'il contient des caractères spéciaux, sauf s'ils sont requis par le chargeur. Le parseur PHP lit les valeurs brutes.

---

## 4. Procédure d'Installation Étape par Étape

### Étape A : Préparation de la Base de Données
1. Accédez à votre **hPanel Hostinger &rarr; Bases de données MySQL**.
2. Créez la base `staging_db` et son utilisateur, puis notez les accès.
3. Cliquez sur **phpMyAdmin** pour ouvrir la base.
4. Cliquez sur **Importer** et sélectionnez les fichiers du projet dans l'ordre :
   1. `php/database/schema.sql` (Structure des tables)
   2. `php/database/seed.sql` (Données initiales d'administration)

### Étape B : Configuration du Sous-domaine et SSL
1. Dans **hPanel Hostinger &rarr; Domaines &rarr; Sous-domaines**, créez le sous-domaine `staging` pointant vers le dossier `public_html/staging`.
2. Allez dans **Sécurité &rarr; Certificats SSL** et installez SSL pour `staging.nova-ci.com`.

### Étape C : Connexion Git sur Hostinger
1. Dans **hPanel Hostinger &rarr; Avancé &rarr; Git**.
2. Saisissez l'URL de votre dépôt GitHub, sélectionnez la branche `staging`, et définissez le dossier d'installation sur `public_html/staging`.
3. Cliquez sur **Créer**.
4. Repérez le dépôt Git créé, cliquez sur **Auto-Déploiement**, et copiez l'URL de Webhook générée.

### Étape D : Liaison du Webhook sur GitHub
1. Ouvrez votre dépôt **GitHub &rarr; Settings &rarr; Webhooks &rarr; Add webhook**.
2. Collez l'URL de Webhook copiée à l'étape précédente dans **Payload URL**.
3. Sélectionnez le format `application/json` et l'événement `push`.
4. Validez en cliquant sur **Add webhook**.

### Étape E : Création du fichier `.env` de Staging
1. Ouvrez le **Gestionnaire de fichiers** d'Hostinger.
2. Naviguez vers le dossier `public_html/staging/php/`.
3. Créez un nouveau fichier nommé `.env`.
4. Collez le contenu de la section 3 (ci-dessus) en insérant vos accès BDD, puis enregistrez.

---

## 5. Commandes Git pour les Mises à Jour

Voici les commandes de base pour maintenir votre staging à jour depuis votre terminal local :

### A. Pousser des modifications sur le Staging
Lorsque vous modifiez du code localement et que vous souhaitez le déployer sur `staging.nova-ci.com` :
```bash
# S'assurer d'être sur la branche de préproduction
git checkout staging

# Ajouter les modifications
git add .

# Enregistrer les modifications
git commit -m "feat/fix: description des changements pour staging"

# Pousser sur GitHub (déclenche le déploiement Hostinger Staging en 3 secondes)
git push origin staging
```

### B. Fusionner le Staging validé vers la Production (main)
Une fois que vos modifications sur `staging.nova-ci.com` sont testées et validées :
```bash
# Basculer sur la branche de production
git checkout main

# Fusionner les modifications de staging
git merge staging

# Pousser sur la branche principale (déclenche le déploiement nova-ci.com)
git push origin main

# Revenir sur la branche de travail staging
git checkout staging
```

---

## 6. Plan de Validation Post-Déploiement

Une fois le déploiement en ligne achevé, effectuez l'audit de validation suivant sur `staging.nova-ci.com` :

### A. Validation des Pages Publiques
Ouvrez les URLs suivantes et assurez-vous de l'absence d'erreurs PHP/MySQL :
*   `https://staging.nova-ci.com/` (Accueil dynamique)
*   `https://staging.nova-ci.com/automobile` (Listing automobile)
*   `https://staging.nova-ci.com/immobilier` (Listing immobilier)
*   `https://staging.nova-ci.com/services` (Services NOVA)
*   `https://staging.nova-ci.com/blog` (Articles de blog)
*   `https://staging.nova-ci.com/contact` (Formulaire de contact)
*   `https://staging.nova-ci.com/annonces` (Tous les listings)

### B. Validation Fonctionnelle & CMS Admin
Connectez-vous à l'administration via `https://staging.nova-ci.com/auth/login` (Admin : `admin@nova.ci` / `admin123`) :
1.  **Création d'Annonces** : Publier une annonce de voiture ou de propriété en téléversant des images.
2.  **Bibliothèque de Médias** : Vérifier que les images s'affichent correctement sous forme de grille, et tester l'upload d'un nouveau fichier.
3.  **Édition de Pages (Page Builder)** : Modifier les sections de la page d'accueil (changer l'ordre, activer/désactiver une section) et vérifier le rendu immédiat en frontend.
4.  **Design Manager** : Modifier une couleur de marque en back-office (ex: `design.nova-red`) et s'assurer que la feuille de style frontend s'adapte instantanément.
5.  **SEO Manager** : Configurer la méta-description d'une page et vérifier sa présence dans le code source HTML.

### C. Vérification Technique
- [ ] **Logs Hostinger** : Consulter le fichier `error_log` à la racine de votre dossier de staging pour vérifier qu'aucun warning PHP n'est émis.
- [ ] **Console JS** : Ouvrir les outils de développement (F12) du navigateur et s'assurer de l'absence de ressources 404 ou d'erreurs d'exécution Javascript.
- [ ] **Permissions d'écriture** : Tenter d'importer une image via le CMS. Si l'upload échoue, corriger les permissions du dossier `php/public/uploads` (Chmod 755 ou 775).
