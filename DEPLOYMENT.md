# Guide de Déploiement Hostinger — NOVA Marketplace (PHP Native)

Ce guide détaille la compatibilité technique, les prérequis, la structure et le workflow d'automatisation professionnelle pour déployer la version PHP Native de **NOVA** sur un hébergement Hostinger.

---

## 1. Prérequis Techniques

### A. Version PHP
*   **Recommandé** : **PHP 8.2** ou **PHP 8.3** (validé et testé en local).
*   **Minimum** : PHP 8.1.

### B. Extensions PHP Requises
Assurez-vous que les extensions suivantes sont cochées dans le menu **Sélecteur de version PHP** de votre hPanel Hostinger :
1.  `pdo` & `pdo_mysql` : Connexion et persistance base de données.
2.  `fileinfo` : Validation stricte des types MIME côté serveur pour la bibliothèque de médias.
3.  `mbstring` : Support du codage des caractères UTF-8.
4.  `openssl` : Chiffrement et connexions sécurisées.
5.  `json` : Encodage et décodage des sections du Page Builder et images stockées.

### C. Taille du Projet
*   **Volume total du code** : **~442 Ko** (hors médias téléversés).
*   Cette légèreté extrême garantit des temps de transfert instantanés et une consommation de ressources minimale.

---

## 2. Variables d'Environnement (.env)

Créez un fichier `.env` à la racine de votre répertoire `/php/` sur Hostinger. Il sera automatiquement lu par le chargeur de configuration :

```env
# ── Configuration de la Base de Données
DB_HOST="127.0.0.1"      # Généralement localhost ou l'IP fournie par Hostinger
DB_PORT="3306"
DB_NAME="u123456789_nova_db" # Votre nom de base MySQL Hostinger
DB_USER="u123456789_root"    # Votre utilisateur MySQL Hostinger
DB_PASS="VotreMotDePasseSecurise"

# ── Mode Débogage
APP_DEBUG="false"        # Mettre à true uniquement pour le développement
```

---

## 3. Base de Données MySQL (Importation)

1.  Connectez-vous à votre **hPanel Hostinger** &rarr; **Bases de données MySQL**.
2.  Créez une nouvelle base de données et notez les identifiants pour votre fichier `.env`.
3.  Ouvrez **phpMyAdmin**.
4.  Sélectionnez votre base de données et cliquez sur l'onglet **Importer**.
5.  Importez en premier le fichier structurel : `php/database/schema.sql`.
6.  Importez ensuite le fichier de données initiales : `php/database/seed.sql`.

---

## 4. Structure des Répertoires Hostinger

Sur Hostinger, le dossier racine public est généralement `public_html`.
Pour une sécurité maximale (empêcher l'accès direct aux fichiers sources `/src`, `/config`, etc.), configurez votre hébergement pour que le sous-dossier public pointe vers `php/public`.

### Structure Cible sur le Serveur :
```
public_html/ (ou racine du site)
├── php/
│   ├── .env                 # Variables d'environnement de production
│   ├── config/              # Fichiers de configuration
│   ├── src/                 # Contrôleurs, Modèles et Vues (Protégés)
│   ├── public/              # Dossier pointé par le serveur web
│   │   ├── index.php        # Front Controller d'entrée unique
│   │   ├── .htaccess        # Réécriture d'URL
│   │   ├── assets/          # Styles CSS, images statiques et JS
│   │   └── uploads/         # Répertoire d'images physiques de la bibliothèque média
```

---

## 5. Workflow de Déploiement Automatisé (Git & Webhook)

Pour éviter d'utiliser des clients FTP manuels lents, configurez un déploiement continu à l'aide de l'outil **Git** de Hostinger.

### Séquence de déploiement professionnel :
```
Développement Local (Git local)
        ↓
   Commit local
        ↓
  Push sur GitHub (main)
        ↓  [Déclencheur Webhook automatique]
Hostinger (git pull automatique)
```

### Étape 1 : Configuration du dépôt Git dans Hostinger
1.  Connectez-vous au hPanel Hostinger &rarr; section **Avancé** &rarr; **Git**.
2.  Dans **Créer un nouveau dépôt**, renseignez :
    *   **Repository URL** : `https://github.com/KODEX-cloud/Xnova.git` (ou votre clé SSH si dépôt privé).
    *   **Branche** : `main`.
    *   **Dossier d'installation** : `public_html` (ou la racine du sous-domaine).
3.  Cliquez sur **Créer**.

### Étape 2 : Configuration du Déploiement Automatique (Webhook)
1.  Une fois le dépôt créé dans Hostinger, repérez la ligne du dépôt dans le tableau.
2.  Cliquez sur **Auto-Déploiement** puis copiez l'**URL du Webhook** générée par Hostinger.
3.  Allez sur votre dépôt **GitHub** &rarr; **Settings** &rarr; **Webhooks**.
4.  Cliquez sur **Add webhook**.
5.  Renseignez :
    *   **Payload URL** : *Collez l'URL copiée de Hostinger*.
    *   **Content type** : `application/json`.
    *   **Which events...** : Just the `push` event.
6.  Cliquez sur **Add webhook**.

Désormais, à chaque `git push origin main` depuis votre terminal de développement, Hostinger récupère automatiquement les fichiers et met le site à jour en moins de 3 secondes !

---

## 6. Procédure de Sauvegarde (Backups)

### A. Sauvegarde des Fichiers
Hostinger génère des sauvegardes quotidiennes ou hebdomadaires de vos fichiers. Vous pouvez également lancer un backup manuel :
1.  hPanel &rarr; **Fichiers** &rarr; **Sauvegardes**.
2.  Sélectionnez **Sauvegardes de fichiers** &rarr; Choisissez la date et lancez le téléchargement ou la restauration.

### B. Sauvegarde SQL via CLI (Cron job automatique)
Pour automatiser la sauvegarde de votre base de données MySQL tous les soirs à minuit, ajoutez un **Cron Job** dans Hostinger :
1.  hPanel &rarr; **Avancé** &rarr; **Tâches Cron**.
2.  Ajoutez la commande suivante (adaptez avec vos identifiants) :
    ```bash
    mysqldump -u u123456789_root -pVotreMotDePasse u123456789_nova_db > /home/u123456789/backups/db_backup_$(date +\%F).sql
    ```
3.  Planifiez à **Une fois par jour** (`0 0 * * *`).
