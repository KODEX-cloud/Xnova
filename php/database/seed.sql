-- Seed Data for NOVA PHP Native CMS
-- Default administrative users, settings, and menus

SET FOREIGN_KEY_CHECKS = 0;

-- ── Seeding Users ─────────────────────────────────────────────────────────────
-- Password hash is bcrypt for 'admin123'
INSERT INTO `users` (`id`, `email`, `password`, `name`, `phone`, `user_type`, `role`, `avatar`, `is_active`, `subscription_plan`, `subscription_expires_at`, `created_at`) VALUES
('usr-admin-001', 'admin@nova.ci', '$2y$12$K896lCgK5n58qGph.mE2tO1Bv8X30lE.XF.BspnL45bK4pXn0/0hK', 'Super Admin NOVA', '+225 0707070707', 'AGENCE', 'SUPER_ADMIN', NULL, 1, 'PREMIUM', '2030-12-31 23:59:59', CURRENT_TIMESTAMP),
('usr-user-001', 'demo@nova.ci', '$2y$12$K896lCgK5n58qGph.mE2tO1Bv8X30lE.XF.BspnL45bK4pXn0/0hK', 'Démo Vendeur', '+225 0505050505', 'VENDEUR', 'USER', NULL, 1, 'FREE', NULL, CURRENT_TIMESTAMP);

-- ── Seeding Menu Items ────────────────────────────────────────────────────────
INSERT INTO `menu_items` (`id`, `label`, `href`, `icon`, `parent_id`, `order`, `is_active`, `target`) VALUES
('menu-001', 'Accueil', '/', 'Home', NULL, 1, 1, '_self'),
('menu-002', 'Automobile', '/automobile', 'Car', NULL, 2, 1, '_self'),
('menu-003', 'Immobilier', '/immobilier', 'HomeIcon', NULL, 3, 1, '_self'),
('menu-004', 'Services', '/services', 'Briefcase', NULL, 4, 1, '_self'),
('menu-005', 'Blog', '/blog', 'BookOpen', NULL, 5, 1, '_self'),
('menu-006', 'Contact', '/contact', 'Mail', NULL, 6, 1, '_self');

-- ── Seeding Site Settings (Design and CMS defaults) ───────────────────────────
INSERT INTO `site_settings` (`id`, `key`, `value`) VALUES
('set-001', 'design.nova-red', '#FF0055'),
('set-002', 'design.nova-orange', '#FF5500'),
('set-003', 'design.nova-yellow', '#FFAA00'),
('set-004', 'design.theme-mode', 'light'),
('set-005', 'design.font-family', 'Outfit, Inter, sans-serif'),
('set-006', 'design.spacing-scale', '1rem'),
('set-007', 'design.btn-radius', '8px'),
('set-008', 'design.card-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'),
('set-009', 'page.home.hero.title', 'Trouvez le véhicule ou le bien immobilier idéal à Abidjan'),
('set-010', 'page.home.hero.subtitle', 'La marketplace premium de référence en Côte d\'Ivoire pour l\'automobile et l\'immobilier.'),
('set-011', 'page.home.hero.bg-image', '/uploads/default-hero.jpg'),
('set-012', 'page.home.cta.title', 'Vous avez un bien à vendre ou à louer ?'),
('set-013', 'page.home.cta.subtitle', 'Publiez votre annonce en quelques minutes et touchez des milliers d\'acheteurs qualifiés à Abidjan.'),
('set-014', 'page.home.cta.btn-text', 'Publier une annonce gratuitement'),
('set-015', 'global.whatsapp-number', '+2250707070707'),
('set-016', 'global.contact-email', 'contact@nova.ci');

-- ── Seeding Default Pages ─────────────────────────────────────────────────────
INSERT INTO `pages` (`id`, `slug`, `title`, `sections`, `hero_title`, `hero_subtitle`, `hero_image`, `is_published`) VALUES
('page-home', 'home', 'Accueil', '["hero", "quick-categories", "featured-showcase", "stats", "testimonials", "cta"]', 'Trouvez le véhicule ou le bien immobilier idéal', 'La marketplace premium de référence en Côte d\'Ivoire', '/uploads/default-hero.jpg', 1),
('page-about', 'about', 'À Propos', '["hero", "why-nova", "stats"]', 'Qui sommes-nous ?', 'Découvrez l\'histoire, les valeurs et la mission de NOVA', NULL, 1);

