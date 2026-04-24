import { LayoutDashboard, Briefcase, Video, CalendarDays, Settings } from "lucide-react";
import { useStore } from "../store";
import { ModuleName } from "../types";
import { cn } from "../lib/utils";

export default function Sidebar() {
  const { activeModule, setModule, activeUser } = useStore();

  const navItems: { name: ModuleName; icon: React.ReactNode }[] = [
    { name: "Comercial", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Produção", icon: <Video className="w-4 h-4" /> },
    { name: "Agenda", icon: <CalendarDays className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#111111] border-r border-[#222222] flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-lg leading-none">
          F
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-[#E0E0E0]">
          Freitas Hub
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-[11px] uppercase tracking-widest text-[#555] font-bold mb-2 mt-4 ml-2">Módulos</div>
        {navItems.map((item) => {
          const isActive = activeModule === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setModule(item.name)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-[#222] text-white"
                  : "text-[#999] hover:text-white"
              )}
            >
              <div className={cn(isActive && "text-violet-500")}>
                {item.icon}
              </div>
              {item.name}
            </button>
          );
        })}

        <div className="text-[11px] uppercase tracking-widest text-[#555] font-bold mb-2 mt-8 ml-2">Time</div>
        <div className="space-y-3 pt-2 ml-2">
          {["Lucas", "Luan", "Gabriel"].map(user => (
            <div key={user} className="flex items-center gap-2 text-sm text-white font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              {user}
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-[#222222] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shrink-0"></div>
        <div className="text-sm overflow-hidden">
          <div className="font-medium text-[#E0E0E0] truncate">Lucas Hub</div>
          <div className="text-xs text-[#555] truncate">Workspace Owner</div>
        </div>
      </div>
    </aside>
  );
}
