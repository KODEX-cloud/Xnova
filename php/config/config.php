<?php
/**
 * NOVA Marketplace — Global Configuration
 */

// Define application paths
define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/src');
define('VIEW_PATH', APP_PATH . '/Views');
define('UPLOAD_DIR', ROOT_PATH . '/public/uploads');

// Auto-detect Base URL for dynamic environments
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$scriptName = dirname($_SERVER['SCRIPT_NAME'] ?? '');
$baseUrl = $protocol . $host . ($scriptName === '/' ? '' : $scriptName);
// If accessed directly via index.php redirect
if (strpos($baseUrl, '/public') === false && file_exists(ROOT_PATH . '/public/index.php')) {
    // Normalizing for local subfolder installations
    $baseUrl = str_replace('/public', '', $baseUrl);
}
define('BASE_URL', rtrim($baseUrl, '/'));

// Database configuration settings
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_NAME', getenv('DB_NAME') ?: 'nova_db');

// Session configuration
define('SESSION_NAME', 'nova_session');
define('SESSION_LIFETIME', 30 * 24 * 60 * 60); // 30 days in seconds (JWT-equivalent)

// Error reporting settings
define('DEBUG_MODE', getenv('APP_DEBUG') === 'true' || $host === 'localhost');

if (DEBUG_MODE) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}
