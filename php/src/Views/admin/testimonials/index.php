<?php
/**
 * NOVA Marketplace — Admin Testimonials List View
 */
?>
<div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
    <div>
        <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Gestion des Témoignages</h1>
        <p style="color: var(--slate-500);">Gérez les avis des clients affichés sur la page d'accueil</p>
    </div>
    <a href="<?= BASE_URL ?>/admin/testimonials/new" class="btn-submit" style="text-decoration: none;">
        Ajouter un témoignage
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
    <h2 class="admin-card-title">Témoignages clients</h2>
    
    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
        <thead>
            <tr style="border-bottom: 2px solid var(--slate-200); color: var(--slate-500); font-weight: 600;">
                <th style="padding: 1rem 0.75rem;">Client</th>
                <th style="padding: 1rem 0.75rem;">Rôle / Entreprise</th>
                <th style="padding: 1rem 0.75rem;">Note</th>
                <th style="padding: 1rem 0.75rem; width: 40%;">Témoignage</th>
                <th style="padding: 1rem 0.75rem; text-align: center;">Ordre</th>
                <th style="padding: 1rem 0.75rem; text-align: center;">Statut</th>
                <th style="padding: 1rem 0.75rem; text-align: right;">Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($testimonials)): ?>
                <tr>
                    <td colspan="7" style="padding: 2rem 0.75rem; text-align: center; color: var(--slate-400);">Aucun témoignage trouvé.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($testimonials as $test): ?>
                    <tr style="border-bottom: 1px solid var(--slate-150); color: var(--slate-700);">
                        <td style="padding: 1rem 0.75rem; font-weight: 700; color: var(--slate-900); display: flex; align-items: center; gap: 0.75rem;">
                            <?php if (!empty($test['avatar'])): ?>
                                <img src="<?= htmlspecialchars($test['avatar']) ?>" alt="" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;">
                            <?php else: ?>
                                <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--slate-200); display:flex; align-items:center; justify-content:center; font-weight:bold; color:var(--slate-500); font-size:0.8rem;">
                                    <?= strtoupper(substr($test['name'], 0, 2)) ?>
                                </div>
                            <?php endif; ?>
                            <?= htmlspecialchars($test['name']) ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; color: var(--slate-600);">
                            <?= htmlspecialchars($test['role'] ?? '') ?> 
                            <?php if (!empty($test['company'])): ?>
                                <span style="font-size: 0.85rem; color: var(--slate-400);">at <?= htmlspecialchars($test['company']) ?></span>
                            <?php endif; ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; color: var(--nova-yellow); font-weight: bold;">
                            <?= str_repeat('★', $test['rating']) ?><span style="color: var(--slate-300);"><?= str_repeat('★', 5 - $test['rating']) ?></span>
                        </td>
                        <td style="padding: 1rem 0.75rem; font-size: 0.85rem; color: var(--slate-500); max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            <?= htmlspecialchars($test['content']) ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: center; font-weight: 600;">
                            <?= $test['order'] ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: center;">
                            <?php if ($test['is_active']): ?>
                                <span style="background-color: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Actif</span>
                            <?php else: ?>
                                <span style="background-color: var(--slate-200); color: var(--slate-500); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Masqué</span>
                            <?php endif; ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: right; white-space: nowrap;">
                            <a href="<?= BASE_URL ?>/admin/testimonials/edit/<?= $test['id'] ?>" style="color: var(--nova-orange); font-weight: 600; margin-right: 1rem; text-decoration: none;">Éditer</a>
                            <form action="<?= BASE_URL ?>/admin/testimonials/delete/<?= $test['id'] ?>" method="POST" style="display: inline;" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?');">
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
