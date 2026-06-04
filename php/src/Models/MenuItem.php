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
}
