<?php
/**
 * NOVA Marketplace — PromotionController (Admin CRUD)
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\Promotion;

class PromotionController extends Controller {
    /**
     * Display promotions list.
     */
    public function index(): void {
        $promoModel = new Promotion();
        $promotions = $promoModel->all();

        // Sort by order ascending
        usort($promotions, function($a, $b) {
            return $a['order'] <=> $b['order'];
        });

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/promotions/index', [
            'promotions' => $promotions,
            'csrfToken' => $csrfToken,
            'success' => Session::get('promo_success'),
            'error' => Session::get('promo_error')
        ], 'layouts/admin');

        Session::delete('promo_success');
        Session::delete('promo_error');
    }

    /**
     * Show form to create promotion.
     */
    public function new(): void {
        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/promotions/new', [
            'csrfToken' => $csrfToken
        ], 'layouts/admin');
    }

    /**
     * Create a new promotion in database.
     */
    public function create(): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('promo_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/promotions');
        }

        $title = trim($_POST['title'] ?? '');
        $subtitle = trim($_POST['subtitle'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $link = trim($_POST['link'] ?? '');
        $badge = trim($_POST['badge'] ?? '');
        $discount = trim($_POST['discount'] ?? '');
        $countdown = trim($_POST['countdown'] ?? '');
        $cta = trim($_POST['cta'] ?? '');
        $gradient = trim($_POST['gradient'] ?? '');
        $bgColor = trim($_POST['bg_color'] ?? '');
        $image = trim($_POST['image'] ?? '');
        $order = (int)($_POST['order'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        $expiresAt = trim($_POST['expires_at'] ?? '');

        if (empty($title)) {
            Session::set('promo_error', 'Le titre de la promotion est obligatoire.');
            $this->redirect('/admin/promotions/new');
        }

        $promoModel = new Promotion();
        $created = $promoModel->create([
            'title' => $title,
            'subtitle' => $subtitle,
            'description' => $description,
            'link' => $link,
            'badge' => $badge,
            'discount' => $discount,
            'countdown' => $countdown,
            'cta' => $cta,
            'gradient' => $gradient,
            'bg_color' => $bgColor,
            'image' => $image,
            'order' => $order,
            'is_active' => $isActive,
            'expires_at' => $expiresAt
        ]);

        if ($created) {
            Session::set('promo_success', 'Promotion créée avec succès !');
            $this->redirect('/admin/promotions');
        } else {
            Session::set('promo_error', 'Erreur lors de la création de la promotion.');
            $this->redirect('/admin/promotions/new');
        }
    }

    /**
     * Show edit form for promotion.
     */
    public function edit(string $id): void {
        $promoModel = new Promotion();
        $promotion = $promoModel->find($id);

        if (!$promotion) {
            Session::set('promo_error', 'Promotion non trouvée.');
            $this->redirect('/admin/promotions');
        }

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/promotions/edit', [
            'promotion' => $promotion,
            'csrfToken' => $csrfToken
        ], 'layouts/admin');
    }

    /**
     * Update an existing promotion.
     */
    public function update(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('promo_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/promotions');
        }

        $title = trim($_POST['title'] ?? '');
        $subtitle = trim($_POST['subtitle'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $link = trim($_POST['link'] ?? '');
        $badge = trim($_POST['badge'] ?? '');
        $discount = trim($_POST['discount'] ?? '');
        $countdown = trim($_POST['countdown'] ?? '');
        $cta = trim($_POST['cta'] ?? '');
        $gradient = trim($_POST['gradient'] ?? '');
        $bgColor = trim($_POST['bg_color'] ?? '');
        $image = trim($_POST['image'] ?? '');
        $order = (int)($_POST['order'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        $expiresAt = trim($_POST['expires_at'] ?? '');

        if (empty($title)) {
            Session::set('promo_error', 'Le titre est obligatoire.');
            $this->redirect("/admin/promotions/edit/{$id}");
        }

        $promoModel = new Promotion();
        $updated = $promoModel->update($id, [
            'title' => $title,
            'subtitle' => $subtitle,
            'description' => $description,
            'link' => $link,
            'badge' => $badge,
            'discount' => $discount,
            'countdown' => $countdown,
            'cta' => $cta,
            'gradient' => $gradient,
            'bg_color' => $bgColor,
            'image' => $image,
            'order' => $order,
            'is_active' => $isActive,
            'expires_at' => $expiresAt
        ]);

        if ($updated) {
            Session::set('promo_success', 'Promotion mise à jour avec succès !');
            $this->redirect('/admin/promotions');
        } else {
            Session::set('promo_error', 'Erreur lors de la modification.');
            $this->redirect("/admin/promotions/edit/{$id}");
        }
    }

    /**
     * Delete promotion.
     */
    public function delete(string $id): void {
        $promoModel = new Promotion();
        if ($promoModel->delete($id)) {
            Session::set('promo_success', 'Promotion supprimée avec succès.');
        } else {
            Session::set('promo_error', 'Impossible de supprimer cette promotion.');
        }
        $this->redirect('/admin/promotions');
    }
}
