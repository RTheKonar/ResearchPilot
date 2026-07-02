import React from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Database, 
  Cpu, 
  Clock, 
  BookMarked,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { ResearchProject } from '../types';

interface SidebarProps {
  projects: { id: string; name: string; query: string; status: string; timestamp: string; paperCount: number }[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
}

export default function Sidebar({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject
}: SidebarProps) {
  // Aggregate stats for memory
  const completedProjects = projects.filter(p => p.status === 'completed');
  const runningProjects = projects.filter(p => p.status === 'running');
  const totalPapersCount = projects.reduce((acc, p) => acc + (p.paperCount || 0), 0);

  return (
    <div className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col h-screen overflow-hidden text-slate-300">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-sm">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">ResearchPilot</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1">Agentic AI Companion</p>
          </div>
        </div>
      </div>

      {/* Primary Action */}
      <div className="p-4 bg-slate-950/40 border-b border-slate-850">
        <button
          onClick={onCreateProject}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 shadow transition duration-150 cursor-pointer active:scale-95 text-xs uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Objective</span>
        </button>
      </div>

      {/* Navigation & Projects List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">
            <span>Recent Research</span>
            <span className="bg-slate-800 text-slate-300 rounded px-1.5 py-0.5 text-[9px]">{projects.length}</span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-slate-800 rounded-lg bg-slate-950/20">
              <Search className="w-5 h-5 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No projects started yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {projects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject(proj.id)}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-150 border ${
                      isActive 
                        ? 'bg-slate-800 border-slate-700 text-white shadow-sm' 
                        : 'border-transparent hover:bg-slate-850 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm font-semibold truncate leading-snug">
                        {proj.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <span>{new Date(proj.timestamp).toLocaleDateString()}</span>
                        <span>•</span>
                        {proj.status === 'completed' && (
                          <span className="flex items-center text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-emerald-400" />
                            {proj.paperCount} papers
                          </span>
                        )}
                        {proj.status === 'running' && (
                          <span className="flex items-center text-blue-400 font-semibold animate-pulse">
                            <Loader2 className="w-2.5 h-2.5 mr-0.5 animate-spin text-blue-400" />
                            Active
                          </span>
                        )}
                        {proj.status === 'failed' && (
                          <span className="flex items-center text-rose-400 font-semibold">
                            <XCircle className="w-2.5 h-2.5 mr-0.5 text-rose-400" />
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => onDeleteProject(proj.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-700 rounded text-slate-500 hover:text-rose-400 transition"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Memory Buffer Diagnostics */}
        <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/60 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-300 mb-3 border-b border-slate-850 pb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Vector Memory Profile</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-850">
              <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Total Topics</span>
              <span className="text-xs font-extrabold text-slate-200">{projects.length}</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-850">
              <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Parsed Papers</span>
              <span className="text-xs font-extrabold text-slate-200">{totalPapersCount}</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-850">
              <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Active Jobs</span>
              <span className="text-xs font-extrabold text-blue-400">{runningProjects.length}</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-850">
              <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Synthesized</span>
              <span className="text-xs font-extrabold text-emerald-400">{completedProjects.length}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-850 flex items-center space-x-2 text-[10px] text-slate-500 p-1 rounded">
            <BookMarked className="w-3.5 h-3.5 text-blue-500" />
            <span>ChromaDB Vector context loaded.</span>
          </div>
        </div>
      </div>

      {/* Workspace Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500">
        <span>V2.5.0 Flash-core</span>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-400">Active Node: 3</span>
        </div>
      </div>
    </div>
  );
}
