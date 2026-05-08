-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "reporterName" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "sellerName" TEXT,
ADD COLUMN     "targetName" TEXT,
ADD COLUMN     "userName" TEXT;
