/**
 * Sidebar com categorias, tags e opções de navegação
 * Permite filtrar tarefas e acessar diferentes seções
 */

import React, { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Download, Upload, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

interface SidebarProps {
  onNavigate?: (section: string) => void;
  currentSection?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentSection = "tasks" }) => {
  const { state, setFilters, resetState } = useTaskContext();
  const { categories, filters } = state;
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCategoryFilter = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];

    setFilters({ ...filters, categories: newCategories });
  };

  const handleExport = () => {
    try {
      const dataStr = storage.exportAsJSON(state);
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(dataStr));
      element.setAttribute("download", `todo-app-backup-${new Date().toISOString().split("T")[0]}.json`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar dados");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = storage.importFromJSON(event.target?.result as string);
            if (imported) {
              resetState();
              toast.success("Dados importados com sucesso!");
            }
          } catch (error) {
            toast.error("Erro ao importar arquivo");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (window.confirm("Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.")) {
      resetState();
      toast.success("Dados resetados com sucesso!");
    }
  };

  return (
    <motion.aside
      className={`flex flex-col border-r border-border bg-sidebar transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header do Sidebar */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
        {isExpanded && <h2 className="font-semibold text-sidebar-foreground">Navegação</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8"
        >
          {isExpanded ? "−" : "+"}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* Seção de Categorias */}
          <div>
            {isExpanded && (
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-sidebar-foreground">Categorias</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" title="Adicionar categoria">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="space-y-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    filters.categories.includes(category.id)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  {isExpanded && <span className="truncate">{category.name}</span>}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Divisor */}
          {isExpanded && <div className="border-t border-sidebar-border" />}

          {/* Seção de Ações */}
          {isExpanded && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-sidebar-foreground">Ações</h3>
              <div className="space-y-2">

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleImport}
                >
                  <Upload className="h-4 w-4" />
                  Importar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
                  onClick={handleReset}
                >
                  <Trash2 className="h-4 w-4" />
                  Resetar
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>


    </motion.aside>
  );
};

export default Sidebar;
