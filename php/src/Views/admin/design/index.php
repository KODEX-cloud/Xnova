<?php
/**
 * NOVA Marketplace — Admin Design Manager View
 */
?>
<div style="margin-bottom: 2rem;">
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Gestionnaire du Design System</h1>
    <p style="color: var(--slate-500);">Modifiez en temps réel la charte graphique globale de NOVA sans retoucher au CSS</p>
</div>

<?php if (!empty($success)): ?>
    <div class="alert-success"><?= htmlspecialchars($success) ?></div>
<?php endif; ?>

<?php if (!empty($error)): ?>
    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 1.5rem;">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<form action="<?= BASE_URL ?>/admin/design/update" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
        
        <!-- Block Colors -->
        <div class="admin-card">
            <h2 class="admin-card-title" style="color: var(--nova-red);">Palette de Couleurs</h2>
            <p style="color: var(--slate-500); font-size: 0.8rem; margin-top: -1rem; margin-bottom: 1.5rem;">
                Modifiez les couleurs principales du site (boutons, liens, éléments d'accentuation).
            </p>

            <div class="form-group">
                <label class="form-label" for="color_red">Couleur Primaire (Nova Red)</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="color" id="color_red_picker" value="<?= htmlspecialchars($settings['design.nova-red'] ?? '#FF0055') ?>" oninput="document.getElementById('color_red').value = this.value;" style="width: 40px; height: 40px; border: 1px solid var(--slate-300); border-radius: var(--radius-sm); cursor: pointer;">
                    <input type="text" id="color_red" name="design[nova-red]" class="form-control" value="<?= htmlspecialchars($settings['design.nova-red'] ?? '#FF0055') ?>" oninput="document.getElementById('color_red_picker').value = this.value;">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="color_orange">Couleur Secondaire (Nova Orange)</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="color" id="color_orange_picker" value="<?= htmlspecialchars($settings['design.nova-orange'] ?? '#FF5500') ?>" oninput="document.getElementById('color_orange').value = this.value;" style="width: 40px; height: 40px; border: 1px solid var(--slate-300); border-radius: var(--radius-sm); cursor: pointer;">
                    <input type="text" id="color_orange" name="design[nova-orange]" class="form-control" value="<?= htmlspecialchars($settings['design.nova-orange'] ?? '#FF5500') ?>" oninput="document.getElementById('color_orange_picker').value = this.value;">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="color_yellow">Couleur Accent (Nova Yellow)</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="color" id="color_yellow_picker" value="<?= htmlspecialchars($settings['design.nova-yellow'] ?? '#FFAA00') ?>" oninput="document.getElementById('color_yellow').value = this.value;" style="width: 40px; height: 40px; border: 1px solid var(--slate-300); border-radius: var(--radius-sm); cursor: pointer;">
                    <input type="text" id="color_yellow" name="design[nova-yellow]" class="form-control" value="<?= htmlspecialchars($settings['design.nova-yellow'] ?? '#FFAA00') ?>" oninput="document.getElementById('color_yellow_picker').value = this.value;">
                </div>
            </div>
        </div>

        <!-- Block Typography and Border Radius -->
        <div class="admin-card">
            <h2 class="admin-card-title" style="color: var(--nova-orange);">Typographie & Formes</h2>
            <p style="color: var(--slate-500); font-size: 0.8rem; margin-top: -1rem; margin-bottom: 1.5rem;">
                Ajustez les polices de caractères et l'arrondi des boutons/cartes du site.
            </p>

            <div class="form-group">
                <label class="form-label" for="font_family">Famille de Police (Font Family)</label>
                <select id="font_family" name="design[font-family]" class="form-control">
                    <option value="Outfit, Inter, sans-serif" <?= ($settings['design.font-family'] ?? '') === 'Outfit, Inter, sans-serif' ? 'selected' : '' ?>>Outfit & Inter (Par défaut NOVA)</option>
                    <option value="'Inter', sans-serif" <?= ($settings['design.font-family'] ?? '') === "'Inter', sans-serif" ? 'selected' : '' ?>>Inter uniquement</option>
                    <option value="'Roboto', sans-serif" <?= ($settings['design.font-family'] ?? '') === "'Roboto', sans-serif" ? 'selected' : '' ?>>Roboto</option>
                    <option value="system-ui, sans-serif" <?= ($settings['design.font-family'] ?? '') === 'system-ui, sans-serif' ? 'selected' : '' ?>>Polices système standard</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label" for="btn_radius">Arrondi des Angles (Border Radius)</label>
                <input type="text" id="btn_radius" name="design[btn-radius]" class="form-control" value="<?= htmlspecialchars($settings['design.btn-radius'] ?? '8px') ?>">
                <span style="font-size: 0.7rem; color: var(--slate-400);">Exemple: <code style="background-color: var(--slate-100); padding: 0.1rem 0.25rem;">8px</code> ou <code style="background-color: var(--slate-100); padding: 0.1rem 0.25rem;">0.5rem</code></span>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="card_shadow">Ombre des Cartes (Box Shadow)</label>
                <input type="text" id="card_shadow" name="design[card-shadow]" class="form-control" value="<?= htmlspecialchars($settings['design.card-shadow'] ?? '0 4px 6px -1px rgba(0, 0, 0, 0.1)') ?>">
            </div>
        </div>
    </div>

    <div style="margin-top: 1.5rem; text-align: right;">
        <button type="submit" class="btn-submit" style="padding: 0.85rem 2rem;">Enregistrer la charte graphique</button>
    </div>
</form>
