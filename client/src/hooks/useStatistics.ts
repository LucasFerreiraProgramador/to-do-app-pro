/**
 * Hook customizado para calcular estatísticas de tarefas
 */

import { useMemo } from "react";
import { Task, Category, Statistics } from "@/types";
import { calculateStatistics } from "@/lib/taskUtils";

export const useStatistics = (tasks: Task[], categories: Category[]): Statistics => {
  return useMemo(() => {
    return calculateStatistics(tasks, categories);
  }, [tasks, categories]);
};
