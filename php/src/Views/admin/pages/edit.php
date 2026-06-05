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
                <h2 class="admin-card-title">Structure de la page (Page Builder)</h2>
                <p style="color: var(--slate-500); font-size: 0.8rem; margin-top: -1rem; margin-bottom: 1.5rem;">
                    Configurez et organisez l'ordre des sections de votre page.
                </p>

                <?php
                $rawSections = json_decode($page['sections'], true) ?: [];
                $normalizedSections = [];
                foreach ($rawSections as $idx => $item) {
                    if (is_string($item)) {
                        $normalizedSections[] = [
                            'id' => 'sec_' . $item . '_' . $idx,
                            'type' => $item,
                            'active' => true
                        ];
                    } else if (is_array($item)) {
                        $normalizedSections[] = [
                            'id' => $item['id'] ?? 'sec_' . ($item['type'] ?? 'unknown') . '_' . $idx,
                            'type' => $item['type'] ?? '',
                            'active' => isset($item['active']) ? (bool)$item['active'] : true
                        ];
                    }
                }
                ?>

                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <?php if (empty($normalizedSections)): ?>
                        <div style="padding: 1.5rem; text-align: center; color: var(--slate-400); background-color: var(--slate-50); border-radius: var(--radius-md); border: 1px dashed var(--slate-300);">
                            Aucune section active sur cette page.
                        </div>
                    <?php else: ?>
                        <?php foreach ($normalizedSections as $item): ?>
                            <div style="display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--slate-200); padding: 0.75rem 1rem; border-radius: var(--radius-md); background: white; border-left: 4px solid <?= $item['active'] ? 'var(--success)' : 'var(--slate-400)' ?>;">
                                <div>
                                    <strong style="text-transform: capitalize; color: var(--slate-900); font-size: 0.95rem;"><?= htmlspecialchars(str_replace('-', ' ', $item['type'])) ?></strong>
                                    <span style="font-size: 0.7rem; color: var(--slate-400); display: block;">Type: <?= htmlspecialchars($item['type']) ?></span>
                                </div>
                                <div style="display: flex; gap: 0.35rem; align-items: center;">
                                    <!-- Move Up / Down -->
                                    <a href="<?= BASE_URL ?>/admin/pages/builder/move/<?= $page['id'] ?>/<?= $item['id'] ?>/up" title="Monter" style="padding: 0.25rem 0.5rem; text-decoration: none; border-radius: 4px; background-color: var(--slate-100); font-weight: bold; color: var(--slate-700); font-size: 0.85rem; border: 1px solid var(--slate-200);">&uarr;</a>
                                    <a href="<?= BASE_URL ?>/admin/pages/builder/move/<?= $page['id'] ?>/<?= $item['id'] ?>/down" title="Descendre" style="padding: 0.25rem 0.5rem; text-decoration: none; border-radius: 4px; background-color: var(--slate-100); font-weight: bold; color: var(--slate-700); font-size: 0.85rem; border: 1px solid var(--slate-200);">&darr;</a>
                                    
                                    <!-- Toggle Active -->
                                    <a href="<?= BASE_URL ?>/admin/pages/builder/toggle/<?= $page['id'] ?>/<?= $item['id'] ?>" style="padding: 0.25rem 0.5rem; text-decoration: none; border-radius: 4px; background-color: <?= $item['active'] ? 'rgba(16, 185, 129, 0.1)' : 'var(--slate-200)' ?>; font-size: 0.75rem; font-weight: bold; color: <?= $item['active'] ? 'var(--success)' : 'var(--slate-600)' ?>; border: 1px solid <?= $item['active'] ? 'rgba(16, 185, 129, 0.2)' : 'var(--slate-300)' ?>;">
                                        <?= $item['active'] ? 'Actif' : 'Inactif' ?>
                                    </a>

                                    <!-- Delete -->
                                    <a href="<?= BASE_URL ?>/admin/pages/builder/delete/<?= $page['id'] ?>/<?= $item['id'] ?>" onclick="return confirm('Retirer cette section ?');" title="Supprimer" style="padding: 0.25rem 0.5rem; text-decoration: none; border-radius: 4px; background-color: rgba(239, 68, 68, 0.1); color: var(--danger); font-size: 0.85rem; font-weight: bold; border: 1px solid rgba(239, 68, 68, 0.15);">&times;</a>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>

                <!-- Add Section dropdown -->
                <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px dashed var(--slate-200);">
                    <div style="display: flex; gap: 0.5rem;">
                        <select id="new-section-select" class="form-control" style="padding: 0.5rem; font-size: 0.9rem;">
                            <option value="">-- Ajouter une section --</option>
                            <option value="hero">Bannière Hero</option>
                            <option value="quick-categories">Catégories Rapides</option>
                            <option value="featured-showcase">Annonces Vedettes</option>
                            <option value="stats">Statistiques</option>
                            <option value="testimonials">Témoignages</option>
                            <option value="why-nova">Pourquoi NOVA</option>
                            <option value="cta">Appel à l'action (CTA)</option>
                            <option value="blog">Derniers Articles</option>
                            <option value="contact">Formulaire Contact</option>
                        </select>
                        <button type="button" onclick="addPageSection()" class="btn-submit" style="padding: 0.5rem 1rem; font-size: 0.9rem; white-space: nowrap;">Ajouter</button>
                    </div>
                </div>
            </div>
            
            <script>
            function addPageSection() {
                const type = document.getElementById('new-section-select').value;
                if (!type) {
                    alert('Veuillez sélectionner un type de section.');
                    return;
                }
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '<?= BASE_URL ?>/admin/pages/builder/add/<?= $page['id'] ?>';
                
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrf_token';
                csrfInput.value = '<?= $csrfToken ?>';
                
                const typeInput = document.createElement('input');
                typeInput.type = 'hidden';
                typeInput.name = 'type';
                typeInput.value = type;
                
                form.appendChild(csrfInput);
                form.appendChild(typeInput);
                document.body.appendChild(form);
                form.submit();
            }
            </script>

            
        </div>
    </div>
</form>
