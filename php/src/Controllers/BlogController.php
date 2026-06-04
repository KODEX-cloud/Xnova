<?php
/**
 * NOVA Marketplace — BlogController (Public)
 */

namespace Controllers;

use Core\Controller;
use Models\BlogPost;

class BlogController extends Controller {
    /**
     * Render the list of published articles.
     */
    public function index(): void {
        $postModel = new BlogPost();
        
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        
        $posts = $postModel->getPublishedPosts($category, $search);

        $this->render('blog/index', [
            'posts' => $posts,
            'category' => $category,
            'search' => $search,
            'seoTitle' => 'Blog Automobile & Immobilier Côte d\'Ivoire — NOVA'
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
