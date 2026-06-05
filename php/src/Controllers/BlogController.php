<?php
/**
 * NOVA Marketplace — BlogController (Public)
 */

namespace Controllers;

use Core\Controller;
use Models\BlogPost;
use Models\Page;
use Models\SiteSetting;

class BlogController extends Controller {
    /**
     * Render the list of published articles.
     */
    public function index(): void {
        $pageModel = new Page();
        $page = $pageModel->findBySlug('blog');
        if (!$page) {
            $db = \Config\Database::getConnection();
            $db->prepare("INSERT INTO `pages` (`id`, `slug`, `title`, `sections`, `is_published`) VALUES (?, ?, ?, ?, ?)")
               ->execute(['page-blog', 'blog', 'Blog', '["hero", "blog-list"]', 1]);
            $page = $pageModel->findBySlug('blog');
        }

        $settingModel = new SiteSetting();
        $settings = $settingModel->getCachedSettings();

        // Filter and get active section names
        $rawSections = json_decode($page['sections'], true) ?: [];
        $sections = [];
        foreach ($rawSections as $item) {
            if (is_string($item)) {
                $sections[] = $item;
            } else if (is_array($item)) {
                if (isset($item['active']) ? (bool)$item['active'] : true) {
                    $sections[] = $item['type'] ?? '';
                }
            }
        }

        $postModel = new BlogPost();
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        
        $posts = $postModel->getPublishedPosts($category, $search);

        $this->render('blog/index', [
            'page' => $page,
            'settings' => $settings,
            'sections' => $sections,
            'posts' => $posts,
            'category' => $category,
            'search' => $search,
            'seoTitle' => $page['seo_title'] ?? 'Blog Automobile & Immobilier Côte d\'Ivoire — NOVA',
            'metaDescription' => $page['meta_description'] ?? null
        ], 'layouts/main');
    }

    /**
     * Render a single blog post.
     */
    public function detail(string $slug): void {
        $postModel = new BlogPost();
        $post = $postModel->findBy('slug', $slug);

        if (!$post || $post['status'] !== 'PUBLISHED') {
            header("HTTP/1.0 404 Not Found");
            $this->render('errors/404', ['seoTitle' => 'Article non trouvé'], 'layouts/main');
            return;
        }

        $this->render('blog/detail', [
            'post' => $post,
            'seoTitle' => $post['title'] . ' — Blog NOVA',
            'metaDescription' => $post['excerpt']
        ], 'layouts/main');
    }
}
