<?php
/**
 * NOVA Marketplace — Public Services Hub View
 */
?>

<?php foreach ($sections as $sectionName): ?>

    <!-- ── SECTION HERO ──────────────────────────────────────────────────────── -->
    <?php if ($sectionName === 'hero'): ?>
        <section class="hero" style="background-image: url('<?= htmlspecialchars($settings['page.services.hero.bg-image'] ?? BASE_URL . '/assets/img/default-hero.jpg') ?>'); background-size: cover; background-position: center; margin-bottom: 2rem;">
            <div class="hero-overlay"></div>
            <div class="container" style="position: relative; z-index: 10;">
                <div class="hero-container">
                    <h1 class="hero-title">
                        <?= htmlspecialchars($settings['page.services.hero.title'] ?? 'Nos Services Experts') ?>
                    </h1>
                    <p class="hero-subtitle">
                        <?= htmlspecialchars($settings['page.services.hero.subtitle'] ?? 'NOVA vous accompagne dans tous vos besoins automobiles et immobiliers à Abidjan.') ?>
                    </p>
                </div>
            </div>
        </section>

    <!-- ── SECTION SERVICES LIST ─────────────────────────────────────────────── -->
    <?php elseif ($sectionName === 'services-list'): ?>
        <section class="section" style="padding-top: 1rem;">
            <div class="container">
                <div class="card-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem;">
                    <?php foreach ($services as $service): ?>
                        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
                            <div>
                                <div class="card-img-wrapper" style="padding-top: 55%; background-color: var(--slate-100); display:flex; align-items:center; justify-content:center;">
                                    <div style="font-size: 3rem; color: var(--slate-300);">⚙️</div>
                                </div>
                                <div class="card-content">
                                    <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: <?= $service['category'] === 'automobile' ? 'var(--nova-orange)' : 'var(--nova-red)' ?>; display:block; margin-bottom:0.5rem;">
                                        <?= htmlspecialchars($service['category']) ?>
                                    </span>
                                    <h3 class="card-title" style="font-size: 1.25rem; margin-bottom: 0.5rem;"><?= htmlspecialchars($service['title']) ?></h3>
                                    <p style="color: var(--slate-500); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem;">
                                        <?= htmlspecialchars($service['description']) ?>
                                    </p>
                                </div>
                            </div>
                            <div style="padding: 0 1.5rem 1.5rem 1.5rem;">
                                <a href="<?= BASE_URL ?>/services/<?= htmlspecialchars($service['id']) ?>" class="btn-publish" style="display:block; text-align:center; padding: 0.75rem; text-decoration:none; background-color: <?= $service['category'] === 'automobile' ? 'var(--nova-orange)' : 'var(--nova-red)' ?>; font-size: 0.9rem;">
                                    En savoir plus
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

    <?php endif; ?>

<?php endforeach; ?>
