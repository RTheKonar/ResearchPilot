import React from 'react';
import { motion } from 'motion/react';
import { 
  FileSearch, 
  BookOpen, 
  BarChart4, 
  GitFork, 
  RefreshCw, 
  FileSpreadsheet, 
  Compass, 
  Database,
  ArrowRight
} from 'lucide-react';

interface AgentGraphProps {
  activeAgent: string;
}

export default function AgentGraph({ activeAgent }: AgentGraphProps) {
  // Define agent nodes
  const nodes = [
    { id: 'planner', name: 'Planner Agent', desc: 'Schedules tasks & targets', icon: Compass, color: 'from-blue-600 to-cyan-600' },
    { id: 'search', name: 'Search Agent', desc: 'Queries arXiv & Semantic Scholar', icon: FileSearch, color: 'from-cyan-600 to-teal-600' },
    { id: 'reader', name: 'Reading Agent', desc: 'Virtual PDF parsing & abstracts', icon: BookOpen, color: 'from-blue-600 to-indigo-600' },
    { id: 'comparison', name: 'Comparison Agent', desc: 'Generates comparisons', icon: FileSpreadsheet, color: 'from-purple-600 to-indigo-600' },
    { id: 'gap_analysis', name: 'Gap Analyzer', desc: 'Scans research frontiers', icon: GitFork, color: 'from-amber-600 to-orange-600' },
    { id: 'reflection', name: 'Reflection Agent', desc: 'Checks quality confidence', icon: RefreshCw, color: 'from-rose-600 to-pink-600' },
    { id: 'report', name: 'Synthesizer', desc: 'Compiles APA Markdown', icon: BarChart4, color: 'from-emerald-600 to-teal-600' }
  ];

  // Helper to determine active index
  const activeIndex = nodes.findIndex(n => {
    if (activeAgent.toLowerCase().includes('planner')) return n.id === 'planner';
    if (activeAgent.toLowerCase().includes('search')) return n.id === 'search';
    if (activeAgent.toLowerCase().includes('reading') || activeAgent.toLowerCase().includes('reader')) return n.id === 'reader';
    if (activeAgent.toLowerCase().includes('comparison')) return n.id === 'comparison';
    if (activeAgent.toLowerCase().includes('gap')) return n.id === 'gap_analysis';
    if (activeAgent.toLowerCase().includes('reflection')) return n.id === 'reflection';
    if (activeAgent.toLowerCase().includes('report') || activeAgent.toLowerCase().includes('synthesizer')) return n.id === 'report';
    return false;
  });

  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
      {/* Dynamic Background Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:16px_16px] opacity-15"></div>
      
      {/* Top Indicators */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Agent Workflow Mesh Network</span>
          </h3>
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mt-1">Multi-Agent State Orchestration Engine</p>
        </div>
        <span className="bg-slate-800/90 border border-slate-700 rounded px-3 py-1 text-xs text-slate-300 font-mono flex items-center space-x-1.5 self-stretch sm:self-auto justify-center">
          <Database className="w-3.5 h-3.5 text-blue-400 mr-1 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-slate-400">STATE: </span>
          <span className="text-blue-400 font-bold uppercase">{nodes[activeIndex]?.name || 'Initializing'}</span>
        </span>
      </div>

      {/* Grid of Agent Nodes */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-7 gap-3 items-stretch">
        {nodes.map((node, index) => {
          const isNodeActive = index === activeIndex;
          const isCompleted = index < activeIndex && activeIndex !== -1;
          const Icon = node.icon;

          return (
            <React.Fragment key={node.id}>
              {/* Agent Node Card */}
              <motion.div
                layout
                animate={{
                  scale: isNodeActive ? 1.02 : 1,
                }}
                className={`relative rounded-lg p-3.5 flex flex-col items-center text-center transition-all duration-150 border ${
                  isNodeActive 
                    ? 'bg-slate-950 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] z-10' 
                    : isCompleted 
                      ? 'bg-slate-900/40 border-emerald-500/40 opacity-90'
                      : 'bg-slate-950/20 border-slate-800/80 opacity-60'
                }`}
              >
                {/* Visual Connector / Glow Line */}
                {isNodeActive && (
                  <span className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 -z-10 blur-[1px] opacity-40 animate-pulse"></span>
                )}

                {/* Node Icon Circle */}
                <div className={`w-10 h-10 rounded bg-gradient-to-br ${node.color} flex items-center justify-center text-white shadow-sm mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h4 className="text-xs font-bold leading-tight truncate w-full text-slate-100 font-mono tracking-tight">
                  {node.name}
                </h4>
                <p className="text-[9px] text-slate-400 mt-1 leading-snug h-8 overflow-hidden line-clamp-2">
                  {node.desc}
                </p>

                {/* Status Indicator Pill */}
                <span className={`text-[9px] font-mono font-bold mt-3 px-2 py-0.5 rounded ${
                  isNodeActive 
                    ? 'bg-blue-950/80 text-blue-400 border border-blue-800/50 animate-pulse' 
                    : isCompleted
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/30'
                      : 'bg-slate-800/40 text-slate-400 border border-slate-700/30'
                }`}>
                  {isNodeActive ? 'ACTIVE' : isCompleted ? 'DONE' : 'STANDBY'}
                </span>
              </motion.div>

              {/* Connector Chevron/Arrow (Show between cards except last node) */}
              {index < nodes.length - 1 && (
                <div className="hidden md:flex justify-center items-center text-slate-800">
                  <ArrowRight className={`w-3.5 h-3.5 ${
                    isCompleted ? 'text-emerald-500' : isNodeActive ? 'text-blue-500 animate-pulse' : 'text-slate-800'
                  }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
