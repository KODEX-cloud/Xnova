<?php
/**
 * NOVA Marketplace — Admin Page Editor View
 */
?>
<div style="margin-bottom: 2rem;">
    <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.9rem; color: var(--slate-500); margin-bottom: 0.5rem;">
        <a href="<?= BASE_URL ?>/admin/pages" style="color: var(--slate-500); font-weight: 500;">Pages CMS</a>
        <span>&rsaquo;</span>
        <span>Éditeur</span>
    </div>
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Éditer la page : <?= htmlspecialchars($page['title']) ?></h1>
    <p style="color: var(--slate-500);">Modifiez les sections structurelles et les textes sans toucher au code source.</p>
</div>

<?php if (!empty($success)): ?>
    <div class="alert-success"><?= htmlspecialchars($success) ?></div>
<?php endif; ?>

<?php if (!empty($error)): ?>
    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 1.5rem;">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<form action="<?= BASE_URL ?>/admin/pages/update/<?= $page['id'] ?>" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
        
        <!-- Left Column: Content Builder -->
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            
            <!-- Global Info Card -->
            <div class="admin-card">
                <h2 class="admin-card-title">Paramètres Généraux</h2>
                
                <div class="form-group">
                    <label class="form-label" for="title">Titre de la Page</label>
                    <input type="text" id="title" name="title" class="form-control" value="<?= htmlspecialchars($page['title']) ?>" required>
                </div>
            </div>

            <!-- Page Dynamic Fields -->
            <div class="admin-card">
                <h2 class="admin-card-title">Textes & Contenus Dynamiques (CMS Builder)</h2>
                <p style="color: var(--slate-500); font-size: 0.85rem; margin-top: -1rem; margin-bottom: 1.5rem;">
                    Ces champs de textes surchargent les valeurs statiques du site. Aucun mot n'est codé en dur en production.
                </p>

                <!-- Hero Fields -->
                <div style="border-bottom: 1px solid var(--slate-200); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: var(--slate-800); margin-bottom: 1rem; text-transform:uppercase; font-size:0.8rem; color:var(--nova-orange);">Section Hero</h3>
                    
                    <div class="form-group">
                        <label class="form-label" for="setting_hero_title">Titre principal (Hero Title)</label>
                        <input type="text" id="setting_hero_title" name="settings[hero.title]" class="form-control" 
                               value="<?= htmlspecialchars($pageSettings['hero.title'] ?? '') ?>">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="setting_hero_subtitle">Sous-titre (Hero Subtitle)</label>
                        <textarea id="setting_hero_subtitle" name="settings[hero.subtitle]" class="form-control" rows="3"><?= htmlspecialchars($pageSettings['hero.subtitle'] ?? '') ?></textarea>
                    </div>
                </div>

                <!-- CTA Fields (Conditional for Home page) -->
                <?php if ($page['slug'] === 'home'): ?>
                    <div>
                        <h3 style="font-size: 1rem; font-weight: 700; color: var(--slate-800); margin-bottom: 1rem; text-transform:uppercase; font-size:0.8rem; color:var(--nova-red);">Section Appels à l'action (CTA)</h3>
                        
                        <div class="form-group">
                            <label class="form-label" for="setting_cta_title">Titre CTA</label>
                            <input type="text" id="setting_cta_title" name="settings[cta.title]" class="form-control" 
                                   value="<?= htmlspecialchars($pageSettings['cta.title'] ?? '') ?>">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="setting_cta_subtitle">Sous-titre CTA</label>
                            <textarea id="setting_cta_subtitle" name="settings[cta.subtitle]" class="form-control" rows="3"><?= htmlspecialchars($pageSettings['cta.subtitle'] ?? '') ?></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="setting_cta_btn_text">Texte du Bouton CTA</label>
                            <input type="text" id="setting_cta_btn_text" name="settings[cta.btn-text]" class="form-control" 
                                   value="<?= htmlspecialchars($pageSettings['cta.btn-text'] ?? '') ?>">
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- Right Column: Status & Structure -->
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            
            <!-- Publish Controls -->
            <div class="admin-card">
                <h2 class="admin-card-title">Publication</h2>
                
                <div class="form-group" style="display: flex; align-items: center; gap: 0.75rem;">
                    <input type="checkbox" id="is_published" name="is_published" value="1" <?= $page['is_published'] ? 'checked' : '' ?> style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="is_published" style="font-weight: 600; color: var(--slate-800); cursor: pointer;">Mettre en ligne la page</label>
                </div>
                
                <button type="submit" class="btn-submit" style="width: 100%; text-align: center; margin-top: 1rem;">Sauvegarder les modifications</button>
            </div>

            <!-- Page Sections Layout Structure Builder -->
            <div class="admin-card">
                <h2 class="admin-card-title">Structure de la page</h2>
                <p style="color: var(--slate-500); font-size: 0.8rem; margin-top: -1rem; margin-bottom: 1rem;">
                    Ordonnez les blocs constituant la page. Les blocs sont définis sous forme de tableau JSON.
                </p>

                <div class="form-group">
                    <label class="form-label" for="sections">Blocs (JSON Array)</label>
                    <textarea id="sections" name="sections" class="form-control" rows="6" style="font-family: monospace; font-size: 0.85rem;"><?= htmlspecialchars($page['sections']) ?></textarea>
                </div>
                <span style="font-size: 0.7rem; color: var(--slate-400); display: block; margin-top: -0.5rem;">
                    Exemple: <code style="background-color: var(--slate-100); padding: 0.1rem 0.25rem;">["hero", "stats", "cta"]</code>
                </span>
            </div>
            
        </div>
    </div>
</form>
