<?php
/**
 * NOVA Marketplace — Admin Cars List View
 */
?>
<div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
    <div>
        <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Gestion Automobiles</h1>
        <p style="color: var(--slate-500);">Gérez les fiches de véhicules de la marketplace</p>
    </div>
    <a href="<?= BASE_URL ?>/admin/cars/new" class="btn-publish" style="text-decoration: none;">
        + Nouveau Véhicule
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
    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
        <thead>
            <tr style="border-bottom: 2px solid var(--slate-200); color: var(--slate-500); font-weight: 600;">
                <th style="padding: 1rem 0.75rem;">Véhicule</th>
                <th style="padding: 1rem 0.75rem;">Prix</th>
                <th style="padding: 1rem 0.75rem;">Année / km</th>
                <th style="padding: 1rem 0.75rem;">Statut</th>
                <th style="padding: 1rem 0.75rem; text-align: right;">Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($cars)): ?>
                <tr>
                    <td colspan="5" style="text-align: center; padding: 3rem 0; color: var(--slate-400);">Aucune voiture enregistrée.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($cars as $car): ?>
                    <tr style="border-bottom: 1px solid var(--slate-150); color: var(--slate-700);">
                        <td style="padding: 1rem 0.75rem; font-weight: 600; color: var(--slate-900);">
                            <?= htmlspecialchars($car['brand'] ?? '') ?> <?= htmlspecialchars($car['model'] ?? '') ?><br>
                            <span style="font-size: 0.8rem; font-weight: 400; color: var(--slate-500);"><?= htmlspecialchars($car['title']) ?></span>
                        </td>
                        <td style="padding: 1rem 0.75rem; font-weight: 700; color: var(--nova-red);">
                            <?= number_format($car['price'], 0, ',', ' ') ?> FCFA
                        </td>
                        <td style="padding: 1rem 0.75rem; font-size:0.85rem;">
                            <?= $car['year'] ?? '-' ?> &bull; <?= number_format($car['mileage'] ?? 0, 0, ',', ' ') ?> km
                        </td>
                        <td style="padding: 1rem 0.75rem;">
                            <?php if ($car['status'] === 'ACTIVE'): ?>
                                <span style="background-color: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Actif</span>
                            <?php else: ?>
                                <span style="background-color: var(--slate-200); color: var(--slate-500); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;"><?= htmlspecialchars($car['status']) ?></span>
                            <?php endif; ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: right;">
                            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                <a href="<?= BASE_URL ?>/admin/cars/edit/<?= $car['id'] ?>" class="btn-submit" style="text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.8rem; background-color: var(--slate-700);">
                                    Éditer
                                </a>
                                <form action="<?= BASE_URL ?>/admin/cars/delete/<?= $car['id'] ?>" method="POST" onsubmit="return confirm('Voulez-vous vraiment supprimer cette annonce ?');">
                                    <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                                    <button type="submit" style="padding: 0.4rem 0.8rem; background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 600; cursor: pointer;">
                                        Suppr.
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>
