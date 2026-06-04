<?php
/**
 * NOVA Marketplace — Database Connection Singleton
 */

namespace Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    /**
     * Get the active PDO database connection instance.
     * Implements Singleton pattern.
     * 
     * @return PDO
     */
    public static function getConnection(): PDO {
        if (self::$instance === null) {
            try {
                $dsn = sprintf(
                    "mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4",
                    DB_HOST,
                    DB_PORT,
                    DB_NAME
                );

                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ];

                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // Securely log or output database connection errors
                if (DEBUG_MODE) {
                    die("Erreur de connexion à la base de données : " . $e->getMessage());
                } else {
                    error_log("Database connection failure: " . $e->getMessage());
                    die("Une erreur technique est survenue. Veuillez réessayer plus tard.");
                }
            }
        }

        return self::$instance;
    }

    /**
     * Prevents cloning or instantiation of the class.
     */
    private function __construct() {}
    private function __clone() {}
}
