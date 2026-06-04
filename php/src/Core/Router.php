<?php
/**
 * NOVA Marketplace — Core Custom Router
 */

namespace Core;

class Router {
    private array $routes = [];
    private array $middlewares = [];

    /**
     * Register a GET route.
     * 
     * @param string $path
     * @param string|callable $handler
     * @param array $middlewares
     */
    public function get(string $path, $handler, array $middlewares = []): void {
        $this->addRoute('GET', $path, $handler, $middlewares);
    }

    /**
     * Register a POST route.
     * 
     * @param string $path
     * @param string|callable $handler
     * @param array $middlewares
     */
    public function post(string $path, $handler, array $middlewares = []): void {
        $this->addRoute('POST', $path, $handler, $middlewares);
    }

    /**
     * Add a route configuration to the internal array.
     */
    private function addRoute(string $method, string $path, $handler, array $middlewares): void {
        // Convert route path to regex pattern
        // Example: /blog/:slug -> ~^/blog/(?P<slug>[^/]+)$~
        $pattern = preg_replace('/:[a-zA-Z0-9_]+/', '(?P<$0>[^/]+)', $path);
        $pattern = str_replace(':', '', $pattern);
        $pattern = '~^' . $pattern . '$~';

        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'pattern' => $pattern,
            'handler' => $handler,
            'middlewares' => $middlewares
        ];
    }

    /**
     * Register a global middleware handler by key.
     */
    public function registerMiddleware(string $key, callable $callback): void {
        $this->middlewares[$key] = $callback;
    }

    /**
     * Match incoming HTTP request against registered routes and dispatch.
     */
    public function dispatch(string $url, string $method): void {
        // Strip query string
        $url = parse_url($url, PHP_URL_PATH);
        $url = rtrim($url, '/');
        if (empty($url)) {
            $url = '/';
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['pattern'], $url, $matches)) {
                // Filter out numeric index keys from matches
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);

                // Run middlewares
                foreach ($route['middlewares'] as $middlewareKey) {
                    if (isset($this->middlewares[$middlewareKey])) {
                        $allowed = call_user_func($this->middlewares[$middlewareKey]);
                        if (!$allowed) {
                            return; // Middleware blocked execution
                        }
                    }
                }

                // Handle routing callbacks or Class@method formats
                if (is_callable($route['handler'])) {
                    call_user_func_array($route['handler'], $params);
                    return;
                }

                if (is_string($route['handler'])) {
                    list($controllerName, $methodName) = explode('@', $route['handler']);
                    $controllerNamespace = "\\Controllers\\" . $controllerName;
                    
                    // Support subfolders for Admin controllers
                    if (strpos($controllerName, 'Admin/') === 0) {
                        $controllerNamespace = "\\Controllers\\" . str_replace('/', '\\', $controllerName);
                    }

                    if (class_exists($controllerNamespace)) {
                        $controller = new $controllerNamespace();
                        if (method_exists($controller, $methodName)) {
                            call_user_func_array([$controller, $methodName], $params);
                            return;
                        }
                    }
                }
            }
        }

        // Return 404 Route Not Found
        $this->handleNotFound();
    }

    /**
     * Fallback error handler for 404 routes.
     */
    private function handleNotFound(): void {
        header("HTTP/1.0 404 Not Found");
        if (file_exists(VIEW_PATH . '/errors/404.php')) {
            require_once VIEW_PATH . '/errors/404.php';
        } else {
            echo "<h1>404 - Page Non Trouvée</h1><p>Désolé, la page demandée n'existe pas.</p>";
        }
    }
}
