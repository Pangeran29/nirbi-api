/*
  Warnings:

  - The `auth_method` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AUTH_METHOD" AS ENUM ('GOOGLE_OAUTH', 'LOCAL_AUTH');

-- CreateEnum
CREATE TYPE "TYPE_OF_CONTENT" AS ENUM ('TEXT', 'PICTURE', 'VIDEO');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "auth_method",
ADD COLUMN     "auth_method" "AUTH_METHOD";

-- DropEnum
DROP TYPE "AuthMethod";

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "type_of_content" "TYPE_OF_CONTENT" NOT NULL,
    "content" TEXT,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Status_id_key" ON "Status"("id");

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
