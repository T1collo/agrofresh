/*
  Warnings:

  - A unique constraint covering the columns `[name,categoryId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_name_categoryId_key" ON "Product"("name", "categoryId");
