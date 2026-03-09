'use client';

import { AVAILABLE_TOOLS } from '@/lib/tools';
import { useAgentStore } from '@/lib/store';
import { History, Wrench, Settings, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  search: 'text-cyan-400',
  compute: 'text-purple-400',
  data: 'text-green-400',
  calendar: 'text-amber-400',
  communication: 'text-pink-400',
};

function ToolsPanel() {
  const categories = [...new Set(AVAILABLE_TOOLS.map(t => t.category))];

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold px-1">Available Tools ({AVAILABLE_TOOLS.length})</p>
      {categories.map(cat => (
        <div key={cat}>
          <p className={cn('text-xs uppercase tracking-wider font-semibold mb-2 px-1', CATEGORY_COLORS[cat])}>{cat}</p>
          <div className="space-y-1">
            {AVAILABLE_TOOLS.filter(t => t.category === cat).map(tool => (
              <div key={tool.name} className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{tool.icon}</span>
                  <span className="text-xs font-mono text-zinc-300">{tool.name}</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryPanel() {
  const { tasks, setActiveTask } = useAgentStore();
  const sorted = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

  if (sorted.length === 0) {
    return <p className="text-xs text-zinc-600 text-center py-8">No task history yet</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold px-1">Task History ({sorted.length})</p>
      {sorted.map(task => (
        <button
          key={task.id}
          onClick={() => setActiveTask(task.id)}
          className="w-full text-left p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
        >
          <p className="text-xs text-zinc-300 truncate">{task.query}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn(
              'w-1.5 h-1.5 rounded-full',
              task.status === 'completed' ? 'bg-green-400' :
              task.status === 'error' ? 'bg-red-400' : 'bg-zinc-600'
            )} />
            <span className="text-xs text-zinc-600">{formatDate(task.createdAt)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function ToolsSidebar() {
  const { sidePanel, setSidePanel } = useAgentStore();
  if (!sidePanel) return null;

  return (
    <div className="w-72 border-l border-zinc-800 flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          {sidePanel === 'tools' && <Wrench size={14} className="text-zinc-500" />}
          {sidePanel === 'history' && <History size={14} className="text-zinc-500" />}
          <span className="text-sm font-semibold text-zinc-300 capitalize">{sidePanel}</span>
        </div>
        <button onClick={() => setSidePanel(null)} className="text-zinc-600 hover:text-zinc-400 transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {sidePanel === 'tools' && <ToolsPanel />}
        {sidePanel === 'history' && <HistoryPanel />}
      </div>
    </div>
  );
}
