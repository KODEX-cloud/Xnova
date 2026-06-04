<?php
/**
 * NOVA Marketplace — AuthController
 */

namespace Controllers;

use Core\Controller;
use Core\Session;
use Models\User;

class AuthController extends Controller {
    /**
     * Display the login form.
     */
    public function loginForm(): void {
        if (Session::isLoggedIn()) {
            $this->redirect('/admin');
        }
        
        $csrfToken = Session::generateCsrfToken();
        $this->render('auth/login', [
            'seoTitle' => 'Connexion — Administration NOVA',
            'csrfToken' => $csrfToken,
            'error' => Session::get('login_error')
        ], 'layouts/main');
        
        // Clear login errors after rendering
        Session::delete('login_error');
    }

    /**
     * Handle user authentication submission.
     */
    public function login(): void {
        // Validate CSRF token
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('login_error', 'Jeton de sécurité invalide. Veuillez réessayer.');
            $this->redirect('/auth/login');
        }

        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            Session::set('login_error', 'Veuillez remplir tous les champs.');
            $this->redirect('/auth/login');
        }

        $userModel = new User();
        $user = $userModel->findByEmail($email);

        if ($user && $user['is_active'] && password_verify($password, $user['password'])) {
            // Regene session ID for session fixation security
            session_regenerate_id(true);

            Session::set('user_id', $user['id']);
            Session::set('user_email', $user['email']);
            Session::set('user_name', $user['name'] ?? 'Utilisateur');
            Session::set('user_role', $user['role']);
            
            $this->redirect('/admin');
        } else {
            Session::set('login_error', 'Identifiants incorrects ou compte inactif.');
            $this->redirect('/auth/login');
        }
    }

    /**
     * Terminate the session and logout.
     */
    public function logout(): void {
        Session::destroy();
        $this->redirect('/auth/login');
    }
}
