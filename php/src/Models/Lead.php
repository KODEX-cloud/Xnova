<?php
/**
 * NOVA Marketplace — Lead Model
 */

namespace Models;

use Core\Model;
use PDO;

class Lead extends Model {
    protected string $table = 'leads';

    /**
     * Create a new lead.
     */
    public function create(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO `{$this->table}` (
                `id`, `type`, `name`, `email`, `phone`, `subject`, `message`, 
                `source`, `listing_type`, `listing_id`, `is_read`
            ) VALUES (
                :id, :type, :name, :email, :phone, :subject, :message, 
                :source, :listing_type, :listing_id, :is_read
            )
        ");
        return $stmt->execute([
            'id' => $data['id'] ?? uniqid('lead-'),
            'type' => $data['type'] ?? 'CONTACT',
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'subject' => $data['subject'] ?? null,
            'message' => $data['message'] ?? null,
            'source' => $data['source'] ?? null,
            'listing_type' => $data['listing_type'] ?? null,
            'listing_id' => $data['listing_id'] ?? null,
            'is_read' => (int)($data['is_read'] ?? 0)
        ]);
    }

    /**
     * Mark a lead as read/unread.
     */
    public function toggleRead(string $id, bool $isRead = true): bool {
        $stmt = $this->db->prepare("UPDATE `{$this->table}` SET is_read = :is_read WHERE id = :id");
        return $stmt->execute([
            'is_read' => $isRead ? 1 : 0,
            'id' => $id
        ]);
    }
}
