import { create } from 'zustand';
import { AgentTask, AgentStatus, ReasoningStep, PlanStep, TaskPlan, StepStatus } from './types';
import { v4 as uuid } from 'uuid';

interface AgentStore {
  tasks: AgentTask[];
  activeTaskId: string | null;
  sidePanel: 'tools' | 'history' | 'settings' | null;

  createTask: (query: string) => string;
  updateTaskStatus: (id: string, status: AgentStatus) => void;
  addReasoning: (taskId: string, step: Omit<ReasoningStep, 'id' | 'timestamp'>) => void;
  setTaskPlan: (taskId: string, plan: TaskPlan) => void;
  updatePlanStep: (taskId: string, stepId: string, update: Partial<PlanStep>) => void;
  setTaskResult: (taskId: string, result: string) => void;
  completeTask: (taskId: string, result: string) => void;
  failTask: (taskId: string, error: string) => void;
  setActiveTask: (id: string | null) => void;
  setSidePanel: (panel: 'tools' | 'history' | 'settings' | null) => void;
  clearTasks: () => void;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  tasks: [],
  activeTaskId: null,
  sidePanel: null,

  createTask: (query) => {
    const id = uuid();
    const task: AgentTask = {
      id,
      query,
      status: 'idle',
      reasoning: [],
      createdAt: Date.now(),
    };
    set({ tasks: [...get().tasks, task], activeTaskId: id });
    return id;
  },

  updateTaskStatus: (id, status) =>
    set({
      tasks: get().tasks.map(t =>
        t.id === id ? { ...t, status } : t
      ),
    }),

  addReasoning: (taskId, step) =>
    set({
      tasks: get().tasks.map(t =>
        t.id === taskId
          ? { ...t, reasoning: [...t.reasoning, { ...step, id: uuid(), timestamp: Date.now() }] }
          : t
      ),
    }),

  setTaskPlan: (taskId, plan) =>
    set({
      tasks: get().tasks.map(t =>
        t.id === taskId ? { ...t, plan } : t
      ),
    }),

  updatePlanStep: (taskId, stepId, update) =>
    set({
      tasks: get().tasks.map(t =>
        t.id === taskId && t.plan
          ? { ...t, plan: { ...t.plan, steps: t.plan.steps.map(s => s.id === stepId ? { ...s, ...update } : s) } }
          : t
      ),
    }),

  setTaskResult: (taskId, result) =>
    set({ tasks: get().tasks.map(t => t.id === taskId ? { ...t, result } : t) }),

  completeTask: (taskId, result) =>
    set({
      tasks: get().tasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'completed', result, completedAt: Date.now() }
          : t
      ),
    }),

  failTask: (taskId, error) =>
    set({
      tasks: get().tasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'error', result: error, completedAt: Date.now() }
          : t
      ),
    }),

  setActiveTask: (id) => set({ activeTaskId: id }),

  setSidePanel: (panel) => set({ sidePanel: panel }),

  clearTasks: () => set({ tasks: [], activeTaskId: null }),
}));
