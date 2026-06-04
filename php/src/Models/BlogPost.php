<?php
/**
 * NOVA Marketplace — BlogPost Model
 */

namespace Models;

use Core\Model;
use PDO;

class BlogPost extends Model {
    protected string $table = 'blog_posts';

    /**
     * Get published blog posts with category and search filter.
     * 
     * @param string|null $category
     * @param string|null $search
     * @return array
     */
    public function getPublishedPosts(?string $category = null, ?string $search = null): array {
        $sql = "SELECT * FROM `{$this->table}` WHERE `status` = 'PUBLISHED'";
        $params = [];

        if ($category) {
            $sql .= " AND `category` = :category";
            $params['category'] = $category;
        }

        if ($search) {
            $sql .= " AND (`title` LIKE :search OR `content` LIKE :search_content)";
            $params['search'] = '%' . $search . '%';
            $params['search_content'] = '%' . $search . '%';
        }

        $sql .= " ORDER BY `published_at` DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}
