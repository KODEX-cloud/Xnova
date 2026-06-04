<?php
/**
 * NOVA Marketplace — Login View
 */
?>
<section class="section">
    <div class="container" style="max-width: 480px;">
        <div style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--slate-200); padding: 2.5rem; box-shadow: var(--shadow-md);">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Connexion Admin</h1>
                <p style="color: var(--slate-500); font-size: 0.9rem; margin-top: 0.25rem;">Accédez à votre panneau d'administration NOVA</p>
            </div>

            <?php if (!empty($error)): ?>
                <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.9rem; margin-bottom: 1.5rem; font-weight: 500;">
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <form action="<?= BASE_URL ?>/auth/login" method="POST">
                <!-- CSRF Protection Jeton -->
                <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

                <div style="margin-bottom: 1.25rem;">
                    <label for="email" style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--slate-700); margin-bottom: 0.5rem;">Adresse Email</label>
                    <input type="email" id="email" name="email" required placeholder="admin@nova.ci" 
                           style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--slate-300); border-radius: var(--radius-md); font-size: 0.95rem; outline: none; transition: var(--transition-base);" 
                           onfocus="this.style.borderColor='var(--nova-red)';" onblur="this.style.borderColor='var(--slate-300)';">
                </div>

                <div style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <label for="password" style="font-size: 0.85rem; font-weight: 600; color: var(--slate-700);">Mot de Passe</label>
                    </div>
                    <input type="password" id="password" name="password" required placeholder="••••••••" 
                           style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--slate-300); border-radius: var(--radius-md); font-size: 0.95rem; outline: none; transition: var(--transition-base);"
                           onfocus="this.style.borderColor='var(--nova-red)';" onblur="this.style.borderColor='var(--slate-300)';">
                </div>

                <button type="submit" 
                        style="width: 100%; background: linear-gradient(135deg, var(--nova-red) 0%, var(--nova-orange) 100%); color: white; padding: 0.85rem; border: none; border-radius: var(--radius-md); font-size: 1rem; font-weight: 700; cursor: pointer; box-shadow: var(--shadow-md); transition: var(--transition-base);"
                        onmouseover="this.style.opacity='0.95'; this.style.transform='translateY(-1px)';" onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)';">
                    Se Connecter
                </button>
            </form>
            
            <div style="text-align: center; margin-top: 1.5rem; font-size: 0.8rem; color: var(--slate-400);">
                Identifiants démo : admin@nova.ci / admin123
            </div>
        </div>
    </div>
</section>
