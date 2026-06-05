<?php
/**
 * NOVA Marketplace — TestimonialController (Admin CRUD)
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\Testimonial;

class TestimonialController extends Controller {
    /**
     * Display listing of testimonials.
     */
    public function index(): void {
        $testimonialModel = new Testimonial();
        $testimonials = $testimonialModel->all();

        // Sort by order ascending
        usort($testimonials, function($a, $b) {
            return $a['order'] <=> $b['order'];
        });

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/testimonials/index', [
            'testimonials' => $testimonials,
            'csrfToken' => $csrfToken,
            'success' => Session::get('testimonial_success'),
            'error' => Session::get('testimonial_error')
        ], 'layouts/admin');

        Session::delete('testimonial_success');
        Session::delete('testimonial_error');
    }

    /**
     * Show form to create testimonial.
     */
    public function new(): void {
        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/testimonials/new', [
            'csrfToken' => $csrfToken
        ], 'layouts/admin');
    }

    /**
     * Create a new testimonial in DB.
     */
    public function create(): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('testimonial_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/testimonials');
        }

        $name = trim($_POST['name'] ?? '');
        $role = trim($_POST['role'] ?? '');
        $company = trim($_POST['company'] ?? '');
        $content = trim($_POST['content'] ?? '');
        $rating = (int)($_POST['rating'] ?? 5);
        $order = (int)($_POST['order'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        $avatar = trim($_POST['avatar'] ?? '');

        if (empty($name) || empty($content)) {
            Session::set('testimonial_error', 'Le nom et le témoignage sont obligatoires.');
            $this->redirect('/admin/testimonials/new');
        }

        $testimonialModel = new Testimonial();
        $created = $testimonialModel->create([
            'name' => $name,
            'role' => $role,
            'company' => $company,
            'content' => $content,
            'rating' => $rating,
            'order' => $order,
            'is_active' => $isActive,
            'avatar' => $avatar
        ]);

        if ($created) {
            Session::set('testimonial_success', 'Témoignage ajouté avec succès !');
            $this->redirect('/admin/testimonials');
        } else {
            Session::set('testimonial_error', 'Erreur lors de la création du témoignage.');
            $this->redirect('/admin/testimonials/new');
        }
    }

    /**
     * Show edit form for testimonial.
     */
    public function edit(string $id): void {
        $testimonialModel = new Testimonial();
        $testimonial = $testimonialModel->find($id);

        if (!$testimonial) {
            Session::set('testimonial_error', 'Témoignage non trouvé.');
            $this->redirect('/admin/testimonials');
        }

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/testimonials/edit', [
            'testimonial' => $testimonial,
            'csrfToken' => $csrfToken
        ], 'layouts/admin');
    }

    /**
     * Update an existing testimonial.
     */
    public function update(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('testimonial_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/testimonials');
        }

        $name = trim($_POST['name'] ?? '');
        $role = trim($_POST['role'] ?? '');
        $company = trim($_POST['company'] ?? '');
        $content = trim($_POST['content'] ?? '');
        $rating = (int)($_POST['rating'] ?? 5);
        $order = (int)($_POST['order'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        $avatar = trim($_POST['avatar'] ?? '');

        if (empty($name) || empty($content)) {
            Session::set('testimonial_error', 'Le nom et le témoignage sont obligatoires.');
            $this->redirect("/admin/testimonials/edit/{$id}");
        }

        $testimonialModel = new Testimonial();
        $updated = $testimonialModel->update($id, [
            'name' => $name,
            'role' => $role,
            'company' => $company,
            'content' => $content,
            'rating' => $rating,
            'order' => $order,
            'is_active' => $isActive,
            'avatar' => $avatar
        ]);

        if ($updated) {
            Session::set('testimonial_success', 'Témoignage mis à jour avec succès !');
            $this->redirect('/admin/testimonials');
        } else {
            Session::set('testimonial_error', 'Erreur lors de la modification.');
            $this->redirect("/admin/testimonials/edit/{$id}");
        }
    }

    /**
     * Delete testimonial.
     */
    public function delete(string $id): void {
        $testimonialModel = new Testimonial();
        if ($testimonialModel->delete($id)) {
            Session::set('testimonial_success', 'Témoignage supprimé avec succès.');
        } else {
            Session::set('testimonial_error', 'Impossible de supprimer ce témoignage.');
        }
        $this->redirect('/admin/testimonials');
    }
}
