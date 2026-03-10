'use client';

import { Wrench, History, Brain } from 'lucide-react';
import CommandConsole from '@/components/agent/CommandConsole';
import ReasoningTimeline from '@/components/agent/ReasoningTimeline';
import PlanView from '@/components/agent/PlanView';
import ToolsSidebar from '@/components/agent/ToolsSidebar';
import { useAgentStore } from '@/lib/store';
import Link from 'next/link';

export default function DashboardPage() {
  const { sidePanel, setSidePanel } = useAgentStore();

  return (
    <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden">
      {/* Top bar */}
      <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-3 sm:px-4 bg-zinc-950/80 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Brain size={14} className="text-indigo-400" />
            </div>
            <span className="font-bold text-sm text-white">Chief of Staff</span>
          </Link>
          <span className="text-zinc-700 hidden sm:block">/</span>
          <span className="text-zinc-500 text-sm hidden sm:block">Agent Console</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSidePanel(sidePanel === 'tools' ? null : 'tools')}
            className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${sidePanel === 'tools' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900'}`}
          >
            <Wrench size={13} /> <span className="hidden sm:inline">Tools</span>
          </button>
          <button
            onClick={() => setSidePanel(sidePanel === 'history' ? null : 'history')}
            className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${sidePanel === 'history' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900'}`}
          >
            <History size={13} /> <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Reasoning timeline */}
        <div className="flex-1 flex flex-col overflow-hidden md:border-r border-zinc-800">
          <div className="px-3 sm:px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
            <Brain size={12} className="text-purple-400" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Reasoning Timeline</span>
          </div>
          <ReasoningTimeline />
        </div>

        {/* Right: Plan view - hidden on mobile */}
        <div className="hidden md:flex w-96 flex-col overflow-hidden">
          <PlanView />
        </div>

        {/* Optional sidebar */}
        <ToolsSidebar />
      </div>

      {/* Bottom: Command console */}
      <div className="border-t border-zinc-800 p-3 sm:p-4 bg-zinc-950/90">
        <CommandConsole />
      </div>
    </div>
  );
}
