<?php
/**
 * NOVA Marketplace — CarController (Public)
 */

namespace Controllers;

use Core\Controller;
use Models\Car;
use Models\Page;
use Models\SiteSetting;

class CarController extends Controller {
    /**
     * Render the public listing of automobiles with filters.
     */
    public function index(): void {
        $pageModel = new Page();
        $page = $pageModel->findBySlug('automobile');
        if (!$page) {
            $db = \Config\Database::getConnection();
            $db->prepare("INSERT INTO `pages` (`id`, `slug`, `title`, `sections`, `is_published`) VALUES (?, ?, ?, ?, ?)")
               ->execute(['page-automobile', 'automobile', 'Automobile', '["hero", "listings-auto"]', 1]);
            $page = $pageModel->findBySlug('automobile');
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

        $carModel = new Car();
        
        // Capture filters from GET query string
        $filters = [
            'brand' => $_GET['brand'] ?? null,
            'price_max' => $_GET['price_max'] ?? null,
            'fuel' => $_GET['fuel'] ?? null,
            'transmission' => $_GET['transmission'] ?? null,
            'search' => $_GET['search'] ?? null
        ];

        $cars = $carModel->getActiveCars($filters);

        $this->render('automobile/index', [
            'page' => $page,
            'settings' => $settings,
            'sections' => $sections,
            'cars' => $cars,
            'filters' => $filters,
            'seoTitle' => $page['seo_title'] ?? 'Achat et Location Voiture à Abidjan — NOVA',
            'metaDescription' => $page['meta_description'] ?? null
        ], 'layouts/main');
    }

    /**
     * Render the detailed vehicle specifications view.
     */
    public function detail(string $slug): void {
        $carModel = new Car();
        $car = $carModel->findBy('slug', $slug);

        if (!$car || $car['status'] !== 'ACTIVE') {
            header("HTTP/1.0 404 Not Found");
            $this->render('errors/404', ['seoTitle' => 'Annonce non trouvée'], 'layouts/main');
            return;
        }

        // Decode JSON images string
        $images = json_decode($car['images'], true) ?: [];

        $this->render('automobile/detail', [
            'car' => $car,
            'images' => $images,
            'seoTitle' => $car['title'] . ' — NOVA Automobile'
        ], 'layouts/main');
    }
}
