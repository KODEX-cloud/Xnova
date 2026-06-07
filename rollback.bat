@echo off
echo ===================================================
echo   NOVA MARKETPLACE - SCRIPT DE ROLLBACK RAPIDE
echo ===================================================
echo.
echo Ce script va réinitialiser la branche principale (main)
echo locale et distante au tag de sauvegarde 'nova-nextjs-final-backup'.
echo.
set /p confirm="Êtes-vous sûr de vouloir annuler le déploiement et restaurer l'ancienne version Next.js ? (O/N) : "

if /i "%confirm%" neq "O" (
    echo Opération annulée.
    pause
    exit /b
)

echo.
echo 1. Force checkout de la branche main...
git checkout main
if %errorlevel% neq 0 (
    echo Erreur lors du checkout.
    pause
    exit /b
)

echo 2. Réinitialisation de la branche locale au tag de sauvegarde...
git reset --hard nova-nextjs-final-backup
if %errorlevel% neq 0 (
    echo Erreur lors de la réinitialisation locale.
    pause
    exit /b
)

echo 3. Push forcé sur GitHub (déclenche le webhook de restauration)...
git push origin main --force
if %errorlevel% neq 0 (
    echo Erreur lors du push forcé vers GitHub.
    echo Veuillez vérifier vos droits d'accès ou votre connexion.
    pause
    exit /b
)

echo.
echo ===================================================
echo   ROLLBACK GIT TERMINÉ AVEC SUCCÈS !
echo ===================================================
echo Le site sur Hostinger se mettra à jour dans les 3 secondes.
echo Pour restaurer la base de données, importez 'backup_local_nova_db.sql'
echo via phpMyAdmin sur votre hébergement Hostinger.
echo ===================================================
pause
