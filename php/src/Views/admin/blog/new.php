<?php
/**
 * NOVA Marketplace — Admin Create BlogPost View
 */
?>
<div style="margin-bottom: 2rem;">
    <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.9rem; color: var(--slate-500); margin-bottom: 0.5rem;">
        <a href="<?= BASE_URL ?>/admin/blog" style="color: var(--slate-500); font-weight: 500;">Blog</a>
        <span>&rsaquo;</span>
        <span>Nouvel article</span>
    </div>
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Rédiger un article</h1>
    <p style="color: var(--slate-500);">Créez un nouvel article pour le blog de la plateforme</p>
</div>

<?php if (!empty($error)): ?>
    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 1.5rem;">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<form action="<?= BASE_URL ?>/admin/blog/create" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;">
        
        <!-- Left: Rich Text Editor Container -->
        <div class="admin-card">
            <h2 class="admin-card-title">Contenu de l'article</h2>

            <div class="form-group">
                <label class="form-label" for="title">Titre de l'Article <span style="color:var(--danger)">*</span></label>
                <input type="text" id="title" name="title" required placeholder="ex: 10 Conseils pour acheter une voiture d'occasion" class="form-control">
            </div>

            <div class="form-group">
                <label class="form-label" for="excerpt">Résumé court (Excerpt)</label>
                <textarea id="excerpt" name="excerpt" rows="3" placeholder="Description courte affichée sur la grille du blog..." class="form-control" style="resize:vertical;"></textarea>
            </div>

            <div class="form-group">
                <label class="form-label" for="content">Contenu HTML <span style="color:var(--danger)">*</span></label>
                <textarea id="content" name="content" required rows="10" placeholder="Écrivez le contenu en HTML..." class="form-control" style="resize:vertical; font-family:sans-serif;"></textarea>
            </div>
        </div>

        <!-- Right: Status and Layout -->
        <div style="display: flex; flex-direction: column; gap: 2rem;">
            <!-- Status Card -->
            <div class="admin-card">
                <h2 class="admin-card-title">Publication</h2>
                
                <div class="form-group">
                    <label class="form-label" for="status">Statut</label>
                    <select id="status" name="status" class="form-control">
                        <option value="DRAFT">Brouillon (DRAFT)</option>
                        <option value="PUBLISHED">Publié (PUBLISHED)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" for="category">Catégorie</label>
                    <select id="category" name="category" class="form-control">
                        <option value="guides">Guides</option>
                        <option value="automobile">Automobile</option>
                        <option value="immobilier">Immobilier</option>
                        <option value="actualites">Actualités</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" for="read_time">Temps de lecture (minutes)</label>
                    <input type="number" id="read_time" name="read_time" value="5" class="form-control">
                </div>

                <div class="form-group">
                    <label class="form-label" for="author">Auteur</label>
                    <input type="text" id="author" name="author" value="<?= htmlspecialchars(\Core\Session::get('user_name')) ?>" class="form-control">
                </div>
            </div>

            <!-- Media Cover Card -->
            <div class="admin-card">
                <h2 class="admin-card-title">Image de couverture</h2>
                <p style="color:var(--slate-500); font-size:0.8rem; margin-top:-1rem; margin-bottom:1.5rem;">
                    Copiez l'URL de votre image depuis la Bibliothèque Médias, puis collez-la ci-dessous.
                </p>
                <div class="form-group">
                    <label class="form-label" for="cover_image">Lien de l'image</label>
                    <input type="text" id="cover_image" name="cover_image" placeholder="ex: /uploads/image.jpg" class="form-control">
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="tags">Tags (JSON Array)</label>
                    <input type="text" id="tags" name="tags" value='["conseils", "guide"]' class="form-control" style="font-family:monospace; font-size:0.85rem;">
                </div>
            </div>

            <!-- Action button -->
            <button type="submit" class="btn-submit" style="width:100%; text-align:center; padding:0.85rem;">
                Créer l'article
            </button>
        </div>

    </div>
</form>
