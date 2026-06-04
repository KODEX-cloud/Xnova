<?php
/**
 * NOVA Marketplace — Base Model
 */

namespace Core;

use Config\Database;
use PDO;

abstract class Model {
    protected PDO $db;
    protected string $table;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Fetch all records from the table.
     * 
     * @return array
     */
    public function all(): array {
        $stmt = $this->db->query("SELECT * FROM `{$this->table}`");
        return $stmt->fetchAll();
    }

    /**
     * Find a record by its unique ID.
     * 
     * @param string $id
     * @return array|null
     */
    public function find(string $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM `{$this->table}` WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Find a record by a specific key-value pair.
     * 
     * @param string $key
     * @param mixed $value
     * @return array|null
     */
    public function findBy(string $key, $value): ?array {
        $stmt = $this->db->prepare("SELECT * FROM `{$this->table}` WHERE `{$key}` = :val LIMIT 1");
        $stmt->execute(['val' => $value]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Delete a record by ID.
     * 
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool {
        $stmt = $this->db->prepare("DELETE FROM `{$this->table}` WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
