export type AgentStatus = 'idle' | 'planning' | 'executing' | 'completed' | 'error';
export type StepStatus = 'pending' | 'running' | 'completed' | 'error' | 'skipped';

export interface ToolCall {
  id: string;
  tool: string;
  input: Record<string, unknown>;
  output?: string;
  status: StepStatus;
  startedAt?: number;
  completedAt?: number;
  duration?: number;
}

export interface ReasoningStep {
  id: string;
  type: 'thought' | 'plan' | 'tool_call' | 'observation' | 'answer';
  content: string;
  toolCall?: ToolCall;
  timestamp: number;
}

export interface TaskPlan {
  goal: string;
  steps: PlanStep[];
}

export interface PlanStep {
  id: string;
  description: string;
  tool: string;
  status: StepStatus;
  reasoning?: string;
  result?: string;
}

export interface AgentTask {
  id: string;
  query: string;
  status: AgentStatus;
  plan?: TaskPlan;
  reasoning: ReasoningStep[];
  result?: string;
  createdAt: number;
  completedAt?: number;
  tokensUsed?: number;
  toolsExecuted?: number;
}

export interface Tool {
  name: string;
  description: string;
  icon: string;
  category: 'search' | 'compute' | 'data' | 'calendar' | 'communication';
  parameters: ToolParam[];
}

export interface ToolParam {
  name: string;
  type: string;
  description: string;
  required: boolean;
}
