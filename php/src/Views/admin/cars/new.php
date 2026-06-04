<?php
/**
 * NOVA Marketplace — Admin Create Car View
 */
?>
<div style="margin-bottom: 2rem;">
    <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.9rem; color: var(--slate-500); margin-bottom: 0.5rem;">
        <a href="<?= BASE_URL ?>/admin/cars" style="color: var(--slate-500); font-weight: 500;">Automobiles</a>
        <span>&rsaquo;</span>
        <span>Nouveau véhicule</span>
    </div>
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Ajouter un véhicule</h1>
    <p style="color: var(--slate-500);">Créez une nouvelle fiche automobile pour la marketplace NOVA</p>
</div>

<?php if (!empty($error)): ?>
    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 1.5rem;">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<form action="<?= BASE_URL ?>/admin/cars/create" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
        
        <!-- Left: Details Form -->
        <div class="admin-card">
            <h2 class="admin-card-title">Informations Générales</h2>

            <div class="form-group">
                <label class="form-label" for="title">Titre de l'Annonce <span style="color:var(--danger)">*</span></label>
                <input type="text" id="title" name="title" required placeholder="ex: Toyota Land Cruiser Prado 2022" class="form-control">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <label class="form-label" for="brand">Marque</label>
                    <input type="text" id="brand" name="brand" placeholder="ex: Toyota" class="form-control">
                </div>
                <div>
                    <label class="form-label" for="model">Modèle</label>
                    <input type="text" id="model" name="model" placeholder="ex: Prado" class="form-control">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <label class="form-label" for="price">Prix (FCFA) <span style="color:var(--danger)">*</span></label>
                    <input type="number" id="price" name="price" required placeholder="ex: 45000000" class="form-control">
                </div>
                <div>
                    <label class="form-label" for="price_type">Mode de Transaction</label>
                    <select id="price_type" name="price_type" class="form-control">
                        <option value="SALE">Vente</option>
                        <option value="RENT">Location</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <label class="form-label" for="year">Année</label>
                    <input type="number" id="year" name="year" placeholder="ex: 2022" class="form-control">
                </div>
                <div>
                    <label class="form-label" for="mileage">Kilométrage (km)</label>
                    <input type="number" id="mileage" name="mileage" placeholder="ex: 34000" class="form-control">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <label class="form-label" for="fuel">Carburant</label>
                    <select id="fuel" name="fuel" class="form-control">
                        <option value="DIESEL">Diesel</option>
                        <option value="ESSENCE">Essence</option>
                        <option value="HYBRIDE">Hybride</option>
                        <option value="ELECTRIQUE">Électrique</option>
                    </select>
                </div>
                <div>
                    <label class="form-label" for="transmission">Boîte de vitesse</label>
                    <select id="transmission" name="transmission" class="form-control">
                        <option value="AUTOMATIC">Automatique</option>
                        <option value="MANUAL">Manuelle</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <label class="form-label" for="color">Couleur</label>
                    <input type="text" id="color" name="color" placeholder="ex: Noir" class="form-control">
                </div>
                <div>
                    <label class="form-label" for="category">Catégorie</label>
                    <input type="text" id="category" name="category" placeholder="ex: SUV, Berline" class="form-control">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <label class="form-label" for="city">Ville</label>
                    <input type="text" id="city" name="city" placeholder="ex: Abidjan" class="form-control">
                </div>
                <div>
                    <label class="form-label" for="location">Commune / Zone</label>
                    <input type="text" id="location" name="location" placeholder="ex: Cocody" class="form-control">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="description">Description complète</label>
                <textarea id="description" name="description" rows="5" placeholder="Description technique, caractéristiques supplémentaires..." class="form-control" style="resize:vertical;"></textarea>
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
                        <option value="ACTIVE">Actif (En ligne)</option>
                        <option value="PENDING">En attente (Modération)</option>
                        <option value="EXPIRED">Expiré</option>
                        <option value="REJECTED">Rejeté</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" for="plan_type">Plan de Publication</label>
                    <select id="plan_type" name="plan_type" class="form-control">
                        <option value="GRATUIT">Gratuit (Standard)</option>
                        <option value="EN_AVANT">En Avant (Boosté)</option>
                        <option value="PREMIUM">Premium (Visibilité max)</option>
                    </select>
                </div>

                <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
                    <input type="checkbox" id="featured" name="featured" value="1" style="width: 18px; height: 18px; cursor:pointer;">
                    <label for="featured" style="font-weight: 600; color: var(--slate-700); cursor:pointer;">Épingler en vedette</label>
                </div>
            </div>

            <!-- Media / Images Card -->
            <div class="admin-card">
                <h2 class="admin-card-title">Images de l'annonce</h2>
                <p style="color:var(--slate-500); font-size:0.8rem; margin-top:-1rem; margin-bottom:1.5rem;">
                    Copiez l'URL de votre image depuis la Bibliothèque Médias, puis collez-la ci-dessous sous format tableau JSON.
                </p>
                <div class="form-group">
                    <label class="form-label" for="images">Images (JSON Array)</label>
                    <textarea id="images" name="images" class="form-control" rows="4" style="font-family:monospace; font-size:0.85rem;">["/uploads/default-car.jpg"]</textarea>
                </div>
            </div>

            <!-- Action button -->
            <button type="submit" class="btn-submit" style="width:100%; text-align:center; padding:0.85rem;">
                Enregistrer l'annonce
            </button>
        </div>

    </div>
</form>
