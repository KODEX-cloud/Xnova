<?php
/**
 * NOVA Marketplace — ServiceController (Public Services Hub)
 */

namespace Controllers;

use Core\Controller;
use Models\Page;
use Models\SiteSetting;

class ServiceController extends Controller {
    /**
     * Get the static reference data for NOVA services.
     */
    private function getServicesData(): array {
        return [
            [
                'id' => 'location-voiture',
                'title' => 'Location de Voiture',
                'category' => 'automobile',
                'subtitle' => 'Louez à court ou long terme à Abidjan',
                'description' => 'Profitez de notre large flotte de véhicules récents (citadines, SUV, berlines) pour tous vos déplacements professionnels ou personnels en Côte d\'Ivoire.',
                'image' => '/assets/img/default-car.jpg'
            ],
            [
                'id' => 'flotte',
                'title' => 'Gestion de Flotte',
                'category' => 'automobile',
                'subtitle' => 'Optimisation logistique pour entreprises',
                'description' => 'Confiez la gestion opérationnelle et technique de vos véhicules d\'entreprise à des experts : suivi maintenance, géolocalisation, et chauffeurs qualifiés.',
                'image' => '/assets/img/default-car.jpg'
            ],
            [
                'id' => 'pieces-auto',
                'title' => 'Vente de Pièces Auto',
                'category' => 'automobile',
                'subtitle' => 'Pièces d\'origine et certifiées',
                'description' => 'Un grand choix de pièces de rechange d\'origine pour toutes les grandes marques automobiles, importées directement avec garantie constructeur.',
                'image' => '/assets/img/default-car.jpg'
            ],
            [
                'id' => 'achat-vente-immo',
                'title' => 'Achat & Vente Immobilier',
                'category' => 'immobilier',
                'subtitle' => 'Trouvez ou vendez votre bien à Abidjan',
                'description' => 'Accompagnement personnalisé pour l\'achat ou la revente de vos appartements, duplex, immeubles de rapport, bureaux ou terrains titrés.',
                'image' => '/assets/img/default-property.jpg'
            ],
            [
                'id' => 'location-immo',
                'title' => 'Location Immobilier',
                'category' => 'immobilier',
                'subtitle' => 'Trouvez votre futur chez-vous',
                'description' => 'Sélection rigoureuse de biens immobiliers résidentiels et commerciaux disponibles à la location dans toutes les communes d\'Abidjan.',
                'image' => '/assets/img/default-property.jpg'
            ]
        ];
    }

    /**
     * Display the services hub listing page.
     */
    public function index(): void {
        $pageModel = new Page();
        $page = $pageModel->findBySlug('services');
        if (!$page) {
            $db = \Config\Database::getConnection();
            $db->prepare("INSERT INTO `pages` (`id`, `slug`, `title`, `sections`, `is_published`) VALUES (?, ?, ?, ?, ?)")
               ->execute(['page-services', 'services', 'Nos Services', '["hero", "services-list"]', 1]);
            $page = $pageModel->findBySlug('services');
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

        $services = $this->getServicesData();

        $this->render('services/index', [
            'page' => $page,
            'settings' => $settings,
            'sections' => $sections,
            'services' => $services,
            'seoTitle' => $page['seo_title'] ?? 'Nos Services Premium — Automobile & Immobilier NOVA',
            'metaDescription' => $page['meta_description'] ?? null
        ], 'layouts/main');
    }

    /**
     * Display a single service details.
     */
    public function detail(string $id): void {
        $services = $this->getServicesData();
        $service = null;
        foreach ($services as $s) {
            if ($s['id'] === $id) {
                $service = $s;
                break;
            }
        }

        if (!$service) {
            header("HTTP/1.0 404 Not Found");
            $this->render('errors/404', ['seoTitle' => 'Service non trouvé'], 'layouts/main');
            return;
        }

        $pageModel = new Page();
        $slug = 'services/' . $id;
        $page = $pageModel->findBySlug($slug);
        if (!$page) {
            $db = \Config\Database::getConnection();
            $db->prepare("INSERT INTO `pages` (`id`, `slug`, `title`, `sections`, `is_published`) VALUES (?, ?, ?, ?, ?)")
               ->execute(['page-' . $id, $slug, $service['title'], '["hero", "service-detail"]', 1]);
            $page = $pageModel->findBySlug($slug);
        }

        $settingModel = new SiteSetting();
        $settings = $settingModel->getCachedSettings();

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

        $this->render('services/detail', [
            'page' => $page,
            'settings' => $settings,
            'sections' => $sections,
            'service' => $service,
            'seoTitle' => $page['seo_title'] ?? ($service['title'] . ' — Services NOVA'),
            'metaDescription' => $page['meta_description'] ?? null
        ], 'layouts/main');
    }
}
