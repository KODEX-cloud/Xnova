<?php
/**
 * NOVA Marketplace — Property Model
 */

namespace Models;

use Core\Model;
use PDO;

class Property extends Model {
    protected string $table = 'properties';

    /**
     * Get active properties with filters.
     * 
     * @param array $filters
     * @return array
     */
    public function getActiveProperties(array $filters = []): array {
        $sql = "SELECT p.*, u.name as owner_name, u.phone as owner_phone 
                FROM `{$this->table}` p
                LEFT JOIN `users` u ON p.user_id = u.id
                WHERE p.status = 'ACTIVE'";
        
        $params = [];

        if (!empty($filters['type'])) {
            $sql .= " AND p.type = :type";
            $params['type'] = $filters['type'];
        }

        if (!empty($filters['price_max'])) {
            $sql .= " AND p.price <= :price_max";
            $params['price_max'] = (int)$filters['price_max'];
        }

        if (!empty($filters['bedrooms'])) {
            $sql .= " AND p.bedrooms = :bedrooms";
            $params['bedrooms'] = (int)$filters['bedrooms'];
        }

        if (!empty($filters['city'])) {
            $sql .= " AND p.city = :city";
            $params['city'] = $filters['city'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (p.title LIKE :search OR p.description LIKE :search_desc)";
            $params['search'] = '%' . $filters['search'] . '%';
            $params['search_desc'] = '%' . $filters['search'] . '%';
        }

        // Ordered by featured first, then publication date
        $sql .= " ORDER BY p.featured DESC, p.created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Create a new property entry.
     * 
     * @param array $data
     * @return bool
     */
    public function create(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO `{$this->table}` (
                `id`, `title`, `slug`, `description`, `price`, `price_type`, `type`, `bedrooms`, 
                `bathrooms`, `surface`, `land`, `city`, `location`, `district`, `images`, `amenities`, 
                `badge`, `badge_color`, `status`, `featured`, `user_id`, `plan_type`
            ) VALUES (
                :id, :title, :slug, :description, :price, :price_type, :type, :bedrooms, 
                :bathrooms, :surface, :land, :city, :location, :district, :images, :amenities, 
                :badge, :badge_color, :status, :featured, :user_id, :plan_type
            )
        ");

        return $stmt->execute([
            'id' => $data['id'] ?? uniqid('prop-'),
            'title' => $data['title'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'price_type' => $data['price_type'] ?? 'SALE',
            'type' => $data['type'],
            'bedrooms' => $data['bedrooms'] ?? null,
            'bathrooms' => $data['bathrooms'] ?? null,
            'surface' => $data['surface'] ?? null,
            'land' => $data['land'] ?? null,
            'city' => $data['city'] ?? null,
            'location' => $data['location'] ?? null,
            'district' => $data['district'] ?? null,
            'images' => $data['images'] ?? '[]',
            'amenities' => $data['amenities'] ?? '[]',
            'badge' => $data['badge'] ?? null,
            'badge_color' => $data['badge_color'] ?? null,
            'status' => $data['status'] ?? 'ACTIVE',
            'featured' => $data['featured'] ?? 0,
            'user_id' => $data['user_id'] ?? null,
            'plan_type' => $data['plan_type'] ?? 'GRATUIT'
        ]);
    }

    /**
     * Update an existing property entry.
     * 
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE `{$this->table}` SET
                `title` = :title,
                `slug` = :slug,
                `description` = :description,
                `price` = :price,
                `price_type` = :price_type,
                `type` = :type,
                `bedrooms` = :bedrooms,
                `bathrooms` = :bathrooms,
                `surface` = :surface,
                `land` = :land,
                `city` = :city,
                `location` = :location,
                `district` = :district,
                `images` = :images,
                `amenities` = :amenities,
                `badge` = :badge,
                `badge_color` = :badge_color,
                `status` = :status,
                `featured` = :featured,
                `plan_type` = :plan_type
            WHERE `id` = :id
        ");

        return $stmt->execute([
            'id' => $id,
            'title' => $data['title'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'price_type' => $data['price_type'] ?? 'SALE',
            'type' => $data['type'],
            'bedrooms' => $data['bedrooms'] ?? null,
            'bathrooms' => $data['bathrooms'] ?? null,
            'surface' => $data['surface'] ?? null,
            'land' => $data['land'] ?? null,
            'city' => $data['city'] ?? null,
            'location' => $data['location'] ?? null,
            'district' => $data['district'] ?? null,
            'images' => $data['images'] ?? '[]',
            'amenities' => $data['amenities'] ?? '[]',
            'badge' => $data['badge'] ?? null,
            'badge_color' => $data['badge_color'] ?? null,
            'status' => $data['status'] ?? 'ACTIVE',
            'featured' => $data['featured'] ?? 0,
            'plan_type' => $data['plan_type'] ?? 'GRATUIT'
        ]);
    }
}
