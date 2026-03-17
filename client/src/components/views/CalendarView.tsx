import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarView = () => {
  const { state } = useTaskContext();
  const { tasks } = state;
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 16)); // Março 2026

  // Dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  // Lógica básica para gerar os dias do mês de Março/2026 (baseado no seu print)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Função para filtrar tarefas do dia
  const getTasksForDay = (day: number) => {
    // Aqui assumimos que suas tarefas têm um campo 'date'. 
    // Ajustamos para comparar com o dia do mês atual.
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getDate() === day && taskDate.getMonth() === 2; // Mês 2 é Março
    });
  };

  return (
    <div className="flex flex-col h-full bg-background p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Calendário</h2>
          <p className="text-sm text-muted-foreground">março 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded-md border"><ChevronLeft size={16} /></button>
          <button className="px-4 py-1.5 text-sm font-medium border rounded-md hover:bg-secondary">Hoje</button>
          <button className="p-2 hover:bg-secondary rounded-md border"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border border rounded-lg overflow-hidden flex-1">
        {weekDays.map(day => (
          <div key={day} className="bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground uppercase">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          const isToday = day === 16;

          return (
            <div key={day} className={`bg-card p-2 min-h-[100px] border-t border-l transition-colors hover:bg-accent/50 group relative ${isToday ? 'ring-2 ring-primary z-10' : ''}`}>
              <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                {day}
              </span>
              
              <div className="mt-1 space-y-1">
                {dayTasks.map(task => (
                  <div key={task.id} className="text-[10px] p-1 bg-blue-100 text-blue-700 rounded border border-blue-200 truncate">
                    {task.title}
                  </div>
                ))}
              </div>

              <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded">
                <Plus size={14} className="text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;