/*
  Warnings:

  - You are about to drop the `completedAlbuns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."completedAlbuns" DROP CONSTRAINT "completedAlbuns_userId_fkey";

-- DropTable
DROP TABLE "public"."completedAlbuns";

-- CreateTable
CREATE TABLE "completedAlbums" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "albumId" TEXT NOT NULL,
    "albumName" TEXT NOT NULL,
    "albumImage" TEXT,
    "albumTracks" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "completedAlbums_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "completedAlbums" ADD CONSTRAINT "completedAlbums_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
