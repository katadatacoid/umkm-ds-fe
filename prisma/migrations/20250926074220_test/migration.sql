/*
  Warnings:

  - The primary key for the `admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `BigInt`.
  - The primary key for the `catalog_photos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `catalog_photos` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `BigInt`.
  - You are about to alter the column `catalog_id` on the `catalog_photos` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `BigInt`.
  - Added the required column `name` to the `test` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `catalog_photos` DROP FOREIGN KEY `catalog_photos_catalog_id_fkey`;

-- DropIndex
DROP INDEX `catalog_photos_catalog_id_fkey` ON `catalog_photos`;

-- AlterTable
ALTER TABLE `admins` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `catalog_photos` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `catalog_id` BIGINT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `test` ADD COLUMN `name` VARCHAR(191) NOT NULL;

