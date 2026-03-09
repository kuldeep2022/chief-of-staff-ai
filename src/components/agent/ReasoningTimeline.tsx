'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Wrench, Eye, CheckCircle, Loader } from 'lucide-react';
import { useAgentStore } from '@/lib/store';
import { ReasoningStep } from '@/lib/types';
import { cn } from '@/lib/utils';

const STEP_CONFIG: Record<ReasoningStep['type'], { icon: React.ReactNode; color: string; label: string }> = {
  thought: { icon: <Brain size={14} />, color: 'text-purple-400', label: 'Thinking' },
  plan: { icon: <Target size={14} />, color: 'text-blue-400', label: 'Planning' },
  tool_call: { icon: <Wrench size={14} />, color: 'text-amber-400', label: 'Executing Tool' },
  observation: { icon: <Eye size={14} />, color: 'text-cyan-400', label: 'Observation' },
  answer: { icon: <CheckCircle size={14} />, color: 'text-green-400', label: 'Final Answer' },
};

function StepItem({ step, index }: { step: ReasoningStep; index: number }) {
  const config = STEP_CONFIG[step.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ delay: 0.05 }}
      className="flex gap-3 group"
    >
      {/* Timeline line + icon */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center border',
          step.type === 'answer' ? 'bg-green-500/10 border-green-500/30' :
          step.type === 'tool_call' ? 'bg-amber-500/10 border-amber-500/30' :
          'bg-zinc-800 border-zinc-700'
        )}>
          <span className={config.color}>{config.icon}</span>
        </div>
        <div className="w-px flex-1 bg-zinc-800 mt-1" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-xs font-semibold uppercase tracking-wider', config.color)}>
            {config.label}
          </span>
          <span className="text-xs text-zinc-600">
            {new Date(step.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className={cn(
          'text-sm leading-relaxed',
          step.type === 'answer' ? 'text-zinc-200' : 'text-zinc-400'
        )}>
          {step.content.split('\n').map((line, i) => {
            if (line.startsWith('**') && line.includes('**')) {
              const parts = line.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={i} className="mb-1">
                  {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-zinc-200 font-semibold">{p}</strong> : p)}
                </p>
              );
            }
            if (line.startsWith('```')) return null;
            if (line.match(/^\d+\./)) return <p key={i} className="mb-0.5 pl-3">{line}</p>;
            return line ? <p key={i} className="mb-1">{line}</p> : <br key={i} />;
          })}
        </div>

        {/* Tool call badge */}
        {step.toolCall && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-xs">
            <Wrench size={10} className="text-amber-400" />
            <span className="text-zinc-400 font-mono">{step.toolCall.tool}</span>
            {step.toolCall.status === 'completed' && (
              <span className="text-green-400 ml-1">✓ {step.toolCall.duration}ms</span>
            )}
            {step.toolCall.status === 'running' && (
              <Loader size={10} className="text-amber-400 animate-spin ml-1" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ReasoningTimeline() {
  const { tasks, activeTaskId } = useAgentStore();
  const task = tasks.find(t => t.id === activeTaskId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task?.reasoning.length]);

  if (!task) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-700 text-sm">
        Enter a command to see the agent's reasoning process
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {/* Task header */}
      <div className="mb-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn(
            'w-2 h-2 rounded-full',
            task.status === 'completed' ? 'bg-green-400' :
            task.status === 'error' ? 'bg-red-400' :
            'bg-indigo-400 pulse-dot'
          )} />
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
            {task.status === 'completed' ? 'Completed' :
             task.status === 'error' ? 'Error' :
             task.status === 'planning' ? 'Planning' :
             task.status === 'executing' ? 'Executing' : 'Starting'}
          </span>
        </div>
        <p className="text-sm text-zinc-300 font-medium">{task.query}</p>
      </div>

      {/* Timeline */}
      <AnimatePresence mode="popLayout">
        {task.reasoning.map((step, i) => (
          <StepItem key={step.id} step={step} index={i} />
        ))}
      </AnimatePresence>

      {/* Running indicator */}
      {(task.status === 'planning' || task.status === 'executing') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 pl-10 text-xs text-indigo-400"
        >
          <Loader size={12} className="animate-spin" />
          <span className="typing-cursor">Processing</span>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
