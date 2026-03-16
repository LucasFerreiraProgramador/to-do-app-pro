/**
 * Tipos e interfaces centralizadas para o To-Do App
 * Mantém a consistência de tipos em toda a aplicação
 */

export type Priority = "low" | "medium" | "high" | "urgent";
export type ViewMode = "list" | "kanban" | "calendar";

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  priority: Priority;
  dueDate?: Date;
  completed: boolean;
  tags: Tag[];
  subtasks: SubTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilter {
  categories: string[];
  priorities: Priority[];
  tags: string[];
  searchQuery: string;
  showCompleted: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface Statistics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksByPriority: Record<Priority, number>;
  tasksByCategory: Record<string, number>;
  completionRate: number;
  averageTasksPerDay: number;
}

export interface AppState {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  filters: TaskFilter;
  viewMode: ViewMode;
  isDarkMode: boolean;
}
