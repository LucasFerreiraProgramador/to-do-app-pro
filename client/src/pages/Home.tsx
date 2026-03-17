/**
 * Página principal do To-Do App
 * Integra layout, filtros e visualizações
 */

import React, { useState } from "react";
import Layout from "@/components/Layout";
import FilterBar from "@/components/FilterBar";
import ListView from "@/components/views/ListView";
import KanbanView from "@/components/views/KanbanView";
import CalendarView from "@/components/views/CalendarView";
import Statistics from "@/pages/Statistics";
import { useTaskContext } from "@/contexts/TaskContext";

export default function Home() {
  const { state } = useTaskContext();
  const { viewMode, isDarkMode } = state;
  const [currentSection, setCurrentSection] = useState("tasks");

  // Aplicar tema escuro
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

 const renderContent = () => {
    if (currentSection === "statistics") {
      return <Statistics />;
    }

    return (
      <>
        <FilterBar />
        <div key={viewMode} className="flex-1">
          {viewMode === "list" && <ListView />}
          {viewMode === "kanban" && <KanbanView />}
          {viewMode === "calendar" && <CalendarView />}
        </div>
      </>
    );
  };

  return (
    <Layout>
      <div className="flex h-full flex-col bg-background">
        {renderContent()}
      </div>
    </Layout>
  );
}
