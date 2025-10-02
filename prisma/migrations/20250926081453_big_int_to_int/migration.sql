/*
  Warnings:

  - The primary key for the `admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `catalog_photos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `catalog_photos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `catalog_id` on the `catalog_photos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `catalogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `catalogs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `umkm_id` on the `catalogs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `failed_jobs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `failed_jobs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `mitra` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `mitra` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `personal_access_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `personal_access_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `tokenable_id` on the `personal_access_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `subscribers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `subscribers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `umkms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `umkms` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `catalog_photos` DROP FOREIGN KEY `catalog_photos_catalog_id_fkey`;

-- DropForeignKey
ALTER TABLE `catalogs` DROP FOREIGN KEY `catalogs_umkm_id_fkey`;

-- DropIndex
DROP INDEX `catalogs_umkm_id_fkey` ON `catalogs`;

-- AlterTable
ALTER TABLE `admins` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `catalog_photos` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `catalog_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `catalogs` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `umkm_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `failed_jobs` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `mitra` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `personal_access_tokens` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `tokenable_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `subscribers` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `umkms` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `catalogs` ADD CONSTRAINT `catalogs_umkm_id_fkey` FOREIGN KEY (`umkm_id`) REFERENCES `umkms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catalog_photos` ADD CONSTRAINT `catalog_photos_catalog_id_fkey` FOREIGN KEY (`catalog_id`) REFERENCES `catalogs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
