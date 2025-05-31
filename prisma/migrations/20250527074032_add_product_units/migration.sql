/*
  Warnings:

  - Added the required column `unit` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitQuantity` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "unit" TEXT NOT NULL DEFAULT 'kg';
ALTER TABLE "Product" ADD COLUMN "unitQuantity" DOUBLE PRECISION NOT NULL DEFAULT 1.0;

-- Remove defaults after adding columns
ALTER TABLE "Product" ALTER COLUMN "unit" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "unitQuantity" DROP DEFAULT;
