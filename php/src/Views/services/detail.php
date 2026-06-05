<?php
/**
 * NOVA Marketplace — Public Service Details View
 */
?>

<?php foreach ($sections as $sectionName): ?>

    <!-- ── SECTION HERO ──────────────────────────────────────────────────────── -->
    <?php if ($sectionName === 'hero'): ?>
        <section class="hero" style="background-image: url('<?= htmlspecialchars($settings['page.services/' . $service['id'] . '.hero.bg-image'] ?? BASE_URL . $service['image']) ?>'); background-size: cover; background-position: center; margin-bottom: 2rem;">
            <div class="hero-overlay"></div>
            <div class="container" style="position: relative; z-index: 10;">
                <div class="hero-container">
                    <span style="background-color: var(--nova-red); color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; display: inline-block; margin-bottom: 1rem;">
                        Service <?= htmlspecialchars(str_replace('-', ' ', $service['category'])) ?>
                    </span>
                    <h1 class="hero-title">
                        <?= htmlspecialchars($settings['page.services/' . $service['id'] . '.hero.title'] ?? $service['title']) ?>
                    </h1>
                    <p class="hero-subtitle">
                        <?= htmlspecialchars($settings['page.services/' . $service['id'] . '.hero.subtitle'] ?? $service['subtitle']) ?>
                    </p>
                </div>
            </div>
        </section>

    <!-- ── SECTION SERVICE DETAIL ────────────────────────────────────────────── -->
    <?php elseif ($sectionName === 'service-detail'): ?>
        <section class="section" style="padding-top: 1rem;">
            <div class="container" style="max-width: 800px;">
                <div style="background-color: white; border-radius: var(--radius-lg); border: 1px solid var(--slate-200); padding: 3rem; box-shadow: var(--shadow-md); margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--slate-900); margin-bottom: 1rem;">Description du service</h2>
                    <div style="line-height: 1.7; color: var(--slate-700); font-size: 1.05rem; margin-bottom: 2.5rem; white-space: pre-wrap;">
                        <?= htmlspecialchars($settings['page.services/' . $service['id'] . '.description'] ?? $service['description']) ?>
                    </div>

                    <!-- Call To Action -->
                    <div style="border-top: 1px solid var(--slate-200); padding-top: 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.25rem;">
                        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--slate-900); margin: 0;">Ce service vous intéresse ?</h3>
                        <p style="color: var(--slate-500); margin: 0; max-width: 500px;">Contactez nos experts directement via WhatsApp ou par email pour obtenir un devis gratuit ou planifier un rendez-vous.</p>
                        
                        <div style="display: flex; gap: 1rem; width: 100%; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">
                            <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $settings['global.whatsapp-number'] ?? '2250707070707') ?>?text=Bonjour,%20je%20suis%20intéressé%20par%20le%20service%20<?= urlencode($service['title']) ?>" 
                               target="_blank" rel="noopener noreferrer" 
                               style="background-color: #25D366; color: white; padding: 0.85rem 2rem; border-radius: var(--radius-md); font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; font-size: 1rem;">
                                Contacter sur WhatsApp
                            </a>
                            <a href="mailto:<?= htmlspecialchars($settings['global.contact-email'] ?? 'contact@nova.ci') ?>?subject=Demande de service : <?= htmlspecialchars($service['title']) ?>" 
                               style="background-color: var(--slate-900); color: white; padding: 0.85rem 2rem; border-radius: var(--radius-md); font-weight: 700; text-decoration: none; font-size: 1rem;">
                                Nous envoyer un Email
                            </a>
                        </div>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="<?= BASE_URL ?>/services" style="color: var(--slate-500); font-weight: 600; text-decoration: none; font-size: 0.95rem;">
                        &larr; Retour à tous les services
                    </a>
                </div>
            </div>
        </section>

    <?php endif; ?>

<?php endforeach; ?>
