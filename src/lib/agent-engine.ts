import { useAgentStore } from './store';
import { PlanStep, ToolCall, StepStatus } from './types';
import { executeTool } from './tool-executor';
import { AVAILABLE_TOOLS } from './tools';
import { v4 as uuid } from 'uuid';
import { delay } from './utils';

// The agent engine runs client-side, calling the API for Claude reasoning
// and executing tools locally for the demo

interface PlanResponse {
  goal: string;
  steps: Array<{
    description: string;
    tool: string;
    tool_input: Record<string, unknown>;
    reasoning: string;
  }>;
}

interface ExecuteResponse {
  thought: string;
  answer: string;
}

export async function runAgent(taskId: string, query: string) {
  const store = useAgentStore.getState();

  // Phase 1: Planning
  store.updateTaskStatus(taskId, 'planning');
  store.addReasoning(taskId, {
    type: 'thought',
    content: `Analyzing request: "${query}"\nBreaking down into actionable steps...`,
  });

  await delay(500);

  // Call planning API
  let plan: PlanResponse;
  try {
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'plan', query }),
    });
    const data = await res.json();
    plan = data.plan;
  } catch {
    // Fallback to mock plan if API is unavailable
    plan = generateMockPlan(query);
  }

  const planSteps: PlanStep[] = plan.steps.map((s, i) => ({
    id: uuid(),
    description: s.description,
    tool: s.tool,
    status: 'pending' as StepStatus,
    reasoning: s.reasoning,
  }));

  store.setTaskPlan(taskId, { goal: plan.goal, steps: planSteps });
  store.addReasoning(taskId, {
    type: 'plan',
    content: `**Plan created: ${plan.goal}**\n\n${planSteps.map((s, i) => `${i + 1}. ${s.description} (using \`${s.tool}\`)`).join('\n')}`,
  });

  // Phase 2: Execution
  store.updateTaskStatus(taskId, 'executing');
  const allResults: Record<string, string> = {};

  for (let i = 0; i < planSteps.length; i++) {
    const step = planSteps[i];
    const planInput = plan.steps[i];

    // Mark step as running
    store.updatePlanStep(taskId, step.id, { status: 'running' });
    store.addReasoning(taskId, {
      type: 'thought',
      content: `**Step ${i + 1}/${planSteps.length}:** ${step.description}\nUsing tool: \`${step.tool}\`\n${step.reasoning || ''}`,
    });

    await delay(300);

    // Execute tool
    const toolCall: ToolCall = {
      id: uuid(),
      tool: step.tool,
      input: planInput.tool_input,
      status: 'running',
      startedAt: Date.now(),
    };

    store.addReasoning(taskId, {
      type: 'tool_call',
      content: `Executing \`${step.tool}\`...`,
      toolCall,
    });

    try {
      const result = await executeTool(step.tool, planInput.tool_input);
      allResults[step.tool] = result;

      const completedCall: ToolCall = {
        ...toolCall,
        output: result,
        status: 'completed',
        completedAt: Date.now(),
        duration: Date.now() - (toolCall.startedAt || 0),
      };

      store.addReasoning(taskId, {
        type: 'observation',
        content: `Tool \`${step.tool}\` completed.\n\`\`\`json\n${result.slice(0, 400)}${result.length > 400 ? '\n...' : ''}\n\`\`\``,
        toolCall: completedCall,
      });

      store.updatePlanStep(taskId, step.id, {
        status: 'completed',
        result: result.slice(0, 200),
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Tool execution failed';
      store.updatePlanStep(taskId, step.id, { status: 'error', result: errorMsg });
      store.addReasoning(taskId, {
        type: 'observation',
        content: `⚠️ Tool \`${step.tool}\` failed: ${errorMsg}`,
      });
    }

    await delay(200);
  }

  // Phase 3: Synthesize answer
  store.addReasoning(taskId, {
    type: 'thought',
    content: 'All tools executed. Synthesizing final response...',
  });

  await delay(500);

  let finalAnswer: string;
  try {
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'synthesize', query, results: allResults }),
    });
    const data = await res.json();
    finalAnswer = data.answer;
  } catch {
    finalAnswer = generateMockAnswer(query, allResults);
  }

  store.addReasoning(taskId, {
    type: 'answer',
    content: finalAnswer,
  });

  store.completeTask(taskId, finalAnswer);
}

