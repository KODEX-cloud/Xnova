-- NOVA Marketplace — MySQL Schema (PHP Native Edition)
-- Active Database Definition

SET FOREIGN_KEY_CHECKS = 0;

-- ── Users ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(191) DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `user_type` VARCHAR(50) NOT NULL DEFAULT 'VENDEUR', -- VENDEUR | AGENCE
    `role` VARCHAR(50) NOT NULL DEFAULT 'USER',        -- SUPER_ADMIN | ADMIN | EDITOR | AGENT_AUTO | AGENT_IMMO | USER
    `avatar` VARCHAR(255) DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `subscription_plan` VARCHAR(50) NOT NULL DEFAULT 'FREE', -- FREE | PRO | PREMIUM
    `subscription_expires_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Payments ──────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'FCFA',
    `method` VARCHAR(50) NOT NULL, -- MTN | ORANGE | MOOV | CARD
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING | SUCCESS | FAILED | REFUNDED
    `reference` VARCHAR(191) NOT NULL UNIQUE,
    `type` VARCHAR(50) NOT NULL, -- ANNONCE | BOOST | SUBSCRIPTION
    `plan_type` VARCHAR(50) DEFAULT NULL, -- GRATUIT | EN_AVANT | PREMIUM | PRO
    `related_id` VARCHAR(36) DEFAULT NULL, -- ID de l'annonce ou de la propriété
    `phone` VARCHAR(50) DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Subscriptions ─────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `plan` VARCHAR(50) NOT NULL, -- FREE | PRO | PREMIUM
    `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | EXPIRED | CANCELLED
    `starts_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expires_at` DATETIME DEFAULT NULL,
    `payment_id` VARCHAR(36) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_subscriptions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_subscriptions_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Cars ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `cars`;
CREATE TABLE `cars` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL UNIQUE,
    `description` TEXT DEFAULT NULL,
    `price` INT NOT NULL,
    `price_type` VARCHAR(50) NOT NULL DEFAULT 'SALE', -- SALE | RENT
    `year` INT DEFAULT NULL,
    `mileage` INT DEFAULT NULL,
    `fuel` VARCHAR(50) DEFAULT NULL,
    `transmission` VARCHAR(50) DEFAULT NULL,
    `color` VARCHAR(50) DEFAULT NULL,
    `brand` VARCHAR(100) DEFAULT NULL,
    `model` VARCHAR(100) DEFAULT NULL,
    `city` VARCHAR(100) DEFAULT NULL,
    `location` VARCHAR(255) DEFAULT NULL,
    `images` TEXT NOT NULL, -- JSON String (ex: '["url1.jpg", "url2.jpg"]')
    `category` VARCHAR(100) DEFAULT NULL,
    `condition` VARCHAR(100) DEFAULT NULL,
    `badge` VARCHAR(100) DEFAULT NULL,
    `badge_color` VARCHAR(100) DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- PENDING | ACTIVE | EXPIRED | REJECTED
    `featured` TINYINT(1) NOT NULL DEFAULT 0,
    `views` INT NOT NULL DEFAULT 0,
    `user_id` VARCHAR(36) DEFAULT NULL,
    `plan_type` VARCHAR(50) NOT NULL DEFAULT 'GRATUIT', -- GRATUIT | EN_AVANT | PREMIUM
    `is_boosted` TINYINT(1) NOT NULL DEFAULT 0,
    `boosted_until` DATETIME DEFAULT NULL,
    `published_at` DATETIME DEFAULT NULL,
    `seo_title` VARCHAR(191) DEFAULT NULL,
    `meta_description` VARCHAR(255) DEFAULT NULL,
    `og_image` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_cars_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Properties ────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `properties`;
