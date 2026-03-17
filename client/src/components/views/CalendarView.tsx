import React from 'react';

const CalendarView = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-xl m-4">
      <h2 className="text-2xl font-bold mb-2">📅 Visualização em Calendário</h2>
      <p className="text-muted-foreground">O módulo de calendário foi ativado com sucesso!</p>
      <div className="grid grid-cols-7 gap-2 mt-6 w-full max-w-md text-center">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
          <div key={day} className="font-bold text-blue-500">{day}</div>
        ))}
        {Array.from({ length: 31 }).map((_, i) => (
          <div key={i} className="p-2 bg-secondary rounded-md hover:bg-primary hover:text-white cursor-pointer transition-colors">
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;