// Mock plan generator for demo mode (no API key)
function generateMockPlan(query: string): PlanResponse {
  const q = query.toLowerCase();

  if (q.includes('trip') || q.includes('travel') || q.includes('vacation') || q.includes('weekend')) {
    const city = extractCity(query) || 'New York';
    const budget = extractBudget(query) || 600;
    return {
      goal: `Plan a trip to ${city} within $${budget} budget`,
      steps: [
        { description: `Search for flights to ${city}`, tool: 'search_flights', tool_input: { origin: 'SFO', destination: city, date: '2025-04-15', max_price: Math.round(budget * 0.4) }, reasoning: 'Finding the best flight deals first to anchor the budget' },
        { description: `Find hotels in ${city}`, tool: 'search_hotels', tool_input: { city, check_in: '2025-04-15', check_out: '2025-04-17', max_price: Math.round(budget * 0.3 / 2) }, reasoning: 'Comparing hotel options for best value' },
        { description: `Check weather in ${city}`, tool: 'get_weather', tool_input: { city, date: '2025-04-15' }, reasoning: 'Weather affects activity planning' },
        { description: `Find activities in ${city}`, tool: 'search_activities', tool_input: { city }, reasoning: 'Discovering top attractions and experiences' },
        { description: `Find restaurants in ${city}`, tool: 'search_restaurants', tool_input: { city, price_range: '$$' }, reasoning: 'Finding dining options within budget' },
        { description: 'Calculate total budget', tool: 'calculate_budget', tool_input: { items: '[]', budget_limit: budget }, reasoning: 'Ensuring everything fits within budget' },
        { description: 'Create day-by-day itinerary', tool: 'create_itinerary', tool_input: { destination: city, days: 2, activities: '[]' }, reasoning: 'Organizing all plans into a structured schedule' },
        { description: 'Create calendar event', tool: 'create_calendar_event', tool_input: { title: `Trip to ${city}`, start_date: '2025-04-15', end_date: '2025-04-17' }, reasoning: 'Adding trip to calendar for reminders' },
      ],
    };
  }

  if (q.includes('meeting') || q.includes('schedule') || q.includes('agenda')) {
    return {
      goal: 'Research and prepare for the meeting',
      steps: [
        { description: 'Search for relevant background info', tool: 'web_search', tool_input: { query: query.replace(/schedule|plan|prepare/gi, '').trim() }, reasoning: 'Gathering context' },
        { description: 'Summarize findings', tool: 'summarize_data', tool_input: { data: 'gathered info', format: 'brief' }, reasoning: 'Creating concise brief' },
        { description: 'Create calendar event', tool: 'create_calendar_event', tool_input: { title: 'Meeting', start_date: '2025-04-10', end_date: '2025-04-10' }, reasoning: 'Blocking time on calendar' },
      ],
    };
  }

  // Default: general research task
  return {
    goal: `Research and compile information about: ${query}`,
    steps: [
      { description: 'Search the web for information', tool: 'web_search', tool_input: { query, num_results: 5 }, reasoning: 'Starting with broad research' },
      { description: 'Search for detailed data', tool: 'web_search', tool_input: { query: `${query} guide tips`, num_results: 3 }, reasoning: 'Gathering expert opinions and guides' },
      { description: 'Summarize all findings', tool: 'summarize_data', tool_input: { data: 'research results', format: 'detailed' }, reasoning: 'Compiling everything into a useful report' },
    ],
  };
}

function extractCity(query: string): string | null {
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'Seattle', 'Boston', 'Austin', 'Denver', 'Portland', 'Nashville', 'Paris', 'London', 'Tokyo'];
  for (const city of cities) {
    if (query.toLowerCase().includes(city.toLowerCase())) return city;
  }
  return null;
}

function extractBudget(query: string): number | null {
  const match = query.match(/\$(\d+)/);
  return match ? parseInt(match[1]) : null;
}

function generateMockAnswer(query: string, results: Record<string, string>): string {
  const parts: string[] = ['## Results\n'];

  for (const [tool, result] of Object.entries(results)) {
    try {
      const data = JSON.parse(result);
      if (data.note) {
        parts.push(`**${tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:** ${data.note}`);
      }
    } catch {
      parts.push(`**${tool}:** Completed`);
    }
  }

  parts.push('\n---\n*All steps completed. See the reasoning timeline for full details.*');
  return parts.join('\n\n');
}
