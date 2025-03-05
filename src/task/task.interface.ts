import { projects, task_comments, tasks } from '@prisma/client';

export type TaskCreateResponseInterface = TaskListResponseInterface;

export type TaskUpdateResponseInterface = TaskListResponseInterface;

export interface TaskDeleteResponseInterface {
  id: string;
}

export interface TaskListResponseInterface extends Omit<tasks, 'user_id' | 'project_id' | 'updated_at'> {
  user: {
    id: string;
    name: string;
    email: string;
  };
  project: Pick<projects, 'id' | 'name'> | null;
  task_categories: Array<{
    id: string;
    name: string;
  }>;
  total_comment: number;
}

export interface TaskDetailResponseInterface extends Omit<tasks, 'user_id' | 'project_id' | 'updated_at'> {
  user: {
    id: string;
    name: string;
    email: string;
  };
  project: Pick<projects, 'id' | 'name'> | null;
  task_categories: Array<{
    id: string;
    name: string;
  }>;
  total_comment: number;
}

export interface TaskCommentListResponseInterface extends Omit<task_comments, 'user_id' | 'task_id' | 'updated_at'> {
  user: {
    id: string;
    name: string;
    email: string;
  };
}
