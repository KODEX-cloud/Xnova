<?php
/**
 * NOVA Marketplace — ContactController
 */

namespace Controllers;

use Core\Controller;
use Core\Session;
use Models\ContactMessage;

class ContactController extends Controller {
    /**
     * Display the public contact form page.
     */
    public function index(): void {
        $csrfToken = Session::generateCsrfToken();
        
        $this->render('contact/index', [
            'csrfToken' => $csrfToken,
            'success' => Session::get('contact_success'),
            'error' => Session::get('contact_error'),
            'seoTitle' => 'Contactez-nous — NOVA Marketplace'
        ], 'layouts/main');

        // Clear session messages
        Session::delete('contact_success');
        Session::delete('contact_error');
    }

    /**
     * Process contact form submissions and insert them into database.
     */
    public function send(): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('contact_error', 'Sécurité CSRF invalide.');
            $this->redirect('/contact');
        }

        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $subject = trim($_POST['subject'] ?? '');
        $message = trim($_POST['message'] ?? '');

        if (empty($name) || empty($email) || empty($message)) {
            Session::set('contact_error', 'Veuillez remplir tous les champs obligatoires.');
            $this->redirect('/contact');
        }

        $msgModel = new ContactMessage();
        $success = $msgModel->create([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'subject' => $subject,
            'message' => $message
        ]);

        if ($success) {
            Session::set('contact_success', 'Votre message a été envoyé avec succès ! Nous vous recontacterons sous peu.');
        } else {
            Session::set('contact_error', 'Une erreur technique est survenue lors de l\'enregistrement de votre message.');
        }

        $this->redirect('/contact');
    }
}
