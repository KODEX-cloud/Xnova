<?php
/**
 * NOVA Marketplace — Public Blog Listing View
 */
?>
<section class="section">
    <div class="container">
        
        <div class="section-header" style="text-align: center; margin-bottom: 3rem;">
            <span style="background-color: rgba(255, 0, 85, 0.1); color: var(--nova-red); padding: 0.35rem 0.75rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Blog & Actualités</span>
            <h1 class="section-title" style="margin-top: 0.5rem;">Conseils & Guides</h1>
            <p class="section-subtitle">Retrouvez les dernières actualités et conseils sur l'immobilier et l'automobile à Abidjan.</p>
        </div>

        <!-- Filter tabs & Search -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.5rem; margin-bottom: 3.5rem; border-bottom: 1px solid var(--slate-200); padding-bottom: 1.5rem;">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <a href="<?= BASE_URL ?>/blog" 
                   style="padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; <?= empty($category) ? 'background-color: var(--nova-red); color: white;' : 'background-color: var(--slate-100); color: var(--slate-600);' ?>">
                    Tous les articles
                </a>
                <a href="<?= BASE_URL ?>/blog?category=automobile" 
                   style="padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; <?= ($category === 'automobile') ? 'background-color: var(--nova-red); color: white;' : 'background-color: var(--slate-100); color: var(--slate-600);' ?>">
                    Automobile
                </a>
                <a href="<?= BASE_URL ?>/blog?category=immobilier" 
                   style="padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; <?= ($category === 'immobilier') ? 'background-color: var(--nova-red); color: white;' : 'background-color: var(--slate-100); color: var(--slate-600);' ?>">
                    Immobilier
                </a>
                <a href="<?= BASE_URL ?>/blog?category=guides" 
                   style="padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; <?= ($category === 'guides') ? 'background-color: var(--nova-red); color: white;' : 'background-color: var(--slate-100); color: var(--slate-600);' ?>">
                    Guides
                </a>
            </div>

            <!-- Search box -->
            <form action="<?= BASE_URL ?>/blog" method="GET" style="display: flex; gap: 0.5rem; max-width: 320px; width: 100%;">
                <?php if (!empty($category)): ?>
                    <input type="hidden" name="category" value="<?= htmlspecialchars($category) ?>">
                <?php endif; ?>
                <input type="text" name="search" value="<?= htmlspecialchars($search ?? '') ?>" placeholder="Rechercher un article..." 
                       style="flex-grow: 1; padding: 0.5rem 1rem; border: 1px solid var(--slate-300); border-radius: var(--radius-md); font-size: 0.9rem; outline: none;"
                       onfocus="this.style.borderColor='var(--nova-red)';" onblur="this.style.borderColor='var(--slate-300)';">
                <button type="submit" class="btn-publish" style="padding: 0.5rem 1rem; font-size: 0.9rem; box-shadow: none;">Filtrer</button>
            </form>
        </div>

        <!-- Articles Grid -->
        <?php if (empty($posts)): ?>
            <div style="background-color: white; padding: 5rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm);">
                <p style="color: var(--slate-500); font-weight: 600;">Aucun article trouvé dans cette catégorie.</p>
            </div>
        <?php else: ?>
            <div class="card-grid">
                <?php foreach ($posts as $post): ?>
                    <?php 
                    $cover = !empty($post['cover_image']) ? BASE_URL . $post['cover_image'] : BASE_URL . '/assets/img/default-blog.jpg';
                    ?>
                    <article class="card">
                        <div class="card-img-wrapper" style="padding-top: 50%;">
                            <img src="<?= $cover ?>" alt="<?= htmlspecialchars($post['title']) ?>" class="card-img">
                            <span class="card-badge" style="background-color: var(--slate-800);"><?= htmlspecialchars($post['category']) ?></span>
                        </div>
                        <div class="card-content">
                            <h3 class="card-title" style="font-size: 1.25rem;">
                                <a href="<?= BASE_URL ?>/blog/<?= htmlspecialchars($post['slug']) ?>" style="color: var(--slate-900);">
                                    <?= htmlspecialchars($post['title']) ?>
                                </a>
                            </h3>
                            <p style="color: var(--slate-500); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; height: 4.5em;">
                                <?= htmlspecialchars($post['excerpt'] ?? '') ?>
                            </p>
                            <div class="card-meta">
                                <span>Par <?= htmlspecialchars($post['author'] ?? 'L\'équipe NOVA') ?></span>
                                <span>&bull;</span>
                                <span><?= $post['read_time'] ?> min de lecture</span>
                            </div>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
    </div>
</section>
