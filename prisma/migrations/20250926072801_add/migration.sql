/*
  Warnings:

  - You are about to alter the column `catalog_id` on the `catalog_photos` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `BigInt`.

*/


-- CreateTable
CREATE TABLE `test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `test` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

