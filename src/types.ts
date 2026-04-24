export type Role = "Lucas" | "Luan" | "Gabriel";
export type ModuleName = "Comercial" | "Produção" | "Agenda";
export type ViewType = "Kanban" | "Calendar" | "List";
export type TaskType = "Reunião" | "Gravação" | "Estratégia" | "Edição";
export type Priority = "Urgente" | "Alta" | "Normal";

export const MODULE_COLUMNS: Record<ModuleName, string[]> = {
  Comercial: [
    "Lead novo",
    "Contato iniciado",
    "Qualificação",
    "Proposta enviada",
    "Fechado",
    "Perdido",
  ],
  Produção: [
    "Briefing",
    "Planejamento",
    "Em produção",
    "Em revisão",
    "Aprovado",
    "Entregue",
  ],
  Agenda: ["Reuniões", "Gravações", "Edição", "Entrega"],
};

export interface Task {
  id: string;
  cliente: string;
  responsavel: Role;
  tipo: TaskType;
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  objetivo: string;
  status: string;
  module: ModuleName;
  prioridade: Priority;
  tags: string[];
  createdAt: string;
}
