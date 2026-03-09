# Chief of Staff AI

An autonomous AI agent that plans, reasons, and executes multi-step tasks using real tools — with full reasoning transparency.

## Architecture

```
User Query → Planner (Claude) → Tool Executor → Synthesizer → Final Answer
```

**3-Phase Execution:**
1. **Planning** — Claude breaks the query into a multi-step execution plan with dependency ordering
2. **Execution** — Each step runs the appropriate tool (flights, hotels, weather, etc.) with mock or real data
3. **Synthesis** — Claude aggregates all tool outputs into a clear, actionable recommendation

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **State:** Zustand
- **AI:** Anthropic Claude API (claude-haiku-4-5)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 10 Built-in Tools

| Tool | Category | Description |
|------|----------|-------------|
| search_flights | search | Search flights between cities |
| search_hotels | search | Find hotels by city and dates |
| search_restaurants | search | Discover restaurants by cuisine/location |
| search_activities | search | Find activities and attractions |
| get_weather | data | Get weather forecasts |
| calculate_budget | compute | Budget breakdown calculator |
| create_itinerary | data | Generate day-by-day itineraries |
| create_calendar_event | calendar | Create calendar events |
| web_search | search | General web search |
| summarize_data | compute | Summarize and analyze data |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY (optional — works with mock data)

# Run development server
npm run dev

# Build for production
npm run build
```

## Docker

```bash
docker-compose up --build
```

## Demo Mode

The app works fully without an API key using intelligent mock data. When an API key is configured, Claude generates real execution plans and synthesized answers.

## Key Features

- **Real-time Reasoning Timeline** — Watch the agent think step-by-step
- **Execution Plan Visualization** — See progress through each tool call
- **10 Specialized Tools** — Flight search, hotel booking, weather, restaurants, and more
- **Task History** — Every task stored with full reasoning trace
- **Dark Theme** — Clean, professional zinc-950 design

## Project Structure

```
src/
├── app/
│   ├── api/agent/     # Claude API route (plan + synthesize)
│   ├── dashboard/     # Main agent dashboard
│   └── page.tsx       # Landing page
├── components/agent/
│   ├── CommandConsole  # Query input with examples
│   ├── ReasoningTimeline # Step-by-step reasoning display
│   ├── PlanView        # Execution plan progress
│   └── ToolsSidebar    # Tools catalog + task history
└── lib/
    ├── agent-engine.ts # Core 3-phase orchestration
    ├── tool-executor.ts # Mock tool implementations
    ├── tools.ts        # Tool definitions
    ├── store.ts        # Zustand state
    └── types.ts        # TypeScript types
```

---

Built by **Kuldeep Dave** · SWE2 @ Meta
