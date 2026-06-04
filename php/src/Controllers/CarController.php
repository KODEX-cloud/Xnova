<?php
/**
 * NOVA Marketplace — CarController (Public)
 */

namespace Controllers;

use Core\Controller;
use Models\Car;

class CarController extends Controller {
    /**
     * Render the public listing of automobiles with filters.
     */
    public function index(): void {
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
            'cars' => $cars,
            'filters' => $filters,
            'seoTitle' => 'Achat et Location Voiture à Abidjan — NOVA'
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
