<?php
/**
 * NOVA Marketplace — Front Controller and Bootstrapper
 */

// Load configuration
require_once dirname(__DIR__) . '/config/config.php';

// Implement PSR-4 Namespace Autoloader
spl_autoload_register(function ($class) {
    // Normalize namespace separators
    $class = ltrim($class, '\\');
    
    // Check if class belongs to Config namespace
    if (strpos($class, 'Config\\') === 0) {
        $relativeClass = substr($class, 7);
        $file = ROOT_PATH . '/config/' . strtolower(str_replace('\\', '/', $relativeClass)) . '.php';
    } else {
        // Core, Controllers, Models mapping to /src/
        $file = ROOT_PATH . '/src/' . str_replace('\\', '/', $class) . '.php';
    }

    if (file_exists($file)) {
        require_once $file;
    }
});

// Initialize session and security
use Core\Session;
Session::start();

// Initialize Router
use Core\Router;
$router = new Router();

// Register access control middlewares
$router->registerMiddleware('auth', [Core\Middleware::class, 'auth']);
$router->registerMiddleware('admin', [Core\Middleware::class, 'admin']);
$router->registerMiddleware('editor', [Core\Middleware::class, 'editor']);
$router->registerMiddleware('agent_auto', [Core\Middleware::class, 'agentAuto']);
$router->registerMiddleware('agent_immo', [Core\Middleware::class, 'agentImmo']);

// ── Public Routes ─────────────────────────────────────────────────────────────
$router->get('/', 'HomeController@index');
$router->get('/about', 'HomeController@about');
$router->get('/contact', 'ContactController@index');
$router->post('/contact', 'ContactController@send');

$router->get('/auth/login', 'AuthController@loginForm');
$router->post('/auth/login', 'AuthController@login');
$router->get('/auth/logout', 'AuthController@logout');

$router->get('/automobile', 'CarController@index');
$router->get('/automobile/:slug', 'CarController@detail');

$router->get('/immobilier', 'PropertyController@index');
$router->get('/immobilier/:slug', 'PropertyController@detail');

$router->get('/blog', 'BlogController@index');
$router->get('/blog/:slug', 'BlogController@detail');

// ── Admin Panel Routes ────────────────────────────────────────────────────────
$router->get('/admin', 'Admin/AdminController@dashboard', ['admin']);
$router->get('/admin/medias', 'Admin/MediaController@index', ['admin']);
$router->post('/admin/medias/upload', 'Admin/MediaController@upload', ['admin']);
$router->post('/admin/medias/delete/:id', 'Admin/MediaController@delete', ['admin']);

$router->get('/admin/design', 'Admin/DesignController@index', ['admin']);
$router->post('/admin/design/update', 'Admin/DesignController@update', ['admin']);

$router->get('/admin/pages', 'Admin/PageController@index', ['admin']);
$router->get('/admin/pages/edit/:id', 'Admin/PageController@edit', ['admin']);
$router->post('/admin/pages/update/:id', 'Admin/PageController@update', ['admin']);

// Resolve incoming URL path and dispatch to MVC controller
$requestUrl = $_SERVER['REQUEST_URI'] ?? '/';
// Remove subfolder path if running inside a subdirectory (like /php/public)
$subPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
if ($subPath !== '/' && strpos($requestUrl, $subPath) === 0) {
    $requestUrl = substr($requestUrl, strlen($subPath));
}
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$router->dispatch($requestUrl, $requestMethod);
