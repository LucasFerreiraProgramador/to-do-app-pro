/**
 * Formulário para criar e editar tarefas
 * Inclui campos para título, descrição, categoria, prioridade, datas e tags
 */

import React, { useState, useEffect } from "react";
import { Task, Priority } from "@/types";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface TaskFormProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, isOpen, onClose }) => {
  const { state, addTask, updateTask } = useTaskContext();
  const { categories, tags } = state;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: categories[0]?.id || "",
    priority: "medium" as Priority,
    dueDate: "",
    selectedTags: [] as string[],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        categoryId: task.categoryId,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
        selectedTags: task.tags.map((t) => t.id),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        categoryId: categories[0]?.id || "",
        priority: "medium",
        dueDate: "",
        selectedTags: [],
      });
    }
  }, [task, isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("O título da tarefa é obrigatório");
      return;
    }

    const selectedTags = tags.filter((t) => formData.selectedTags.includes(t.id));

    if (task) {
      updateTask({
        ...task,
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        tags: selectedTags,
      });
      toast.success("Tarefa atualizada com sucesso!");
    } else {
      addTask({
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        completed: false,
        tags: selectedTags,
        subtasks: [],
      });
      toast.success("Tarefa criada com sucesso!");
    }

    onClose();
  };

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter((id) => id !== tagId)
        : [...prev.selectedTags, tagId],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Digite o título da tarefa..."
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="mt-1"
              autoFocus
            />
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Digite uma descrição detalhada (opcional)..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          {/* Grid de campos */}
          <div className="grid grid-cols-2 gap-4">
            {/* Categoria */}
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}>
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prioridade */}
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value as Priority }))}>
                <SelectTrigger id="priority" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data de Vencimento */}
            <div className="col-span-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-sm transition-all ${
                    formData.selectedTags.includes(tag.id)
                      ? "ring-2 ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  } as React.CSSProperties}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Botões */}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {task ? "Atualizar" : "Criar"} Tarefa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
