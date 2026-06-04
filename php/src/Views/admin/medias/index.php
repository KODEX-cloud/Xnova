<?php
/**
 * NOVA Marketplace — Media Library View
 */
?>
<div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
    <div>
        <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Bibliothèque Médias</h1>
        <p style="color: var(--slate-500);">Téléversez, organisez et copiez vos images pour les intégrer partout</p>
    </div>
</div>

<?php if (!empty($success)): ?>
    <div class="alert-success"><?= htmlspecialchars($success) ?></div>
<?php endif; ?>

<?php if (!empty($error)): ?>
    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 1.5rem;">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<!-- Upload Section -->
<div class="admin-card" style="margin-bottom: 2.5rem;">
    <h2 class="admin-card-title">Téléverser une nouvelle image</h2>
    <form action="<?= BASE_URL ?>/admin/medias/upload" method="POST" enctype="multipart/form-data" style="display: flex; gap: 1rem; align-items: center;">
        <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
        <input type="file" name="file" required style="border: 1px dashed var(--slate-300); padding: 1rem; border-radius: var(--radius-md); width: 100%; max-width: 400px; background-color: var(--slate-50);">
        <button type="submit" class="btn-submit">Téléverser</button>
    </form>
</div>

<!-- Media Grid -->
<div class="admin-card">
    <h2 class="admin-card-title">Images enregistrées</h2>
    
    <?php if (empty($medias)): ?>
        <p style="color: var(--slate-500); text-align: center; padding: 3rem 0;">Aucune image téléversée pour le moment.</p>
    <?php else: ?>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem;">
            <?php foreach ($medias as $media): ?>
                <div style="border: 1px solid var(--slate-200); border-radius: var(--radius-md); overflow: hidden; background-color: white; display: flex; flex-direction: column; box-shadow: var(--shadow-sm);">
                    <div style="position: relative; padding-top: 60%; background-color: var(--slate-100);">
                        <img src="<?= BASE_URL . $media['url'] ?>" alt="<?= htmlspecialchars($media['alt'] ?? '') ?>" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover;">
                    </div>
                    <div style="padding: 1rem; flex-grow: 1; display: flex; flex-direction: column;">
                        <span style="font-size: 0.8rem; font-weight: 600; color: var(--slate-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px; display: block;" title="<?= htmlspecialchars($media['filename']) ?>">
                            <?= htmlspecialchars($media['filename']) ?>
                        </span>
                        <span style="font-size: 0.7rem; color: var(--slate-400); margin-top: 0.25rem;">
                            <?= number_format(($media['size'] ?? 0) / 1024, 1) ?> Ko
                        </span>
                        
                        <div style="display: flex; gap: 0.5rem; margin-top: auto; padding-top: 1rem;">
                            <button onclick="navigator.clipboard.writeText('<?= $media['url'] ?>'); alert('Lien copié dans le presse-papiers !');" 
                                    style="flex-grow: 1; padding: 0.4rem; background-color: var(--slate-100); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight:600; color: var(--slate-700); cursor: pointer; text-align:center;">
                                Copier URL
                            </button>
                            <form action="<?= BASE_URL ?>/admin/medias/delete/<?= $media['id'] ?>" method="POST" onsubmit="return confirm('Voulez-vous vraiment supprimer définitivement ce média ?');">
                                <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                                <button type="submit" style="padding: 0.4rem 0.6rem; background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600; cursor: pointer;">
                                    Suppr.
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>
