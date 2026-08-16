-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "products_slug_key";

-- DropIndex
DROP INDEX IF EXISTS "products_name_key";

-- DropTable
DROP TABLE "products";

-- DropIndex
DROP INDEX IF EXISTS "categories_slug_key";

-- DropIndex
DROP INDEX IF EXISTS "categories_name_key";

-- DropTable
DROP TABLE "categories";