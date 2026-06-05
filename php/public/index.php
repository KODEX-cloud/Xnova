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

$router->get('/services', 'ServiceController@index');
$router->get('/services/:id', 'ServiceController@detail');

$router->get('/annonces', 'AnnonceController@index');

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

// Automobiles Admin CRUD
$router->get('/admin/cars', 'Admin/CarController@index', ['admin']);
$router->get('/admin/cars/new', 'Admin/CarController@new', ['admin']);
$router->post('/admin/cars/create', 'Admin/CarController@create', ['admin']);
$router->get('/admin/cars/edit/:id', 'Admin/CarController@edit', ['admin']);
$router->post('/admin/cars/update/:id', 'Admin/CarController@update', ['admin']);
$router->post('/admin/cars/delete/:id', 'Admin/CarController@delete', ['admin']);

// Immobilier Admin CRUD
$router->get('/admin/properties', 'Admin/PropertyController@index', ['admin']);
$router->get('/admin/properties/new', 'Admin/PropertyController@new', ['admin']);
$router->post('/admin/properties/create', 'Admin/PropertyController@create', ['admin']);
$router->get('/admin/properties/edit/:id', 'Admin/PropertyController@edit', ['admin']);
$router->post('/admin/properties/update/:id', 'Admin/PropertyController@update', ['admin']);
$router->post('/admin/properties/delete/:id', 'Admin/PropertyController@delete', ['admin']);

// Blog Admin CRUD
$router->get('/admin/blog', 'Admin/BlogController@index', ['admin']);
$router->get('/admin/blog/new', 'Admin/BlogController@new', ['admin']);
$router->post('/admin/blog/create', 'Admin/BlogController@create', ['admin']);
$router->get('/admin/blog/edit/:id', 'Admin/BlogController@edit', ['admin']);
$router->post('/admin/blog/update/:id', 'Admin/BlogController@update', ['admin']);
$router->post('/admin/blog/delete/:id', 'Admin/BlogController@delete', ['admin']);

// Page Builder API/Actions
$router->post('/admin/pages/builder/add/:id', 'Admin/PageBuilderController@addSection', ['admin']);
$router->get('/admin/pages/builder/delete/:id/:sectionId', 'Admin/PageBuilderController@deleteSection', ['admin']);
$router->get('/admin/pages/builder/toggle/:id/:sectionId', 'Admin/PageBuilderController@toggleSection', ['admin']);
$router->get('/admin/pages/builder/move/:id/:sectionId/:direction', 'Admin/PageBuilderController@moveSection', ['admin']);

// Menus Admin CRUD
$router->get('/admin/menus', 'Admin/MenuController@index', ['admin']);
$router->post('/admin/menus/create', 'Admin/MenuController@create', ['admin']);
$router->get('/admin/menus/edit/:id', 'Admin/MenuController@edit', ['admin']);
$router->post('/admin/menus/update/:id', 'Admin/MenuController@update', ['admin']);
$router->post('/admin/menus/delete/:id', 'Admin/MenuController@delete', ['admin']);

// Testimonials Admin CRUD
$router->get('/admin/testimonials', 'Admin/TestimonialController@index', ['admin']);
$router->get('/admin/testimonials/new', 'Admin/TestimonialController@new', ['admin']);
$router->post('/admin/testimonials/create', 'Admin/TestimonialController@create', ['admin']);
$router->get('/admin/testimonials/edit/:id', 'Admin/TestimonialController@edit', ['admin']);
$router->post('/admin/testimonials/update/:id', 'Admin/TestimonialController@update', ['admin']);
$router->post('/admin/testimonials/delete/:id', 'Admin/TestimonialController@delete', ['admin']);

// Promotions Admin CRUD
$router->get('/admin/promotions', 'Admin/PromotionController@index', ['admin']);
$router->get('/admin/promotions/new', 'Admin/PromotionController@new', ['admin']);
$router->post('/admin/promotions/create', 'Admin/PromotionController@create', ['admin']);
$router->get('/admin/promotions/edit/:id', 'Admin/PromotionController@edit', ['admin']);
$router->post('/admin/promotions/update/:id', 'Admin/PromotionController@update', ['admin']);
$router->post('/admin/promotions/delete/:id', 'Admin/PromotionController@delete', ['admin']);

// Leads Admin Management
$router->get('/admin/leads', 'Admin/LeadController@index', ['admin']);
$router->get('/admin/leads/view/:id', 'Admin/LeadController@view', ['admin']);
$router->post('/admin/leads/toggle/:id', 'Admin/LeadController@toggle', ['admin']);
$router->post('/admin/leads/delete/:id', 'Admin/LeadController@delete', ['admin']);

// Users Admin Management
$router->get('/admin/users', 'Admin/UserController@index', ['admin']);
$router->get('/admin/users/edit/:id', 'Admin/UserController@edit', ['admin']);
$router->post('/admin/users/update/:id', 'Admin/UserController@update', ['admin']);
$router->post('/admin/users/delete/:id', 'Admin/UserController@delete', ['admin']);

// Global Settings Admin
$router->get('/admin/settings', 'Admin/SettingController@index', ['admin']);
$router->post('/admin/settings/update', 'Admin/SettingController@update', ['admin']);

// Resolve incoming URL path and dispatch to MVC controller
$requestUrl = $_SERVER['REQUEST_URI'] ?? '/';
// Remove subfolder path if running inside a subdirectory (like /php/public)
$subPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
if ($subPath !== '/' && strpos($requestUrl, $subPath) === 0) {
    $requestUrl = substr($requestUrl, strlen($subPath));
}
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$router->dispatch($requestUrl, $requestMethod);
