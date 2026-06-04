<?php
/**
 * NOVA Marketplace — Admin Edit Property View
 */
?>
<div style="margin-bottom: 2rem;">
    <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.9rem; color: var(--slate-500); margin-bottom: 0.5rem;">
        <a href="<?= BASE_URL ?>/admin/properties" style="color: var(--slate-500); font-weight: 500;">Immobilier</a>
        <span>&rsaquo;</span>
        <span>Éditer le bien</span>
    </div>
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Modifier le bien immobilier</h1>
    <p style="color: var(--slate-500);">Modifiez la fiche de l'annonce : <?= htmlspecialchars($property['title']) ?></p>
</div>

<?php if (!empty($error)): ?>
    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 1.5rem;">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<form action="<?= BASE_URL ?>/admin/properties/update/<?= $property['id'] ?>" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
        
        <!-- Left: Details Form -->
        <div class="admin-card">
            <h2 class="admin-card-title">Informations Générales</h2>

            <div class="form-group">
                <label class="form-label" for="title">Titre de l'Annonce <span style="color:var(--danger)">*</span></label>
                <input type="text" id="title" name="title" required value="<?= htmlspecialchars($property['title']) ?>" class="form-control">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <label class="form-label" for="price">Prix (FCFA) <span style="color:var(--danger)">*</span></label>
                    <input type="number" id="price" name="price" required value="<?= htmlspecialchars($property['price']) ?>" class="form-control">
                </div>
                <div>
                    <label class="form-label" for="price_type">Transaction</label>
                    <select id="price_type" name="price_type" class="form-control">
                        <option value="SALE" <?= $property['price_type'] === 'SALE' ? 'selected' : '' ?>>Vente</option>
                        <option value="RENT" <?= $property['price_type'] === 'RENT' ? 'selected' : '' ?>>Location</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <label class="form-label" for="type">Type de Bien <span style="color:var(--danger)">*</span></label>
                    <select id="type" name="type" required class="form-control">
                        <option value="VILLA" <?= $property['type'] === 'VILLA' ? 'selected' : '' ?>>Villa</option>
                        <option value="APPARTEMENT" <?= $property['type'] === 'APPARTEMENT' ? 'selected' : '' ?>>Appartement</option>
                        <option value="DUPLEX" <?= $property['type'] === 'DUPLEX' ? 'selected' : '' ?>>Duplex</option>
                        <option value="STUDIO" <?= $property['type'] === 'STUDIO' ? 'selected' : '' ?>>Studio</option>
                        <option value="TERRAIN" <?= $property['type'] === 'TERRAIN' ? 'selected' : '' ?>>Terrain</option>
                    </select>
                </div>
                <div>
                    <label class="form-label" for="surface">Superficie (m²)</label>
                    <input type="number" id="surface" name="surface" value="<?= htmlspecialchars($property['surface'] ?? '') ?>" class="form-control">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <label class="form-label" for="bedrooms">Nombre de Chambres</label>
                    <input type="number" id="bedrooms" name="bedrooms" value="<?= htmlspecialchars($property['bedrooms'] ?? '') ?>" class="form-control">
                </div>
                <div>
                    <label class="form-label" for="bathrooms">Nombre de Salles de Bain</label>
                    <input type="number" id="bathrooms" name="bathrooms" value="<?= htmlspecialchars($property['bathrooms'] ?? '') ?>" class="form-control">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="land">Superficie du Terrain (m² - Si applicable)</label>
                <input type="number" id="land" name="land" value="<?= htmlspecialchars($property['land'] ?? '') ?>" class="form-control">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <label class="form-label" for="city">Ville</label>
                    <input type="text" id="city" name="city" value="<?= htmlspecialchars($property['city'] ?? '') ?>" class="form-control">
                </div>
                <div>
                    <label class="form-label" for="location">Commune / Zone</label>
                    <input type="text" id="location" name="location" value="<?= htmlspecialchars($property['location'] ?? '') ?>" class="form-control">
                </div>
                <div>
                    <label class="form-label" for="district">Quartier</label>
                    <input type="text" id="district" name="district" value="<?= htmlspecialchars($property['district'] ?? '') ?>" class="form-control">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="description">Description complète</label>
                <textarea id="description" name="description" rows="5" class="form-control" style="resize:vertical;"><?= htmlspecialchars($property['description'] ?? '') ?></textarea>
            </div>
        </div>

        <!-- Right: Status and Images -->
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <!-- Status Card -->
            <div class="admin-card">
                <h2 class="admin-card-title">Statuts & Visibilité</h2>
                
                <div class="form-group">
                    <label class="form-label" for="status">Statut de l'Annonce</label>
                    <select id="status" name="status" class="form-control">
                        <option value="ACTIVE" <?= $property['status'] === 'ACTIVE' ? 'selected' : '' ?>>Actif (En ligne)</option>
                        <option value="PENDING" <?= $property['status'] === 'PENDING' ? 'selected' : '' ?>>En attente (Modération)</option>
                        <option value="EXPIRED" <?= $property['status'] === 'EXPIRED' ? 'selected' : '' ?>>Expiré</option>
                        <option value="REJECTED" <?= $property['status'] === 'REJECTED' ? 'selected' : '' ?>>Rejeté</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" for="plan_type">Plan de Publication</label>
                    <select id="plan_type" name="plan_type" class="form-control">
                        <option value="GRATUIT" <?= $property['plan_type'] === 'GRATUIT' ? 'selected' : '' ?>>Gratuit (Standard)</option>
                        <option value="EN_AVANT" <?= $property['plan_type'] === 'EN_AVANT' ? 'selected' : '' ?>>En Avant (Boosté)</option>
                        <option value="PREMIUM" <?= $property['plan_type'] === 'PREMIUM' ? 'selected' : '' ?>>Premium (Visibilité max)</option>
                    </select>
                </div>

                <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
                    <input type="checkbox" id="featured" name="featured" value="1" <?= $property['featured'] ? 'checked' : '' ?> style="width: 18px; height: 18px; cursor:pointer;">
                    <label for="featured" style="font-weight: 600; color: var(--slate-700); cursor:pointer;">Épingler en vedette</label>
                </div>
            </div>

            <!-- Media / Images Card -->
            <div class="admin-card">
                <h2 class="admin-card-title">Images & Équipements</h2>
                <div class="form-group" style="margin-bottom: 1.5rem;">
                    <label class="form-label" for="images">Images (JSON Array)</label>
                    <textarea id="images" name="images" class="form-control" rows="3" style="font-family:monospace; font-size:0.85rem;"><?= htmlspecialchars($property['images']) ?></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label" for="amenities">Équipements (JSON Array)</label>
                    <textarea id="amenities" name="amenities" class="form-control" rows="3" style="font-family:monospace; font-size:0.85rem;"><?= htmlspecialchars($property['amenities']) ?></textarea>
                </div>
            </div>

            <!-- Action button -->
            <button type="submit" class="btn-submit" style="width:100%; text-align:center; padding:0.85rem;">
                Sauvegarder les modifications
            </button>
        </div>

    </div>
</form>
