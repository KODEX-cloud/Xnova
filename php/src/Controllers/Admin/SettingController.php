<?php
/**
 * NOVA Marketplace — SettingController (Admin Global Configuration)
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\SiteSetting;

class SettingController extends Controller {
    /**
     * Display the settings configuration form.
     */
    public function index(): void {
        $settingModel = new SiteSetting();
        $settings = $settingModel->getCachedSettings();

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/settings/index', [
            'settings' => $settings,
            'csrfToken' => $csrfToken,
            'success' => Session::get('setting_success'),
            'error' => Session::get('setting_error')
        ], 'layouts/admin');

        Session::delete('setting_success');
        Session::delete('setting_error');
    }

    /**
     * Update global settings values.
     */
    public function update(): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('setting_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/settings');
        }

        $settingModel = new SiteSetting();

        if (isset($_POST['settings']) && is_array($_POST['settings'])) {
            foreach ($_POST['settings'] as $key => $value) {
                // Ensure we only update valid configuration prefixes to prevent injection
                $cleanKey = preg_replace('/[^a-zA-Z0-9\._-]/', '', $key);
                $settingModel->setSetting($cleanKey, $value);
            }
            Session::set('setting_success', 'Paramètres globaux mis à jour avec succès !');
        } else {
            Session::set('setting_error', 'Aucun paramètre fourni.');
        }

        $this->redirect('/admin/settings');
    }
}
