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

        // Convert JSON sections string back to PHP array
        $sections = json_decode($page['sections'], true) ?: [];

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

        $sections = json_decode($page['sections'], true) ?: [];

        $this->render('home/index', [
            'page' => $page,
            'sections' => $sections,
            'seoTitle' => $page['seo_title'] ?? 'À Propos — NOVA'
        ], 'layouts/main');
    }
}
