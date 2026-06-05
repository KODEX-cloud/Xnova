<?php
/**
 * NOVA Marketplace — Public Blog Listing View
 */
?>

<?php foreach ($sections as $sectionName): ?>

    <!-- ── SECTION HERO ──────────────────────────────────────────────────────── -->
    <?php if ($sectionName === 'hero'): ?>
        <section class="hero" style="background-image: url('<?= htmlspecialchars($settings['page.blog.hero.bg-image'] ?? BASE_URL . '/assets/img/default-hero.jpg') ?>'); background-size: cover; background-position: center; margin-bottom: 2rem;">
            <div class="hero-overlay"></div>
            <div class="container" style="position: relative; z-index: 10;">
                <div class="hero-container">
                    <h1 class="hero-title">
                        <?= htmlspecialchars($settings['page.blog.hero.title'] ?? 'Blog & Conseils Pratiques') ?>
                    </h1>
                    <p class="hero-subtitle">
                        <?= htmlspecialchars($settings['page.blog.hero.subtitle'] ?? 'Retrouvez les dernières actualités et guides sur l\'immobilier et l\'automobile à Abidjan.') ?>
                    </p>
                </div>
            </div>
        </section>

    <!-- ── SECTION BLOG LIST ─────────────────────────────────────────────────── -->
    <?php elseif ($sectionName === 'blog-list'): ?>
        <section class="section" style="padding-top: 1rem;">
            <div class="container">
                <!-- Filter tabs & Search -->
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.5rem; margin-bottom: 3.5rem; border-bottom: 1px solid var(--slate-200); padding-bottom: 1.5rem;">
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="<?= BASE_URL ?>/blog" 
                           style="padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; <?= empty($category) ? 'background-color: var(--nova-red); color: white;' : 'background-color: var(--slate-100); color: var(--slate-600);' ?> text-decoration:none;">
                            Tous les articles
                        </a>
                        <a href="<?= BASE_URL ?>/blog?category=automobile" 
                           style="padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; <?= ($category === 'automobile') ? 'background-color: var(--nova-red); color: white;' : 'background-color: var(--slate-100); color: var(--slate-600);' ?> text-decoration:none;">
                            Automobile
                        </a>
                        <a href="<?= BASE_URL ?>/blog?category=immobilier" 
                           style="padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; <?= ($category === 'immobilier') ? 'background-color: var(--nova-red); color: white;' : 'background-color: var(--slate-100); color: var(--slate-600);' ?> text-decoration:none;">
                            Immobilier
                        </a>
                        <a href="<?= BASE_URL ?>/blog?category=guides" 
                           style="padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; <?= ($category === 'guides') ? 'background-color: var(--nova-red); color: white;' : 'background-color: var(--slate-100); color: var(--slate-600);' ?> text-decoration:none;">
                            Guides
                        </a>
                    </div>

                    <!-- Search box -->
                    <form action="<?= BASE_URL ?>/blog" method="GET" style="display: flex; gap: 0.5rem; max-width: 320px; width: 100%;">
                        <?php if (!empty($category)): ?>
                            <input type="hidden" name="category" value="<?= htmlspecialchars($category) ?>">
                        <?php endif; ?>
                        <input type="text" name="search" value="<?= htmlspecialchars($search ?? '') ?>" placeholder="Rechercher un article..." 
                               style="flex-grow: 1; padding: 0.5rem 1rem; border: 1px solid var(--slate-300); border-radius: var(--radius-md); font-size: 0.9rem; outline: none;">
                        <button type="submit" class="btn-publish" style="padding: 0.5rem 1rem; font-size: 0.9rem; box-shadow: none;">Filtrer</button>
                    </form>
                </div>

                <!-- Articles Grid -->
                <?php if (empty($posts)): ?>
                    <div style="background-color: white; padding: 5rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm);">
                        <p style="color: var(--slate-500); font-weight: 600;">Aucun article trouvé.</p>
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

    <!-- ── SECTION CTA ───────────────────────────────────────────────────────── -->
    <?php elseif ($sectionName === 'cta'): ?>
        <section class="section" style="background: linear-gradient(135deg, var(--slate-900) 0%, var(--slate-800) 100%); color: white; text-align: center;">
            <div class="container" style="max-width: 720px;">
                <h2 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem;">
                    <?= htmlspecialchars($settings['page.blog.cta.title'] ?? 'Abonnez-vous à notre newsletter') ?>
                </h2>
                <p style="color: var(--slate-300); margin-bottom: 2rem;">
                    <?= htmlspecialchars($settings['page.blog.cta.subtitle'] ?? 'Recevez directement nos derniers guides et tendances par email.') ?>
                </p>
                <a href="<?= BASE_URL ?>/contact" class="btn-publish" style="padding: 1rem 2rem; display:inline-block; text-decoration:none;">
                    <?= htmlspecialchars($settings['page.blog.cta.btn-text'] ?? 'Nous contacter') ?>
                </a>
            </div>
        </section>

    <?php endif; ?>

<?php endforeach; ?>
