/**
 * Barra de filtros avançados com busca, categorias, prioridades e tags
 * Permite filtrar tarefas em tempo real
 */

import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FilterBar: React.FC = () => {
  const { state, setFilters } = useTaskContext();
  const { filters, categories, tags } = state;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (query: string) => {
    setFilters({ ...filters, searchQuery: query });
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];
    setFilters({ ...filters, categories: newCategories });
  };

  const togglePriority = (priority: string) => {
    const newPriorities = filters.priorities.includes(priority as any)
      ? filters.priorities.filter((p) => p !== priority)
      : [...filters.priorities, priority as any];
    setFilters({ ...filters, priorities: newPriorities });
  };

  const toggleTag = (tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter((id) => id !== tagId)
      : [...filters.tags, tagId];
    setFilters({ ...filters, tags: newTags });
  };

  const toggleShowCompleted = () => {
    setFilters({ ...filters, showCompleted: !filters.showCompleted });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priorities: [],
      tags: [],
      searchQuery: "",
      showCompleted: true,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priorities.length > 0 ||
    filters.tags.length > 0 ||
    filters.searchQuery !== "" ||
    !filters.showCompleted;

  return (
    <motion.div
      className="border-b border-border bg-card p-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Barra de Busca */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={isExpanded ? "default" : "outline"}
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-3 w-3" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filtros Expandidos */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* Categorias */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Categorias</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={filters.categories.includes(cat.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <div
                      className="mr-1 h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Prioridades */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Prioridades</label>
              <div className="flex flex-wrap gap-2">
                {["urgent", "high", "medium", "low"].map((priority) => (
                  <Badge
                    key={priority}
                    variant={filters.priorities.includes(priority as any) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => togglePriority(priority)}
                  >
                    {priority === "urgent"
                      ? "Urgente"
                      : priority === "high"
                        ? "Alta"
                        : priority === "medium"
                          ? "Média"
                          : "Baixa"}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={filters.tags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.id)}
                      style={
                        filters.tags.includes(tag.id)
                          ? { backgroundColor: tag.color }
                          : { borderColor: tag.color, color: tag.color }
                      }
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Mostrar Concluídas */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Opções</label>
              <Badge
                variant={filters.showCompleted ? "default" : "outline"}
                className="cursor-pointer"
                onClick={toggleShowCompleted}
              >
                {filters.showCompleted ? "✓" : "○"} Mostrar Concluídas
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilterBar;
