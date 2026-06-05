<?php
/**
 * NOVA Marketplace — Testimonial Model
 */

namespace Models;

use Core\Model;
use PDO;

class Testimonial extends Model {
    protected string $table = 'testimonials';

    /**
     * Create a new testimonial.
     */
    public function create(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO `{$this->table}` (`id`, `name`, `role`, `company`, `avatar`, `content`, `rating`, `is_active`, `order`)
            VALUES (:id, :name, :role, :company, :avatar, :content, :rating, :is_active, :order)
        ");
        return $stmt->execute([
            'id' => $data['id'] ?? uniqid('test-'),
            'name' => $data['name'],
            'role' => $data['role'] ?? null,
            'company' => $data['company'] ?? null,
            'avatar' => $data['avatar'] ?? null,
            'content' => $data['content'],
            'rating' => (int)($data['rating'] ?? 5),
            'is_active' => (int)($data['is_active'] ?? 1),
            'order' => (int)($data['order'] ?? 0)
        ]);
    }

    /**
     * Update an existing testimonial.
     */
    public function update(string $id, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE `{$this->table}` SET
                `name` = :name,
                `role` = :role,
                `company` = :company,
                `avatar` = :avatar,
                `content` = :content,
                `rating` = :rating,
                `is_active` = :is_active,
                `order` = :order
            WHERE `id` = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'role' => $data['role'] ?? null,
            'company' => $data['company'] ?? null,
            'avatar' => $data['avatar'] ?? null,
            'content' => $data['content'],
            'rating' => (int)($data['rating'] ?? 5),
            'is_active' => (int)($data['is_active'] ?? 1),
            'order' => (int)($data['order'] ?? 0)
        ]);
    }
}
