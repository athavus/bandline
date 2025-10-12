/*
  Warnings:

  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.
  - Made the column `passwordHash` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."User_providerId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "providerId",
ADD COLUMN     "avatarUrl" TEXT,
ALTER COLUMN "passwordHash" SET NOT NULL;
