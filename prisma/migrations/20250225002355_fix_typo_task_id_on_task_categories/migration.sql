/*
  Warnings:

  - You are about to drop the column `taskId` on the `task_categories` table. All the data in the column will be lost.
  - Added the required column `task_id` to the `task_categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "task_categories" DROP CONSTRAINT "task_categories_taskId_fkey";

-- AlterTable
ALTER TABLE "task_categories" DROP COLUMN "taskId",
ADD COLUMN     "task_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task_categories" ADD CONSTRAINT "task_categories_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
