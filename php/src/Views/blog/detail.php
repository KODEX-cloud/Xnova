<?php
/**
 * NOVA Marketplace — Public Blog Detail View
 */
?>
<article class="section" style="background-color: white;">
    <div class="container" style="max-width: 800px;">
        
        <!-- Back Link -->
        <div style="margin-bottom: 2rem;">
            <a href="<?= BASE_URL ?>/blog" style="font-size: 0.9rem; color: var(--slate-500); font-weight: 500; display: inline-flex; align-items: center; gap: 0.5rem;">
                &larr; Retour au blog
            </a>
        </div>

        <!-- Article Header -->
        <header style="margin-bottom: 2.5rem;">
            <span style="background-color: var(--slate-100); color: var(--slate-700); padding: 0.35rem 0.75rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; display: inline-block; margin-bottom: 1rem;">
                <?= htmlspecialchars($post['category']) ?>
            </span>
            <h1 style="font-size: 2.5rem; font-weight: 800; color: var(--slate-900); line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 1.5rem;">
                <?= htmlspecialchars($post['title']) ?>
            </h1>
            
            <div style="display: flex; align-items: center; gap: 1rem; color: var(--slate-500); font-size: 0.9rem; border-top: 1px solid var(--slate-100); border-bottom: 1px solid var(--slate-100); padding: 1rem 0;">
                <span>Par <strong><?= htmlspecialchars($post['author'] ?? 'L\'équipe NOVA') ?></strong></span>
                <span>&bull;</span>
                <span>Publié le <?= date('d/m/Y', strtotime($post['published_at'] ?? $post['created_at'])) ?></span>
                <span>&bull;</span>
                <span><?= $post['read_time'] ?> min de lecture</span>
            </div>
        </header>

        <!-- Cover Image -->
        <?php if (!empty($post['cover_image'])): ?>
            <div style="border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--slate-200); margin-bottom: 3rem;">
                <img src="<?= BASE_URL . $post['cover_image'] ?>" alt="<?= htmlspecialchars($post['title']) ?>" style="width: 100%; height: auto; display: block;">
            </div>
        <?php endif; ?>

        <!-- Rich Text HTML Content (TipTap output) -->
        <div class="rich-text-content" style="font-size: 1.1rem; line-height: 1.8; color: var(--slate-800);">
            <?= $post['content'] /* Rich HTML content output */ ?>
        </div>

    </div>
</article>
