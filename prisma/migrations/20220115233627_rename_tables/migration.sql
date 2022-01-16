/*
  Warnings:

  - You are about to drop the `WealthCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WealthSource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `WealthCategory`;

-- DropTable
DROP TABLE `WealthSource`;

-- CreateTable
CREATE TABLE `BalanceItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cuid` VARCHAR(191) NOT NULL,
    `balanceTypeId` INTEGER NOT NULL,
    `value` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BalanceType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL DEFAULT '',
    `category` ENUM('ASSET', 'LIABILITY') NOT NULL DEFAULT 'ASSET',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
