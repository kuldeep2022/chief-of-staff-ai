import Link from 'next/link';

const CAPABILITIES = [
  { icon: '🧠', title: 'Multi-Step Reasoning', desc: 'Breaks complex tasks into logical steps with transparent chain-of-thought reasoning visible in real-time.' },
  { icon: '🔧', title: 'Tool Execution', desc: '10 specialized tools: flight search, hotel booking, weather, restaurants, budgeting, itinerary, calendar, and more.' },
  { icon: '📋', title: 'Autonomous Planning', desc: 'Generates a full execution plan with dependency ordering before running any tools.' },
  { icon: '⚡', title: 'Real-time Dashboard', desc: 'Watch the agent think, plan, and execute — every reasoning step is visible as it happens.' },
  { icon: '📊', title: 'Result Synthesis', desc: 'Aggregates all tool outputs into a clear, actionable summary with recommendations.' },
  { icon: '🗂️', title: 'Task History', desc: 'Every task is stored with full reasoning trace for review and audit.' },
];

const EXAMPLE_TASKS = [
  '"Plan a weekend trip to New York under $600"',
  '"Find flights to Miami, compare hotels, and build an itinerary"',
  '"Research best restaurants in Chicago for a team dinner"',
  '"Plan a 3-day vacation to San Francisco with activities"',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-auto">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-indigo-600/6 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">CS</div>
          <span className="font-bold text-lg">Chief of Staff AI</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#architecture" className="text-sm text-zinc-500 hover:text-white transition-colors">Architecture</a>
          <Link href="/dashboard" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Open Console →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full px-4 py-1.5 text-xs text-indigo-300 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Autonomous AI Agent · Multi-Step Reasoning · 10 Tools
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          Your AI{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Chief of Staff
          </span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          An autonomous AI agent that plans, reasons, and executes multi-step tasks using real tools.
          Watch it think in real-time as it searches flights, compares hotels, builds itineraries, and manages your calendar.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/dashboard" className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-xl shadow-indigo-500/25 hover:-translate-y-0.5">
            Launch Agent Console
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Example tasks */}
        <div className="mt-12 max-w-xl mx-auto">
          <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">Try asking:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {EXAMPLE_TASKS.map(task => (
              <div key={task} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 text-xs text-zinc-400 text-left italic">
                {task}
              </div>
            ))}
          </div>
        </div>

        {/* Architecture diagram */}
        <div className="mt-16" id="architecture">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-zinc-500 font-mono">agent-architecture</span>
            </div>
            <div className="font-mono text-xs text-left space-y-2 text-zinc-400">
              <p><span className="text-indigo-400">User Query</span> → <span className="text-purple-400">Planner (Claude)</span></p>
              <p>  └─ Generates execution plan with N steps</p>
              <p></p>
              <p><span className="text-purple-400">Planner</span> → <span className="text-amber-400">Tool Executor</span></p>
              <p>  ├─ search_flights  ✈️  │ search_hotels  🏨</p>
              <p>  ├─ get_weather    🌤️  │ search_restaurants 🍽️</p>
              <p>  ├─ search_activities 🎭 │ calculate_budget  💰</p>
              <p>  ├─ create_itinerary 📋 │ create_calendar   📅</p>
              <p>  └─ web_search     🔍  │ summarize_data    📊</p>
              <p></p>
              <p><span className="text-amber-400">Tool Results</span> → <span className="text-green-400">Synthesizer (Claude)</span></p>
              <p>  └─ Final answer with recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Production-Grade Agent Architecture</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Built with autonomous planning, tool orchestration, and real-time observability.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map(c => (
            <div key={c.title} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-all">
              <div className="text-2xl mb-3">{c.icon}</div>
              <h3 className="font-semibold text-white mb-2">{c.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 px-6 py-8 text-center">
        <p className="text-xs text-zinc-600">Built with Next.js, Claude API & Zustand · Portfolio project by Kuldeep Dave</p>
      </footer>
    </div>
  );
}
