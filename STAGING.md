# Stratégie et Cahier de Recette de Préproduction — NOVA

Ce document présente l'audit de compatibilité de l'hébergement Vercel et détaille la mise en place d'un environnement de préproduction (staging) identique à la production sur un sous-domaine Hostinger.

---

## 1. Audit de Compatibilité Vercel pour PHP Native

Bien qu'il existe des runtimes communautaires (`vercel-php`) permettant d'exécuter du PHP sur Vercel, cette solution est **fortement déconseillée** pour un CMS relationnel d'entreprise comme NOVA pour les raisons suivantes :

1.  **Système de fichiers éphémère (Stateless)** :
    *   Vercel fonctionne sur une architecture Serverless (AWS Lambda). Le disque dur des fonctions est temporaire et effacé lors du prochain démarrage à froid (Cold Start) ou à chaque déploiement.
    *   *Conséquence* : Toutes les images téléversées par les utilisateurs dans `/public/uploads/` via la Bibliothèque de Médias seraient perdues régulièrement.
2.  **Absence de base de données MySQL locale** :
    *   Vercel ne peut pas héberger de base de données MySQL relationnelle classique. Il faudrait utiliser un serveur MySQL externe (type AWS RDS, Supabase, PlanetScale) ce qui ajouterait de la latence réseau et des coûts de facturation.
3.  **Gestion de la réécriture d'URL (.htaccess)** :
    *   Vercel utilise son propre moteur de routage configuré via un fichier JSON (`vercel.json`) et ne supporte pas nativement les fichiers `.htaccess` d'Apache.
4.  **Temps de réponse (Cold Starts)** :
    *   Le temps de réveil des fonctions serverless PHP peut introduire une latence de 1 à 3 secondes lors des premières requêtes, dégradant l'expérience premium fluide voulue pour NOVA.

### Meilleure alternative de Préproduction : Le Sous-domaine Hostinger
Pour assurer une parité environnementale parfaite, la préproduction doit être hébergée sur un sous-domaine de test sur votre hébergement Hostinger (ex: `staging.nova-ci.com` ou `dev.nova-ci.com`).
*   **Avantages** : Environnement serveur 100% identique (PHP 8.2, Apache, MySQL natif), persistance des médias sur le disque, et coût nul.

---

## 2. Architecture du Workflow Git / GitHub / Staging

Le workflow de déploiement continu utilise deux branches Git distinctes pour séparer le développement, la recette et la production :

```
             [ Branche 'staging' ] ──> Push GitHub ──> Webhook Staging ──> staging.nova-ci.com
           /
Git Local
           \
             [ Branche 'main' ] ──> Push GitHub ──> Webhook Production ──> nova-ci.com (Production)
```

---

## 3. Guide d'Installation de la Préproduction sur Hostinger

### Étape 1 : Création du sous-domaine de Staging
1.  Connectez-vous au hPanel Hostinger &rarr; **Domaines &rarr; Sous-domaines**.
2.  Créez le sous-domaine `staging` (ce qui créera le répertoire `public_html/staging`).

### Étape 2 : Configuration du dépôt Git pour le Staging
1.  Allez dans Hostinger hPanel &rarr; **Avancé &rarr; Git**.
2.  Dans **Créer un nouveau dépôt**, renseignez :
    *   **Repository URL** : `https://github.com/KODEX-cloud/Xnova.git`.
    *   **Branche** : `staging` (Spécifique pour la préproduction).
    *   **Dossier d'installation** : `public_html/staging`.
3.  Cliquez sur **Créer**.

### Étape 3 : Configuration du Webhook de Staging dans GitHub
1.  Sur Hostinger, dans le tableau de vos dépôts Git, repérez le dépôt lié au dossier `staging`.
2.  Cliquez sur **Auto-Déploiement** et copiez l'URL de webhook générée.
3.  Allez sur votre dépôt **GitHub &rarr; Settings &rarr; Webhooks &rarr; Add webhook**.
4.  Collez l'URL Hostinger du staging dans **Payload URL**, configurez en `application/json`, et validez.

Désormais, tout push ou merge sur la branche `staging` déploie le code automatiquement sur `staging.nova-ci.com`.

### Étape 4 : Base de Données et Fichier d'Environnement de Staging
1.  Créez une base de données MySQL distincte dans Hostinger (ex: `u123456789_staging_db`).
2.  Importez les schémas et données initiales (`schema.sql` et `seed.sql`).
3.  Créez le fichier d'environnement de staging `public_html/staging/php/.env` avec les identifiants de la base de staging :
    ```env
    DB_HOST="127.0.0.1"
    DB_PORT="3306"
    DB_NAME="u123456789_staging_db"
    DB_USER="u123456789_staging_user"
    DB_PASS="MotDePasseBaseStaging"
    APP_DEBUG="true"  # Activé en staging pour détecter les éventuels avertissements
    ```

---

## 4. Plan d'Audit & Recette de Préproduction

Une fois la préproduction déployée, effectuez les vérifications suivantes :

### A. Journal d'erreurs PHP (Logs)
Vérifiez qu'aucun warning ou notice n'est généré en consultant le fichier de log de Hostinger (`error_log` accessible via le gestionnaire de fichiers à la racine du sous-domaine).

### B. Validation des permissions (Chmod)
Assurez-vous que le dossier `/php/public/uploads` possède les droits d'écriture corrects (`755` ou `775`) pour permettre le téléversement d'images par le serveur web.

### C. Test de Sécurité SSL
Activez le SSL sur le sous-domaine depuis Hostinger (via **Sécurité &rarr; Certificats SSL &rarr; Installer SSL** pour `staging.nova-ci.com`).
Vérifiez que toutes les requêtes sont redirigées vers `https://` et qu'aucune alerte de contenu mixte (mixed content) n'apparaît dans la console du navigateur.
