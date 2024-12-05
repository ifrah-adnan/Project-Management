/*
  Warnings:

  - You are about to drop the column `operation_id` on the `planifications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "planifications" DROP CONSTRAINT "planifications_operation_id_fkey";

-- AlterTable
ALTER TABLE "planifications" DROP COLUMN "operation_id";

-- CreateTable
CREATE TABLE "planning_operations" (
    "id" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,

    CONSTRAINT "planning_operations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "planning_operations_planningId_operationId_key" ON "planning_operations"("planningId", "operationId");

-- AddForeignKey
ALTER TABLE "planning_operations" ADD CONSTRAINT "planning_operations_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "planifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_operations" ADD CONSTRAINT "planning_operations_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
