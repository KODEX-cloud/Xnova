<?php
/**
 * NOVA Marketplace — Home and CMS Pages Renderer
 */
?>

<?php foreach ($sections as $sectionName): ?>
    
    <!-- ── SECTION HERO ──────────────────────────────────────────────────────── -->
    <?php if ($sectionName === 'hero'): ?>
        <section class="hero" style="background-image: url('<?= htmlspecialchars($settings['page.' . $page['slug'] . '.hero.bg-image'] ?? BASE_URL . '/assets/img/default-hero.jpg') ?>'); background-size: cover; background-position: center;">
            <div class="hero-overlay"></div>
            <div class="container" style="position: relative; z-index: 10;">
                <div class="hero-container">
                    <h1 class="hero-title">
                        <?= htmlspecialchars($settings['page.' . $page['slug'] . '.hero.title'] ?? 'Trouvez le véhicule ou le bien immobilier idéal') ?>
                    </h1>
                    <p class="hero-subtitle">
                        <?= htmlspecialchars($settings['page.' . $page['slug'] . '.hero.subtitle'] ?? 'La marketplace premium de référence en Côte d\'Ivoire.') ?>
                    </p>
                    <div style="display: flex; gap: 1rem;">
                        <a href="<?= BASE_URL ?>/automobile" class="btn-publish" style="text-align: center; padding: 0.85rem 1.75rem;">Voir l'automobile</a>
                        <a href="<?= BASE_URL ?>/immobilier" class="btn-publish" style="background: transparent; border: 2px solid white; color: white; text-align: center; padding: 0.85rem 1.75rem; box-shadow: none;">Voir l'immobilier</a>
                    </div>
                </div>
            </div>
        </section>
        
    <!-- ── SECTION STATS ─────────────────────────────────────────────────────── -->
    <?php elseif ($sectionName === 'stats'): ?>
        <section class="section" style="background-color: var(--slate-100);">
            <div class="container">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
                    <div>
                        <span style="font-size: 3rem; font-weight: 800; color: var(--nova-red); display: block; line-height: 1;">+15k</span>
                        <span style="font-size: 0.9rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase; margin-top: 0.5rem; display: block;">Visiteurs mensuels</span>
                    </div>
                    <div>
                        <span style="font-size: 3rem; font-weight: 800; color: var(--nova-orange); display: block; line-height: 1;">98%</span>
                        <span style="font-size: 0.9rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase; margin-top: 0.5rem; display: block;">Clients satisfaits</span>
                    </div>
                    <div>
                        <span style="font-size: 3rem; font-weight: 800; color: var(--nova-yellow); display: block; line-height: 1;">24h</span>
                        <span style="font-size: 0.9rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase; margin-top: 0.5rem; display: block;">Support réactif</span>
                    </div>
                </div>
            </div>
        </section>

    <!-- ── SECTION CTA ───────────────────────────────────────────────────────── -->
    <?php elseif ($sectionName === 'cta'): ?>
        <section class="section" style="background: linear-gradient(135deg, var(--slate-900) 0%, var(--slate-800) 100%); color: white; text-align: center;">
            <div class="container" style="max-width: 720px;">
                <h2 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em;">
                    <?= htmlspecialchars($settings['page.' . $page['slug'] . '.cta.title'] ?? 'Vous avez un bien à vendre ou à louer ?') ?>
                </h2>
                <p style="color: var(--slate-300); margin-bottom: 2.5rem; font-size: 1.1rem;">
                    <?= htmlspecialchars($settings['page.' . $page['slug'] . '.cta.subtitle'] ?? 'Publiez votre annonce en quelques minutes et touchez des milliers d\'acheteurs.') ?>
                </p>
                <a href="<?= BASE_URL ?>/admin/pages" class="btn-publish" style="padding: 1rem 2rem; font-size: 1.1rem; box-shadow: var(--shadow-md);">
                    <?= htmlspecialchars($settings['page.' . $page['slug'] . '.cta.btn-text'] ?? 'Publier maintenant') ?>
                </a>
            </div>
        </section>

    <?php endif; ?>

<?php endforeach; ?>
