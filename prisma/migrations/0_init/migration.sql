-- Create `catalogs` table
CREATE TABLE `catalogs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `umkm_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `price` INTEGER NOT NULL,
    `view` INTEGER NOT NULL DEFAULT 0,
    `ecommerce_links` TEXT NULL,
    `status` SMALLINT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `ecommerce` VARCHAR(100) NULL,

    INDEX `catalogs_slug_IDX`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create `catalog_photos` table
CREATE TABLE `catalog_photos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `catalog_id` BIGINT UNSIGNED NOT NULL,  -- Ensure catalog_id is UNSIGNED
    `path` TEXT NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `order` SMALLINT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `status` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`),

    -- Adding foreign key constraint
    CONSTRAINT `catalog_photos_catalog_id_fkey` 
    FOREIGN KEY (`catalog_id`) REFERENCES `catalogs`(`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- CreateTable
CREATE TABLE `admins` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `mitra_id` INTEGER NULL,
    `role` INTEGER NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `admins_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mitra` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `kode_mitra` VARCHAR(255) NOT NULL,
    `nama_mitra` VARCHAR(255) NOT NULL,
    `referral` VARCHAR(255) NOT NULL,
    `status_mitra` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `password_resets_email_index`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP(0) NULL,
    `expires_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `personal_access_tokens_token_unique`(`token`),
    INDEX `personal_access_tokens_tokenable_type_tokenable_id_index`(`tokenable_type`, `tokenable_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscribers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `umkm_id` INTEGER NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `umkms` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `theme` INTEGER NULL,
    `name` VARCHAR(50) NOT NULL,
    `deskripsi` TEXT NULL,
    `domain` VARCHAR(100) NOT NULL,
    `banner_img` TEXT NULL,
    `logo_img` TEXT NULL,
    `address` TEXT NULL,
    `social_media_links` TEXT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `email` VARCHAR(50) NULL,
    `ecommerce_links` TEXT NULL,
    `map` TEXT NULL,
    `google_analytics` TEXT NULL,
    `status` SMALLINT NOT NULL DEFAULT 0,
    `profile_photo` VARCHAR(512) NULL,
    `description` TEXT NULL,
    `property_id` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `umkms_domain_unique`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `umkm_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `phone` VARCHAR(25) NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

