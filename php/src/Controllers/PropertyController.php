<?php
/**
 * NOVA Marketplace — PropertyController (Public)
 */

namespace Controllers;

use Core\Controller;
use Models\Property;
use Models\Page;
use Models\SiteSetting;

class PropertyController extends Controller {
    /**
     * Render the public listing of properties with filters.
     */
    public function index(): void {
        $pageModel = new Page();
        $page = $pageModel->findBySlug('immobilier');
        if (!$page) {
            $db = \Config\Database::getConnection();
            $db->prepare("INSERT INTO `pages` (`id`, `slug`, `title`, `sections`, `is_published`) VALUES (?, ?, ?, ?, ?)")
               ->execute(['page-immobilier', 'immobilier', 'Immobilier', '["hero", "listings-immo"]', 1]);
            $page = $pageModel->findBySlug('immobilier');
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

        $propertyModel = new Property();
        
        // Capture filters from GET query string
        $filters = [
            'type' => $_GET['type'] ?? null,
            'price_max' => $_GET['price_max'] ?? null,
            'bedrooms' => $_GET['bedrooms'] ?? null,
            'city' => $_GET['city'] ?? null,
            'search' => $_GET['search'] ?? null
        ];

        $properties = $propertyModel->getActiveProperties($filters);

        $this->render('immobilier/index', [
            'page' => $page,
            'settings' => $settings,
            'sections' => $sections,
            'properties' => $properties,
            'filters' => $filters,
            'seoTitle' => $page['seo_title'] ?? 'Achat, Vente et Location Villa, Appartement à Abidjan — NOVA',
            'metaDescription' => $page['meta_description'] ?? null
        ], 'layouts/main');
    }

    /**
     * Render the detailed property specifications view.
     */
    public function detail(string $slug): void {
        $propertyModel = new Property();
        $property = $propertyModel->findBy('slug', $slug);

        if (!$property || $property['status'] !== 'ACTIVE') {
            header("HTTP/1.0 404 Not Found");
            $this->render('errors/404', ['seoTitle' => 'Annonce non trouvée'], 'layouts/main');
            return;
        }

        // Decode JSON images & amenities string
        $images = json_decode($property['images'], true) ?: [];
        $amenities = json_decode($property['amenities'], true) ?: [];

        $this->render('immobilier/detail', [
            'property' => $property,
            'images' => $images,
            'amenities' => $amenities,
            'seoTitle' => $property['title'] . ' — NOVA Immobilier'
        ], 'layouts/main');
    }
}
