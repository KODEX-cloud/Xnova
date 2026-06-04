<?php
/**
 * NOVA Marketplace — Admin CarController
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\Car;

class CarController extends Controller {
    /**
     * List all automobiles in admin table.
     */
    public function index(): void {
        $carModel = new Car();
        $cars = $carModel->all();

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/cars/index', [
            'cars' => $cars,
            'csrfToken' => $csrfToken,
            'success' => Session::get('car_success'),
            'error' => Session::get('car_error')
        ], 'layouts/admin');

        Session::delete('car_success');
        Session::delete('car_error');
    }

    /**
     * Render the creation form.
     */
    public function new(): void {
        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/cars/new', [
            'csrfToken' => $csrfToken,
            'error' => Session::get('car_error')
        ], 'layouts/admin');
        
        Session::delete('car_error');
    }

    /**
     * Process creation submission.
     */
    public function create(): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('car_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/cars/new');
        }

        $title = trim($_POST['title'] ?? '');
        $price = (int)($_POST['price'] ?? 0);
        
        if (empty($title) || $price <= 0) {
            Session::set('car_error', 'Veuillez remplir le titre et le prix.');
            $this->redirect('/admin/cars/new');
        }

        // Generate clean URL slug from title
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9-]+/', '-', $title)) . '-' . time();

        $carModel = new Car();
        $success = $carModel->create([
            'id' => uniqid('car-'),
            'title' => $title,
            'slug' => $slug,
            'description' => $_POST['description'] ?? null,
            'price' => $price,
            'price_type' => $_POST['price_type'] ?? 'SALE',
            'year' => !empty($_POST['year']) ? (int)$_POST['year'] : null,
            'mileage' => !empty($_POST['mileage']) ? (int)$_POST['mileage'] : null,
            'fuel' => $_POST['fuel'] ?? null,
            'transmission' => $_POST['transmission'] ?? null,
            'color' => $_POST['color'] ?? null,
            'brand' => $_POST['brand'] ?? null,
            'model' => $_POST['model'] ?? null,
            'city' => $_POST['city'] ?? null,
            'location' => $_POST['location'] ?? null,
            'images' => $_POST['images'] ?? '[]',
            'category' => $_POST['category'] ?? null,
            'condition' => $_POST['condition'] ?? null,
            'badge' => $_POST['badge'] ?? null,
            'badge_color' => $_POST['badge_color'] ?? null,
            'status' => $_POST['status'] ?? 'ACTIVE',
            'featured' => isset($_POST['featured']) ? 1 : 0,
            'user_id' => Session::get('user_id'),
            'plan_type' => $_POST['plan_type'] ?? 'GRATUIT'
        ]);

        if ($success) {
            Session::set('car_success', 'Annonce de voiture créée avec succès !');
            $this->redirect('/admin/cars');
        } else {
            Session::set('car_error', 'Une erreur est survenue lors de la création.');
            $this->redirect('/admin/cars/new');
        }
    }

    /**
     * Render the editor form.
     */
    public function edit(string $id): void {
        $carModel = new Car();
        $car = $carModel->find($id);

        if (!$car) {
            Session::set('car_error', 'Véhicule non trouvé.');
            $this->redirect('/admin/cars');
        }

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/cars/edit', [
            'car' => $car,
            'csrfToken' => $csrfToken,
            'error' => Session::get('car_error')
        ], 'layouts/admin');

        Session::delete('car_error');
    }

    /**
     * Process updates.
     */
    public function update(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('car_error', 'Sécurité CSRF invalide.');
            $this->redirect("/admin/cars/edit/{$id}");
        }

        $carModel = new Car();
        $car = $carModel->find($id);

        if (!$car) {
            Session::set('car_error', 'Véhicule non trouvé.');
            $this->redirect('/admin/cars');
        }

        $title = trim($_POST['title'] ?? '');
        $price = (int)($_POST['price'] ?? 0);

        if (empty($title) || $price <= 0) {
            Session::set('car_error', 'Le titre et le prix sont obligatoires.');
            $this->redirect("/admin/cars/edit/{$id}");
        }

        // Keep or update slug
        $slug = $car['slug'];
        if ($car['title'] !== $title) {
            $slug = strtolower(preg_replace('/[^a-zA-Z0-9-]+/', '-', $title)) . '-' . time();
        }

        $success = $carModel->update($id, [
            'title' => $title,
            'slug' => $slug,
            'description' => $_POST['description'] ?? null,
            'price' => $price,
            'price_type' => $_POST['price_type'] ?? 'SALE',
            'year' => !empty($_POST['year']) ? (int)$_POST['year'] : null,
            'mileage' => !empty($_POST['mileage']) ? (int)$_POST['mileage'] : null,
            'fuel' => $_POST['fuel'] ?? null,
            'transmission' => $_POST['transmission'] ?? null,
            'color' => $_POST['color'] ?? null,
            'brand' => $_POST['brand'] ?? null,
            'model' => $_POST['model'] ?? null,
            'city' => $_POST['city'] ?? null,
            'location' => $_POST['location'] ?? null,
            'images' => $_POST['images'] ?? '[]',
            'category' => $_POST['category'] ?? null,
            'condition' => $_POST['condition'] ?? null,
            'badge' => $_POST['badge'] ?? null,
            'badge_color' => $_POST['badge_color'] ?? null,
            'status' => $_POST['status'] ?? 'ACTIVE',
            'featured' => isset($_POST['featured']) ? 1 : 0,
            'plan_type' => $_POST['plan_type'] ?? 'GRATUIT'
        ]);

        if ($success) {
            Session::set('car_success', 'Annonce de voiture mise à jour avec succès !');
            $this->redirect('/admin/cars');
        } else {
            Session::set('car_error', 'Une erreur est survenue lors de la mise à jour.');
            $this->redirect("/admin/cars/edit/{$id}");
        }
    }

    /**
     * Remove entry.
     */
    public function delete(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('car_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/cars');
        }

        $carModel = new Car();
        $success = $carModel->delete($id);

        if ($success) {
            Session::set('car_success', 'Annonce supprimée avec succès.');
        } else {
            Session::set('car_error', 'Impossible de supprimer cette annonce.');
        }

        $this->redirect('/admin/cars');
    }
}
