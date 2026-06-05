<?php
/**
 * NOVA Marketplace — HomeController
 */

namespace Controllers;

use Core\Controller;
use Models\Page;
use Models\SiteSetting;

class HomeController extends Controller {
    /**
     * Helper to decode and filter active sections from JSON.
     */
    private function getActiveSections(string $sectionsJson): array {
        $raw = json_decode($sectionsJson, true) ?: [];
        $active = [];
        foreach ($raw as $item) {
            if (is_string($item)) {
                $active[] = $item;
            } else if (is_array($item)) {
                if (isset($item['active']) ? (bool)$item['active'] : true) {
                    $active[] = $item['type'] ?? '';
                }
            }
        }
        return $active;
    }

    /**
     * Render the dynamic CMS home page.
     */
    public function index(): void {
        $pageModel = new Page();
        $page = $pageModel->findBySlug('home');

        if (!$page) {
            die("Erreur : La page d'accueil n'est pas configurée en base de données.");
        }

        $settingModel = new SiteSetting();
        $settings = $settingModel->getCachedSettings();

        // Filter and get active section names
        $sections = $this->getActiveSections($page['sections']);

        $this->render('home/index', [
            'page' => $page,
            'settings' => $settings,
            'sections' => $sections,
            'seoTitle' => $page['seo_title'] ?? $settings['page.home.hero.title'] ?? null,
            'metaDescription' => $page['meta_description'] ?? $settings['page.home.hero.subtitle'] ?? null
        ], 'layouts/main');
    }

    /**
     * Render the static/dynamic about page.
     */
    public function about(): void {
        $pageModel = new Page();
        $page = $pageModel->findBySlug('about');

        if (!$page) {
            die("Erreur : La page À Propos n'est pas configurée.");
        }

        $settingModel = new SiteSetting();
        $settings = $settingModel->getCachedSettings();

        // Filter and get active section names
        $sections = $this->getActiveSections($page['sections']);

        $this->render('home/index', [
            'page' => $page,
            'settings' => $settings,
            'sections' => $sections,
            'seoTitle' => $page['seo_title'] ?? 'À Propos — NOVA'
        ], 'layouts/main');
    }
}
