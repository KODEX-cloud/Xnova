<?php
/**
 * NOVA Marketplace — Public Contact View
 */
?>

<?php foreach ($sections as $sectionName): ?>

    <!-- ── SECTION HERO ──────────────────────────────────────────────────────── -->
    <?php if ($sectionName === 'hero'): ?>
        <section class="hero" style="background-image: url('<?= htmlspecialchars($settings['page.contact.hero.bg-image'] ?? BASE_URL . '/assets/img/default-hero.jpg') ?>'); background-size: cover; background-position: center; margin-bottom: 2rem;">
            <div class="hero-overlay"></div>
            <div class="container" style="position: relative; z-index: 10;">
                <div class="hero-container">
                    <h1 class="hero-title">
                        <?= htmlspecialchars($settings['page.contact.hero.title'] ?? 'Contactez-nous') ?>
                    </h1>
                    <p class="hero-subtitle">
                        <?= htmlspecialchars($settings['page.contact.hero.subtitle'] ?? 'Notre équipe est à votre disposition pour vous accompagner à Abidjan.') ?>
                    </p>
                </div>
            </div>
        </section>

    <!-- ── SECTION CONTACT FORM ──────────────────────────────────────────────── -->
    <?php elseif ($sectionName === 'contact-form'): ?>
        <section class="section" style="padding-top: 1rem;">
            <div class="container" style="max-width: 600px;">
                
                <?php if (!empty($success)): ?>
                    <div class="alert-success" style="margin-bottom: 2rem;"><?= htmlspecialchars($success) ?></div>
                <?php endif; ?>

                <?php if (!empty($error)): ?>
                    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 2rem;">
                        <?= htmlspecialchars($error) ?>
                    </div>
                <?php endif; ?>

                <!-- Form Card -->
                <div style="background-color: white; border-radius: var(--radius-lg); border: 1px solid var(--slate-200); padding: 2.5rem; box-shadow: var(--shadow-md);">
                    <form action="<?= BASE_URL ?>/contact" method="POST">
                        <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

                        <div class="form-group">
                            <label class="form-label" for="name">Nom Complet <span style="color: var(--danger);">*</span></label>
                            <input type="text" id="name" name="name" required placeholder="Jean-Marc Koffi" class="form-control">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <div>
                                <label class="form-label" for="email">Adresse Email <span style="color: var(--danger);">*</span></label>
                                <input type="email" id="email" name="email" required placeholder="jean.koffi@email.com" class="form-control">
                            </div>
                            <div>
                                <label class="form-label" for="phone">Téléphone</label>
                                <input type="text" id="phone" name="phone" placeholder="+225 07 07 07 07" class="form-control">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="subject">Sujet de votre message</label>
                            <input type="text" id="subject" name="subject" placeholder="ex: Demande d'information villa Angré" class="form-control">
                        </div>

                        <div class="form-group" style="margin-bottom: 2rem;">
                            <label class="form-label" for="message">Votre Message <span style="color: var(--danger);">*</span></label>
                            <textarea id="message" name="message" required rows="5" placeholder="Écrivez votre message ici..." class="form-control" style="resize: vertical;"></textarea>
                        </div>

                        <button type="submit" class="btn-publish" style="width: 100%; padding: 0.85rem; font-weight: 700; text-align: center; border: none; cursor: pointer;">
                            Envoyer mon message
                        </button>
                    </form>
                </div>

            </div>
        </section>

    <?php endif; ?>

<?php endforeach; ?>
