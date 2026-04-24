import { useStore } from "../store";
import { ViewType, Role } from "../types";
import { cn } from "../lib/utils";

export default function Topbar() {
  const { activeModule, activeView, setView, openTaskModal } = useStore();

  const views: { type: ViewType; label: string }[] = [
    { type: "Kanban", label: "Board" },
    { type: "List", label: "Lista" },
    { type: "Calendar", label: "Agenda" },
  ];

  return (
    <header className="flex flex-col md:flex-row md:items-center md:h-16 border-b border-[#222222] bg-[#0A0A0A] shrink-0">
      
      {/* --- Mobile Layout --- */}
      <div className="flex flex-col w-full md:hidden">
        {/* Row 1: Title and Actions */}
        <div className="flex items-center justify-between px-4 h-14">
          <h2 className="text-lg font-bold text-[#E0E0E0]">{activeModule}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => openTaskModal()} 
              className="bg-violet-600 hover:bg-violet-700 text-white text-xl font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Row 2: View Switcher (Tabs) */}
        {activeModule !== "Agenda" && (
          <div className="flex items-center gap-5 px-4 h-10 overflow-x-auto bg-[#0a0a0a] border-t border-[#1a1a1a]">
            {views.map((v) => (
              <button
                key={v.type}
                onClick={() => setView(v.type)}
                className={cn(
                  "text-xs font-semibold whitespace-nowrap pb-2 border-b-2 transition-colors",
                  activeView === v.type
                    ? "text-violet-400 border-violet-500"
                    : "text-[#666] border-transparent hover:text-[#aaa]"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- Desktop Layout --- */}
      <div className="hidden md:flex flex-1 items-center justify-between px-8 h-full">
        <div className="flex flex-col">
          <span className="text-[#555] text-sm hidden md:block">Módulos / {activeModule}</span>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-[#E0E0E0]">{activeView} de {activeModule}</h2>
            {activeModule !== "Agenda" && (
              <div className="flex items-center bg-[#181818] border border-[#333333] rounded-md p-0.5 ml-4">
                {views.map((v) => (
                  <button
                    key={v.type}
                    onClick={() => setView(v.type)}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-medium transition-colors",
                      activeView === v.type
                        ? "bg-[#2A2A2A] text-white shadow-sm"
                        : "text-[#777] hover:text-[#E0E0E0]"
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pesquisar jobs..." 
              className="bg-[#181818] border border-[#333333] rounded-full py-1.5 px-4 text-xs w-64 focus:outline-none focus:border-violet-500 text-[#E0E0E0] placeholder-[#555]"
            />
          </div>
          <button 
            onClick={() => openTaskModal()} 
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center shrink-0"
          >
            + Novo Job
          </button>
        </div>
      </div>
    </header>
  );
}
