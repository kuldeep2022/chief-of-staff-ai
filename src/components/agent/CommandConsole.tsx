'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader, Sparkles } from 'lucide-react';
import { useAgentStore } from '@/lib/store';
import { runAgent } from '@/lib/agent-engine';
import { cn } from '@/lib/utils';

const EXAMPLE_QUERIES = [
  'Plan a weekend trip to New York under $600',
  'Plan a vacation to Miami for 3 days under $1000',
  'Research the best restaurants in San Francisco',
  'Find flights to Chicago and compare hotel prices',
  'Plan a team offsite in Austin, TX for next month',
];

export default function CommandConsole() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { createTask, tasks, activeTaskId } = useAgentStore();

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const isRunning = activeTask?.status === 'planning' || activeTask?.status === 'executing';

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isRunning) return;
    const query = input.trim();
    setInput('');
    setIsProcessing(true);
    const taskId = createTask(query);
    try {
      await runAgent(taskId, query);
    } catch (err) {
      console.error('Agent error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main input */}
      <div className="relative">
        <div
          className={cn(
            'flex items-center gap-3 bg-zinc-900 border rounded-2xl px-5 py-4 transition-all',
            isRunning
              ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10'
              : 'border-zinc-800 hover:border-zinc-700 focus-within:border-indigo-500/50'
          )}
        >
          <Sparkles size={18} className={cn('flex-shrink-0', isRunning ? 'text-indigo-400 animate-pulse' : 'text-zinc-600')} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={isRunning ? 'Agent is working...' : 'What should I do? (e.g., "Plan a weekend trip to NYC under $600")'}
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
            disabled={isRunning}
          />
          <motion.button
            whileHover={{ scale: isRunning ? 1 : 1.05 }}
            whileTap={{ scale: isRunning ? 1 : 0.95 }}
            onClick={handleSubmit}
            disabled={isRunning || !input.trim()}
            className={cn(
              'p-2 rounded-xl transition-all flex-shrink-0',
              !isRunning && input.trim()
                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            )}
          >
            {isRunning ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          </motion.button>
        </div>

        {isRunning && (
          <div className="absolute -bottom-0.5 left-4 right-4 h-0.5 rounded-full overflow-hidden">
            <div className="h-full shimmer rounded-full bg-indigo-500/20" style={{ width: '100%' }} />
          </div>
        )}
      </div>

      {/* Example queries */}
      {!activeTask && (
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((q) => (
            <motion.button
              key={q}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setInput(q)}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900/50 text-zinc-500 border border-zinc-800/50 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all truncate max-w-xs"
            >
              {q}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
