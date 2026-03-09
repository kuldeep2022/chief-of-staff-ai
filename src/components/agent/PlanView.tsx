'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader, AlertCircle, Target } from 'lucide-react';
import { useAgentStore } from '@/lib/store';
import { getToolByName } from '@/lib/tools';
import { cn } from '@/lib/utils';

const STATUS_ICON = {
  pending: <Circle size={14} className="text-zinc-600" />,
  running: <Loader size={14} className="text-indigo-400 animate-spin" />,
  completed: <CheckCircle size={14} className="text-green-400" />,
  error: <AlertCircle size={14} className="text-red-400" />,
  skipped: <Circle size={14} className="text-zinc-700" />,
};

export default function PlanView() {
  const { tasks, activeTaskId } = useAgentStore();
  const task = tasks.find(t => t.id === activeTaskId);

  if (!task?.plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-700 text-sm gap-2">
        <Target size={24} />
        <p>Plan will appear here when the agent starts</p>
      </div>
    );
  }

  const completed = task.plan.steps.filter(s => s.status === 'completed').length;
  const total = task.plan.steps.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Goal header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-2">
          <Target size={14} className="text-indigo-400" />
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Execution Plan</span>
        </div>
        <p className="text-sm text-zinc-300 font-medium">{task.plan.goal}</p>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs text-zinc-500 tabular-nums">{completed}/{total}</span>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {task.plan.steps.map((step, i) => {
          const tool = getToolByName(step.tool);
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'p-3 rounded-xl border transition-all',
                step.status === 'running' ? 'bg-indigo-500/5 border-indigo-500/30' :
                step.status === 'completed' ? 'bg-green-500/3 border-green-500/20' :
                step.status === 'error' ? 'bg-red-500/5 border-red-500/30' :
                'bg-zinc-900/50 border-zinc-800/50'
              )}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">{STATUS_ICON[step.status]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 tabular-nums">#{i + 1}</span>
                    <p className={cn(
                      'text-xs font-medium',
                      step.status === 'completed' ? 'text-zinc-400' : 'text-zinc-300'
                    )}>
                      {step.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {tool && (
                      <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                        <span>{tool.icon}</span>
                        <span className="font-mono">{step.tool}</span>
                      </span>
                    )}
                  </div>

                  {step.result && (
                    <p className="text-xs text-zinc-500 mt-1 truncate">{step.result}</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
