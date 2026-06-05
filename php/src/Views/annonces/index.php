<?php
/**
 * NOVA Marketplace — Public Unified Listings View
 */
?>

<?php foreach ($sections as $sectionName): ?>

    <!-- ── SECTION HERO ──────────────────────────────────────────────────────── -->
    <?php if ($sectionName === 'hero'): ?>
        <section class="hero" style="background-image: url('<?= htmlspecialchars($settings['page.annonces.hero.bg-image'] ?? BASE_URL . '/assets/img/default-hero.jpg') ?>'); background-size: cover; background-position: center; margin-bottom: 2rem;">
            <div class="hero-overlay"></div>
            <div class="container" style="position: relative; z-index: 10;">
                <div class="hero-container">
                    <h1 class="hero-title">
                        <?= htmlspecialchars($settings['page.annonces.hero.title'] ?? 'Toutes les Annonces') ?>
                    </h1>
                    <p class="hero-subtitle">
                        <?= htmlspecialchars($settings['page.annonces.hero.subtitle'] ?? 'Parcourez la totalité de notre catalogue d\'automobiles et de biens immobiliers.') ?>
                    </p>
                </div>
            </div>
        </section>

    <!-- ── SECTION LISTINGS UNIFIED ──────────────────────────────────────────── -->
    <?php elseif ($sectionName === 'listings-unified'): ?>
        <section class="section" style="padding-top: 1rem;">
            <div class="container">
                <div class="section-header" style="text-align: left; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <h2 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900); letter-spacing: -0.02em;">Le Catalogue Complet</h2>
                        <p style="color: var(--slate-500); margin-top: 0.25rem;">Les dernières offres immobilières et automobiles mises en ligne à Abidjan.</p>
                    </div>
                </div>

                <?php if (empty($annonces)): ?>
                    <div style="background-color: white; padding: 5rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm);">
                        <p style="color: var(--slate-500); font-weight: 600;">Aucune annonce en ligne pour le moment.</p>
                    </div>
                <?php else: ?>
                    <div class="card-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
                        <?php foreach ($annonces as $item): ?>
                            <?php 
                            $images = json_decode($item['images'], true) ?: [];
                            $isCar = $item['listing_type'] === 'car';
                            $defaultImg = $isCar ? '/assets/img/default-car.jpg' : '/assets/img/default-property.jpg';
                            $coverImg = !empty($images) ? BASE_URL . $images[0] : BASE_URL . $defaultImg;
                            ?>
                            <div class="card" style="position: relative;">
                                <div class="card-img-wrapper" style="padding-top: 60%;">
                                    <img src="<?= $coverImg ?>" alt="<?= htmlspecialchars($item['title']) ?>" class="card-img">
                                    <span class="card-badge" style="background-color: <?= $isCar ? 'var(--nova-orange)' : 'var(--nova-red)' ?>; left: 1rem; right: auto; text-transform: uppercase;">
                                        <?= $isCar ? 'Auto' : 'Immo' ?>
                                    </span>
                                </div>
                                <div class="card-content">
                                    <div class="card-price" style="color: <?= $isCar ? 'var(--nova-orange)' : 'var(--nova-red)' ?>;">
                                        <?= number_format($item['price'], 0, ',', ' ') ?> FCFA
                                    </div>
                                    <h3 class="card-title">
                                        <a href="<?= BASE_URL ?>/<?= $isCar ? 'automobile' : 'immobilier' ?>/<?= htmlspecialchars($item['slug']) ?>" style="color: var(--slate-900);">
                                            <?= htmlspecialchars($item['title']) ?>
                                        </a>
                                    </h3>
                                    
                                    <div style="font-size:0.85rem; color:var(--slate-500); display:flex; gap:0.5rem; margin-bottom:1.5rem; flex-wrap: wrap;">
                                        <?php if ($isCar): ?>
                                            <span><?= $item['year'] ?></span>
                                            <span>&bull;</span>
                                            <span><?= htmlspecialchars($item['transmission'] === 'AUTOMATIC' ? 'Auto' : 'Manuelle') ?></span>
                                            <span>&bull;</span>
                                            <span><?= htmlspecialchars($item['fuel']) ?></span>
                                        <?php else: ?>
                                            <span><?= $item['surface'] ?> m²</span>
                                            <span>&bull;</span>
                                            <span><?= $item['bedrooms'] ?> ch.</span>
                                            <span>&bull;</span>
                                            <span><?= htmlspecialchars($item['type']) ?></span>
                                        <?php endif; ?>
                                    </div>
                                    
                                    <div class="card-meta" style="border-top: 1px solid var(--slate-100); padding-top: 1rem;">
                                        <span><?= htmlspecialchars($item['city']) ?>, <?= htmlspecialchars($item['location'] ?? '') ?></span>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </section>

    <?php endif; ?>

<?php endforeach; ?>
