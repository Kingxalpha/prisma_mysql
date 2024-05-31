/*
  Warnings:

  - Made the column `postId` on table `image` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_postId_fkey`;

-- AlterTable
ALTER TABLE `image` MODIFY `postId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `post` MODIFY `published` BOOLEAN NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
