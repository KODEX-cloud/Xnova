<?php
/**
 * NOVA Marketplace — Public Contact View
 */
?>
<section class="section">
    <div class="container" style="max-width: 600px;">
        
        <div class="section-header" style="text-align: center; margin-bottom: 3rem;">
            <span style="background-color: rgba(255, 0, 85, 0.1); color: var(--nova-red); padding: 0.35rem 0.75rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Contactez-nous</span>
            <h1 class="section-title" style="margin-top: 0.5rem;">Une Question ? Un Projet ?</h1>
            <p class="section-subtitle">Notre équipe est à votre disposition pour vous accompagner dans vos démarches d'achat, de vente ou de location à Abidjan.</p>
        </div>

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
