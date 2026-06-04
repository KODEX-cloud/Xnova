<?php
/**
 * NOVA Marketplace — ContactMessage Model
 */

namespace Models;

use Core\Model;
use PDO;

class ContactMessage extends Model {
    protected string $table = 'contact_messages';

    /**
     * Create a new contact message entry.
     * 
     * @param array $data
     * @return bool
     */
    public function create(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO `{$this->table}` (`id`, `name`, `email`, `phone`, `subject`, `message`)
            VALUES (:id, :name, :email, :phone, :subject, :message)
        ");

        return $stmt->execute([
            'id' => uniqid('msg-'),
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'subject' => $data['subject'] ?? null,
            'message' => $data['message']
        ]);
    }
}
