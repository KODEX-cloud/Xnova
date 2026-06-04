<?php
/**
 * NOVA Marketplace — Page Model
 */

namespace Models;

use Core\Model;
use PDO;

class Page extends Model {
    protected string $table = 'pages';

    /**
     * Find a page by its slug.
     * 
     * @param string $slug
     * @return array|null
     */
    public function findBySlug(string $slug): ?array {
        return $this->findBy('slug', $slug);
    }

    /**
     * Update the sections config JSON for a page.
     * 
     * @param string $id
     * @param array $sectionsArray
     * @return bool
     */
    public function updateSections(string $id, array $sectionsArray): bool {
        $sectionsJson = json_encode($sectionsArray, JSON_UNESCAPED_UNICODE);
        $stmt = $this->db->prepare("UPDATE `{$this->table}` SET sections = :sections WHERE id = :id");
        return $stmt->execute([
            'sections' => $sectionsJson,
            'id' => $id
        ]);
    }
}
