<?php
/**
 * NOVA Marketplace — Edit User Profile & Roles
 */
?>
<div style="margin-bottom: 2rem;">
    <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.9rem; color: var(--slate-500); margin-bottom: 0.5rem;">
        <a href="<?= BASE_URL ?>/admin/users" style="color: var(--slate-500); font-weight: 500;">Utilisateurs</a>
        <span>&rsaquo;</span>
        <span>Éditer</span>
    </div>
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Modifier l'utilisateur : <?= htmlspecialchars($user['name'] ?? $user['email']) ?></h1>
</div>

<div class="admin-card" style="max-width: 650px;">
    <h2 class="admin-card-title">Profil & Permissions</h2>
    
    <form action="<?= BASE_URL ?>/admin/users/update/<?= $user['id'] ?>" method="POST">
        <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
        
        <div style="background-color: var(--slate-50); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--slate-200); margin-bottom: 1.5rem;">
            <p style="margin: 0; color: var(--slate-600); font-size: 0.95rem;">
                <strong>Adresse Email:</strong> <?= htmlspecialchars($user['email']) ?><br>
                <strong>Date de création:</strong> <?= date('d/m/Y H:i', strtotime($user['created_at'])) ?><br>
                <strong>Nom complet:</strong> <?= htmlspecialchars($user['name'] ?? 'Non renseigné') ?>
            </p>
        </div>

        <div class="form-group">
            <label class="form-label" for="role">Rôle d'accès (Permissions)</label>
            <select id="role" name="role" class="form-control">
                <option value="USER" <?= ($user['role'] === 'USER') ? 'selected' : '' ?>>Utilisateur Standard (USER)</option>
                <option value="AGENT_AUTO" <?= ($user['role'] === 'AGENT_AUTO') ? 'selected' : '' ?>>Agent Automobile (AGENT_AUTO)</option>
                <option value="AGENT_IMMO" <?= ($user['role'] === 'AGENT_IMMO') ? 'selected' : '' ?>>Agent Immobilier (AGENT_IMMO)</option>
                <option value="EDITOR" <?= ($user['role'] === 'EDITOR') ? 'selected' : '' ?>>Éditeur de Contenu (EDITOR)</option>
                <option value="ADMIN" <?= ($user['role'] === 'ADMIN') ? 'selected' : '' ?>>Administrateur (ADMIN)</option>
                <option value="SUPER_ADMIN" <?= ($user['role'] === 'SUPER_ADMIN') ? 'selected' : '' ?>>Super Administrateur (SUPER_ADMIN)</option>
            </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
                <label class="form-label" for="user_type">Type de profil</label>
                <select id="user_type" name="user_type" class="form-control">
                    <option value="VENDEUR" <?= ($user['user_type'] === 'VENDEUR') ? 'selected' : '' ?>>Vendeur Particulier</option>
                    <option value="AGENCE" <?= ($user['user_type'] === 'AGENCE') ? 'selected' : '' ?>>Agence Professionnelle</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label" for="subscription_plan">Plan d'abonnement</label>
                <select id="subscription_plan" name="subscription_plan" class="form-control">
                    <option value="FREE" <?= ($user['subscription_plan'] === 'FREE') ? 'selected' : '' ?>>Plan Gratuit (FREE)</option>
                    <option value="PRO" <?= ($user['subscription_plan'] === 'PRO') ? 'selected' : '' ?>>Plan Pro (PRO)</option>
                    <option value="PREMIUM" <?= ($user['subscription_plan'] === 'PREMIUM') ? 'selected' : '' ?>>Plan Premium (PREMIUM)</option>
                </select>
            </div>
        </div>

        <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
            <input type="checkbox" id="is_active" name="is_active" value="1" <?= $user['is_active'] ? 'checked' : '' ?> style="width: 18px; height: 18px; cursor: pointer;">
            <label for="is_active" style="font-weight: 600; color: var(--slate-700); cursor: pointer;">Compte actif et autorisé à se connecter</label>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button type="submit" class="btn-submit">Sauvegarder les modifications</button>
            <a href="<?= BASE_URL ?>/admin/users" style="background-color: var(--slate-200); color: var(--slate-700); padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; text-decoration: none; text-align: center;">Annuler</a>
        </div>
    </form>
</div>
