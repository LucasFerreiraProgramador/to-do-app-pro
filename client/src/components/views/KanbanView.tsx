/**
 * Visualização Kanban de tarefas
 * Agrupa tarefas por prioridade em colunas com drag-and-drop
 */

import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { useFilteredTasks } from "@/hooks/useFilteredTasks";
import TaskItem from "@/components/TaskItem";
import TaskForm from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { groupTasksByPriority } from "@/lib/taskUtils";
import { Priority } from "@/types";

const priorityConfig = {
  urgent: { label: "Urgente", color: "bg-red-50 dark:bg-red-950/20", borderColor: "border-red-200 dark:border-red-800" },
  high: { label: "Alta", color: "bg-orange-50 dark:bg-orange-950/20", borderColor: "border-orange-200 dark:border-orange-800" },
  medium: { label: "Média", color: "bg-yellow-50 dark:bg-yellow-950/20", borderColor: "border-yellow-200 dark:border-yellow-800" },
  low: { label: "Baixa", color: "bg-green-50 dark:bg-green-950/20", borderColor: "border-green-200 dark:border-green-800" },
};

const KanbanView: React.FC = () => {
  const { state } = useTaskContext();
  const { tasks, filters } = state;
  const filteredTasks = useFilteredTasks(tasks, filters);
  const grouped = groupTasksByPriority(filteredTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<typeof tasks[0] | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);

  const handleEdit = (task: typeof tasks[0]) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const handleNewTask = (priority: Priority) => {
    setSelectedPriority(priority);
    setIsFormOpen(true);
  };

  const priorities: Priority[] = ["urgent", "high", "medium", "low"];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-xl font-semibold text-foreground">Visualização Kanban</h2>
        <p className="text-sm text-muted-foreground">
          {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Colunas Kanban */}
      <div className="flex-1 overflow-auto">
        <div className="flex gap-4 p-6">
          {priorities.map((priority) => (
            <motion.div
              key={priority}
              className={`flex w-80 flex-shrink-0 flex-col rounded-lg border-2 ${priorityConfig[priority].color} ${priorityConfig[priority].borderColor}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: priorities.indexOf(priority) * 0.1 }}
            >
              {/* Header da Coluna */}
              <div className="border-b border-border/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {priorityConfig[priority].label}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">
                    {grouped[priority].length}
                  </span>
                </div>
              </div>

              {/* Tarefas */}
              <div className="flex-1 space-y-2 overflow-auto p-3">
                {grouped[priority].length === 0 ? (
                  <div className="flex h-32 items-center justify-center">
                    <p className="text-xs text-muted-foreground">Nenhuma tarefa</p>
                  </div>
                ) : (
                  grouped[priority].map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onEdit={handleEdit}
                    />
                  ))
                )}
              </div>

              {/* Botão de Nova Tarefa */}
              <div className="border-t border-border/50 p-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleNewTask(priority)}
                >
                  <Plus className="h-3 w-3" />
                  Adicionar
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Formulário */}
      <TaskForm
        task={editingTask}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
};

export default KanbanView;
