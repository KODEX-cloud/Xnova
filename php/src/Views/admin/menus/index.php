<?php
/**
 * NOVA Marketplace — Admin Menu Manager
 */
?>
<div style="margin-bottom: 2rem;">
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Gestion des Menus</h1>
    <p style="color: var(--slate-500);">Gérez les liens de navigation principaux affichés dans le Header et le Footer du site public</p>
</div>

<?php if (!empty($success)): ?>
    <div class="alert-success"><?= htmlspecialchars($success) ?></div>
<?php endif; ?>

<?php if (!empty($error)): ?>
    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 1.5rem;">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
    <!-- Menu List -->
    <div class="admin-card">
        <h2 class="admin-card-title">Liens de navigation existants</h2>
        
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
            <thead>
                <tr style="border-bottom: 2px solid var(--slate-200); color: var(--slate-500); font-weight: 600;">
                    <th style="padding: 1rem 0.75rem;">Libellé</th>
                    <th style="padding: 1rem 0.75rem;">Lien (Href)</th>
                    <th style="padding: 1rem 0.75rem; text-align: center;">Ordre</th>
                    <th style="padding: 1rem 0.75rem; text-align: center;">Cible</th>
                    <th style="padding: 1rem 0.75rem; text-align: center;">Statut</th>
                    <th style="padding: 1rem 0.75rem; text-align: right;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($menus)): ?>
                    <tr>
                        <td colspan="6" style="padding: 2rem 0.75rem; text-align: center; color: var(--slate-400);">Aucun lien de navigation configuré.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($menus as $menu): ?>
                        <tr style="border-bottom: 1px solid var(--slate-150); color: var(--slate-700);">
                            <td style="padding: 1rem 0.75rem; font-weight: 600; color: var(--slate-900);">
                                <?= htmlspecialchars($menu['label']) ?>
                            </td>
                            <td style="padding: 1rem 0.75rem; font-family: monospace; font-size: 0.85rem; color: var(--slate-500);">
                                <?= htmlspecialchars($menu['href']) ?>
                            </td>
                            <td style="padding: 1rem 0.75rem; text-align: center; font-weight: 600;">
                                <?= $menu['order'] ?>
                            </td>
                            <td style="padding: 1rem 0.75rem; text-align: center; font-size: 0.85rem; color: var(--slate-500);">
                                <?= htmlspecialchars($menu['target'] ?? '_self') ?>
                            </td>
                            <td style="padding: 1rem 0.75rem; text-align: center;">
                                <?php if ($menu['is_active']): ?>
                                    <span style="background-color: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Actif</span>
                                <?php else: ?>
                                    <span style="background-color: var(--slate-200); color: var(--slate-500); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Inactif</span>
                                <?php endif; ?>
                            </td>
                            <td style="padding: 1rem 0.75rem; text-align: right; white-space: nowrap;">
                                <a href="<?= BASE_URL ?>/admin/menus/edit/<?= $menu['id'] ?>" style="color: var(--nova-orange); font-weight: 600; margin-right: 1rem; text-decoration: none;">Éditer</a>
                                <form action="<?= BASE_URL ?>/admin/menus/delete/<?= $menu['id'] ?>" method="POST" style="display: inline;" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ce lien ?');">
                                    <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                                    <button type="submit" style="background: none; border: none; color: var(--danger); font-weight: 600; cursor: pointer; padding: 0; font-family: inherit; font-size: inherit;">Supprimer</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Create Menu Form -->
    <div class="admin-card">
        <h2 class="admin-card-title">Ajouter un lien</h2>
        
        <form action="<?= BASE_URL ?>/admin/menus/create" method="POST">
            <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
            
            <div class="form-group">
                <label class="form-label" for="label">Libellé du lien</label>
                <input type="text" id="label" name="label" class="form-control" placeholder="ex: Accueil, Véhicules..." required>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="href">Adresse URL (Href)</label>
                <input type="text" id="href" name="href" class="form-control" placeholder="ex: /, /automobile..." required>
            </div>

            <div class="form-group">
                <label class="form-label" for="order">Ordre d'affichage</label>
                <input type="number" id="order" name="order" class="form-control" value="0">
            </div>

            <div class="form-group">
                <label class="form-label" for="target">Cible (Target)</label>
                <select id="target" name="target" class="form-control">
                    <option value="_self">Même fenêtre (_self)</option>
                    <option value="_blank">Nouvel onglet (_blank)</option>
                </select>
            </div>

            <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
                <input type="checkbox" id="is_active" name="is_active" value="1" checked style="width: 18px; height: 18px; cursor: pointer;">
                <label for="is_active" style="font-weight: 600; color: var(--slate-700); cursor: pointer;">Lien actif</label>
            </div>

            <button type="submit" class="btn-submit" style="width: 100%; margin-top: 1rem;">Ajouter au menu</button>
        </form>
    </div>
</div>
