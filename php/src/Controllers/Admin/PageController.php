<?php
/**
 * NOVA Marketplace — PageController
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\Page;
use Models\SiteSetting;

class PageController extends Controller {
    /**
     * List all CMS Pages.
     */
    public function index(): void {
        $pageModel = new Page();
        $pages = $pageModel->all();

        $this->render('admin/pages/index', [
            'pages' => $pages
        ], 'layouts/admin');
    }

    /**
     * Render the editor interface for a specific page.
     */
    public function edit(string $id): void {
        $pageModel = new Page();
        $page = $pageModel->find($id);

        if (!$page) {
            Session::set('page_error', 'Page non trouvée.');
            $this->redirect('/admin/pages');
        }

        // Fetch associated page settings from SiteSetting
        $settingModel = new SiteSetting();
        $settings = $settingModel->getCachedSettings();

        // Get settings prefixed for this page (e.g. page.home.hero.title)
        $prefix = "page." . $page['slug'] . ".";
        $pageSettings = [];
        foreach ($settings as $key => $value) {
            if (strpos($key, $prefix) === 0) {
                $shortKey = substr($key, strlen($prefix));
                $pageSettings[$shortKey] = $value;
            }
        }

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/pages/edit', [
            'page' => $page,
            'pageSettings' => $pageSettings,
            'csrfToken' => $csrfToken,
            'success' => Session::get('page_success'),
            'error' => Session::get('page_error')
        ], 'layouts/admin');

        // Clear flash messages
        Session::delete('page_success');
        Session::delete('page_error');
    }

    /**
     * Save dynamic settings and structure updates for a page.
     */
    public function update(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('page_error', 'Sécurité CSRF invalide.');
            $this->redirect("/admin/pages/edit/{$id}");
        }

        $pageModel = new Page();
        $page = $pageModel->find($id);

        if (!$page) {
            Session::set('page_error', 'Page non trouvée.');
            $this->redirect('/admin/pages');
        }

        // Update page fields
        $title = trim($_POST['title'] ?? '');
        $isPublished = isset($_POST['is_published']) ? 1 : 0;
        
        $db = \Config\Database::getConnection();
        $stmt = $db->prepare("UPDATE `pages` SET title = :title, is_published = :is_pub WHERE id = :id");
        $stmt->execute([
            'title' => $title,
            'is_pub' => $isPublished,
            'id' => $id
        ]);

        // Save CMS settings keys (prefixing with page.{slug})
        $settingModel = new SiteSetting();
        $prefix = "page." . $page['slug'] . ".";

        if (isset($_POST['settings']) && is_array($_POST['settings'])) {
            foreach ($_POST['settings'] as $key => $value) {
                $settingModel->setSetting($prefix . $key, $value);
            }
        }

        // Save layout sections list order if updated
        if (isset($_POST['sections']) && is_string($_POST['sections'])) {
            $sections = json_decode($_POST['sections'], true);
            if (is_array($sections)) {
                $pageModel->updateSections($id, $sections);
            }
        }

        Session::set('page_success', 'Page CMS mise à jour avec succès !');
        $this->redirect("/admin/pages/edit/{$id}");
    }
}
