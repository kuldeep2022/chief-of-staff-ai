import Anthropic from '@anthropic-ai/sdk';
import { AVAILABLE_TOOLS } from '@/lib/tools';

const toolDescriptions = AVAILABLE_TOOLS.map(t =>
  `- ${t.name}: ${t.description} (params: ${t.parameters.map(p => `${p.name}:${p.type}${p.required ? '*' : ''}`).join(', ')})`
).join('\n');

export async function POST(req: Request) {
  const { action, query, results } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'no_api_key' }, { status: 503 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  if (action === 'plan') {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are an autonomous AI planning agent. Given a user request, create a detailed step-by-step execution plan using the available tools.

Available tools:
${toolDescriptions}

Respond with ONLY valid JSON in this format:
{
  "goal": "concise goal statement",
  "steps": [
    {
      "description": "what this step does",
      "tool": "tool_name",
      "tool_input": { "param1": "value1" },
      "reasoning": "why this step is needed"
    }
  ]
}

Be thorough — use 5-8 steps for complex tasks. Use realistic parameter values.`,
      messages: [{ role: 'user', content: query }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    try {
      const plan = JSON.parse(text);
      return Response.json({ plan });
    } catch {
      return Response.json({ error: 'Failed to parse plan' }, { status: 500 });
    }
  }

  if (action === 'synthesize') {
    const resultSummary = Object.entries(results as Record<string, string>)
      .map(([tool, result]) => {
        try {
          const data = JSON.parse(result);
          return `**${tool}**: ${data.note || JSON.stringify(data).slice(0, 200)}`;
        } catch {
          return `**${tool}**: ${String(result).slice(0, 200)}`;
        }
      })
      .join('\n\n');

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are an AI assistant synthesizing results from multiple tool executions into a clear, actionable summary for the user. Use markdown formatting. Be concise but thorough. Include specific numbers, recommendations, and a clear conclusion.`,
      messages: [
        { role: 'user', content: `Original request: "${query}"\n\nTool results:\n${resultSummary}\n\nSynthesize these results into a clear, actionable response.` },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : 'Unable to synthesize results.';
    return Response.json({ answer: text });
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 });
}
