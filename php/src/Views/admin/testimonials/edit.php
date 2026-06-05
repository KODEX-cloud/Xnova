<?php
/**
 * NOVA Marketplace — Edit Testimonial View
 */
?>
<div style="margin-bottom: 2rem;">
    <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.9rem; color: var(--slate-500); margin-bottom: 0.5rem;">
        <a href="<?= BASE_URL ?>/admin/testimonials" style="color: var(--slate-500); font-weight: 500;">Témoignages</a>
        <span>&rsaquo;</span>
        <span>Éditer</span>
    </div>
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Éditer le témoignage : <?= htmlspecialchars($testimonial['name']) ?></h1>
</div>

<div class="admin-card" style="max-width: 700px;">
    <h2 class="admin-card-title">Détails du Témoignage client</h2>
    
    <form action="<?= BASE_URL ?>/admin/testimonials/update/<?= $testimonial['id'] ?>" method="POST">
        <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
                <label class="form-label" for="name">Nom du client</label>
                <input type="text" id="name" name="name" class="form-control" value="<?= htmlspecialchars($testimonial['name']) ?>" required>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="avatar">Lien de l'avatar (Image URL)</label>
                <input type="text" id="avatar" name="avatar" class="form-control" value="<?= htmlspecialchars($testimonial['avatar'] ?? '') ?>" placeholder="/uploads/...">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
                <label class="form-label" for="role">Rôle / Profession</label>
                <input type="text" id="role" name="role" class="form-control" value="<?= htmlspecialchars($testimonial['role'] ?? '') ?>">
            </div>
            
            <div class="form-group">
                <label class="form-label" for="company">Entreprise</label>
                <input type="text" id="company" name="company" class="form-control" value="<?= htmlspecialchars($testimonial['company'] ?? '') ?>">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
                <label class="form-label" for="rating">Note (Étoiles)</label>
                <select id="rating" name="rating" class="form-control">
                    <option value="5" <?= ($testimonial['rating'] == 5) ? 'selected' : '' ?>>5 Étoiles</option>
                    <option value="4" <?= ($testimonial['rating'] == 4) ? 'selected' : '' ?>>4 Étoiles</option>
                    <option value="3" <?= ($testimonial['rating'] == 3) ? 'selected' : '' ?>>3 Étoiles</option>
                    <option value="2" <?= ($testimonial['rating'] == 2) ? 'selected' : '' ?>>2 Étoiles</option>
                    <option value="1" <?= ($testimonial['rating'] == 1) ? 'selected' : '' ?>>1 Étoile</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label" for="order">Ordre d'affichage</label>
                <input type="number" id="order" name="order" class="form-control" value="<?= $testimonial['order'] ?>">
            </div>
        </div>

        <div class="form-group">
            <label class="form-label" for="content">Témoignage (Texte complet)</label>
            <textarea id="content" name="content" class="form-control" rows="5" required><?= htmlspecialchars($testimonial['content']) ?></textarea>
        </div>

        <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
            <input type="checkbox" id="is_active" name="is_active" value="1" <?= $testimonial['is_active'] ? 'checked' : '' ?> style="width: 18px; height: 18px; cursor: pointer;">
            <label for="is_active" style="font-weight: 600; color: var(--slate-700); cursor: pointer;">Témoignage visible</label>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button type="submit" class="btn-submit">Sauvegarder les modifications</button>
            <a href="<?= BASE_URL ?>/admin/testimonials" style="background-color: var(--slate-200); color: var(--slate-700); padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; text-decoration: none; text-align: center;">Annuler</a>
        </div>
    </form>
</div>
