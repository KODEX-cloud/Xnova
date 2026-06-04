<?php
/**
 * NOVA Marketplace — Admin Dashboard View
 */
?>
<div style="margin-bottom: 2rem;">
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Tableau de bord</h1>
    <p style="color: var(--slate-500);">Vue d'ensemble de l'activité de votre marketplace NOVA</p>
</div>

<!-- Stats Grid -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
    <!-- Card Users -->
    <div style="background: white; border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase;">Utilisateurs</span>
        <span style="font-size: 2.25rem; font-weight: 800; color: var(--slate-900); margin-top: 0.5rem; line-height: 1;"><?= $totalUsers ?></span>
        <span style="font-size: 0.75rem; color: var(--success); font-weight: 600; margin-top: 0.5rem;">Actifs en base</span>
    </div>
    
    <!-- Card Cars -->
    <div style="background: white; border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase;">Véhicules</span>
        <span style="font-size: 2.25rem; font-weight: 800; color: var(--slate-900); margin-top: 0.5rem; line-height: 1;"><?= $totalCars ?></span>
        <span style="font-size: 0.75rem; color: var(--nova-orange); font-weight: 600; margin-top: 0.5rem;">Annonces auto</span>
    </div>

    <!-- Card Properties -->
    <div style="background: white; border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase;">Propriétés</span>
        <span style="font-size: 2.25rem; font-weight: 800; color: var(--slate-900); margin-top: 0.5rem; line-height: 1;"><?= $totalProperties ?></span>
        <span style="font-size: 0.75rem; color: var(--nova-red); font-weight: 600; margin-top: 0.5rem;">Annonces immo</span>
    </div>

    <!-- Card Leads -->
    <div style="background: white; border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase;">Leads Contacts</span>
        <span style="font-size: 2.25rem; font-weight: 800; color: var(--slate-900); margin-top: 0.5rem; line-height: 1;"><?= $totalLeads ?></span>
        <span style="font-size: 0.75rem; color: var(--slate-400); font-weight: 600; margin-top: 0.5rem;">Messages reçus</span>
    </div>
</div>

<!-- Welcome Content -->
<div class="admin-card">
    <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--slate-900); margin-bottom: 0.75rem;">Bienvenue dans le panneau d'administration de NOVA</h2>
    <p style="color: var(--slate-600); margin-bottom: 1.5rem; max-width: 680px;">
        Cet espace vous permet de gérer entièrement le site public NOVA sans aucun contenu codé en dur. Utilisez le menu de gauche pour administrer les pages du CMS, téléverser des images dans votre bibliothèque de médias ou modifier dynamiquement le design global.
    </p>
    <div style="display: flex; gap: 1rem;">
        <a href="<?= BASE_URL ?>/admin/pages" class="btn-submit" style="text-decoration: none; padding: 0.6rem 1.2rem; font-size: 0.9rem;">Gérer les Pages CMS</a>
        <a href="<?= BASE_URL ?>/admin/design" class="btn-submit" style="background-color: var(--slate-700); text-decoration: none; padding: 0.6rem 1.2rem; font-size: 0.9rem;">Modifier le Design</a>
    </div>
</div>
