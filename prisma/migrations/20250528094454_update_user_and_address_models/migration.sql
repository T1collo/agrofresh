-- DropIndex
DROP INDEX "Address_userId_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "label" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "preferences" JSONB;

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");
