<?php
/**
 * NOVA Marketplace — Public Base Layout Template
 */

// Fetch dynamic settings and menu items
$settingModel = new \Models\SiteSetting();
$menuModel = new \Models\MenuItem();

$settings = $settingModel->getCachedSettings();
$navItems = $menuModel->getActiveNav();

// Dynamic Theme Colors
$novaRed = $settings['design.nova-red'] ?? '#FF0055';
$novaOrange = $settings['design.nova-orange'] ?? '#FF5500';
$novaYellow = $settings['design.nova-yellow'] ?? '#FFAA00';
$fontFamily = $settings['design.font-family'] ?? 'Outfit, Inter, sans-serif';
$btnRadius = $settings['design.btn-radius'] ?? '8px';
$cardShadow = $settings['design.card-shadow'] ?? '0 4px 6px -1px rgba(0, 0, 0, 0.1)';

// Contact details
$whatsappNumber = $settings['global.whatsapp-number'] ?? '+2250707070707';
$contactEmail = $settings['global.contact-email'] ?? 'contact@nova.ci';
?>
<!DOCTYPE html>
<html lang="fr" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Management -->
    <title><?= htmlspecialchars($seoTitle ?? 'NOVA Marketplace — Automobile & Immobilier Côte d\'Ivoire') ?></title>
    <meta name="description" content="<?= htmlspecialchars($metaDescription ?? 'Trouvez les meilleures annonces de vente et location de voitures et propriétés à Abidjan.') ?>">
    <?php if (!empty($canonical)): ?>
        <link rel="canonical" href="<?= htmlspecialchars($canonical) ?>">
    <?php endif; ?>
    <?php if (!empty($noIndex)): ?>
        <meta name="robots" content="noindex, nofollow">
    <?php endif; ?>

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
            --radius-md: <?= $btnRadius ?>;
            --shadow-md: <?= $cardShadow ?>;
        }
    </style>
</head>
<body>

    <!-- Header Navigation -->
    <nav class="navbar">
        <div class="container navbar-container">
            <a href="<?= BASE_URL ?>/" class="logo">
                NOVA
            </a>
            
            <ul class="nav-links">
                <?php foreach ($navItems as $item): ?>
                    <li>
                        <a href="<?= BASE_URL . $item['href'] ?>" class="nav-link" target="<?= $item['target'] ?? '_self' ?>">
                            <?= htmlspecialchars($item['label']) ?>
                        </a>
                    </li>
                <?php endforeach; ?>

                <?php if (\Core\Session::isLoggedIn()): ?>
                    <li>
                        <a href="<?= BASE_URL ?>/admin" class="nav-link" style="color: var(--nova-orange); font-weight:600;">
                            Admin
                        </a>
                    </li>
                    <li>
                        <a href="<?= BASE_URL ?>/auth/logout" class="nav-link">Déconnexion</a>
                    </li>
                <?php else: ?>
                    <li>
                        <a href="<?= BASE_URL ?>/auth/login" class="nav-link">Connexion</a>
                    </li>
                <?php endif; ?>
                
                <li>
                    <a href="<?= BASE_URL ?>/admin/pages" class="btn-publish">
                        Vendre / Louer
                    </a>
                </li>
            </ul>
        </div>
    </nav>

    <!-- Main Content Container -->
    <main>
        <?= $content ?>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div>
                    <div class="footer-logo">NOVA</div>
                    <p>La marketplace premium double-secteur de référence à Abidjan pour l'automobile et l'immobilier.</p>
                </div>
                <div>
                    <div class="footer-title">Navigation</div>
                    <ul class="footer-links">
                        <?php foreach ($navItems as $item): ?>
                            <li>
                                <a href="<?= BASE_URL . $item['href'] ?>" class="footer-link">
                                    <?= htmlspecialchars($item['label']) ?>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div>
                    <div class="footer-title">Contact</div>
                    <ul class="footer-links">
                        <li>Email: <?= htmlspecialchars($contactEmail) ?></li>
                        <li>WhatsApp: <?= htmlspecialchars($whatsappNumber) ?></li>
                        <li>Abidjan, Côte d'Ivoire</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?= date('Y') ?> NOVA Marketplace. Tous droits réservés. Coded in PHP Native.</p>
            </div>
        </div>
    </footer>

    <!-- WhatsApp Floating Action Button -->
    <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $whatsappNumber) ?>" 
       style="position: fixed; bottom: 2rem; right: 2rem; background-color: #25D366; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 999; font-size: 1.8rem;" 
       target="_blank" rel="noopener noreferrer">
        W
    </a>

</body>
</html>
