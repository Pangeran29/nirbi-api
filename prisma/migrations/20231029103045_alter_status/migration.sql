/*
  Warnings:

  - You are about to drop the column `content` on the `Status` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Status" DROP COLUMN "content",
ADD COLUMN     "description" TEXT;
