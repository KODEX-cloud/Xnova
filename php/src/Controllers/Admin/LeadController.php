<?php
/**
 * NOVA Marketplace — LeadController (Admin Leads Inbox)
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\Lead;
use Models\ContactMessage;

class LeadController extends Controller {
    /**
     * Display both contact messages and specific listing inquiries/leads.
     */
    public function index(): void {
        $leadModel = new Lead();
        $leads = $leadModel->all();

        // Sort leads by created_at desc
        usort($leads, function($a, $b) {
            return strtotime($b['created_at']) <=> strtotime($a['created_at']);
        });

        // Fetch contact messages
        $contactMessageModel = new ContactMessage();
        $contactMessages = $contactMessageModel->all();
        
        usort($contactMessages, function($a, $b) {
            return strtotime($b['created_at']) <=> strtotime($a['created_at']);
        });

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/leads/index', [
            'leads' => $leads,
            'contactMessages' => $contactMessages,
            'csrfToken' => $csrfToken,
            'success' => Session::get('lead_success'),
            'error' => Session::get('lead_error')
        ], 'layouts/admin');

        Session::delete('lead_success');
        Session::delete('lead_error');
    }

    /**
     * View lead details and mark it as read.
     */
    public function view(string $id): void {
        $leadModel = new Lead();
        $lead = $leadModel->find($id);

        if (!$lead) {
            // Check if it is a contact message instead
            $contactMessageModel = new ContactMessage();
            $lead = $contactMessageModel->find($id);
            if ($lead) {
                // Mark contact message as read
                $db = \Config\Database::getConnection();
                $stmt = $db->prepare("UPDATE `contact_messages` SET is_read = 1 WHERE id = :id");
                $stmt->execute(['id' => $id]);
                $lead['is_contact_message'] = true;
            }
        } else {
            // Mark lead as read
            $leadModel->toggleRead($id, true);
            $lead['is_contact_message'] = false;
        }

        if (!$lead) {
            Session::set('lead_error', 'Lead ou message non trouvé.');
            $this->redirect('/admin/leads');
        }

        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/leads/view', [
            'lead' => $lead,
            'csrfToken' => $csrfToken
        ], 'layouts/admin');
    }

    /**
     * Toggle read status manually.
     */
    public function toggle(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('lead_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/leads');
        }

        $leadModel = new Lead();
        $lead = $leadModel->find($id);

        if ($lead) {
            $newStatus = $lead['is_read'] ? 0 : 1;
            $leadModel->toggleRead($id, (bool)$newStatus);
            Session::set('lead_success', 'Statut de lecture mis à jour.');
        } else {
            // Try contact message
            $contactMessageModel = new ContactMessage();
            $msg = $contactMessageModel->find($id);
            if ($msg) {
                $newStatus = $msg['is_read'] ? 0 : 1;
                $db = \Config\Database::getConnection();
                $stmt = $db->prepare("UPDATE `contact_messages` SET is_read = :is_read WHERE id = :id");
                $stmt->execute(['is_read' => $newStatus, 'id' => $id]);
                Session::set('lead_success', 'Statut de lecture mis à jour.');
            } else {
                Session::set('lead_error', 'Introuvable.');
            }
        }

        $this->redirect('/admin/leads');
    }

    /**
     * Delete a lead.
     */
    public function delete(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('lead_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/leads');
        }

        $leadModel = new Lead();
        if ($leadModel->delete($id)) {
            Session::set('lead_success', 'Lead supprimé.');
        } else {
            // Try deleting from contact messages
            $contactMessageModel = new ContactMessage();
            if ($contactMessageModel->delete($id)) {
                Session::set('lead_success', 'Message de contact supprimé.');
            } else {
                Session::set('lead_error', 'Impossible de supprimer.');
            }
        }

        $this->redirect('/admin/leads');
    }
}
