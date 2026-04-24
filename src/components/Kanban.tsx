import React, { useState } from "react";
import { useStore } from "../store";
import { MODULE_COLUMNS, Task } from "../types";
import { cn } from "../lib/utils";

export default function KanbanBoard() {
  const { activeModule, tasks, moveTask, openTaskModal } = useStore();
  const columns = MODULE_COLUMNS[activeModule];
  const moduleTasks = tasks.filter((t) => t.module === activeModule);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      moveTask(id, status);
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="flex-1 flex gap-4 md:gap-6 p-4 md:p-6 overflow-x-auto overflow-y-hidden bg-[#0F0F0F] snap-x snap-mandatory md:snap-none custom-scrollbar pb-6">
      {columns.map((columnName) => {
        const colTasks = moduleTasks.filter((t) => t.status === columnName);

        return (
      <div
            key={columnName}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, columnName)}
            className="flex flex-col gap-3 min-w-[280px] w-[85vw] md:w-auto md:min-w-[200px] md:flex-1 shrink-0 snap-center md:snap-align-none"
          >
            <div className="flex items-center justify-between px-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-tighter text-[#777]">{columnName}</span>
                <span className="bg-[#222] text-[#999] text-[10px] px-1.5 py-0.5 rounded">
                  {colTasks.length}
                </span>
              </div>
              <button 
                onClick={() => openTaskModal()}
                className="text-[#555] hover:text-white"
              >
                +
              </button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pb-4 min-h-[150px]">
              {colTasks.map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  isDragging={draggedTaskId === task.id}
                  onDragStart={handleDragStart}
                  onClick={() => openTaskModal(task)}
                />
              ))}
              {colTasks.length === 0 && (
                <div className="flex-1 border-2 border-dashed border-[#222] rounded-xl flex items-center justify-center p-6 bg-[#111]/30 min-h-[100px]">
                  <span className="text-[#333] text-xs font-medium uppercase tracking-wider">Solte para mover</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Urgente": return "text-red-500";
    case "Alta": return "text-orange-400";
    case "Normal": return "text-blue-400";
    default: return "text-[#777]";
  }
}

function KanbanCard({
  task,
  isDragging,
  onDragStart,
  onClick,
}: {
  task: Task;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onClick: () => void;
}) {
  const priorityColor = getPriorityColor(task.prioridade);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={onClick}
      className={cn(
        "bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 space-y-3 cursor-grab active:cursor-grabbing hover:border-violet-500/50 transition-colors shadow-sm",
        isDragging && "opacity-50 border-violet-500/50 scale-[0.98]",
      )}
    >
      <div className="flex justify-between items-start">
        <span className={cn("text-[10px] font-bold uppercase tracking-widest", priorityColor)}>
          {task.prioridade}
        </span>
        <span className="text-[10px] text-[#555]">{task.horario || "Sem hora"}</span>
      </div>
      
      <div>
        <div className="text-sm font-semibold text-white leading-tight mb-1">{task.cliente}</div>
        <div className="text-xs text-[#888] line-clamp-2">{task.objetivo}</div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#222]">
        <div className="flex items-center gap-1.5 text-[10px] text-[#555]">
          {task.tipo}
        </div>
        <span className="text-[10px] text-[#555] italic font-medium">{task.responsavel}</span>
      </div>
    </div>
  );
}
