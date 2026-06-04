<?php
/**
 * NOVA Marketplace — PropertyController (Public)
 */

namespace Controllers;

use Core\Controller;
use Models\Property;

class PropertyController extends Controller {
    /**
     * Render the public listing of properties with filters.
     */
    public function index(): void {
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
            'properties' => $properties,
            'filters' => $filters,
            'seoTitle' => 'Achat, Vente et Location Villa, Appartement à Abidjan — NOVA'
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
