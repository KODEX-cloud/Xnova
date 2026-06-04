<?php
/**
 * NOVA Marketplace — Route Middlewares
 */

namespace Core;

class Middleware {
    /**
     * Authenticated User Middleware.
     * Restricts routes to logged-in accounts.
     * 
     * @return bool
     */
    public static function auth(): bool {
        Session::start();
        if (!Session::isLoggedIn()) {
            header('Location: ' . BASE_URL . '/auth/login');
            exit();
        }
        return true;
    }

    /**
     * Editor Role Middleware.
     * Grants access to SUPER_ADMIN, ADMIN, and EDITOR.
     * 
     * @return bool
     */
    public static function editor(): bool {
        self::auth();
        if (!Session::hasRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            self::forbidden();
            return false;
        }
        return true;
    }

    /**
     * Automobile Agent Middleware.
     * 
     * @return bool
     */
    public static function agentAuto(): bool {
        self::auth();
        if (!Session::hasRole(['SUPER_ADMIN', 'ADMIN', 'AGENT_AUTO'])) {
            self::forbidden();
            return false;
        }
        return true;
    }

    /**
     * Real Estate Agent Middleware.
     * 
     * @return bool
     */
    public static function agentImmo(): bool {
        self::auth();
        if (!Session::hasRole(['SUPER_ADMIN', 'ADMIN', 'AGENT_IMMO'])) {
            self::forbidden();
            return false;
        }
        return true;
    }

    /**
     * Admin Panel Core Access Middleware.
     * Restricts routes to administrative accounts.
     * 
     * @return bool
     */
    public static function admin(): bool {
        self::auth();
        if (!Session::hasRole(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AGENT_AUTO', 'AGENT_IMMO'])) {
            self::forbidden();
            return false;
        }
        return true;
    }

    /**
     * Trigger HTTP 403 Forbidden page.
     */
    private static function forbidden(): void {
        header("HTTP/1.1 403 Forbidden");
        if (file_exists(VIEW_PATH . '/errors/403.php')) {
            require_once VIEW_PATH . '/errors/403.php';
        } else {
            echo "<h1>403 - Accès Refusé</h1><p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>";
        }
        exit();
    }
}
