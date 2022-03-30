export interface TaskboardItem {
  id: string;
  select: string;
  description: string;
}

export enum TaskboardItemStatus {
  TO_DO = 'To Do',
  DONE = 'Done',
}
