<?php
/**
 * NOVA Marketplace — Admin Users List View
 */
?>
<div style="margin-bottom: 2rem;">
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Gestion des Utilisateurs</h1>
    <p style="color: var(--slate-500);">Gérez les comptes utilisateurs, les rôles (droits d'administration) et les abonnements</p>
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
    <h2 class="admin-card-title">Utilisateurs enregistrés</h2>
    
    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
        <thead>
            <tr style="border-bottom: 2px solid var(--slate-200); color: var(--slate-500); font-weight: 600;">
                <th style="padding: 1rem 0.75rem;">Utilisateur</th>
                <th style="padding: 1rem 0.75rem;">Rôle</th>
                <th style="padding: 1rem 0.75rem;">Type Profil</th>
                <th style="padding: 1rem 0.75rem;">Abonnement</th>
                <th style="padding: 1rem 0.75rem; text-align: center;">Statut</th>
                <th style="padding: 1rem 0.75rem; text-align: right;">Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($users as $user): ?>
                <tr style="border-bottom: 1px solid var(--slate-150); color: var(--slate-700);">
                    <td style="padding: 1rem 0.75rem;">
                        <div style="font-weight: 700; color: var(--slate-900);"><?= htmlspecialchars($user['name'] ?? 'Non renseigné') ?></div>
                        <div style="font-size: 0.85rem; color: var(--slate-500);"><?= htmlspecialchars($user['email']) ?></div>
                        <?php if (!empty($user['phone'])): ?>
                            <div style="font-size: 0.8rem; color: var(--slate-400);"><?= htmlspecialchars($user['phone']) ?></div>
                        <?php endif; ?>
                    </td>
                    <td style="padding: 1rem 0.75rem;">
                        <span style="background-color: <?= ($user['role'] === 'SUPER_ADMIN' || $user['role'] === 'ADMIN') ? 'rgba(255, 0, 85, 0.1)' : 'var(--slate-150)' ?>; color: <?= ($user['role'] === 'SUPER_ADMIN' || $user['role'] === 'ADMIN') ? 'var(--nova-red)' : 'var(--slate-700)' ?>; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(0,0,0,0.05);">
                            <?= htmlspecialchars($user['role']) ?>
                        </span>
                    </td>
                    <td style="padding: 1rem 0.75rem; font-weight: 600; font-size: 0.85rem;">
                        <?= htmlspecialchars($user['user_type'] ?? 'VENDEUR') ?>
                    </td>
                    <td style="padding: 1rem 0.75rem;">
                        <span style="font-weight: 700; color: <?= ($user['subscription_plan'] !== 'FREE') ? 'var(--nova-orange)' : 'var(--slate-500)' ?>;">
                            <?= htmlspecialchars($user['subscription_plan']) ?>
                        </span>
                    </td>
                    <td style="padding: 1rem 0.75rem; text-align: center;">
                        <?php if ($user['is_active']): ?>
                            <span style="background-color: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Actif</span>
                        <?php else: ?>
                            <span style="background-color: var(--slate-200); color: var(--slate-500); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Désactivé</span>
                        <?php endif; ?>
                    </td>
                    <td style="padding: 1rem 0.75rem; text-align: right; white-space: nowrap;">
                        <a href="<?= BASE_URL ?>/admin/users/edit/<?= $user['id'] ?>" style="color: var(--nova-orange); font-weight: 600; margin-right: 1rem; text-decoration: none;">Modifier</a>
                        
                        <form action="<?= BASE_URL ?>/admin/users/delete/<?= $user['id'] ?>" method="POST" style="display: inline;" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ? Cette action supprimera également toutes ses annonces.');">
                            <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                            <button type="submit" style="background: none; border: none; color: var(--danger); font-weight: 600; cursor: pointer; padding: 0; font-family: inherit; font-size: inherit;">Supprimer</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
