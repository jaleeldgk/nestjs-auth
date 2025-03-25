/*
  Warnings:

  - You are about to drop the column `token` on the `passwordreset` table. All the data in the column will be lost.
  - Added the required column `otp` to the `PasswordReset` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `PasswordReset_token_key` ON `passwordreset`;

-- AlterTable
ALTER TABLE `passwordreset` DROP COLUMN `token`,
    ADD COLUMN `otp` VARCHAR(191) NOT NULL;
