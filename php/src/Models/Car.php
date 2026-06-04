<?php
/**
 * NOVA Marketplace — Car Model
 */

namespace Models;

use Core\Model;
use PDO;

class Car extends Model {
    protected string $table = 'cars';

    /**
     * Get active cars with filters.
     * 
     * @param array $filters
     * @return array
     */
    public function getActiveCars(array $filters = []): array {
        $sql = "SELECT c.*, u.name as owner_name, u.phone as owner_phone 
                FROM `{$this->table}` c
                LEFT JOIN `users` u ON c.user_id = u.id
                WHERE c.status = 'ACTIVE'";
        
        $params = [];

        if (!empty($filters['brand'])) {
            $sql .= " AND c.brand = :brand";
            $params['brand'] = $filters['brand'];
        }

        if (!empty($filters['price_max'])) {
            $sql .= " AND c.price <= :price_max";
            $params['price_max'] = (int)$filters['price_max'];
        }

        if (!empty($filters['fuel'])) {
            $sql .= " AND c.fuel = :fuel";
            $params['fuel'] = $filters['fuel'];
        }

        if (!empty($filters['transmission'])) {
            $sql .= " AND c.transmission = :transmission";
            $params['transmission'] = $filters['transmission'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (c.title LIKE :search OR c.description LIKE :search_desc)";
            $params['search'] = '%' . $filters['search'] . '%';
            $params['search_desc'] = '%' . $filters['search'] . '%';
        }

        // Ordered by featured (pinned) first, then publication date
        $sql .= " ORDER BY c.featured DESC, c.created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Create a new car entry.
     * 
     * @param array $data
     * @return bool
     */
    public function create(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO `{$this->table}` (
                `id`, `title`, `slug`, `description`, `price`, `price_type`, `year`, `mileage`, 
                `fuel`, `transmission`, `color`, `brand`, `model`, `city`, `location`, `images`, 
                `category`, `condition`, `badge`, `badge_color`, `status`, `featured`, `user_id`, `plan_type`
            ) VALUES (
                :id, :title, :slug, :description, :price, :price_type, :year, :mileage, 
                :fuel, :transmission, :color, :brand, :model, :city, :location, :images, 
                :category, :condition, :badge, :badge_color, :status, :featured, :user_id, :plan_type
            )
        ");

        return $stmt->execute([
            'id' => $data['id'] ?? uniqid('car-'),
            'title' => $data['title'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'price_type' => $data['price_type'] ?? 'SALE',
            'year' => $data['year'] ?? null,
            'mileage' => $data['mileage'] ?? null,
            'fuel' => $data['fuel'] ?? null,
            'transmission' => $data['transmission'] ?? null,
            'color' => $data['color'] ?? null,
            'brand' => $data['brand'] ?? null,
            'model' => $data['model'] ?? null,
            'city' => $data['city'] ?? null,
            'location' => $data['location'] ?? null,
            'images' => $data['images'] ?? '[]',
            'category' => $data['category'] ?? null,
            'condition' => $data['condition'] ?? null,
            'badge' => $data['badge'] ?? null,
            'badge_color' => $data['badge_color'] ?? null,
            'status' => $data['status'] ?? 'ACTIVE',
            'featured' => $data['featured'] ?? 0,
            'user_id' => $data['user_id'] ?? null,
            'plan_type' => $data['plan_type'] ?? 'GRATUIT'
        ]);
    }

    /**
     * Update an existing car entry.
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
                `year` = :year,
                `mileage` = :mileage,
                `fuel` = :fuel,
                `transmission` = :transmission,
                `color` = :color,
                `brand` = :brand,
                `model` = :model,
                `city` = :city,
                `location` = :location,
                `images` = :images,
                `category` = :category,
                `condition` = :condition,
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
            'year' => $data['year'] ?? null,
            'mileage' => $data['mileage'] ?? null,
            'fuel' => $data['fuel'] ?? null,
            'transmission' => $data['transmission'] ?? null,
            'color' => $data['color'] ?? null,
            'brand' => $data['brand'] ?? null,
            'model' => $data['model'] ?? null,
            'city' => $data['city'] ?? null,
            'location' => $data['location'] ?? null,
            'images' => $data['images'] ?? '[]',
            'category' => $data['category'] ?? null,
            'condition' => $data['condition'] ?? null,
            'badge' => $data['badge'] ?? null,
            'badge_color' => $data['badge_color'] ?? null,
            'status' => $data['status'] ?? 'ACTIVE',
            'featured' => $data['featured'] ?? 0,
            'plan_type' => $data['plan_type'] ?? 'GRATUIT'
        ]);
    }
}
