<?php
/**
 * NOVA Marketplace — AnnonceController (Public Unified Ads)
 */

namespace Controllers;

use Core\Controller;
use Models\Page;
use Models\SiteSetting;

class AnnonceController extends Controller {
    /**
     * Display a unified list of both car and real estate listings.
     */
    public function index(): void {
        $pageModel = new Page();
        $page = $pageModel->findBySlug('annonces');
        if (!$page) {
            $db = \Config\Database::getConnection();
            $db->prepare("INSERT INTO `pages` (`id`, `slug`, `title`, `sections`, `is_published`) VALUES (?, ?, ?, ?, ?)")
               ->execute(['page-annonces', 'annonces', 'Toutes les Annonces', '["hero", "listings-unified"]', 1]);
            $page = $pageModel->findBySlug('annonces');
        }

        $settingModel = new SiteSetting();
        $settings = $settingModel->getCachedSettings();

        // Get active sections
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

        // Fetch cars and properties
        $db = \Config\Database::getConnection();
        $cars = $db->query("SELECT *, 'car' as listing_type FROM `cars` WHERE status = 'ACTIVE'")->fetchAll();
        $properties = $db->query("SELECT *, 'property' as listing_type FROM `properties` WHERE status = 'ACTIVE'")->fetchAll();

        // Merge and sort by creation date descending
        $annonces = array_merge($cars, $properties);
        usort($annonces, function($a, $b) {
            return strtotime($b['created_at']) <=> strtotime($a['created_at']);
        });

        $this->render('annonces/index', [
            'page' => $page,
            'settings' => $settings,
            'sections' => $sections,
            'annonces' => $annonces,
            'seoTitle' => $page['seo_title'] ?? 'Toutes les Annonces Côte d\'Ivoire — NOVA',
            'metaDescription' => $page['meta_description'] ?? null
        ], 'layouts/main');
    }
}
