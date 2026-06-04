<?php
/**
 * NOVA Marketplace — Media Model
 */

namespace Models;

use Core\Model;
use PDO;

class Media extends Model {
    protected string $table = 'media';

    /**
     * Fetch all media items ordered by creation date descending.
     * 
     * @return array
     */
    public function getAllDesc(): array {
        $stmt = $this->db->query("SELECT * FROM `{$this->table}` ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    /**
     * Create a new media entry in database.
     * 
     * @param array $data
     * @return bool
     */
    public function create(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO `{$this->table}` (`id`, `url`, `filename`, `mimetype`, `size`, `alt`, `folder`, `width`, `height`)
            VALUES (:id, :url, :filename, :mimetype, :size, :alt, :folder, :width, :height)
        ");
        
        return $stmt->execute([
            'id' => $data['id'] ?? uniqid('med-'),
            'url' => $data['url'],
            'filename' => $data['filename'],
            'mimetype' => $data['mimetype'] ?? null,
            'size' => $data['size'] ?? null,
            'alt' => $data['alt'] ?? null,
            'folder' => $data['folder'] ?? null,
            'width' => $data['width'] ?? null,
            'height' => $data['height'] ?? null
        ]);
    }
}
