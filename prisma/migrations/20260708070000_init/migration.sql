CREATE TABLE `Notice` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(140) NOT NULL,
    `body` TEXT NOT NULL,
    `category` ENUM('EXAM', 'EVENT', 'GENERAL') NOT NULL,
    `priority` ENUM('NORMAL', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    `publishDate` DATETIME(3) NOT NULL,
    `imageUrl` VARCHAR(2048) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Notice_priority_publishDate_createdAt_idx`(`priority`, `publishDate`, `createdAt`),
    INDEX `Notice_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
