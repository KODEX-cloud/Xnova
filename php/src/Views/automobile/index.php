<?php
/**
 * NOVA Marketplace — Public Car Listing View
 */
?>

<?php foreach ($sections as $sectionName): ?>

    <!-- ── SECTION HERO ──────────────────────────────────────────────────────── -->
    <?php if ($sectionName === 'hero'): ?>
        <section class="hero" style="background-image: url('<?= htmlspecialchars($settings['page.automobile.hero.bg-image'] ?? BASE_URL . '/assets/img/default-hero.jpg') ?>'); background-size: cover; background-position: center; margin-bottom: 2rem;">
            <div class="hero-overlay"></div>
            <div class="container" style="position: relative; z-index: 10;">
                <div class="hero-container">
                    <h1 class="hero-title">
                        <?= htmlspecialchars($settings['page.automobile.hero.title'] ?? 'Annuaire et Vente Automobile à Abidjan') ?>
                    </h1>
                    <p class="hero-subtitle">
                        <?= htmlspecialchars($settings['page.automobile.hero.subtitle'] ?? 'Trouvez votre prochain véhicule au meilleur prix parmi nos offres vérifiées.') ?>
                    </p>
                </div>
            </div>
        </section>

    <!-- ── SECTION LISTINGS AUTO ─────────────────────────────────────────────── -->
    <?php elseif ($sectionName === 'listings-auto'): ?>
        <section class="section" style="padding-top: 1rem;">
            <div class="container">
                <div style="display: grid; grid-template-columns: 280px 1fr; gap: 2rem; align-items: start;">
                    
                    <!-- Filters Sidebar -->
                    <aside style="background-color: white; padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm);">
                        <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--slate-900);">Filtrer les annonces</h2>
                        
                        <form action="<?= BASE_URL ?>/automobile" method="GET" style="display: flex; flex-direction: column; gap: 1.25rem;">
                            
                            <div>
                                <label style="display:block; font-size:0.8rem; font-weight:600; color:var(--slate-500); margin-bottom:0.4rem;">Recherche</label>
                                <input type="text" name="search" value="<?= htmlspecialchars($filters['search'] ?? '') ?>" placeholder="ex: Toyota, Prado..." style="width:100%; padding:0.6rem 0.8rem; border:1px solid var(--slate-300); border-radius:var(--radius-sm); font-size:0.9rem;">
                            </div>

                            <div>
                                <label style="display:block; font-size:0.8rem; font-weight:600; color:var(--slate-500); margin-bottom:0.4rem;">Marque</label>
                                <input type="text" name="brand" value="<?= htmlspecialchars($filters['brand'] ?? '') ?>" placeholder="ex: Toyota, Suzuki..." style="width:100%; padding:0.6rem 0.8rem; border:1px solid var(--slate-300); border-radius:var(--radius-sm); font-size:0.9rem;">
                            </div>

                            <div>
                                <label style="display:block; font-size:0.8rem; font-weight:600; color:var(--slate-500); margin-bottom:0.4rem;">Prix Max (FCFA)</label>
                                <input type="number" name="price_max" value="<?= htmlspecialchars($filters['price_max'] ?? '') ?>" placeholder="Budget maximum" style="width:100%; padding:0.6rem 0.8rem; border:1px solid var(--slate-300); border-radius:var(--radius-sm); font-size:0.9rem;">
                            </div>

                            <div>
                                <label style="display:block; font-size:0.8rem; font-weight:600; color:var(--slate-500); margin-bottom:0.4rem;">Carburant</label>
                                <select name="fuel" style="width:100%; padding:0.6rem 0.8rem; border:1px solid var(--slate-300); border-radius:var(--radius-sm); font-size:0.9rem; background-color:white;">
                                    <option value="">Tous les types</option>
                                    <option value="ESSENCE" <?= ($filters['fuel'] ?? '') === 'ESSENCE' ? 'selected' : '' ?>>Essence</option>
                                    <option value="DIESEL" <?= ($filters['fuel'] ?? '') === 'DIESEL' ? 'selected' : '' ?>>Diesel</option>
                                    <option value="HYBRIDE" <?= ($filters['fuel'] ?? '') === 'HYBRIDE' ? 'selected' : '' ?>>Hybride</option>
                                    <option value="ELECTRIQUE" <?= ($filters['fuel'] ?? '') === 'ELECTRIQUE' ? 'selected' : '' ?>>Électrique</option>
                                </select>
                            </div>

                            <div>
                                <label style="display:block; font-size:0.8rem; font-weight:600; color:var(--slate-500); margin-bottom:0.4rem;">Transmission</label>
                                <select name="transmission" style="width:100%; padding:0.6rem 0.8rem; border:1px solid var(--slate-300); border-radius:var(--radius-sm); font-size:0.9rem; background-color:white;">
                                    <option value="">Toutes</option>
                                    <option value="AUTOMATIC" <?= ($filters['transmission'] ?? '') === 'AUTOMATIC' ? 'selected' : '' ?>>Automatique</option>
                                    <option value="MANUAL" <?= ($filters['transmission'] ?? '') === 'MANUAL' ? 'selected' : '' ?>>Manuelle</option>
                                </select>
                            </div>

                            <button type="submit" class="btn-publish" style="width:100%; text-align:center; padding:0.75rem;">Appliquer</button>
                            <a href="<?= BASE_URL ?>/automobile" style="text-align:center; font-size:0.8rem; color:var(--slate-500); font-weight:600; text-decoration:none;">Réinitialiser</a>
                        </form>
                    </aside>

                    <!-- Listing grid -->
                    <div>
                        <?php if (empty($cars)): ?>
                            <div style="background-color:white; padding:4rem; border-radius:var(--radius-lg); text-align:center; border:1px solid var(--slate-200);">
                                <p style="color:var(--slate-500); font-weight:600;">Aucun véhicule ne correspond à vos critères de recherche.</p>
                            </div>
                        <?php else: ?>
                            <div class="card-grid" style="margin-top: 0; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
                                <?php foreach ($cars as $car): ?>
                                    <?php 
                                    $carImages = json_decode($car['images'], true) ?: [];
                                    $coverImg = !empty($carImages) ? BASE_URL . $carImages[0] : BASE_URL . '/assets/img/default-car.jpg';
                                    ?>
                                    <div class="card">
                                        <div class="card-img-wrapper">
                                            <img src="<?= $coverImg ?>" alt="<?= htmlspecialchars($car['title']) ?>" class="card-img">
                                            <?php if ($car['featured']): ?>
                                                <span class="card-badge" style="background-color: var(--nova-orange);">Vedette</span>
                                            <?php endif; ?>
                                        </div>
                                        <div class="card-content">
                                            <div class="card-price"><?= number_format($car['price'], 0, ',', ' ') ?> FCFA</div>
                                            <h3 class="card-title">
                                                <a href="<?= BASE_URL ?>/automobile/<?= htmlspecialchars($car['slug']) ?>" style="color: var(--slate-900);">
                                                    <?= htmlspecialchars($car['title']) ?>
                                                </a>
                                            </h3>
                                            <div style="font-size:0.85rem; color:var(--slate-500); display:flex; gap:1rem; margin-bottom:1rem;">
                                                <span><?= $car['year'] ?></span>
                                                <span>&bull;</span>
                                                <span><?= htmlspecialchars($car['transmission'] === 'AUTOMATIC' ? 'Auto' : 'Manuelle') ?></span>
                                                <span>&bull;</span>
                                                <span><?= htmlspecialchars($car['fuel']) ?></span>
                                            </div>
                                            
                                            <div class="card-meta">
                                                <span><?= htmlspecialchars($car['city']) ?>, <?= htmlspecialchars($car['location'] ?? '') ?></span>
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

    <!-- ── SECTION CTA ───────────────────────────────────────────────────────── -->
    <?php elseif ($sectionName === 'cta'): ?>
        <section class="section" style="background: linear-gradient(135deg, var(--slate-900) 0%, var(--slate-800) 100%); color: white; text-align: center;">
            <div class="container" style="max-width: 720px;">
                <h2 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem;">
                    <?= htmlspecialchars($settings['page.automobile.cta.title'] ?? 'Vous vendez un véhicule ?') ?>
                </h2>
                <p style="color: var(--slate-300); margin-bottom: 2rem;">
                    <?= htmlspecialchars($settings['page.automobile.cta.subtitle'] ?? 'Publiez votre annonce gratuitement et touchez des acheteurs qualifiés.') ?>
                </p>
                <a href="<?= BASE_URL ?>/admin/pages" class="btn-publish" style="padding: 1rem 2rem; display:inline-block; text-decoration:none;">
                    <?= htmlspecialchars($settings['page.automobile.cta.btn-text'] ?? 'Vendre mon véhicule') ?>
                </a>
            </div>
        </section>

    <?php endif; ?>

<?php endforeach; ?>
