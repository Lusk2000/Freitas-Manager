import { create } from "zustand";
import { ModuleName, Role, Task, ViewType, MODULE_COLUMNS } from "./types";
import { supabase } from "./lib/supabase";

interface AppState {
  tasks: Task[];
  activeModule: ModuleName;
  activeView: ViewType;
  activeUser: Role;
  activeTaskEdit: Task | null;
  isTaskModalOpen: boolean;
  isLoading: boolean;

  setModule: (module: ModuleName) => void;
  setView: (view: ViewType) => void;
  setUser: (user: Role) => void;
  openTaskModal: (task?: Task | null) => void;
  closeTaskModal: () => void;

  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: string, newModule?: ModuleName) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  tasks: [],
  activeModule: "Comercial",
  activeView: "Kanban",
  activeUser: "Lucas",
  activeTaskEdit: null,
  isTaskModalOpen: false,
  isLoading: true,

  setModule: (module) => set({ activeModule: module, activeView: module === "Agenda" ? "Calendar" : "Kanban" }),
  setView: (view) => set({ activeView: view }),
  setUser: (user) => set({ activeUser: user }),
  openTaskModal: (task = null) => set({ activeTaskEdit: task, isTaskModalOpen: true }),
  closeTaskModal: () => set({ activeTaskEdit: null, isTaskModalOpen: false }),

  fetchTasks: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) {
      console.error("Error fetching tasks. Make sure the table 'tasks' exists in Supabase. Error:", error);
      // fallback to empty if error (e.g. table not found)
      set({ tasks: [], isLoading: false });
      return;
    }
    set({ tasks: data as Task[], isLoading: false });
  },

  addTask: async (taskData) => {
    const tempId = Math.random().toString(36).substring(2, 9);
    const optimisticTask: Task = {
      ...taskData,
      id: tempId,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI
    set((state) => ({ tasks: [...state.tasks, optimisticTask] }));

    const { data, error } = await supabase.from('tasks').insert([{
      id: optimisticTask.id,
      cliente: taskData.cliente,
      responsavel: taskData.responsavel,
      tipo: taskData.tipo,
      data: taskData.data,
      horario: taskData.horario,
      objetivo: taskData.objetivo,
      status: taskData.status,
      module: taskData.module,
      prioridade: taskData.prioridade,
      tags: taskData.tags,
      createdAt: optimisticTask.createdAt
    }]).select().single();

    if (error) {
      console.error("Error adding task:", error);
      // revert on fail
      set((state) => ({ tasks: state.tasks.filter(t => t.id !== tempId) }));
    } else if (data) {
      // replace temp with real
      set((state) => ({
        tasks: state.tasks.map(t => t.id === tempId ? data as Task : t)
      }));
    }
  },

  updateTask: async (id, updates) => {
    // Optimistic
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (error) {
      console.error("Error updating task:", error);
      // Note: A full robust version would restore the old state, skipping for brevity
      get().fetchTasks(); 
    }
  },

  deleteTask: async (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));

    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error("Error deleting task:", error);
      get().fetchTasks();
    }
  },

  moveTask: async (taskId, newStatus, newModule) => {
    const state = get();
    const taskIndex = state.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = state.tasks[taskIndex];
    const targetModule = newModule || task.module;

    // Optimistic update wrapper
    const triggerOptimisticUpdate = (tasks: Task[]) => set({ tasks });

    // Automation: Se moveu para Fechado no Comercial, cria automaticamente em Produção -> Briefing
    if (
      task.module === "Comercial" &&
      newStatus === "Fechado" &&
      task.status !== "Fechado"
    ) {
      const tempNewId = Math.random().toString(36).substring(2, 9);
      const newTaskData = {
        ...task,
        module: "Produção" as ModuleName,
        status: "Briefing",
      };
      
      const optimisticNewTask: Task = {
        ...newTaskData,
        id: tempNewId,
        createdAt: new Date().toISOString(),
      };
      
      triggerOptimisticUpdate([
        ...state.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: newStatus, module: targetModule }
            : t
        ),
        optimisticNewTask,
      ]);

      // Execute supabase calls
      await supabase.from('tasks').update({ status: newStatus, module: targetModule }).eq('id', taskId);
      const { data, error } = await supabase.from('tasks').insert([
        {
          id: optimisticNewTask.id,
          cliente: newTaskData.cliente,
          responsavel: newTaskData.responsavel,
          tipo: newTaskData.tipo,
          data: newTaskData.data,
          horario: newTaskData.horario,
          objetivo: newTaskData.objetivo,
          status: newTaskData.status,
          module: newTaskData.module,
          prioridade: newTaskData.prioridade,
          tags: newTaskData.tags,
          createdAt: optimisticNewTask.createdAt
        }
      ]).select().single();

      if (error) {
         console.error("Error replicating task on automation:", error);
         get().fetchTasks();
      } else if (data) {
         set((s) => ({ tasks: s.tasks.map(t => t.id === tempNewId ? data as Task : t) }));
      }
      return;
    }

    triggerOptimisticUpdate(
      state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus, module: targetModule }
          : t
      )
    );

    const { error } = await supabase.from('tasks').update({ status: newStatus, module: targetModule }).eq('id', taskId);
    if (error) {
      console.error("Error moving task:", error);
      get().fetchTasks();
    }
  },
}));
