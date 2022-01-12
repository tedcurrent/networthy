/*
  Warnings:

  - Added the required column `wealthCategoryId` to the `WealthSource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `WealthSource` ADD COLUMN `wealthCategoryId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `WealthCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
