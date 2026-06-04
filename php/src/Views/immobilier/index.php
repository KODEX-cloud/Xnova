<?php
/**
 * NOVA Marketplace — Public Property Listing View
 */
?>
<section class="section">
    <div class="container">
        
        <div class="section-header" style="text-align: left; margin-bottom: 2rem;">
            <span style="background-color: rgba(255, 0, 85, 0.1); color: var(--nova-red); padding: 0.35rem 0.75rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Immobilier</span>
            <h1 class="section-title" style="margin-top: 0.5rem;">Annonces Immobilier à Abidjan</h1>
            <p class="section-subtitle">Vente et location de villas, appartements, duplex et terrains vérifiés.</p>
        </div>

        <div style="display: grid; grid-template-columns: 280px 1fr; gap: 2rem; align-items: start;">
            
            <!-- Filters Sidebar -->
            <aside style="background-color: white; padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm);">
                <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--slate-900);">Filtrer les annonces</h2>
                
                <form action="<?= BASE_URL ?>/immobilier" method="GET" style="display: flex; flex-direction: column; gap: 1.25rem;">
                    
                    <div>
                        <label style="display:block; font-size:0.8rem; font-weight:600; color:var(--slate-500); margin-bottom:0.4rem;">Recherche</label>
                        <input type="text" name="search" value="<?= htmlspecialchars($filters['search'] ?? '') ?>" placeholder="ex: Villa, Angré..." style="width:100%; padding:0.6rem 0.8rem; border:1px solid var(--slate-300); border-radius:var(--radius-sm); font-size:0.9rem;">
                    </div>

                    <div>
                        <label style="display:block; font-size:0.8rem; font-weight:600; color:var(--slate-500); margin-bottom:0.4rem;">Type de Bien</label>
                        <select name="type" style="width:100%; padding:0.6rem 0.8rem; border:1px solid var(--slate-300); border-radius:var(--radius-sm); font-size:0.9rem; background-color:white;">
                            <option value="">Tous les biens</option>
                            <option value="VILLA" <?= ($filters['type'] ?? '') === 'VILLA' ? 'selected' : '' ?>>Villa</option>
                            <option value="APPARTEMENT" <?= ($filters['type'] ?? '') === 'APPARTEMENT' ? 'selected' : '' ?>>Appartement</option>
                            <option value="DUPLEX" <?= ($filters['type'] ?? '') === 'DUPLEX' ? 'selected' : '' ?>>Duplex</option>
                            <option value="TERRAIN" <?= ($filters['type'] ?? '') === 'TERRAIN' ? 'selected' : '' ?>>Terrain</option>
                            <option value="STUDIO" <?= ($filters['type'] ?? '') === 'STUDIO' ? 'selected' : '' ?>>Studio</option>
                        </select>
                    </div>

                    <div>
                        <label style="display:block; font-size:0.8rem; font-weight:600; color:var(--slate-500); margin-bottom:0.4rem;">Prix Max (FCFA)</label>
                        <input type="number" name="price_max" value="<?= htmlspecialchars($filters['price_max'] ?? '') ?>" placeholder="Budget maximum" style="width:100%; padding:0.6rem 0.8rem; border:1px solid var(--slate-300); border-radius:var(--radius-sm); font-size:0.9rem;">
                    </div>

                    <div>
                        <label style="display:block; font-size:0.8rem; font-weight:600; color:var(--slate-500); margin-bottom:0.4rem;">Pièces / Chambres</label>
                        <select name="bedrooms" style="width:100%; padding:0.6rem 0.8rem; border:1px solid var(--slate-300); border-radius:var(--radius-sm); font-size:0.9rem; background-color:white;">
                            <option value="">Peu importe</option>
                            <option value="1" <?= ($filters['bedrooms'] ?? '') === '1' ? 'selected' : '' ?>>1 chambre</option>
                            <option value="2" <?= ($filters['bedrooms'] ?? '') === '2' ? 'selected' : '' ?>>2 chambres</option>
                            <option value="3" <?= ($filters['bedrooms'] ?? '') === '3' ? 'selected' : '' ?>>3 chambres</option>
                            <option value="4" <?= ($filters['bedrooms'] ?? '') === '4' ? 'selected' : '' ?>>4 chambres +</option>
                        </select>
                    </div>

                    <div>
                        <label style="display:block; font-size:0.8rem; font-weight:600; color:var(--slate-500); margin-bottom:0.4rem;">Ville / Commune</label>
                        <select name="city" style="width:100%; padding:0.6rem 0.8rem; border:1px solid var(--slate-300); border-radius:var(--radius-sm); font-size:0.9rem; background-color:white;">
                            <option value="">Toutes</option>
                            <option value="Abidjan" <?= ($filters['city'] ?? '') === 'Abidjan' ? 'selected' : '' ?>>Abidjan</option>
                            <option value="Assinie" <?= ($filters['city'] ?? '') === 'Assinie' ? 'selected' : '' ?>>Assinie</option>
                            <option value="Yamoussoukro" <?= ($filters['city'] ?? '') === 'Yamoussoukro' ? 'selected' : '' ?>>Yamoussoukro</option>
                        </select>
                    </div>

                    <button type="submit" class="btn-publish" style="width:100%; text-align:center; padding:0.75rem;">Appliquer</button>
                    <a href="<?= BASE_URL ?>/immobilier" style="text-align:center; font-size:0.8rem; color:var(--slate-500); font-weight:600;">Réinitialiser</a>
                </form>
            </aside>

            <!-- Listing grid -->
            <div>
                <?php if (empty($properties)): ?>
                    <div style="background-color:white; padding:4rem; border-radius:var(--radius-lg); text-align:center; border:1px solid var(--slate-200);">
                        <p style="color:var(--slate-500); font-weight:600;">Aucune annonce immobilière ne correspond à vos critères.</p>
                    </div>
                <?php else: ?>
                    <div class="card-grid" style="margin-top: 0; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
                        <?php foreach ($properties as $prop): ?>
                            <?php 
                            $propImages = json_decode($prop['images'], true) ?: [];
                            $coverImg = !empty($propImages) ? BASE_URL . $propImages[0] : BASE_URL . '/assets/img/default-property.jpg';
                            ?>
                            <div class="card">
                                <div class="card-img-wrapper">
                                    <img src="<?= $coverImg ?>" alt="<?= htmlspecialchars($prop['title']) ?>" class="card-img">
                                    <?php if ($prop['featured']): ?>
                                        <span class="card-badge" style="background-color: var(--nova-red);">Vedette</span>
                                    <?php endif; ?>
                                </div>
                                <div class="card-content">
                                    <div class="card-price"><?= number_format($prop['price'], 0, ',', ' ') ?> FCFA</div>
                                    <h3 class="card-title">
                                        <a href="<?= BASE_URL ?>/immobilier/<?= htmlspecialchars($prop['slug']) ?>" style="color: var(--slate-900);">
                                            <?= htmlspecialchars($prop['title']) ?>
                                        </a>
                                    </h3>
                                    <div style="font-size:0.85rem; color:var(--slate-500); display:flex; gap:1rem; margin-bottom:1rem;">
                                        <span><?= $prop['surface'] ?> m²</span>
                                        <span>&bull;</span>
                                        <span><?= $prop['bedrooms'] ?> ch.</span>
                                        <span>&bull;</span>
                                        <span><?= htmlspecialchars($prop['type']) ?></span>
                                    </div>
                                    
                                    <div class="card-meta">
                                        <span><?= htmlspecialchars($prop['city']) ?>, <?= htmlspecialchars($prop['location'] ?? '') ?></span>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
            
        </div>
    </div>
</section>
