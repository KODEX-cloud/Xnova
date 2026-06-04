<?php
/**
 * NOVA Marketplace — Admin CMS Pages List View
 */
?>
<div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
    <div>
        <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Gestion des Pages CMS</h1>
        <p style="color: var(--slate-500);">Modifiez la structure et le contenu textuel/visuel de vos pages de manière dynamique</p>
    </div>
</div>

<div class="admin-card">
    <h2 class="admin-card-title">Liste des pages du site</h2>
    
    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
        <thead>
            <tr style="border-bottom: 2px solid var(--slate-200); color: var(--slate-500); font-weight: 600;">
                <th style="padding: 1rem 0.75rem;">Nom de la Page</th>
                <th style="padding: 1rem 0.75rem;">Slug (URL)</th>
                <th style="padding: 1rem 0.75rem;">Statut</th>
                <th style="padding: 1rem 0.75rem; text-align: right;">Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($pages as $page): ?>
                <tr style="border-bottom: 1px solid var(--slate-150); color: var(--slate-700);">
                    <td style="padding: 1rem 0.75rem; font-weight: 600; color: var(--slate-900);">
                        <?= htmlspecialchars($page['title']) ?>
                    </td>
                    <td style="padding: 1rem 0.75rem; font-family: monospace; font-size: 0.85rem; color: var(--slate-500);">
                        /<?= htmlspecialchars($page['slug'] === 'home' ? '' : $page['slug']) ?>
                    </td>
                    <td style="padding: 1rem 0.75rem;">
                        <?php if ($page['is_published']): ?>
                            <span style="background-color: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Publié</span>
                        <?php else: ?>
                            <span style="background-color: var(--slate-200); color: var(--slate-500); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Brouillon</span>
                        <?php endif; ?>
                    </td>
                    <td style="padding: 1rem 0.75rem; text-align: right;">
                        <a href="<?= BASE_URL ?>/admin/pages/edit/<?= $page['id'] ?>" class="btn-submit" style="text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                            Éditer
                        </a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
