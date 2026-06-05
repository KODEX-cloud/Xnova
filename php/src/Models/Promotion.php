<?php
/**
 * NOVA Marketplace — Promotion Model
 */

namespace Models;

use Core\Model;
use PDO;

class Promotion extends Model {
    protected string $table = 'promotions';

    /**
     * Create a new promotion.
     */
    public function create(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO `{$this->table}` (
                `id`, `title`, `subtitle`, `description`, `image`, `link`, 
                `badge`, `discount`, `countdown`, `cta`, `gradient`, `bg_color`, 
                `is_active`, `expires_at`, `order`
            ) VALUES (
                :id, :title, :subtitle, :description, :image, :link, 
                :badge, :discount, :countdown, :cta, :gradient, :bg_color, 
                :is_active, :expires_at, :order
            )
        ");
        return $stmt->execute([
            'id' => $data['id'] ?? uniqid('promo-'),
            'title' => $data['title'],
            'subtitle' => $data['subtitle'] ?? null,
            'description' => $data['description'] ?? null,
            'image' => $data['image'] ?? null,
            'link' => $data['link'] ?? null,
            'badge' => $data['badge'] ?? null,
            'discount' => $data['discount'] ?? null,
            'countdown' => $data['countdown'] ?? null,
            'cta' => $data['cta'] ?? null,
            'gradient' => $data['gradient'] ?? null,
            'bg_color' => $data['bg_color'] ?? null,
            'is_active' => (int)($data['is_active'] ?? 1),
            'expires_at' => !empty($data['expires_at']) ? $data['expires_at'] : null,
            'order' => (int)($data['order'] ?? 0)
        ]);
    }

    /**
     * Update an existing promotion.
     */
    public function update(string $id, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE `{$this->table}` SET
                `title` = :title,
                `subtitle` = :subtitle,
                `description` = :description,
                `image` = :image,
                `link` = :link,
                `badge` = :badge,
                `discount` = :discount,
                `countdown` = :countdown,
                `cta` = :cta,
                `gradient` = :gradient,
                `bg_color` = :bg_color,
                `is_active` = :is_active,
                `expires_at` = :expires_at,
                `order` = :order
            WHERE `id` = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'title' => $data['title'],
            'subtitle' => $data['subtitle'] ?? null,
            'description' => $data['description'] ?? null,
            'image' => $data['image'] ?? null,
            'link' => $data['link'] ?? null,
            'badge' => $data['badge'] ?? null,
            'discount' => $data['discount'] ?? null,
            'countdown' => $data['countdown'] ?? null,
            'cta' => $data['cta'] ?? null,
            'gradient' => $data['gradient'] ?? null,
            'bg_color' => $data['bg_color'] ?? null,
            'is_active' => (int)($data['is_active'] ?? 1),
            'expires_at' => !empty($data['expires_at']) ? $data['expires_at'] : null,
            'order' => (int)($data['order'] ?? 0)
        ]);
    }
}
