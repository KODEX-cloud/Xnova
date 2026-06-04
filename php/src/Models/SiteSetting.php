<?php
/**
 * NOVA Marketplace — SiteSetting Model
 */

namespace Models;

use Core\Model;
use PDO;

class SiteSetting extends Model {
    protected string $table = 'site_settings';
    private static ?array $settingsCache = null;

    /**
     * Fetch all settings and cache them.
     * 
     * @return array
     */
    public function getCachedSettings(): array {
        if (self::$settingsCache === null) {
            $stmt = $this->db->query("SELECT `key`, `value` FROM `{$this->table}`");
            $rows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
            self::$settingsCache = $rows ?: [];
        }
        return self::$settingsCache;
    }

    /**
     * Get a setting by key.
     * 
     * @param string $key
     * @param string|null $default
     * @return string|null
     */
    public function getSetting(string $key, ?string $default = null): ?string {
        $settings = $this->getCachedSettings();
        return $settings[$key] ?? $default;
    }

    /**
     * Update or insert a setting by key.
     * 
     * @param string $key
     * @param string|null $value
     * @return bool
     */
    public function setSetting(string $key, ?string $value): bool {
        // Clear cache
        self::$settingsCache = null;
        
        $stmt = $this->db->prepare("
            INSERT INTO `{$this->table}` (`id`, `key`, `value`) 
            VALUES (:id, :key, :value) 
            ON DUPLICATE KEY UPDATE `value` = :value_update
        ");
        
        $id = uniqid('set-');
        return $stmt->execute([
            'id' => $id,
            'key' => $key,
            'value' => $value,
            'value_update' => $value
        ]);
    }
}
