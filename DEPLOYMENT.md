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

## 4. Structure Globale du Projet

```
public_html/ (ou racine de votre site internet)
├── php/
│   ├── .env                 # Variables de configuration de production (Exclu de Git)
│   ├── config/
│   │   ├── config.php       # Constantes globales et chargeur automatique de .env
│   │   └── database.php     # Instance Singleton PDO MySQL
│   ├── database/
│   │   ├── schema.sql       # Structure des 15 tables relationnelles
│   │   └── seed.sql         # Données d'initialisation (compte administrateur et fiches)
│   ├── src/
│   │   ├── Core/            # Composants fondamentaux (Router, Middleware, Session, MVC Core)
│   │   ├── Controllers/     # Contrôleurs publics (Automobile, Immobilier, Blog, Services...)
│   │   │   └── Admin/       # Contrôleurs d'administration (PageBuilder, Menus, Testimonials...)
│   │   ├── Models/          # Entités BDD (User, Car, Property, SiteSetting, MenuItem...)
│   │   └── Views/           # Templates et fichiers de rendu HTML
│   └── public/              # Dossier pointé par le serveur web
│       ├── index.php        # Front Controller d'entrée unique
│       ├── .htaccess        # Règles de réécriture d'URL Apache
│       ├── assets/          # Styles CSS, images de base et scripts JS
│       └── uploads/         # Répertoire de stockage physique de la bibliothèque de médias
```

---

## 5. Configuration GitHub & Déploiement Continu

Pour automatiser la mise en ligne, configurez le déploiement continu via Webhook Hostinger.

### Séquence de déploiement automatique :
```
Développement Local (Git local) ──> Push sur GitHub (main) ──> Hostinger (Webhook Auto-pull)
```

1.  **Sur Hostinger (hPanel)** :
    *   Allez dans **Avancé &rarr; Git**.
    *   Entrez l'URL du dépôt : `https://github.com/KODEX-cloud/Xnova.git`.
    *   Branche : `main`.
    *   Dossier de destination : `public_html`.
    *   Cliquez sur **Créer**.
2.  **Activer l'Auto-Déploiement** :
    *   Une fois créé, repérez le dépôt dans Hostinger et cliquez sur **Auto-Déploiement**.
    *   Copiez l'**URL du Webhook** générée par Hostinger.
3.  **Sur GitHub** :
    *   Ouvrez votre dépôt &rarr; **Settings &rarr; Webhooks** &rarr; **Add webhook**.
    *   Collez l'URL dans **Payload URL**.
    *   Sélectionnez le format `application/json` et l'événement `push`.
    *   Enregistrez.

Désormais, tout push sur GitHub déclenche instantanément la mise en production sur Hostinger.

---

## 6. Procédure de Sauvegarde (Backups)

### A. Sauvegarde manuelle des fichiers
1.  Connectez-vous à Hostinger hPanel &rarr; **Fichiers &rarr; Sauvegardes**.
2.  Sélectionnez **Sauvegardes de fichiers** &rarr; Choisir le répertoire `public_html` &rarr; Cliquez sur **Télécharger** ou **Préparer la sauvegarde**.

### B. Sauvegarde SQL automatique via tâche Cron
Ajoutez une **Tâche Cron** sous Hostinger hPanel &rarr; **Avancé &rarr; Tâches Cron** pour exporter les données toutes les nuits à minuit :
```bash
mysqldump -h localhost -u u123456789_root -pVotreMotDePasse u123456789_nova_db > /home/u123456789/backups/db_backup_$(date +\%F).sql
```
Planification : `0 0 * * *` (tous les jours à minuit).

---

## 7. Procédure de Restauration (Recovery)

En cas d'incident, suivez ces étapes pour restaurer une version stable.

### A. Restauration des fichiers
1.  Allez dans **hPanel &rarr; Fichiers &rarr; Sauvegardes &rarr; Sauvegardes de fichiers**.
2.  Sélectionnez la date de la sauvegarde souhaitée dans le menu déroulant.
3.  Cochez le dossier `public_html` et cliquez sur **Restaurer les fichiers** (écrase les fichiers actuels).

### B. Restauration de la base de données (SQL)
1.  Connectez-vous à **phpMyAdmin** sur Hostinger.
2.  Sélectionnez votre base de données et cochez toutes les tables, puis choisissez l'option **Supprimer** (Drop) pour vider la base.
3.  Cliquez sur l'onglet **Importer**.
4.  Choisissez le dernier fichier SQL sauvegardé (ex: `db_backup_2026-06-05.sql`) et cliquez sur **Importer**.

---

## 8. Procédure de Mise à Jour (Updates)

### A. Mises à jour mineures de code
1.  Effectuez vos modifications et testez-les en local.
2.  Exécutez `git commit -am "Description des changements"` puis `git push origin main`.
3.  Le webhook déclenche automatiquement le `git pull` de Hostinger et le site est mis à jour en ligne en moins de 3 secondes.

### B. Modifications de base de données (Migrations)
1.  Si votre modification nécessite une mise à jour de la structure MySQL (nouvelle table ou colonne) :
    *   Exécutez la requête `ALTER TABLE` ou `CREATE TABLE` sur votre BDD locale.
    *   Ajoutez cette requête SQL dans un script ou dans `php/database/schema.sql` pour conserver l'historique dans Git.
    *   Connectez-vous à phpMyAdmin en ligne sur Hostinger et exécutez la même requête SQL dans l'onglet **SQL** pour synchroniser la base de production.
