<?php
/**
 * NOVA Marketplace — Admin BlogController
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\BlogPost;

class BlogController extends Controller {
    /**
     * List all articles in admin table.
     */
    public function index(): void {
        $postModel = new BlogPost();
        $posts = $postModel->all();

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/blog/index', [
            'posts' => $posts,
            'csrfToken' => $csrfToken,
            'success' => Session::get('blog_success'),
            'error' => Session::get('blog_error')
        ], 'layouts/admin');

        Session::delete('blog_success');
        Session::delete('blog_error');
    }

    /**
     * Render the creation form.
     */
    public function new(): void {
        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/blog/new', [
            'csrfToken' => $csrfToken,
            'error' => Session::get('blog_error')
        ], 'layouts/admin');

        Session::delete('blog_error');
    }

    /**
     * Process creation submission.
     */
    public function create(): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('blog_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/blog/new');
        }

        $title = trim($_POST['title'] ?? '');
        $content = $_POST['content'] ?? '';

        if (empty($title) || empty($content)) {
            Session::set('blog_error', 'Veuillez remplir le titre et le contenu.');
            $this->redirect('/admin/blog/new');
        }

        // Generate slug from title
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9-]+/', '-', $title)) . '-' . time();

        // Build array database insertion
        $db = \Config\Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO `blog_posts` (
                `id`, `title`, `slug`, `content`, `excerpt`, `cover_image`, `category`, 
                `tags`, `author`, `status`, `published_at`, `read_time`
            ) VALUES (
                :id, :title, :slug, :content, :excerpt, :cover, :category, 
                :tags, :author, :status, :pub_at, :read
            )
        ");

        $id = uniqid('post-');
        $status = $_POST['status'] ?? 'DRAFT';
        $publishedAt = ($status === 'PUBLISHED') ? date('Y-m-d H:i:s') : null;

        $success = $stmt->execute([
            'id' => $id,
            'title' => $title,
            'slug' => $slug,
            'content' => $content,
            'excerpt' => $_POST['excerpt'] ?? null,
            'cover' => $_POST['cover_image'] ?? null,
            'category' => $_POST['category'] ?? 'guides',
            'tags' => $_POST['tags'] ?? '[]',
            'author' => $_POST['author'] ?? Session::get('user_name'),
            'status' => $status,
            'pub_at' => $publishedAt,
            'read' => !empty($_POST['read_time']) ? (int)$_POST['read_time'] : 5
        ]);

        if ($success) {
            Session::set('blog_success', 'Article de blog créé avec succès !');
            $this->redirect('/admin/blog');
        } else {
            Session::set('blog_error', 'Une erreur est survenue lors de la création.');
            $this->redirect('/admin/blog/new');
        }
    }

    /**
     * Render the editor form.
     */
    public function edit(string $id): void {
        $postModel = new BlogPost();
        $post = $postModel->find($id);

        if (!$post) {
            Session::set('blog_error', 'Article non trouvé.');
            $this->redirect('/admin/blog');
        }

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/blog/edit', [
            'post' => $post,
            'csrfToken' => $csrfToken,
            'error' => Session::get('blog_error')
        ], 'layouts/admin');

        Session::delete('blog_error');
    }

    /**
     * Process updates.
     */
    public function update(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('blog_error', 'Sécurité CSRF invalide.');
            $this->redirect("/admin/blog/edit/{$id}");
        }

        $postModel = new BlogPost();
        $post = $postModel->find($id);

        if (!$post) {
            Session::set('blog_error', 'Article non trouvé.');
            $this->redirect('/admin/blog');
        }

        $title = trim($_POST['title'] ?? '');
        $content = $_POST['content'] ?? '';

        if (empty($title) || empty($content)) {
            Session::set('blog_error', 'Le titre et le contenu sont obligatoires.');
            $this->redirect("/admin/blog/edit/{$id}");
        }

        // Keep or update slug
        $slug = $post['slug'];
        if ($post['title'] !== $title) {
            $slug = strtolower(preg_replace('/[^a-zA-Z0-9-]+/', '-', $title)) . '-' . time();
        }

        $status = $_POST['status'] ?? 'DRAFT';
        $publishedAt = $post['published_at'];
        if ($status === 'PUBLISHED' && $post['status'] !== 'PUBLISHED') {
            $publishedAt = date('Y-m-d H:i:s');
        }

        $db = \Config\Database::getConnection();
        $stmt = $db->prepare("
            UPDATE `blog_posts` SET
                `title` = :title,
                `slug` = :slug,
                `content` = :content,
                `excerpt` = :excerpt,
                `cover_image` = :cover,
                `category` = :category,
                `tags` = :tags,
                `author` = :author,
                `status` = :status,
                `published_at` = :pub_at,
                `read_time` = :read
            WHERE `id` = :id
        ");

        $success = $stmt->execute([
            'id' => $id,
            'title' => $title,
            'slug' => $slug,
            'content' => $content,
            'excerpt' => $_POST['excerpt'] ?? null,
            'cover' => $_POST['cover_image'] ?? null,
            'category' => $_POST['category'] ?? 'guides',
            'tags' => $_POST['tags'] ?? '[]',
            'author' => $_POST['author'] ?? Session::get('user_name'),
            'status' => $status,
            'pub_at' => $publishedAt,
            'read' => !empty($_POST['read_time']) ? (int)$_POST['read_time'] : 5
        ]);

        if ($success) {
            Session::set('blog_success', 'Article de blog mis à jour avec succès !');
            $this->redirect('/admin/blog');
        } else {
            Session::set('blog_error', 'Une erreur est survenue lors de la mise à jour.');
            $this->redirect("/admin/blog/edit/{$id}");
        }
    }

    /**
     * Remove entry.
     */
    public function delete(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('blog_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/blog');
        }

        $postModel = new BlogPost();
        $success = $postModel->delete($id);

        if ($success) {
            Session::set('blog_success', 'Article supprimé avec succès.');
        } else {
            Session::set('blog_error', 'Impossible de supprimer cet article.');
        }

        $this->redirect('/admin/blog');
    }
}
