<?php
/**
 * NOVA Marketplace — Admin PropertyController
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\Property;

class PropertyController extends Controller {
    /**
     * List all properties in admin table.
     */
    public function index(): void {
        $propertyModel = new Property();
        $properties = $propertyModel->all();

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/properties/index', [
            'properties' => $properties,
            'csrfToken' => $csrfToken,
            'success' => Session::get('property_success'),
            'error' => Session::get('property_error')
        ], 'layouts/admin');

        Session::delete('property_success');
        Session::delete('property_error');
    }

    /**
     * Render the creation form.
     */
    public function new(): void {
        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/properties/new', [
            'csrfToken' => $csrfToken,
            'error' => Session::get('property_error')
        ], 'layouts/admin');

        Session::delete('property_error');
    }

    /**
     * Process creation submission.
     */
    public function create(): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('property_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/properties/new');
        }

        $title = trim($_POST['title'] ?? '');
        $price = (int)($_POST['price'] ?? 0);
        $type = $_POST['type'] ?? '';

        if (empty($title) || $price <= 0 || empty($type)) {
            Session::set('property_error', 'Veuillez remplir le titre, le prix et le type.');
            $this->redirect('/admin/properties/new');
        }

        // Generate clean URL slug
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9-]+/', '-', $title)) . '-' . time();

        $propertyModel = new Property();
        $success = $propertyModel->create([
            'id' => uniqid('prop-'),
            'title' => $title,
            'slug' => $slug,
            'description' => $_POST['description'] ?? null,
            'price' => $price,
            'price_type' => $_POST['price_type'] ?? 'SALE',
            'type' => $type,
            'bedrooms' => !empty($_POST['bedrooms']) ? (int)$_POST['bedrooms'] : null,
            'bathrooms' => !empty($_POST['bathrooms']) ? (int)$_POST['bathrooms'] : null,
            'surface' => !empty($_POST['surface']) ? (int)$_POST['surface'] : null,
            'land' => !empty($_POST['land']) ? (int)$_POST['land'] : null,
            'city' => $_POST['city'] ?? null,
            'location' => $_POST['location'] ?? null,
            'district' => $_POST['district'] ?? null,
            'images' => $_POST['images'] ?? '[]',
            'amenities' => $_POST['amenities'] ?? '[]',
            'badge' => $_POST['badge'] ?? null,
            'badge_color' => $_POST['badge_color'] ?? null,
            'status' => $_POST['status'] ?? 'ACTIVE',
            'featured' => isset($_POST['featured']) ? 1 : 0,
            'user_id' => Session::get('user_id'),
            'plan_type' => $_POST['plan_type'] ?? 'GRATUIT'
        ]);

        if ($success) {
            Session::set('property_success', 'Annonce immobilière créée avec succès !');
            $this->redirect('/admin/properties');
        } else {
            Session::set('property_error', 'Une erreur est survenue lors de la création.');
            $this->redirect('/admin/properties/new');
        }
    }

    /**
     * Render the editor form.
     */
    public function edit(string $id): void {
        $propertyModel = new Property();
        $property = $propertyModel->find($id);

        if (!$property) {
            Session::set('property_error', 'Bien immobilier non trouvé.');
            $this->redirect('/admin/properties');
        }

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/properties/edit', [
            'property' => $property,
            'csrfToken' => $csrfToken,
            'error' => Session::get('property_error')
        ], 'layouts/admin');

        Session::delete('property_error');
    }

    /**
     * Process updates.
     */
    public function update(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('property_error', 'Sécurité CSRF invalide.');
            $this->redirect("/admin/properties/edit/{$id}");
        }

        $propertyModel = new Property();
        $property = $propertyModel->find($id);

        if (!$property) {
            Session::set('property_error', 'Bien immobilier non trouvé.');
            $this->redirect('/admin/properties');
        }

        $title = trim($_POST['title'] ?? '');
        $price = (int)($_POST['price'] ?? 0);
        $type = $_POST['type'] ?? '';

        if (empty($title) || $price <= 0 || empty($type)) {
            Session::set('property_error', 'Le titre, le prix et le type sont obligatoires.');
            $this->redirect("/admin/properties/edit/{$id}");
        }

        // Keep or update slug
        $slug = $property['slug'];
        if ($property['title'] !== $title) {
            $slug = strtolower(preg_replace('/[^a-zA-Z0-9-]+/', '-', $title)) . '-' . time();
        }

        $success = $propertyModel->update($id, [
            'title' => $title,
            'slug' => $slug,
            'description' => $_POST['description'] ?? null,
            'price' => $price,
            'price_type' => $_POST['price_type'] ?? 'SALE',
            'type' => $type,
            'bedrooms' => !empty($_POST['bedrooms']) ? (int)$_POST['bedrooms'] : null,
            'bathrooms' => !empty($_POST['bathrooms']) ? (int)$_POST['bathrooms'] : null,
            'surface' => !empty($_POST['surface']) ? (int)$_POST['surface'] : null,
            'land' => !empty($_POST['land']) ? (int)$_POST['land'] : null,
            'city' => $_POST['city'] ?? null,
            'location' => $_POST['location'] ?? null,
            'district' => $_POST['district'] ?? null,
            'images' => $_POST['images'] ?? '[]',
            'amenities' => $_POST['amenities'] ?? '[]',
            'badge' => $_POST['badge'] ?? null,
            'badge_color' => $_POST['badge_color'] ?? null,
            'status' => $_POST['status'] ?? 'ACTIVE',
            'featured' => isset($_POST['featured']) ? 1 : 0,
            'plan_type' => $_POST['plan_type'] ?? 'GRATUIT'
        ]);

        if ($success) {
            Session::set('property_success', 'Annonce immobilière mise à jour avec succès !');
            $this->redirect('/admin/properties');
        } else {
            Session::set('property_error', 'Une erreur est survenue lors de la mise à jour.');
            $this->redirect("/admin/properties/edit/{$id}");
        }
    }

    /**
     * Remove entry.
     */
    public function delete(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('property_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/properties');
        }

        $propertyModel = new Property();
        $success = $propertyModel->delete($id);

        if ($success) {
            Session::set('property_success', 'Annonce supprimée avec succès.');
        } else {
            Session::set('property_error', 'Impossible de supprimer cette annonce.');
        }

        $this->redirect('/admin/properties');
    }
}
