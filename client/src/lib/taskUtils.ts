/**
 * Utilitários para manipulação de tarefas e cálculos
 * Inclui funções para filtros, busca e estatísticas
 */

import { Task, TaskFilter, Statistics, Priority, Category } from "@/types";
import { isToday, isPast, isBefore, startOfDay, endOfDay } from "date-fns";

/**
 * Verifica se uma tarefa está atrasada
 */
export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.completed) return false;
  return isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
};

/**
 * Verifica se uma tarefa vence hoje
 */
export const isTaskDueToday = (task: Task): boolean => {
  if (!task.dueDate) return false;
  return isToday(new Date(task.dueDate));
};

/**
 * Filtra tarefas baseado nos critérios especificados
 */
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  return tasks.filter((task) => {
    // Filtro por conclusão
    if (!filter.showCompleted && task.completed) return false;

    // Filtro por categorias
    if (filter.categories.length > 0 && !filter.categories.includes(task.categoryId)) {
      return false;
    }

    // Filtro por prioridades
    if (filter.priorities.length > 0 && !filter.priorities.includes(task.priority)) {
      return false;
    }

    // Filtro por tags
    if (filter.tags.length > 0) {
      const taskTagIds = task.tags.map((t) => t.id);
      const hasMatchingTag = filter.tags.some((tagId) => taskTagIds.includes(tagId));
      if (!hasMatchingTag) return false;
    }

    // Filtro por data
    if (filter.dateRange) {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      if (
        isBefore(taskDate, startOfDay(filter.dateRange.start)) ||
        isBefore(endOfDay(filter.dateRange.end), taskDate)
      ) {
        return false;
      }
    }

    // Filtro por busca
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description?.toLowerCase().includes(query) || false;
      const matchesTags = task.tags.some((t) => t.name.toLowerCase().includes(query));
      if (!matchesTitle && !matchesDescription && !matchesTags) return false;
    }

    return true;
  });
};

/**
 * Ordena tarefas por prioridade (urgente > alta > média > baixa)
 */
export const sortByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder: Record<Priority, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};

/**
 * Ordena tarefas por data de vencimento
 */
export const sortByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

/**
 * Calcula estatísticas das tarefas
 */
export const calculateStatistics = (tasks: Task[], categories: Category[]): Statistics => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const overdueTasks = tasks.filter((t) => isTaskOverdue(t)).length;

  // Tarefas por prioridade
  const tasksByPriority: Record<Priority, number> = {
    low: tasks.filter((t) => t.priority === "low").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    high: tasks.filter((t) => t.priority === "high").length,
    urgent: tasks.filter((t) => t.priority === "urgent").length,
  };

  // Tarefas por categoria
  const tasksByCategory: Record<string, number> = {};
  categories.forEach((cat) => {
    tasksByCategory[cat.id] = tasks.filter((t) => t.categoryId === cat.id).length;
  });

  // Taxa de conclusão
  const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  // Média de tarefas por dia (baseado em dias desde a primeira tarefa)
  let averageTasksPerDay = 0;
  if (tasks.length > 0) {
    const sortedByDate = [...tasks].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const firstTaskDate = new Date(sortedByDate[0].createdAt);
    const lastTaskDate = new Date(sortedByDate[sortedByDate.length - 1].createdAt);
    const daysDiff = Math.max(1, Math.ceil((lastTaskDate.getTime() - firstTaskDate.getTime()) / (1000 * 60 * 60 * 24)));
    averageTasksPerDay = totalTasks / daysDiff;
  }

  return {
    totalTasks,
    completedTasks,
    overdueTasks,
    tasksByPriority,
    tasksByCategory,
    completionRate,
    averageTasksPerDay,
  };
};

/**
 * Agrupa tarefas por categoria
 */
export const groupTasksByCategory = (tasks: Task[]): Record<string, Task[]> => {
  const grouped: Record<string, Task[]> = {};
  tasks.forEach((task) => {
    if (!grouped[task.categoryId]) {
      grouped[task.categoryId] = [];
    }
    grouped[task.categoryId].push(task);
  });
  return grouped;
};

/**
 * Agrupa tarefas por prioridade
 */
export const groupTasksByPriority = (tasks: Task[]): Record<Priority, Task[]> => {
  return {
    urgent: tasks.filter((t) => t.priority === "urgent"),
    high: tasks.filter((t) => t.priority === "high"),
    medium: tasks.filter((t) => t.priority === "medium"),
    low: tasks.filter((t) => t.priority === "low"),
  };
};

/**
 * Agrupa tarefas por data de vencimento
 */
export const groupTasksByDate = (
  tasks: Task[]
): {
  today: Task[];
  tomorrow: Task[];
  thisWeek: Task[];
  thisMonth: Task[];
  overdue: Task[];
  noDueDate: Task[];
} => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));

  const endOfMonth = new Date(today);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);

  const grouped = {
    today: [] as Task[],
    tomorrow: [] as Task[],
    thisWeek: [] as Task[],
    thisMonth: [] as Task[],
    overdue: [] as Task[],
    noDueDate: [] as Task[],
  };

  tasks.forEach((task) => {
    if (!task.dueDate) {
      grouped.noDueDate.push(task);
      return;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (isTaskOverdue(task)) {
      grouped.overdue.push(task);
    } else if (dueDate.getTime() === today.getTime()) {
      grouped.today.push(task);
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      grouped.tomorrow.push(task);
    } else if (dueDate <= endOfWeek) {
      grouped.thisWeek.push(task);
    } else if (dueDate <= endOfMonth) {
      grouped.thisMonth.push(task);
    }
  });

  return grouped;
};

/**
 * Gera cores em escala de cinza para modo escuro
 */
export const getCategoryColorForDarkMode = (lightColor: string): string => {
  // Mapeamento de cores claras para versões mais claras para modo escuro
  const colorMap: Record<string, string> = {
    "#FF6B6B": "#FF8787",
    "#4ECDC4": "#5EEAD4",
    "#45B7D1": "#38BDF8",
    "#FFA07A": "#FFAB91",
    "#98D8C8": "#A7E8D3",
    "#F7DC6F": "#FCD34D",
    "#BB8FCE": "#D8B4FE",
    "#85C1E2": "#93C5FD",
  };

  return colorMap[lightColor] || lightColor;
};
