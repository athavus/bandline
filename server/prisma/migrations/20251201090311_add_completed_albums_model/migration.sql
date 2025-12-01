-- CreateTable
CREATE TABLE "completedAlbuns" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "albumId" TEXT NOT NULL,
    "albumName" TEXT NOT NULL,
    "albumImage" TEXT,
    "albumTracks" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "completedAlbuns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "completedAlbuns" ADD CONSTRAINT "completedAlbuns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
