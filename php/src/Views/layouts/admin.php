<?php
/**
 * NOVA Marketplace — Admin Base Layout Template (Premium Spacious Clear Design)
 */

$settingModel = new \Models\SiteSetting();
$settings = $settingModel->getCachedSettings();

$novaRed = $settings['design.nova-red'] ?? '#FF0055';
$novaOrange = $settings['design.nova-orange'] ?? '#FF5500';
$novaYellow = $settings['design.nova-yellow'] ?? '#FFAA00';
$fontFamily = $settings['design.font-family'] ?? 'Outfit, Inter, sans-serif';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration — NOVA Marketplace</title>
    
    <!-- Preconnect Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Global CSS Stylesheet -->
    <link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/style.css">

    <!-- Dynamic Style Injection Engine -->
    <style>
        :root {
            --nova-red: <?= $novaRed ?>;
            --nova-orange: <?= $novaOrange ?>;
            --nova-yellow: <?= $novaYellow ?>;
            --font-sans: <?= $fontFamily ?>;
        }

        /* Administration Panel specific styles overriding main layout for spacious clarity */
        body {
            background-color: var(--slate-100);
        }

        .admin-header {
            background-color: white;
            padding: 1.25rem 2.5rem;
            border-bottom: 1px solid var(--slate-200);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .admin-title-head {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--slate-900);
        }

        .admin-user-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.9rem;
            color: var(--slate-600);
        }

        .admin-card {
            background: white;
            border-radius: var(--radius-md);
            padding: 2rem;
            border: 1px solid var(--slate-200);
            box-shadow: var(--shadow-sm);
            margin-bottom: 2rem;
        }

        .admin-card-title {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: var(--slate-900);
            border-bottom: 2px solid var(--slate-100);
            padding-bottom: 0.75rem;
        }

        /* Form elements styles */
        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--slate-700);
            margin-bottom: 0.5rem;
        }

        .form-control {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--slate-300);
            border-radius: var(--radius-md);
            background-color: white;
            transition: var(--transition-base);
        }

        .form-control:focus {
            border-color: var(--nova-red);
            box-shadow: 0 0 0 3px rgba(255, 0, 85, 0.15);
        }

        .btn-submit {
            background-color: var(--nova-red);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius-md);
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition-base);
        }

        .btn-submit:hover {
            opacity: 0.9;
        }

        .alert-success {
            background-color: rgba(16, 185, 129, 0.1);
            color: var(--success);
            padding: 1rem;
            border-radius: var(--radius-md);
            border: 1px solid rgba(16, 185, 129, 0.2);
            margin-bottom: 1.5rem;
            font-weight: 500;
        }
    </style>
</head>
<body>

    <div class="admin-shell">
        <!-- Admin Sidebar Navigation -->
        <aside class="admin-sidebar">
            <a href="<?= BASE_URL ?>/" class="logo" style="margin-bottom: 2rem;">
                NOVA <span style="font-size: 0.8rem; font-weight:600; text-transform:uppercase; color:var(--slate-400);">Admin</span>
            </a>
            
            <ul class="admin-menu-list">
                <li>
                    <a href="<?= BASE_URL ?>/admin" class="admin-menu-link">
                        Dashboard
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/pages" class="admin-menu-link">
                        Pages CMS
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/menus" class="admin-menu-link">
                        Gestion des Menus
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/cars" class="admin-menu-link">
                        Automobiles
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/properties" class="admin-menu-link">
                        Immobilier
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/blog" class="admin-menu-link">
                        Blog
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/testimonials" class="admin-menu-link">
                        Témoignages
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/promotions" class="admin-menu-link">
                        Promotions
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/leads" class="admin-menu-link">
                        Inbox Leads
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/users" class="admin-menu-link">
                        Utilisateurs
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/medias" class="admin-menu-link">
                        Bibliothèque Médias
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/design" class="admin-menu-link">
                        Gestionnaire Design
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/admin/settings" class="admin-menu-link">
                        Paramètres Globaux
                    </a>
                </li>
                <li style="margin-top: 2rem; border-top: 1px solid var(--slate-200); padding-top: 1rem;">
                    <a href="<?= BASE_URL ?>/" class="admin-menu-link" target="_blank">
                        Voir le site public
                    </a>
                </li>
                <li>
                    <a href="<?= BASE_URL ?>/auth/logout" class="admin-menu-link" style="color: var(--danger);">
                        Déconnexion
                    </a>
                </li>
            </ul>
        </aside>

        <!-- Right Side Panel Content -->
        <div style="display: flex; flex-direction: column; flex-grow: 1;">
            <header class="admin-header">
                <div class="admin-title-head">Panneau d'administration</div>
                <div class="admin-user-info">
                    <span>Connecté en tant que: <strong><?= htmlspecialchars(\Core\Session::get('user_name', 'Administrateur')) ?></strong></span>
                </div>
            </header>
            
            <main class="admin-content">
                <?= $content ?>
            </main>
        </div>
    </div>

</body>
</html>