-- ── Seeding Default Cars ──────────────────────────────────────────────────────
INSERT INTO `cars` (`id`, `title`, `slug`, `description`, `price`, `price_type`, `year`, `mileage`, `fuel`, `transmission`, `color`, `brand`, `model`, `city`, `location`, `images`, `category`, `condition`, `badge`, `badge_color`, `status`, `featured`, `views`, `user_id`, `plan_type`) VALUES
('car-001', 'Toyota Land Cruiser Prado 2022', 'toyota-land-cruiser-prado-2022', 'Toyota Land Cruiser Prado en excellent état, boîte automatique, moteur Diesel, climatisation d\'origine, intérieur cuir.', 45000000, 'SALE', 2022, 34000, 'DIESEL', 'AUTOMATIC', 'Noir', 'Toyota', 'Prado', 'Abidjan', 'Cocody', '["/uploads/prado1.jpg"]', 'SUV', 'Excellent', 'Vedette', 'nova-orange', 'ACTIVE', 1, 142, 'usr-user-001', 'PREMIUM');

-- ── Seeding Default Properties ────────────────────────────────────────────────
INSERT INTO `properties` (`id`, `title`, `slug`, `description`, `price`, `price_type`, `type`, `bedrooms`, `bathrooms`, `surface`, `land`, `city`, `location`, `district`, `images`, `amenities`, `badge`, `badge_color`, `status`, `featured`, `views`, `user_id`, `plan_type`) VALUES
('prop-001', 'Villa Duplex 5 Pièces avec Piscine', 'villa-duplex-5-pieces-piscine-cocody', 'Magnifique villa duplex de 5 pièces située à Cocody Angré. Grande piscine, jardin, garage couvert pour 2 voitures, sécurité H24.', 250000000, 'SALE', 'VILLA', 4, 5, 450, 600, 'Abidjan', 'Cocody', 'Angré', '["/uploads/villa1.jpg"]', '["Piscine", "Garage", "Jardin", "Climatisation", "Sécurité"]', 'Exclusivité', 'nova-red', 'ACTIVE', 1, 230, 'usr-user-001', 'PREMIUM');

-- ── Seeding Default Blog Posts ────────────────────────────────────────────────
INSERT INTO `blog_posts` (`id`, `title`, `slug`, `content`, `excerpt`, `cover_image`, `category`, `tags`, `author`, `status`, `published_at`, `views`, `read_time`) VALUES
('blog-001', 'Guide d\'achat : Choisir son véhicule d\'occasion à Abidjan', '<p>Acheter un véhicule d\'occasion à Abidjan peut s\'avérer complexe...</p>', 'Les points clés à vérifier avant d\'acheter votre véhicule de seconde main à Abidjan.', '/uploads/blog-cover1.jpg', 'guides', '["automobile", "achat", "conseils"]', 'L\'équipe NOVA', 'PUBLISHED', CURRENT_TIMESTAMP, 98, 4);

-- ── Seeding Testimonials ──────────────────────────────────────────────────────
INSERT INTO `testimonials` (`id`, `name`, `role`, `company`, `avatar`, `content`, `rating`, `is_active`, `order`) VALUES
('test-001', 'Jean-Marc Koffi', 'Directeur', 'Koffi Auto', NULL, 'Grâce à NOVA, nos ventes de véhicules ont augmenté de 35% en seulement 3 mois. La plateforme est très simple à utiliser.', 5, 1, 1),
('test-002', 'Awa Diarrassouba', 'Particulier', NULL, NULL, 'J\'ai vendu mon appartement à Marcory en moins de deux semaines grâce à l\'annonce Premium. Je recommande fortement.', 5, 1, 2);

-- ── Seeding FAQ Items ─────────────────────────────────────────────────────────
INSERT INTO `faq_items` (`id`, `question`, `answer`, `category`, `order`, `is_active`) VALUES
('faq-001', 'Comment publier une annonce sur NOVA ?', 'Pour publier une annonce, inscrivez-vous ou connectez-vous, puis cliquez sur le bouton "Publier" dans votre tableau de bord.', 'Général', 1, 1);

SET FOREIGN_KEY_CHECKS = 1;
