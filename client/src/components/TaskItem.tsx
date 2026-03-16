/**
 * Componente de item de tarefa individual
 * Exibe informações da tarefa com indicadores visuais de prioridade e status
 */

import React, { useState } from "react";
import { Task } from "@/types";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isPast, isToday } from "date-fns";
import { isTaskOverdue } from "@/lib/taskUtils";
import { ptBR } from "date-fns/locale";

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  isDragging?: boolean;
}

const priorityConfig = {
  urgent: { label: "Urgente", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  high: { label: "Alta", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  medium: { label: "Média", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  low: { label: "Baixa", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, isDragging = false }) => {
  const { deleteTask, toggleTask, state } = useTaskContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const category = state.categories.find((c) => c.id === task.categoryId);
  const isOverdue = isTaskOverdue(task);
  const isDueToday = isToday(new Date(task.dueDate || 0));
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  return (
    <motion.div
      className={`group rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      } ${task.completed ? "opacity-60" : ""}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
    >
      {/* Header da Tarefa */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleTask(task.id)}
          className="mt-1"
        />

        {/* Conteúdo Principal */}
        <div className="flex-1 min-w-0">
          {/* Título */}
          <div className="flex items-start gap-2">
            <h3
              className={`flex-1 text-sm font-medium leading-tight ${
                task.completed ? "line-through text-muted-foreground" : "text-card-foreground"
              }`}
            >
              {task.title}
            </h3>
            {isOverdue && !task.completed && (
              <div title="Tarefa atrasada">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
              </div>
            )}
          </div>

          {/* Metadados */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Categoria */}
            {category && (
              <Badge variant="outline" className="text-xs">
                <div
                  className="mr-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </Badge>
            )}

            {/* Prioridade */}
            <Badge className={`text-xs ${priorityConfig[task.priority].color}`}>
              {priorityConfig[task.priority].label}
            </Badge>

            {/* Data de Vencimento */}
            {task.dueDate && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  isOverdue && !task.completed
                    ? "border-destructive text-destructive"
                    : isDueToday
                      ? "border-orange-500 text-orange-600 dark:text-orange-400"
                      : ""
                }`}
              >
                {format(new Date(task.dueDate), "dd MMM", { locale: ptBR })}
              </Badge>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex gap-1">
                {task.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="text-xs"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Descrição (se houver) */}
          {task.description && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          )}

          {/* Subtarefas */}
          {task.subtasks.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Subtarefas: {completedSubtasks}/{task.subtasks.length}
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {task.subtasks.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(task)}
            className="h-8 w-8"
            title="Editar tarefa"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTask(task.id)}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            title="Deletar tarefa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subtarefas Expandidas */}
      <AnimatePresence>
        {isExpanded && task.subtasks.length > 0 && (
          <motion.div
            className="mt-3 space-y-2 border-t border-border pt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 text-sm">
                <Checkbox checked={subtask.completed} disabled className="h-4 w-4" />
                <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                  {subtask.title}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskItem;
