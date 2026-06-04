<?php
/**
 * NOVA Marketplace — Session and CSRF Security Manager
 */

namespace Core;

class Session {
    /**
     * Start secure PHP native session.
     */
    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            // Configure secure cookies parameters
            ini_set('session.cookie_lifetime', SESSION_LIFETIME);
            ini_set('session.gc_maxlifetime', SESSION_LIFETIME);
            
            $cookieParams = [
                'lifetime' => SESSION_LIFETIME,
                'path' => '/',
                'domain' => $_SERVER['HTTP_HOST'] ?? '',
                'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
                'httponly' => true,
                'samesite' => 'Lax'
            ];

            session_name(SESSION_NAME);
            session_set_cookie_params($cookieParams);
            session_start();
        }
    }

    /**
     * Set session key.
     */
    public static function set(string $key, $value): void {
        self::start();
        $_SESSION[$key] = $value;
    }

    /**
     * Get session key.
     */
    public static function get(string $key, $default = null) {
        self::start();
        return $_SESSION[$key] ?? $default;
    }

    /**
     * Delete session key.
     */
    public static function delete(string $key): void {
        self::start();
        if (isset($_SESSION[$key])) {
            unset($_SESSION[$key]);
        }
    }

    /**
     * Destroy active session.
     */
    public static function destroy(): void {
        self::start();
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }
        session_destroy();
    }

    /**
     * Generate secure CSRF token.
     */
    public static function generateCsrfToken(): string {
        self::start();
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    /**
     * Verify CSRF token from POST/requests.
     */
    public static function checkCsrfToken(?string $token): bool {
        self::start();
        $stored = $_SESSION['csrf_token'] ?? null;
        if (!$stored || !$token) {
            return false;
        }
        return hash_equals($stored, $token);
    }

    /**
     * Check if user is logged in.
     */
    public static function isLoggedIn(): bool {
        return self::get('user_id') !== null;
    }

    /**
     * Check if user has an authorized role.
     * 
     * @param array $allowedRoles
     * @return bool
     */
    public static function hasRole(array $allowedRoles): bool {
        if (!self::isLoggedIn()) {
            return false;
        }
        $role = self::get('user_role');
        return in_array($role, $allowedRoles);
    }
}
