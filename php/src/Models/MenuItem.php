<?php
/**
 * NOVA Marketplace — MenuItem Model
 */

namespace Models;

use Core\Model;
use PDO;

class MenuItem extends Model {
    protected string $table = 'menu_items';

    /**
     * Fetch all active navigation links.
     * 
     * @return array
     */
    public function getActiveNav(): array {
        $stmt = $this->db->query("
            SELECT * FROM `{$this->table}` 
            WHERE is_active = 1 
            ORDER BY `order` ASC
        ");
        return $stmt->fetchAll();
    }

    /**
     * Create a new menu item.
     */
    public function create(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO `{$this->table}` (`id`, `label`, `href`, `icon`, `parent_id`, `order`, `is_active`, `target`)
            VALUES (:id, :label, :href, :icon, :parent_id, :order, :is_active, :target)
        ");
        return $stmt->execute([
            'id' => $data['id'] ?? uniqid('menu-'),
            'label' => $data['label'],
            'href' => $data['href'] ?? '#',
            'icon' => $data['icon'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
            'order' => (int)($data['order'] ?? 0),
            'is_active' => (int)($data['is_active'] ?? 1),
            'target' => $data['target'] ?? '_self'
        ]);
    }

    /**
     * Update an existing menu item.
     */
    public function update(string $id, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE `{$this->table}` SET
                `label` = :label,
                `href` = :href,
                `icon` = :icon,
                `parent_id` = :parent_id,
                `order` = :order,
                `is_active` = :is_active,
                `target` = :target
            WHERE `id` = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'label' => $data['label'],
            'href' => $data['href'] ?? '#',
            'icon' => $data['icon'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
            'order' => (int)($data['order'] ?? 0),
            'is_active' => (int)($data['is_active'] ?? 1),
            'target' => $data['target'] ?? '_self'
        ]);
    }
}
