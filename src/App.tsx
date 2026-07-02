import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Cpu, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  Compass, 
  Clock, 
  GitFork, 
  AlertTriangle,
  RefreshCw,
  Loader2,
  ListChecks,
  Activity,
  CheckCircle2,
  ChevronRight,
  Terminal,
  Bookmark,
  FileSpreadsheet,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import AgentGraph from './components/AgentGraph';
import DashboardTabs from './components/DashboardTabs';
import { ResearchProject } from './types';

export default function App() {
  const [projects, setProjects] = useState<{ id: string; name: string; query: string; status: string; timestamp: string; paperCount: number }[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<ResearchProject | null>(null);
  const [query, setQuery] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'welcome' | 'running' | 'completed' | 'failed'>('welcome');
  const [mcpStatus, setMcpStatus] = useState<any>(null);
  const [showMcpModal, setShowMcpModal] = useState(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested starter queries
  const sampleSuggestions = [
    "Help me understand Reinforcement Learning for RNA Folding.",
    "Explain Graph Neural Networks in Antibiotic Drug Discovery.",
    "Multi-agent LLM systems for Autonomous Software Engineering.",
    "Secure Memory Architecture and Vector DB Isolation in ChromaDB."
  ];

  // Fetch all projects list on load
  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        
        // Auto-select latest project if none selected
        if (data.length > 0 && !activeProjectId) {
          handleSelectProject(data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetch('/api/mcp-status')
      .then(res => res.ok ? res.json() : null)
      .then(data => setMcpStatus(data))
      .catch(err => console.error("Error fetching MCP status:", err));
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Poll active project if running
  const startPolling = (id: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const projectData: ResearchProject = await res.json();
          setActiveProject(projectData);
          
          if (projectData.status !== 'running') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            fetchProjects(); // refresh projects list with completed/failed counts
          }
        }
      } catch (err) {
        console.error("Error polling project:", err);
      }
    }, 2000);
  };

  // Handle Project Selection
  const handleSelectProject = async (id: string) => {
    setActiveProjectId(id);
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data: ResearchProject = await res.json();
        setActiveProject(data);
        
        if (data.status === 'running') {
          startPolling(id);
        }
      }
    } catch (err) {
      console.error("Error loading project:", err);
    }
  };

  // Start new research objective
  const handleStartResearch = async (objectiveQuery: string) => {
    if (!objectiveQuery.trim()) return;

    try {
      setActiveProject(null);
      setActiveProjectId(null);

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: objectiveQuery })
      });

      if (res.ok) {
        const data: ResearchProject = await res.json();
        setActiveProjectId(data.id);
        setActiveProject(data);
        setQuery('');
        fetchProjects(); // update sidebar list
        startPolling(data.id); // start polling execution logs
      }
    } catch (err) {
      console.error("Error launching research task:", err);
    }
  };

  // Continue research with more specialized keywords (Agentic Expansion)
  const handleContinueResearch = async () => {
    if (!activeProject) return;
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeProject.query, projectId: activeProject.id })
      });

      if (res.ok) {
        const data: ResearchProject = await res.json();
        setActiveProject(data);
        fetchProjects();
        startPolling(data.id);
      }
    } catch (err) {
      console.error("Error expanding research:", err);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this research project? This clears all vector storage memory for this objective.")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (activeProjectId === id) {
          setActiveProjectId(null);
          setActiveProject(null);
        }
        fetchProjects();
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  // Reset to Welcome / New Search Screen
  const handleCreateNewProject = () => {
    setActiveProjectId(null);
    setActiveProject(null);
    setQuery('');
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
  };

  // Download Markdown file helper
  const handleDownloadMarkdown = () => {
    if (!activeProject || !activeProject.report) return;
    const blob = new Blob([activeProject.report.rawMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeProject.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy full report to clipboard helper
  const handleCopyReport = () => {
    if (!activeProject || !activeProject.report) return;
    navigator.clipboard.writeText(activeProject.report.rawMarkdown);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Scroll terminal logs to bottom automatically
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeProject?.logs]);

  // Determine view screen based on activeProject status
  const currentView = activeProject ? activeProject.status : 'welcome';

  // Get active agent for visual graph
  const getActiveAgent = () => {
    if (!activeProject || activeProject.status !== 'running') return '';
    const runningTask = activeProject.plan?.tasks.find(t => t.status === 'running');
    return runningTask ? runningTask.agent : 'Planner Agent';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      {/* SIDEBAR CONTAINER */}
      <Sidebar 
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateNewProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* MAIN WORKSPACE SECTION */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-10">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <span>ResearchPilot Dashboard</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-600 font-bold capitalize">
              {currentView === 'welcome' ? 'Workspace' : activeProject?.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMcpModal(true)}
              className="text-xs text-slate-500 hover:text-blue-700 font-semibold bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-3 py-1 rounded-full flex items-center space-x-1.5 transition duration-150 cursor-pointer"
              title="Click to view Model Context Protocol (MCP) Server Status & Tools"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>MCP Server Active</span>
            </button>
            <span className="text-xs text-slate-400 font-semibold bg-slate-100 border border-slate-200 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gemini 2.5 Flash Connected</span>
            </span>
          </div>
        </div>

        {/* Dynamic Inner Workspace Panel */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
          
          {/* VIEW SCENARIO A: WELCOME & PROMPT SELECTION */}
          {currentView === 'welcome' && (
            <div className="max-w-3xl mx-auto space-y-10 pt-8">
              {/* Giant elegant title block */}
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow mx-auto">
                  <Cpu className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none font-mono uppercase">
                  ResearchPilot
                </h1>
                <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                  An Agentic AI Research Companion for Literature Discovery, Analysis, and Knowledge Synthesis. 
                  Start a deep systematic literature search below.
                </p>
              </div>

              {/* Research Input Bar */}
              <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-3 relative">
                <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStartResearch(query)}
                    placeholder="Enter research topic, objective, or computational question..."
                    className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder-slate-400 font-semibold"
                  />
                  <button
                    onClick={() => handleStartResearch(query)}
                    className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    Launch Agents
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-semibold uppercase tracking-wider">
                  <span>Queries research repositories and synthesizes structured reports automatically.</span>
                  <span className="font-bold text-blue-600">Enter to run</span>
                </div>
              </div>

              {/* Sample suggestion list */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
                  Suggested Research Objectives
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleSuggestions.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleStartResearch(s)}
                      className="p-4 border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/10 rounded-xl cursor-pointer shadow-sm transition group"
                    >
                      <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                        <span>Scenario {idx + 1}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition" />
                      </h4>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                        {s}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW SCENARIO B: ACTIVE RUNNING LOOP */}
          {currentView === 'running' && activeProject && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Header card with loader */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wide">
                    Orchestrator Online
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    Synthesizing: {activeProject.query}
                  </h2>
                </div>
                <div className="flex items-center space-x-3.5 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-xs font-bold text-slate-600 animate-pulse">Running systematic analysis...</span>
                </div>
              </div>

              {/* Dynamic Interactive Multi-Agent Node Graph */}
              <AgentGraph activeAgent={getActiveAgent()} />

              {/* Splitted Column Layout: Plan progress & Live Logs terminal */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* 6-step static dynamic plan progress */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2.5 flex items-center">
                    <ListChecks className="w-4 h-4 text-blue-600 mr-1.5" />
                    Dynamic Task Progress Matrix
                  </h3>
                  
                  {activeProject.plan ? (
                    <div className="space-y-4">
                      {activeProject.plan.tasks.map((task, idx) => (
                        <div key={task.id} className="flex items-start space-x-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 border ${
                            task.status === 'completed' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' :
                            task.status === 'running' ? 'bg-blue-50 border-blue-300 text-blue-700 animate-pulse' :
                            'bg-slate-50 border-slate-200 text-slate-400'
                          }`}>
                            {task.status === 'completed' ? '✓' : idx + 1}
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold leading-tight ${
                              task.status === 'completed' ? 'text-slate-400 line-through' :
                              task.status === 'running' ? 'text-blue-900' : 'text-slate-500'
                            }`}>
                              {task.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      Drafting research tasks...
                    </div>
                  )}
                </div>

                {/* Log terminal */}
                <div className="lg:col-span-7 bg-slate-950 text-slate-200 border border-slate-900 rounded-xl p-6 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>Agent Thought Monitor Logs</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>

                  <div className="font-mono text-[10px] space-y-2 h-72 overflow-y-auto pr-2">
                    {activeProject.logs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed">
                        <span className="text-slate-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                        <span className={`font-bold uppercase ${
                          log.agent.includes('Search') ? 'text-cyan-400' :
                          log.agent.includes('Reading') ? 'text-blue-400' :
                          log.agent.includes('Comparison') ? 'text-purple-400' :
                          log.agent.includes('Gap') ? 'text-amber-400' :
                          log.agent.includes('Reflection') ? 'text-rose-400' :
                          'text-emerald-400'
                        }`}>
                          {log.agent}
                        </span>:{' '}
                        <span className={log.level === 'error' ? 'text-rose-500 font-bold' : log.level === 'warn' ? 'text-amber-400' : 'text-slate-200'}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                    <div ref={logsEndRef}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW SCENARIO C: COMPLETED DASHBOARD */}
          {currentView === 'completed' && activeProject && (
            <div className="max-w-6xl mx-auto space-y-8">
              
              {/* Dynamic Notification Action Banner: Continuation or agent info */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest">
                    Agents Dormant • Synthesis Ready
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    Literature synthesis completed for "{activeProject.query}"
                  </h2>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleContinueResearch}
                    className="py-2.5 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition duration-150 cursor-pointer active:scale-95"
                    title="Run search iteration with recommended specialized keywords"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Expand Literature Synthesis</span>
                  </button>
                </div>
              </div>

              {/* Tabbed content details */}
              <DashboardTabs 
                project={activeProject}
                onDownloadMarkdown={handleDownloadMarkdown}
                onCopyReport={handleCopyReport}
                copySuccess={copySuccess}
              />
            </div>
          )}

          {/* VIEW SCENARIO D: FAILED ERROR SCREEN */}
          {currentView === 'failed' && activeProject && (
            activeProject.defenseAudit?.overallVerdict === 'threat_blocked' ? (
              <div className="max-w-2xl mx-auto py-8 space-y-8 animate-fade-in">
                {/* Visual Security Banner */}
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 text-center space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.07),transparent)]"></div>
                  <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shadow-inner mx-auto relative z-10 animate-pulse">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 relative z-10">
                    <span className="text-[10px] uppercase font-extrabold px-3 py-1 bg-rose-100 text-rose-800 rounded-full border border-rose-200">
                      PROMPT INJECTION CONTAINED
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mt-2 font-mono">
                      SECURITY SHIELD TRIGGERED
                    </h2>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      A malicious prompt override command or jailbreak attempt was identified within the research query. 
                      Execution has been aborted to safeguard downstream reasoning models.
                    </p>
                  </div>
                </div>

                {/* Audit Checklist telemetry */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2.5 flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 text-rose-600 mr-1.5" />
                      <span>Security Inspection Checklist</span>
                    </div>
                    <span className="text-[10px] text-rose-600 font-extrabold uppercase">THREAT BLOCKED</span>
                  </h3>

                  <div className="space-y-3">
                    {activeProject.defenseAudit.checks.map((check, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded ${
                              check.status === 'blocked' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                            }`}></span>
                            <span>{check.component}</span>
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                            {check.details}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                          check.status === 'blocked' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {check.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => {
                      setActiveProjectId(null);
                      setActiveProject(null);
                    }}
                    className="py-2.5 px-5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-sm transition duration-150 cursor-pointer active:scale-95"
                  >
                    Return to Workspace
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-xl mx-auto py-12 text-center space-y-6">
                <div className="w-14 h-14 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm mx-auto">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none uppercase font-mono">
                    Workflow Execution Interrupted
                  </h2>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    The Multi-Agent framework met an unexpected terminal error during literature search. Review the diagnostic logs below.
                  </p>
                </div>

                {/* Mini Diagnostic log scroll */}
                <div className="bg-slate-950 text-left p-4 rounded-lg font-mono text-[10px] text-slate-200 max-h-40 overflow-y-auto">
                  {activeProject.logs.map((log, idx) => (
                    <div key={idx} className="py-0.5">
                      <span className="text-slate-500">[{log.agent}]</span> {log.message}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleStartResearch(activeProject.query)}
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition duration-150 cursor-pointer"
                >
                  Re-initialize Orchestrator
                </button>
              </div>
            )
          )}

        </div>
      </div>

      {/* MODEL CONTEXT PROTOCOL (MCP) SERVICE OVERLAY MODAL */}
      {showMcpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold">
                  MCP
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Model Context Protocol Integration Console
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    ResearchPilot Ecosystem Server Status
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMcpModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-md hover:bg-slate-100 transition cursor-pointer"
              >
                Close Console
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Server Metadata Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Server Name</span>
                  <span className="text-xs font-bold text-slate-800">
                    {mcpStatus?.name || "ResearchPilot Multi-Agent MCP Server"}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Protocol Version</span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    v{mcpStatus?.version || "1.0.0"}
                  </span>
                </div>
              </div>

              {/* Server Endpoint Configurations */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Active SSE Connection Endpoints
                </h4>
                <div className="p-4 bg-slate-950 text-slate-300 font-mono text-[10px] rounded-xl border border-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Event-Stream Target (GET):</span>
                    <span className="text-blue-400 font-bold bg-blue-950/40 border border-blue-900/30 px-2 py-0.5 rounded">
                      /sse
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Messaging Routing (POST):</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded">
                      /messages
                    </span>
                  </div>
                  <div className="border-t border-slate-900 pt-2 text-[9px] text-slate-400 leading-relaxed font-sans">
                    💡 <strong>How to connect:</strong> Direct your LLM client (e.g. Claude Desktop or a custom MCP client) to establish a Server-Sent Events (SSE) session at <code>http://localhost:3000/sse</code>. All JSON-RPC client messages will route through the matching message target.
                  </div>
                </div>
              </div>

              {/* Registered Capabilities & Tools */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Registered Schema Tools ({mcpStatus?.tools?.length || 4})
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {(mcpStatus?.tools || [
                    { name: "list_projects", description: "Retrieve a list of all research projects and literature synthesis topics." },
                    { name: "get_project", description: "Get comprehensive details of a specific research project (including findings, paper list, comparative matrix, and gap analysis)." },
                    { name: "create_research_project", description: "Initialize and run a multi-agent literature search and synthesis workflow for a scientific query." },
                    { name: "verify_integrity", description: "Perform secure cryptographic HMAC chain signature auditing of all logs in a research project." }
                  ]).map((tool: any) => (
                    <div key={tool.name} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                      <div className="bg-blue-100 text-blue-800 text-[9px] font-mono font-bold px-2 py-1 rounded border border-blue-200 shrink-0 mt-0.5">
                        {tool.name}
                      </div>
                      <p className="text-xs text-slate-600 font-semibold leading-normal">
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowMcpModal(false)}
                className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
              >
                Okay, Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
