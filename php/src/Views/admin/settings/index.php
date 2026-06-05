<?php
/**
 * NOVA Marketplace — Admin Settings Configuration View
 */
?>
<div style="margin-bottom: 2rem;">
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Paramètres Globaux</h1>
    <p style="color: var(--slate-500);">Configurez les coordonnées de contact, réseaux sociaux et informations clés du site internet</p>
</div>

<?php if (!empty($success)): ?>
    <div class="alert-success"><?= htmlspecialchars($success) ?></div>
<?php endif; ?>

<?php if (!empty($error)): ?>
    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 1.5rem;">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<form action="<?= BASE_URL ?>/admin/settings/update" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        
        <!-- Left Card: Contact Information -->
        <div class="admin-card">
            <h2 class="admin-card-title">Coordonnées de Contact</h2>
            
            <div class="form-group">
                <label class="form-label" for="whatsapp">Numéro WhatsApp principal (avec indicatif)</label>
                <input type="text" id="whatsapp" name="settings[global.whatsapp-number]" class="form-control" 
                       value="<?= htmlspecialchars($settings['global.whatsapp-number'] ?? '+2250707070707') ?>" required>
                <span style="font-size: 0.75rem; color: var(--slate-400);">Format international recommandé (ex: +2250707070707)</span>
            </div>

            <div class="form-group">
                <label class="form-label" for="email">Adresse E-mail de Contact</label>
                <input type="email" id="email" name="settings[global.contact-email]" class="form-control" 
                       value="<?= htmlspecialchars($settings['global.contact-email'] ?? 'contact@nova.ci') ?>" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="phone">Numéro de Téléphone standard</label>
                <input type="text" id="phone" name="settings[global.contact-phone]" class="form-control" 
                       value="<?= htmlspecialchars($settings['global.contact-phone'] ?? '+225 05 05 05 05 05') ?>">
            </div>

            <div class="form-group">
                <label class="form-label" for="address">Adresse physique</label>
                <input type="text" id="address" name="settings[global.contact-address]" class="form-control" 
                       value="<?= htmlspecialchars($settings['global.contact-address'] ?? 'Cocody Vallons, Abidjan, Côte d\'Ivoire') ?>">
            </div>
        </div>

        <!-- Right Card: General Identity & Socials -->
        <div class="admin-card">
            <h2 class="admin-card-title">Identité du Site & Réseaux</h2>

            <div class="form-group">
                <label class="form-label" for="sitename">Nom du site</label>
                <input type="text" id="sitename" name="settings[global.site-name]" class="form-control" 
                       value="<?= htmlspecialchars($settings['global.site-name'] ?? 'NOVA Marketplace') ?>" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="logo">URL du Logo principal</label>
                <input type="text" id="logo" name="settings[global.site-logo]" class="form-control" 
                       value="<?= htmlspecialchars($settings['global.site-logo'] ?? '') ?>" placeholder="/assets/img/logo.png">
                <span style="font-size: 0.75rem; color: var(--slate-400);">Laissez vide pour utiliser le logo textuel par défaut.</span>
            </div>

            <div class="form-group">
                <label class="form-label" for="fb">Lien Facebook</label>
                <input type="text" id="fb" name="settings[global.social-facebook]" class="form-control" 
                       value="<?= htmlspecialchars($settings['global.social-facebook'] ?? 'https://facebook.com/novamarketplace') ?>">
            </div>

            <div class="form-group">
                <label class="form-label" for="insta">Lien Instagram</label>
                <input type="text" id="insta" name="settings[global.social-instagram]" class="form-control" 
                       value="<?= htmlspecialchars($settings['global.social-instagram'] ?? 'https://instagram.com/novamarketplace') ?>">
            </div>
        </div>

    </div>

    <!-- Submit Section -->
    <div class="admin-card" style="text-align: right; margin-top: 1rem;">
        <button type="submit" class="btn-submit" style="padding: 0.85rem 2.5rem;">Enregistrer tous les paramètres</button>
    </div>
</form>
