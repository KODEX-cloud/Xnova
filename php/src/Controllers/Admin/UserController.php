<?php
/**
 * NOVA Marketplace — UserController (Admin User Management)
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\User;

class UserController extends Controller {
    /**
     * Display a list of all registered users.
     */
    public function index(): void {
        $userModel = new User();
        $users = $userModel->all();

        // Sort by name or email
        usort($users, function($a, $b) {
            return strcasecmp($a['email'], $b['email']);
        });

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/users/index', [
            'users' => $users,
            'csrfToken' => $csrfToken,
            'success' => Session::get('user_success'),
            'error' => Session::get('user_error')
        ], 'layouts/admin');

        Session::delete('user_success');
        Session::delete('user_error');
    }

    /**
     * Edit user details (role and active status).
     */
    public function edit(string $id): void {
        $userModel = new User();
        $user = $userModel->find($id);

        if (!$user) {
            Session::set('user_error', 'Utilisateur non trouvé.');
            $this->redirect('/admin/users');
        }

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/users/edit', [
            'user' => $user,
            'csrfToken' => $csrfToken
        ], 'layouts/admin');
    }

    /**
     * Update user details in the database.
     */
    public function update(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('user_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/users');
        }

        $role = trim($_POST['role'] ?? 'USER');
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        $userType = trim($_POST['user_type'] ?? 'VENDEUR');
        $subscriptionPlan = trim($_POST['subscription_plan'] ?? 'FREE');

        // Roles validation
        $validRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AGENT_AUTO', 'AGENT_IMMO', 'USER'];
        if (!in_array($role, $validRoles)) {
            Session::set('user_error', 'Rôle non valide.');
            $this->redirect("/admin/users/edit/{$id}");
        }

        // Prevent admin from disabling themselves
        $currentUserId = Session::get('user_id');
        if ($currentUserId === $id && $isActive === 0) {
            Session::set('user_error', 'Vous ne pouvez pas désactiver votre propre compte.');
            $this->redirect("/admin/users/edit/{$id}");
        }

        $db = \Config\Database::getConnection();
        $stmt = $db->prepare("
            UPDATE `users` SET 
                role = :role, 
                is_active = :is_active,
                user_type = :user_type,
                subscription_plan = :sub_plan
            WHERE id = :id
        ");
        
        $updated = $stmt->execute([
            'role' => $role,
            'is_active' => $isActive,
            'user_type' => $userType,
            'sub_plan' => $subscriptionPlan,
            'id' => $id
        ]);

        if ($updated) {
            Session::set('user_success', 'Profil utilisateur mis à jour.');
            $this->redirect('/admin/users');
        } else {
            Session::set('user_error', 'Erreur lors de la mise à jour.');
            $this->redirect("/admin/users/edit/{$id}");
        }
    }

    /**
     * Delete user account.
     */
    public function delete(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('user_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/users');
        }

        $currentUserId = Session::get('user_id');
        if ($currentUserId === $id) {
            Session::set('user_error', 'Vous ne pouvez pas supprimer votre propre compte.');
            $this->redirect('/admin/users');
        }

        $userModel = new User();
        if ($userModel->delete($id)) {
            Session::set('user_success', 'Utilisateur supprimé avec succès.');
        } else {
            Session::set('user_error', 'Erreur lors de la suppression de l\'utilisateur.');
        }

        $this->redirect('/admin/users');
    }
}
