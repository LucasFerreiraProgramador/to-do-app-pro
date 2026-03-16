/**
 * Hook customizado para filtrar e ordenar tarefas
 */

import { useMemo } from "react";
import { Task, TaskFilter } from "@/types";
import { filterTasks, sortByPriority, sortByDueDate } from "@/lib/taskUtils";

export const useFilteredTasks = (tasks: Task[], filters: TaskFilter, sortBy: "priority" | "dueDate" = "priority"): Task[] => {
  return useMemo(() => {
    let filtered = filterTasks(tasks, filters);

    if (sortBy === "priority") {
      filtered = sortByPriority(filtered);
    } else if (sortBy === "dueDate") {
      filtered = sortByDueDate(filtered);
    }

    return filtered;
  }, [tasks, filters, sortBy]);
};
