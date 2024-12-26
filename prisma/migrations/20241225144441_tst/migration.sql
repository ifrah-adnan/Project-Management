/*
  Warnings:

  - You are about to drop the column `estimated_time` on the `operations` table. All the data in the column will be lost.
  - You are about to drop the `planning_operations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `operation_id` to the `planifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "planifications" DROP CONSTRAINT "planifications_command_project_id_fkey";

-- DropForeignKey
ALTER TABLE "planning_operations" DROP CONSTRAINT "planning_operations_operationId_fkey";

-- DropForeignKey
ALTER TABLE "planning_operations" DROP CONSTRAINT "planning_operations_planningId_fkey";

-- AlterTable
ALTER TABLE "operations" DROP COLUMN "estimated_time";

-- AlterTable
ALTER TABLE "planifications" ADD COLUMN     "operation_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "planning_operations";

-- CreateTable
CREATE TABLE "project_operations" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "project_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CommandProjectToPlanning" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OperationToPlanning" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "project_operations_projectId_operationId_key" ON "project_operations"("projectId", "operationId");

-- CreateIndex
CREATE UNIQUE INDEX "_CommandProjectToPlanning_AB_unique" ON "_CommandProjectToPlanning"("A", "B");

-- CreateIndex
CREATE INDEX "_CommandProjectToPlanning_B_index" ON "_CommandProjectToPlanning"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OperationToPlanning_AB_unique" ON "_OperationToPlanning"("A", "B");

-- CreateIndex
CREATE INDEX "_OperationToPlanning_B_index" ON "_OperationToPlanning"("B");

-- AddForeignKey
ALTER TABLE "project_operations" ADD CONSTRAINT "project_operations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_operations" ADD CONSTRAINT "project_operations_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommandProjectToPlanning" ADD CONSTRAINT "_CommandProjectToPlanning_A_fkey" FOREIGN KEY ("A") REFERENCES "command_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommandProjectToPlanning" ADD CONSTRAINT "_CommandProjectToPlanning_B_fkey" FOREIGN KEY ("B") REFERENCES "planifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OperationToPlanning" ADD CONSTRAINT "_OperationToPlanning_A_fkey" FOREIGN KEY ("A") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OperationToPlanning" ADD CONSTRAINT "_OperationToPlanning_B_fkey" FOREIGN KEY ("B") REFERENCES "planifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
