<?php
/**
 * NOVA Marketplace — Admin Promotions List View
 */
?>
<div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
    <div>
        <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Gestion des Promotions</h1>
        <p style="color: var(--slate-500);">Gérez les bannières, offres spéciales et promotions en cours sur le site public</p>
    </div>
    <a href="<?= BASE_URL ?>/admin/promotions/new" class="btn-submit" style="text-decoration: none;">
        Nouvelle promotion
    </a>
</div>

<?php if (!empty($success)): ?>
    <div class="alert-success"><?= htmlspecialchars($success) ?></div>
<?php endif; ?>

<?php if (!empty($error)): ?>
    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 1.5rem;">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<div class="admin-card">
    <h2 class="admin-card-title">Promotions et bannières actives</h2>
    
    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
        <thead>
            <tr style="border-bottom: 2px solid var(--slate-200); color: var(--slate-500); font-weight: 600;">
                <th style="padding: 1rem 0.75rem;">Visuel</th>
                <th style="padding: 1rem 0.75rem;">Titre / Badge</th>
                <th style="padding: 1rem 0.75rem;">Réduction / Type</th>
                <th style="padding: 1rem 0.75rem;">Lien CTA</th>
                <th style="padding: 1rem 0.75rem; text-align: center;">Ordre</th>
                <th style="padding: 1rem 0.75rem; text-align: center;">Statut</th>
                <th style="padding: 1rem 0.75rem; text-align: right;">Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($promotions)): ?>
                <tr>
                    <td colspan="7" style="padding: 2rem 0.75rem; text-align: center; color: var(--slate-400);">Aucune promotion configurée.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($promotions as $promo): ?>
                    <tr style="border-bottom: 1px solid var(--slate-150); color: var(--slate-700);">
                        <td style="padding: 1rem 0.75rem;">
                            <?php if (!empty($promo['image'])): ?>
                                <img src="<?= htmlspecialchars($promo['image']) ?>" alt="" style="width: 80px; height: 45px; border-radius: 4px; object-fit: cover; border: 1px solid var(--slate-200);">
                            <?php else: ?>
                                <div style="width: 80px; height: 45px; border-radius: 4px; background-color: var(--slate-100); display:flex; align-items:center; justify-content:center; color:var(--slate-400); font-size:0.7rem;">Pas d'image</div>
                            <?php endif; ?>
                        </td>
                        <td style="padding: 1rem 0.75rem;">
                            <div style="font-weight: 700; color: var(--slate-900);"><?= htmlspecialchars($promo['title']) ?></div>
                            <?php if (!empty($promo['badge'])): ?>
                                <span style="background-color: var(--nova-red); color: white; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; display: inline-block; margin-top: 0.25rem;"><?= htmlspecialchars($promo['badge']) ?></span>
                            <?php endif; ?>
                        </td>
                        <td style="padding: 1rem 0.75rem;">
                            <div style="font-weight: 600; color: var(--slate-800);"><?= htmlspecialchars($promo['discount'] ?? 'Standard') ?></div>
                            <span style="font-size: 0.8rem; color: var(--slate-500);"><?= htmlspecialchars($promo['subtitle'] ?? '') ?></span>
                        </td>
                        <td style="padding: 1rem 0.75rem; font-family: monospace; font-size: 0.85rem; color: var(--slate-500);">
                            <a href="<?= BASE_URL . $promo['link'] ?>" target="_blank" style="color: var(--slate-500); text-decoration: none;">
                                <?= htmlspecialchars($promo['cta'] ?? 'Visiter') ?> &rarr;
                            </a>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: center; font-weight: 600;">
                            <?= $promo['order'] ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: center;">
                            <?php if ($promo['is_active']): ?>
                                <span style="background-color: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Active</span>
                            <?php else: ?>
                                <span style="background-color: var(--slate-200); color: var(--slate-500); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Inactive</span>
                            <?php endif; ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: right; white-space: nowrap;">
                            <a href="<?= BASE_URL ?>/admin/promotions/edit/<?= $promo['id'] ?>" style="color: var(--nova-orange); font-weight: 600; margin-right: 1rem; text-decoration: none;">Éditer</a>
                            <form action="<?= BASE_URL ?>/admin/promotions/delete/<?= $promo['id'] ?>" method="POST" style="display: inline;" onsubmit="return confirm('Supprimer définitivement cette offre ?');">
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
