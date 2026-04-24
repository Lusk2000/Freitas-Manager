import { format, parseISO } from "date-fns";
import { useStore } from "../store";

export default function ListView() {
  const { tasks, activeModule, openTaskModal } = useStore();
  const moduleTasks = tasks.filter((t) => t.module === activeModule);

  return (
    <div className="flex-1 p-6 overflow-auto bg-[#0F0F0F]">
      <div className="border border-[#222222] rounded-lg bg-[#111111] overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#1A1A1A] text-[#777777] uppercase text-[10px] tracking-widest font-bold">
            <tr>
              <th className="px-6 py-3 border-b border-[#222222]">Job / Cliente</th>
              <th className="px-6 py-3 border-b border-[#222222]">Status</th>
              <th className="px-6 py-3 border-b border-[#222222]">Responsável</th>
              <th className="px-6 py-3 border-b border-[#222222]">Prazo</th>
              <th className="px-6 py-3 border-b border-[#222222]">Prioridade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222222] text-[#E0E0E0]">
            {moduleTasks.map((task) => (
              <tr 
                key={task.id} 
                onClick={() => openTaskModal(task)}
                className="hover:bg-[#1A1A1A] cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-white">{task.cliente}</div>
                  <div className="text-[11px] text-[#888888] truncate max-w-[300px] mt-0.5">{task.objetivo}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#999999] bg-[#222222] px-2 py-1 rounded">
                     {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#888888] text-xs">{task.responsavel}</td>
                <td className="px-6 py-4 text-[#888888] text-xs">
                   {task.data ? (
                     <div className="flex flex-col">
                       <span>{format(parseISO(task.data), "dd/MM/yyyy")}</span>
                       {task.horario && <span className="text-[10px] text-[#555555]">{task.horario}</span>}
                     </div>
                   ) : (
                     <span className="text-[#555555]">-</span>
                   )}
                </td>
                <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      task.prioridade === 'Urgente' ? 'text-red-500' :
                      task.prioridade === 'Alta' ? 'text-orange-400' : 'text-blue-400'
                    }`}>
                     {task.prioridade}
                   </span>
                </td>
              </tr>
            ))}
            
            {moduleTasks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#555555] italic text-xs">
                  Nenhuma tarefa encontrada neste módulo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
