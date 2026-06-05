<?php
/**
 * NOVA Marketplace — Create Promotion View
 */
?>
<div style="margin-bottom: 2rem;">
    <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.9rem; color: var(--slate-500); margin-bottom: 0.5rem;">
        <a href="<?= BASE_URL ?>/admin/promotions" style="color: var(--slate-500); font-weight: 500;">Promotions</a>
        <span>&rsaquo;</span>
        <span>Nouvelle</span>
    </div>
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Créer une promotion</h1>
</div>

<div class="admin-card">
    <h2 class="admin-card-title">Détails de la promotion / bannière</h2>
    
    <form action="<?= BASE_URL ?>/admin/promotions/create" method="POST">
        <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
        
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
            
            <!-- Left Side Content -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label" for="title">Titre principal de la promotion</label>
                    <input type="text" id="title" name="title" class="form-control" placeholder="ex: Méga Vente de Fin d'Année" required>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label" for="subtitle">Sous-titre</label>
                        <input type="text" id="subtitle" name="subtitle" class="form-control" placeholder="ex: Jusqu'à -30% sur les SUV">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="discount">Libellé Réduction / Offre</label>
                        <input type="text" id="discount" name="discount" class="form-control" placeholder="ex: -30% ou 1 Acheter = 1 Offert">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="description">Description (Optionnel)</label>
                    <textarea id="description" name="description" class="form-control" rows="4" placeholder="Description de l'offre spéciale..."></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label" for="link">Adresse de Redirection (URL du lien)</label>
                        <input type="text" id="link" name="link" class="form-control" placeholder="ex: /automobile?brand=Toyota">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="cta">Texte d'appel à l'action (Bouton CTA)</label>
                        <input type="text" id="cta" name="cta" class="form-control" placeholder="ex: Découvrir les offres">
                    </div>
                </div>
            </div>

            <!-- Right Side Settings -->
            <div style="display: flex; flex-direction: column; gap: 1rem; background-color: var(--slate-50); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--slate-200);">
                <div class="form-group">
                    <label class="form-label" for="image">Image de fond (URL)</label>
                    <input type="text" id="image" name="image" class="form-control" placeholder="/uploads/...">
                </div>

                <div class="form-group">
                    <label class="form-label" for="badge">Badge promotionnel</label>
                    <input type="text" id="badge" name="badge" class="form-control" placeholder="ex: Offre Flash, Exclusif">
                </div>

                <div class="form-group">
                    <label class="form-label" for="expires_at">Date d'expiration (YYYY-MM-DD HH:MM:SS)</label>
                    <input type="text" id="expires_at" name="expires_at" class="form-control" placeholder="ex: 2026-12-31 23:59:59">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <div class="form-group">
                        <label class="form-label" for="gradient">Style dégradé (CSS)</label>
                        <input type="text" id="gradient" name="gradient" class="form-control" placeholder="ex: linear-gradient(...)">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="bg_color">Couleur Fond (Hex)</label>
                        <input type="text" id="bg_color" name="bg_color" class="form-control" placeholder="ex: #FF0055">
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <div class="form-group">
                        <label class="form-label" for="order">Ordre</label>
                        <input type="number" id="order" name="order" class="form-control" value="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="countdown">Compte à rebours</label>
                        <input type="text" id="countdown" name="countdown" class="form-control" placeholder="ex: 2026/12/31">
                    </div>
                </div>

                <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
                    <input type="checkbox" id="is_active" name="is_active" value="1" checked style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="is_active" style="font-weight: 600; color: var(--slate-700); cursor: pointer;">Promotion active</label>
                </div>
            </div>

        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem; border-top: 1px solid var(--slate-200); padding-top: 1.5rem;">
            <button type="submit" class="btn-submit">Créer la promotion</button>
            <a href="<?= BASE_URL ?>/admin/promotions" style="background-color: var(--slate-200); color: var(--slate-700); padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; text-decoration: none; text-align: center;">Annuler</a>
        </div>
    </form>
</div>
