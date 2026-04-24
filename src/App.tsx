import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import KanbanBoard from "./components/Kanban";
import ListView from "./components/List";
import CalendarView from "./components/Calendar";
import TaskModal from "./components/TaskModal";
import { useStore } from "./store";

export default function App() {
  const { activeView, fetchTasks } = useStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="flex h-screen w-full bg-[#0A0A0A] text-[#E0E0E0] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        
        <main className="flex-1 relative overflow-hidden flex flex-col bg-[#0F0F0F]">
          {activeView === "Kanban" && <KanbanBoard />}
          {activeView === "List" && <ListView />}
          {activeView === "Calendar" && <CalendarView />}
        </main>
        {/* Status Bar */}
        <footer className="h-8 bg-[#111111] border-t border-[#222222] px-6 flex items-center justify-between text-[10px] text-[#555555] uppercase tracking-widest font-bold shrink-0">
          <div className="flex items-center gap-6">
            <span className="text-violet-500">● Live Updates Ativo</span>
            <span>3 Tasks Ativas</span>
            <span>2 Finalizadas Hoje</span>
          </div>
          <div>v2.4.0 • Freitas Hub Manager</div>
        </footer>
      </div>

      <TaskModal />
    </div>
  );
}
