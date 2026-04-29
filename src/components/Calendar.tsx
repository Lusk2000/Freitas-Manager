import { useState } from "react";
import { parseISO, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday, getDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "../store";
import { cn } from "../lib/utils";

export default function CalendarView() {
  const { tasks, activeModule, openTaskModal, calendarDate, setCalendarDate } = useStore();
  const moduleTasks = tasks; // Todas as agendas sincronizadas (mostram os mesmos cards)

  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = getDay(monthStart);
  const paddingDays = Array.from({ length: startDay }).map((_, i) => `pad-${i}`);

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const nextMonth = () => setCalendarDate(addMonths(calendarDate, 1));
  const prevMonth = () => setCalendarDate(subMonths(calendarDate, 1));
  const goToToday = () => setCalendarDate(new Date());

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden bg-[#0F0F0F]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-[#E0E0E0] capitalize tracking-tight">
            {format(calendarDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <div className="flex items-center gap-1 bg-[#181818] border border-[#333333] rounded-md p-0.5">
            <button onClick={prevMonth} className="p-1 text-[#777] hover:text-[#E0E0E0] transition-colors rounded hover:bg-[#2A2A2A]">
               <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={goToToday} className="px-2 text-xs font-bold text-[#777] hover:text-[#E0E0E0] transition-colors">
               Hoje
            </button>
            <button onClick={nextMonth} className="p-1 text-[#777] hover:text-[#E0E0E0] transition-colors rounded hover:bg-[#2A2A2A]">
               <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar border border-[#2A2A2A] rounded-lg bg-[#222222]">
        <div className="min-w-full md:min-w-[700px] h-full flex flex-col">
          <div className="grid grid-cols-7 gap-px shrink-0">
            {weekDays.map((day) => (
              <div key={day} className="bg-[#1A1A1A] py-2 text-center text-[10px] font-bold text-[#777777] uppercase tracking-widest">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px flex-1">
            {paddingDays.map((pad) => (
              <div key={pad} className="bg-[#111111] min-h-[70px] md:min-h-[100px]" />
            ))}

            {days.map((day) => {
              const dayStr = format(day, "yyyy-MM-dd");
              const dayTasks = moduleTasks.filter((t) => t.data === dayStr);

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "bg-[#111111] min-h-[70px] md:min-h-[100px] p-1 md:p-2 transition-colors hover:bg-[#181818] group flex flex-col",
                    !isSameMonth(day, monthStart) && "opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center text-[10px] md:text-xs font-bold mb-1 md:mb-2 shrink-0",
                      isToday(day) ? "bg-violet-600 text-white" : "text-[#777777] group-hover:text-[#E0E0E0]"
                    )}
                  >
                    {format(day, "d")}
                  </div>

                  <div className="space-y-1 overflow-y-auto custom-scrollbar pr-0.5 md:pr-1 flex-1">
                    {dayTasks.map((task) => {
                      const borderColors = {
                        "Comercial": "border-l-blue-500 shadow-[inset_2px_0_0_0_rgba(59,130,246,1)]",
                        "Produção": "border-l-orange-500 shadow-[inset_2px_0_0_0_rgba(249,115,22,1)]",
                        "Agenda": "border-l-emerald-500 shadow-[inset_2px_0_0_0_rgba(16,185,129,1)]"
                      };
                      return (
                        <div
                          key={task.id}
                          onClick={() => openTaskModal(task)}
                          className={cn(
                            "text-[8px] md:text-[10px] font-medium leading-tight px-1 py-0.5 md:px-2 md:py-1 bg-[#1A1A1A] text-[#999999] rounded border border-[#2A2A2A] cursor-pointer hover:border-[#444444] hover:text-white truncate",
                            borderColors[task.module]
                          )}
                        >
                          {task.horario && <span className="text-violet-500 mr-0.5 md:mr-1">{task.horario}</span>}
                          {task.cliente}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
