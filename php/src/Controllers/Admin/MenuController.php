<?php
/**
 * NOVA Marketplace — MenuController (Admin CRUD)
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\MenuItem;

class MenuController extends Controller {
    /**
     * Display the menus listing and creation form.
     */
    public function index(): void {
        $menuModel = new MenuItem();
        $menus = $menuModel->all();

        // Sort menus by order
        usort($menus, function($a, $b) {
            return $a['order'] <=> $b['order'];
        });

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/menus/index', [
            'menus' => $menus,
            'csrfToken' => $csrfToken,
            'success' => Session::get('menu_success'),
            'error' => Session::get('menu_error')
        ], 'layouts/admin');

        Session::delete('menu_success');
        Session::delete('menu_error');
    }

    /**
     * Create a new menu item.
     */
    public function create(): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('menu_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/menus');
        }

        $label = trim($_POST['label'] ?? '');
        $href = trim($_POST['href'] ?? '');
        $order = (int)($_POST['order'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        $target = trim($_POST['target'] ?? '_self');

        if (empty($label)) {
            Session::set('menu_error', 'Le libellé est obligatoire.');
            $this->redirect('/admin/menus');
        }

        $menuModel = new MenuItem();
        $created = $menuModel->create([
            'label' => $label,
            'href' => $href,
            'order' => $order,
            'is_active' => $isActive,
            'target' => $target
        ]);

        if ($created) {
            Session::set('menu_success', 'Lien de navigation ajouté avec succès !');
        } else {
            Session::set('menu_error', 'Erreur lors de la création du lien.');
        }

        $this->redirect('/admin/menus');
    }

    /**
     * Show edit form for a menu item.
     */
    public function edit(string $id): void {
        $menuModel = new MenuItem();
        $menu = $menuModel->find($id);

        if (!$menu) {
            Session::set('menu_error', 'Lien non trouvé.');
            $this->redirect('/admin/menus');
        }

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/menus/edit', [
            'menu' => $menu,
            'csrfToken' => $csrfToken
        ], 'layouts/admin');
    }

    /**
     * Update a menu item.
     */
    public function update(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('menu_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/menus');
        }

        $label = trim($_POST['label'] ?? '');
        $href = trim($_POST['href'] ?? '');
        $order = (int)($_POST['order'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        $target = trim($_POST['target'] ?? '_self');

        if (empty($label)) {
            Session::set('menu_error', 'Le libellé est obligatoire.');
            $this->redirect("/admin/menus/edit/{$id}");
        }

        $menuModel = new MenuItem();
        $updated = $menuModel->update($id, [
            'label' => $label,
            'href' => $href,
            'order' => $order,
            'is_active' => $isActive,
            'target' => $target
        ]);

        if ($updated) {
            Session::set('menu_success', 'Lien de navigation mis à jour avec succès !');
            $this->redirect('/admin/menus');
        } else {
            Session::set('menu_error', 'Erreur lors de la mise à jour.');
            $this->redirect("/admin/menus/edit/{$id}");
        }
    }

    /**
     * Delete a menu item.
     */
    public function delete(string $id): void {
        $menuModel = new MenuItem();
        if ($menuModel->delete($id)) {
            Session::set('menu_success', 'Lien de navigation supprimé.');
        } else {
            Session::set('menu_error', 'Impossible de supprimer ce lien.');
        }
        $this->redirect('/admin/menus');
    }
}