CREATE TABLE `properties` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL UNIQUE,
    `description` TEXT DEFAULT NULL,
    `price` INT NOT NULL,
    `price_type` VARCHAR(50) NOT NULL DEFAULT 'SALE', -- SALE | RENT
    `type` VARCHAR(100) NOT NULL,
    `bedrooms` INT DEFAULT NULL,
    `bathrooms` INT DEFAULT NULL,
    `surface` INT DEFAULT NULL,
    `land` INT DEFAULT NULL,
    `city` VARCHAR(100) DEFAULT NULL,
    `location` VARCHAR(255) DEFAULT NULL,
    `district` VARCHAR(100) DEFAULT NULL,
    `images` TEXT NOT NULL, -- JSON String
    `amenities` TEXT NOT NULL, -- JSON String
    `badge` VARCHAR(100) DEFAULT NULL,
    `badge_color` VARCHAR(100) DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- PENDING | ACTIVE | EXPIRED | REJECTED
    `featured` TINYINT(1) NOT NULL DEFAULT 0,
    `views` INT NOT NULL DEFAULT 0,
    `user_id` VARCHAR(36) DEFAULT NULL,
    `plan_type` VARCHAR(50) NOT NULL DEFAULT 'GRATUIT',
    `is_boosted` TINYINT(1) NOT NULL DEFAULT 0,
    `boosted_until` DATETIME DEFAULT NULL,
    `published_at` DATETIME DEFAULT NULL,
    `seo_title` VARCHAR(191) DEFAULT NULL,
    `meta_description` VARCHAR(255) DEFAULT NULL,
    `og_image` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_properties_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Blog ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL UNIQUE,
    `content` LONGTEXT DEFAULT NULL,
    `excerpt` TEXT DEFAULT NULL,
    `cover_image` VARCHAR(255) DEFAULT NULL,
    `category` VARCHAR(100) DEFAULT NULL,
    `tags` TEXT NOT NULL, -- JSON String
    `author` VARCHAR(100) DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT | PUBLISHED | SCHEDULED
    `published_at` DATETIME DEFAULT NULL,
    `scheduled_at` DATETIME DEFAULT NULL,
    `views` INT NOT NULL DEFAULT 0,
    `read_time` INT NOT NULL DEFAULT 5,
    `seo_title` VARCHAR(191) DEFAULT NULL,
    `meta_description` VARCHAR(255) DEFAULT NULL,
    `og_image` VARCHAR(255) DEFAULT NULL,
    `canonical` VARCHAR(255) DEFAULT NULL,
    `no_index` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Pages CMS ─────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
    `id` VARCHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL UNIQUE,
    `title` VARCHAR(191) NOT NULL,
    `sections` LONGTEXT NOT NULL, -- Contenu dynamique de la page sous format JSON
    `hero_title` VARCHAR(191) DEFAULT NULL,
    `hero_subtitle` VARCHAR(191) DEFAULT NULL,
    `hero_image` VARCHAR(255) DEFAULT NULL,
    `content` TEXT DEFAULT NULL,
    `is_published` TINYINT(1) NOT NULL DEFAULT 1,
    `seo_title` VARCHAR(191) DEFAULT NULL,
    `meta_description` VARCHAR(255) DEFAULT NULL,
    `og_image` VARCHAR(255) DEFAULT NULL,
    `canonical` VARCHAR(255) DEFAULT NULL,
    `no_index` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Menu Navigation ───────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `menu_items`;
CREATE TABLE `menu_items` (
    `id` VARCHAR(36) NOT NULL,
    `label` VARCHAR(100) NOT NULL,
    `href` VARCHAR(255) DEFAULT NULL,
    `icon` VARCHAR(50) DEFAULT NULL,
    `parent_id` VARCHAR(36) DEFAULT NULL,
    `order` INT NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `target` VARCHAR(50) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Media Library ─────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `media`;
CREATE TABLE `media` (
    `id` VARCHAR(36) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `public_id` VARCHAR(255) DEFAULT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `mimetype` VARCHAR(100) DEFAULT NULL,
    `size` INT DEFAULT NULL,
    `alt` VARCHAR(191) DEFAULT NULL,
    `folder` VARCHAR(100) DEFAULT NULL,
    `width` INT DEFAULT NULL,
    `height` INT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Site settings ─────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
    `id` VARCHAR(36) NOT NULL,
    `key` VARCHAR(191) NOT NULL UNIQUE,
    `value` LONGTEXT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Promotions ────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `promotions`;
CREATE TABLE `promotions` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `image` VARCHAR(255) DEFAULT NULL,
    `link` VARCHAR(255) DEFAULT NULL,
    `badge` VARCHAR(100) DEFAULT NULL,
    `discount` VARCHAR(50) DEFAULT NULL,
    `countdown` VARCHAR(50) DEFAULT NULL,
    `cta` VARCHAR(100) DEFAULT NULL,
    `gradient` VARCHAR(255) DEFAULT NULL,
    `bg_color` VARCHAR(50) DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `expires_at` DATETIME DEFAULT NULL,
    `order` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Testimonials ──────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE `testimonials` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(100) DEFAULT NULL,
    `company` VARCHAR(100) DEFAULT NULL,
    `avatar` VARCHAR(255) DEFAULT NULL,
    `content` TEXT NOT NULL,
    `rating` INT NOT NULL DEFAULT 5,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `order` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── FAQ Items ─────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `faq_items`;
CREATE TABLE `faq_items` (
    `id` VARCHAR(36) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` TEXT NOT NULL,
    `category` VARCHAR(100) DEFAULT NULL,
    `order` INT NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Leads ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `leads`;
CREATE TABLE `leads` (
    `id` VARCHAR(36) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `name` VARCHAR(191) DEFAULT NULL,
    `email` VARCHAR(191) DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `subject` VARCHAR(191) DEFAULT NULL,
    `message` TEXT DEFAULT NULL,
    `source` VARCHAR(100) DEFAULT NULL,
    `listing_type` VARCHAR(50) DEFAULT NULL,
    `listing_id` VARCHAR(36) DEFAULT NULL,
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Contact Messages ──────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `subject` VARCHAR(191) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
