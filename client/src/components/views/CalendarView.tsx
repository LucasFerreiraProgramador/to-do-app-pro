import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarView = () => {
  const { state } = useTaskContext();
  const { tasks } = state;
  // Agora o estado controla qual mês estamos vendo!
  const [viewDate, setViewDate] = useState(new Date(2026, 2, 1)); 

  // Funções para mudar o mês
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goToToday = () => setViewDate(new Date(2026, 2, 1)); // Volta para Março/2026

  // Lógica para calcular os dias do mês dinamicamente
  const monthName = viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Filtra as tarefas que batem com o dia, mês e ano que estamos vendo
  const getTasksForDay = (day: number) => {
    return tasks.filter(task => {
      const tDate = new Date(task.date);
      return (
        tDate.getDate() === day &&
        tDate.getMonth() === viewDate.getMonth() &&
        tDate.getFullYear() === viewDate.getFullYear()
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground capitalize">{monthName}</h2>
          <p className="text-sm text-muted-foreground">Suas tarefas organizadas no tempo</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-secondary rounded-md border transition-colors"><ChevronLeft size={16} /></button>
          <button onClick={goToToday} className="px-4 py-1.5 text-sm font-medium border rounded-md hover:bg-secondary">Hoje</button>
          <button onClick={nextMonth} className="p-2 hover:bg-secondary rounded-md border transition-colors"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border border rounded-lg overflow-hidden flex-1 shadow-sm">
        {weekDays.map(day => (
          <div key={day} className="bg-muted/30 p-3 text-center text-xs font-semibold text-muted-foreground uppercase">
            {day}
          </div>
        ))}
        
        {blanks.map(b => <div key={`blank-${b}`} className="bg-card/50 min-h-[100px]" />)}

        {calendarDays.map(day => {
          const dayTasks = getTasksForDay(day);
          const isToday = day === 16 && viewDate.getMonth() === 2 && viewDate.getFullYear() === 2026;

          return (
            <div key={day} className="bg-card p-2 min-h-[120px] border-t border-l transition-all hover:bg-accent/10 group relative">
              <span className={`text-sm font-bold flex items-center justify-center w-7 h-7 rounded-full ${isToday ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'}`}>
                {day}
              </span>
              
              <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                {dayTasks.map(task => (
                  <div key={task.id} className="text-[10px] p-1.5 bg-primary/10 text-primary rounded-md border border-primary/20 truncate font-medium">
                    {task.title}
                  </div>
                ))}
              </div>

              <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-primary text-white rounded-full shadow-lg">
                <Plus size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;