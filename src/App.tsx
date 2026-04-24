import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import KanbanBoard from "./components/Kanban";
import ListView from "./components/List";
import CalendarView from "./components/Calendar";
import TaskModal from "./components/TaskModal";
import { useStore } from "./store";
import { Briefcase, Video, CalendarDays, UserCircle2 } from "lucide-react";
import { cn } from "./lib/utils";
import { ModuleName } from "./types";

export default function App() {
  const { activeView, fetchTasks, activeModule, setModule } = useStore();
  const [showMobileTeam, setShowMobileTeam] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const navItems: { name: ModuleName; icon: React.ReactNode }[] = [
    { name: "Comercial", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Produção", icon: <Video className="w-5 h-5" /> },
    { name: "Agenda", icon: <CalendarDays className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-[100dvh] w-full bg-[#0A0A0A] text-[#E0E0E0] font-sans flex-col md:flex-row overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />
        
        {showMobileTeam ? (
          <main className="flex-1 overflow-y-auto bg-[#0F0F0F] p-6 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold text-[#E0E0E0] mb-6">Time</h2>
            <div className="text-[11px] uppercase tracking-widest text-[#555] font-bold mb-4">Membros Ativos</div>
            <div className="space-y-4 bg-[#111] p-4 rounded-lg border border-[#222]">
              {["Lucas", "Luan", "Gabriel"].map(user => (
                <div key={user} className="flex items-center gap-3 text-base text-white font-medium p-2 bg-[#1A1A1A] rounded-md border border-[#2A2A2A]">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  {user}
                </div>
              ))}
            </div>
            <p className="text-xs text-[#555] mt-6 text-center leading-relaxed">
              Todos os membros têm os mesmos acessos. <br/> "Arrume o time, sem (Admin) todos ativos."
            </p>
          </main>
        ) : (
          <main className="flex-1 relative overflow-hidden flex flex-col bg-[#0F0F0F]">
            {activeView === "Kanban" && <KanbanBoard />}
            {activeView === "List" && <ListView />}
            {activeView === "Calendar" && <CalendarView />}
          </main>
        )}

        {/* Status Bar (Desktop) */}
        <footer className="hidden md:flex h-8 bg-[#111111] border-t border-[#222222] px-6 items-center justify-between text-[10px] text-[#555555] uppercase tracking-widest font-bold shrink-0">
          <div className="flex items-center gap-6">
            <span className="text-violet-500">● Live Updates Ativo</span>
            <span>3 Tasks Ativas</span>
            <span>2 Finalizadas Hoje</span>
          </div>
          <div>v2.4.0 • Freitas Hub Manager</div>
        </footer>

        {/* Bottom Nav (Mobile) */}
        <div className="md:hidden flex h-16 bg-[#111111] border-t border-[#222222] shrink-0 items-center justify-around px-2 z-40 pb-safe">
          {navItems.map((item) => {
            const isActive = activeModule === item.name && !showMobileTeam;
            return (
              <button
                key={item.name}
                onClick={() => { setModule(item.name); setShowMobileTeam(false); }}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                  isActive ? "text-violet-500" : "text-[#777]"
                )}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.name}</span>
              </button>
            );
          })}
          <button 
            onClick={() => setShowMobileTeam(true)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
              showMobileTeam ? "text-violet-500" : "text-[#777]"
            )}
          >
             <UserCircle2 className="w-5 h-5" />
             <span className="text-[10px] font-medium">Time</span>
          </button>
        </div>
      </div>

      <TaskModal />
    </div>
  );
}

