/**
 * Header do To-Do App com título, controles de visualização e tema
 * Inclui navegação entre visualizações e toggle de modo escuro
 */

import React from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, List, LayoutGrid, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const { state, setViewMode, toggleDarkMode } = useTaskContext();
  const { viewMode, isDarkMode } = state;

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Título */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-lg font-bold text-white">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">To-Do App</h1>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          {/* Botões de visualização */}
          <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
              title="Visualização em Lista"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Lista</span>
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="gap-2"
              title="Visualização Kanban"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="gap-2"
              title="Visualização em Calendário"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendário</span>
            </Button>
          </div>

          {/* Toggle de tema */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Modo claro" : "Modo escuro"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
