import { useEffect, useState } from "react";
import { useStore } from "../store";
import { Button, Input, Label, Modal, Select, Textarea } from "./ui";
import { Role, TaskType, Priority, Task, MODULE_COLUMNS } from "../types";

export default function TaskModal() {
  const { activeTaskEdit, isTaskModalOpen, closeTaskModal, addTask, updateTask, activeModule, deleteTask } = useStore();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({
    cliente: "",
    responsavel: "Lucas",
    tipo: "Reunião",
    data: "",
    horario: "",
    objetivo: "",
    prioridade: "Normal",
    tags: [],
    status: MODULE_COLUMNS[activeModule][0],
  });

  const [tagInput, setTagInput] = useState("");

  const isOpen = isTaskModalOpen;

  useEffect(() => {
    setIsConfirmingDelete(false);
    if (activeTaskEdit && activeTaskEdit.id) {
      setFormData(activeTaskEdit);
      setTagInput(activeTaskEdit.tags.join(", "));
    } else {
      setFormData({
        cliente: "",
        responsavel: "Lucas",
        tipo: "Reunião",
        data: "",
        horario: "",
        objetivo: "",
        prioridade: "Normal",
        tags: [],
        module: "Comercial",
        status: MODULE_COLUMNS["Comercial"][0],
      });
      setTagInput("");
    }
  }, [activeTaskEdit, activeModule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = tagInput.split(",").map(t => t.trim()).filter(Boolean);
    const finalData = { ...formData, tags: tagsArray, module: formData.module || "Comercial" } as any;

    if (activeTaskEdit && activeTaskEdit.id) {
      updateTask(activeTaskEdit.id, finalData);
    } else {
      addTask(finalData);
    }
    
    closeTaskModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeTaskModal}
      title={activeTaskEdit && activeTaskEdit.id ? "Editar TAREFA" : "Nova TAREFA"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Job / Cliente</Label>
          <Input 
            required
            value={formData.cliente} 
            onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
            placeholder="Ex: Tatu Preparações"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Responsável</Label>
            <Select 
              value={formData.responsavel}
              onChange={(e) => setFormData({ ...formData, responsavel: e.target.value as Role })}
            >
              <option value="Lucas">Lucas</option>
              <option value="Luan">Luan</option>
              <option value="Gabriel">Gabriel</option>
            </Select>
          </div>
          <div>
            <Label>Tipo</Label>
            <Select 
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TaskType })}
            >
              <option value="Reunião">Reunião</option>
              <option value="Gravação">Gravação</option>
              <option value="Estratégia">Estratégia</option>
              <option value="Edição">Edição</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Data</Label>
            <Input 
              type="date" 
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            />
          </div>
          <div>
            <Label>Horário</Label>
            <Input 
              type="time" 
              value={formData.horario}
              onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Módulo</Label>
            <Select 
              value={formData.module || "Comercial"}
              onChange={(e) => {
                const newModule = e.target.value as "Comercial" | "Produção" | "Agenda";
                setFormData({ 
                  ...formData, 
                  module: newModule,
                  status: MODULE_COLUMNS[newModule][0]
                });
              }}
            >
              <option value="Comercial">Comercial</option>
              <option value="Produção">Produção</option>
              <option value="Agenda">Agenda</option>
            </Select>
          </div>
          <div>
            <Label>Status Atual</Label>
            <Select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {MODULE_COLUMNS[formData.module || "Comercial"].map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label>Objetivo / Escopo</Label>
          <Textarea 
            required
            value={formData.objetivo}
            onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
            placeholder="Descreva o que precisa ser feito..."
            className="h-24 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Prioridade</Label>
            <Select 
              value={formData.prioridade}
              onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as Priority })}
            >
              <option value="Normal">Normal</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </Select>
          </div>
          <div>
            <Label>Tags (separadas por vírgula)</Label>
            <Input 
              value={tagInput} 
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Ex: premium, travado"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#222222] flex justify-between gap-3 mt-6">
          {activeTaskEdit && activeTaskEdit.id ? (
            isConfirmingDelete ? (
              <Button 
                type="button" 
                variant="outline" 
                className="text-white border-red-500 bg-red-600 hover:bg-red-700"
                onClick={() => {
                  deleteTask(activeTaskEdit.id!);
                  closeTaskModal();
                }}
              >
                Certeza?
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                onClick={() => setIsConfirmingDelete(true)}
              >
                Excluir
              </Button>
            )
          ) : (
            <div></div>
          )}
          <div className="flex gap-3">
             <Button type="button" variant="ghost" onClick={closeTaskModal}>Cancelar</Button>
             <Button type="submit" variant="primary">Salvar Job</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
