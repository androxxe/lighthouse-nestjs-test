/*
  Warnings:

  - Added the required column `user_id` to the `task_comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_comments" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
