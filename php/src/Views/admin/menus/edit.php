<?php
/**
 * NOVA Marketplace — Edit Menu Item
 */
?>
<div style="margin-bottom: 2rem;">
    <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.9rem; color: var(--slate-500); margin-bottom: 0.5rem;">
        <a href="<?= BASE_URL ?>/admin/menus" style="color: var(--slate-500); font-weight: 500;">Gestion Menus</a>
        <span>&rsaquo;</span>
        <span>Éditer</span>
    </div>
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Éditer le lien : <?= htmlspecialchars($menu['label']) ?></h1>
</div>

<div class="admin-card" style="max-width: 600px;">
    <h2 class="admin-card-title">Détails du lien de navigation</h2>
    
    <form action="<?= BASE_URL ?>/admin/menus/update/<?= $menu['id'] ?>" method="POST">
        <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
        
        <div class="form-group">
            <label class="form-label" for="label">Libellé du lien</label>
            <input type="text" id="label" name="label" class="form-control" value="<?= htmlspecialchars($menu['label']) ?>" required>
        </div>
        
        <div class="form-group">
            <label class="form-label" for="href">Adresse URL (Href)</label>
            <input type="text" id="href" name="href" class="form-control" value="<?= htmlspecialchars($menu['href']) ?>" required>
        </div>

        <div class="form-group">
            <label class="form-label" for="order">Ordre d'affichage</label>
            <input type="number" id="order" name="order" class="form-control" value="<?= $menu['order'] ?>">
        </div>

        <div class="form-group">
            <label class="form-label" for="target">Cible (Target)</label>
            <select id="target" name="target" class="form-control">
                <option value="_self" <?= ($menu['target'] === '_self') ? 'selected' : '' ?>>Même fenêtre (_self)</option>
                <option value="_blank" <?= ($menu['target'] === '_blank') ? 'selected' : '' ?>>Nouvel onglet (_blank)</option>
            </select>
        </div>

        <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
            <input type="checkbox" id="is_active" name="is_active" value="1" <?= $menu['is_active'] ? 'checked' : '' ?> style="width: 18px; height: 18px; cursor: pointer;">
            <label for="is_active" style="font-weight: 600; color: var(--slate-700); cursor: pointer;">Lien actif</label>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button type="submit" class="btn-submit">Sauvegarder les modifications</button>
            <a href="<?= BASE_URL ?>/admin/menus" style="background-color: var(--slate-200); color: var(--slate-700); padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; text-decoration: none; text-align: center;">Annuler</a>
        </div>
    </form>
</div>
