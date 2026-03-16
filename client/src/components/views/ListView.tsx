/**
 * Visualização em Lista de tarefas
 * Exibe todas as tarefas em uma lista com filtros aplicados
 */

import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { useFilteredTasks } from "@/hooks/useFilteredTasks";
import TaskItem from "@/components/TaskItem";
import TaskForm from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const ListView: React.FC = () => {
  const { state } = useTaskContext();
  const { tasks, filters } = state;
  const filteredTasks = useFilteredTasks(tasks, filters, "priority");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<typeof tasks[0] | undefined>();

  const handleEdit = (task: typeof tasks[0]) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header da Visualização */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Minhas Tarefas</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Lista de Tarefas */}
      <div className="flex-1 overflow-auto">
        {filteredTasks.length === 0 ? (
          <motion.div
            className="flex h-full items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">Nenhuma tarefa encontrada</p>
              <p className="text-sm text-muted-foreground">Crie uma nova tarefa para começar</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-2 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={handleEdit}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Formulário de Tarefa */}
      <TaskForm
        task={editingTask}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
};

export default ListView;
