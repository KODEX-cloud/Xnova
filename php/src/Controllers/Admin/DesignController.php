<?php
/**
 * NOVA Marketplace — DesignController
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\SiteSetting;

class DesignController extends Controller {
    /**
     * Display the Design settings page.
     */
    public function index(): void {
        $settingModel = new SiteSetting();
        $settings = $settingModel->getCachedSettings();

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/design/index', [
            'settings' => $settings,
            'csrfToken' => $csrfToken,
            'success' => Session::get('design_success'),
            'error' => Session::get('design_error')
        ], 'layouts/admin');

        // Clear session messages
        Session::delete('design_success');
        Session::delete('design_error');
    }

    /**
     * Update dynamic layout styles, colors, and layout configurations.
     */
    public function update(): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('design_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/design');
        }

        if (isset($_POST['design']) && is_array($_POST['design'])) {
            $settingModel = new SiteSetting();
            
            foreach ($_POST['design'] as $key => $value) {
                // Ensure key is prefixed properly to avoid settings collision
                $settingModel->setSetting('design.' . $key, trim($value));
            }

            Session::set('design_success', 'Paramètres de design mis à jour avec succès !');
        } else {
            Session::set('design_error', 'Aucun paramètre fourni.');
        }

        $this->redirect('/admin/design');
    }
}
