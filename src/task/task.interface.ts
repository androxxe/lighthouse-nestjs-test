import { projects, tasks } from '@prisma/client';

export interface TaskCreateResponseInterface extends Omit<tasks, 'user_id' | 'project_id' | 'updated_at'> {
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
