<?php
/**
 * NOVA Marketplace — Base Controller
 */

namespace Core;

abstract class Controller {
    /**
     * Render an HTML view wrapped inside a layout.
     * 
     * @param string $view Path of the view file (e.g. 'home/index')
     * @param array $data Variables to expose to the view
     * @param string $layout Path of the layout file (e.g. 'layouts/main')
     */
    protected function render(string $view, array $data = [], string $layout = 'layouts/main'): void {
        // Extract variables to local scope
        extract($data);

        // Start output buffering for the specific view file
        $viewFile = VIEW_PATH . '/' . $view . '.php';
        if (!file_exists($viewFile)) {
            die("La vue demandée n'existe pas : " . $viewFile);
        }

        ob_start();
        require_once $viewFile;
        $content = ob_get_clean(); // Captured view content

        // If a layout is defined, wrap the content in it
        if ($layout) {
            $layoutFile = VIEW_PATH . '/' . $layout . '.php';
            if (!file_exists($layoutFile)) {
                die("Le layout demandé n'existe pas : " . $layoutFile);
            }
            require_once $layoutFile;
        } else {
            echo $content;
        }
    }

    /**
     * Redirect to another URL.
     * 
     * @param string $url
     */
    protected function redirect(string $url): void {
        header("Location: " . BASE_URL . $url);
        exit();
    }

    /**
     * Return a JSON response and terminate.
     * 
     * @param mixed $data
     * @param int $statusCode
     */
    protected function jsonResponse($data, int $statusCode = 200): void {
        header("Content-Type: application/json; charset=utf-8");
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit();
    }
}
