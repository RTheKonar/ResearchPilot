import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  GitFork, 
  Network, 
  HelpCircle, 
  Bookmark, 
  Download, 
  Copy, 
  Check,
  TrendingUp,
  AlertTriangle,
  Compass,
  Award,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Database,
  Trash2,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { ResearchProject } from '../types';
import PaperTimeline from './PaperTimeline';
import CitationGraph from './CitationGraph';
import SecurityDashboard from './SecurityDashboard';

interface DashboardTabsProps {
  project: ResearchProject;
  onDownloadMarkdown: () => void;
  onCopyReport: () => void;
  copySuccess: boolean;
}

export default function DashboardTabs({
  project,
  onDownloadMarkdown,
  onCopyReport,
  copySuccess
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'comparison' | 'gaps' | 'timeline' | 'glossary' | 'bibliography' | 'security'>('synthesis');

  const { papers, comparison, gapAnalysis, report } = project;

  if (!report) return null;

  return (
    <div className="space-y-6">
      {/* Dynamic Tab Switchers */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-200/80 rounded-lg border border-slate-300 max-w-full">
        <button
          onClick={() => setActiveTab('synthesis')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
            activeTab === 'synthesis' 
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Executive Synthesis</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
            activeTab === 'comparison' 
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Comparison Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('gaps')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
            activeTab === 'gaps' 
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Gaps & Frontiers</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
            activeTab === 'timeline' 
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Timeline & Graph</span>
        </button>

        <button
          onClick={() => setActiveTab('glossary')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
            activeTab === 'glossary' 
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Glossary</span>
        </button>

        <button
          onClick={() => setActiveTab('bibliography')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
            activeTab === 'bibliography' 
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bibliography</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
            activeTab === 'security' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-300/40'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security Posture & Shield</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-300">
        {/* TAB 1: EXECUTIVE SYNTHESIS REPORT */}
        {activeTab === 'synthesis' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Primary Report Content Column */}
            <div className="xl:col-span-8 bg-white rounded-xl p-8 border border-slate-200 shadow-sm space-y-8 relative">
              
              {/* Header */}
              <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-blue-600 tracking-widest block mb-1">
                    Academic Synthesis Report
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {project.name}
                  </h2>
                </div>

                {/* Report Download Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onCopyReport}
                    className="py-2 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition duration-150 cursor-pointer"
                  >
                    {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copySuccess ? 'Copied' : 'Copy Report'}</span>
                  </button>
                  <button
                    onClick={onDownloadMarkdown}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow transition duration-150 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download APA Markdown</span>
                  </button>
                </div>
              </div>

              {/* Research Objective Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Research Objective</h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                    {report.objective}
                  </p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Executive Summary</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {report.executiveSummary}
                </p>
              </div>

              {/* Methodological Trends */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Methodological Trends & Paradigms</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium bg-blue-50/20 border border-blue-100/50 rounded-lg p-5">
                  {report.methodologicalTrends}
                </p>
              </div>

              {/* Suggested Reading Order */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Suggested Reading Roadmap</h3>
                <div className="space-y-3">
                  {report.suggestedReadingOrder.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3.5 bg-slate-50 border border-slate-200/60 p-4 rounded-lg hover:bg-slate-50 transition duration-150">
                      <div className="w-7 h-7 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Sidebar Key Takeaways */}
            <div className="xl:col-span-4 space-y-6 sticky top-6">
              {/* Paper list overview with take-aways */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2 flex items-center">
                  <Award className="w-4 h-4 text-blue-600 mr-1.5" />
                  Primary Literature Takeaways
                </h3>
                <div className="space-y-4">
                  {report.topPapers.map((takeaway, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[9px] font-bold uppercase text-slate-400">Paper {idx + 1} Takeaway</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded border border-slate-200">
                        {takeaway}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Citation Summary */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-6 shadow border border-slate-800 space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent)]"></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 relative z-10 flex items-center">
                  <TrendingUp className="w-4 h-4 text-blue-400 mr-1.5" />
                  Synthesis Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Literature Analyzed</span>
                    <span className="text-xl font-extrabold text-blue-400 mt-1 block">{papers.length} Publications</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Methodologies compared</span>
                    <span className="text-xl font-extrabold text-cyan-400 mt-1 block">{comparison.length} Models</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Technical glossary</span>
                    <span className="text-xl font-extrabold text-blue-400 mt-1 block">{report.glossary.length} Terms</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Future horizons</span>
                    <span className="text-xl font-extrabold text-cyan-400 mt-1 block">{report.futureResearchDirections.length} Topics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPARATIVE MATRIX */}
        {activeTab === 'comparison' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center space-x-2.5 mb-6 border-b border-slate-200 pb-3">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Literature Comparison Matrix</h3>
                <p className="text-xs text-slate-400 mt-1">Cross-examine datasets, core mechanics, and scientific claims side-by-side</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    <th className="p-4 w-1/4">Paper Title & Ref</th>
                    <th className="p-4 w-1/6">Core Method</th>
                    <th className="p-4 w-1/6">Benchmarks / Datasets</th>
                    <th className="p-4 w-1/4">Core Strengths</th>
                    <th className="p-4 w-1/4">Critical Weaknesses</th>
                    <th className="p-4 w-1/4">Novel Contributions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                  {comparison.map((row) => (
                    <tr key={row.paperId} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-900 leading-snug">
                        {row.title}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded text-[10px] uppercase border border-blue-200/55">
                          {row.method}
                        </span>
                      </td>
                      <td className="p-4 font-medium">
                        {row.dataset}
                      </td>
                      <td className="p-4 font-medium leading-relaxed text-emerald-700">
                        {row.strengths}
                      </td>
                      <td className="p-4 font-medium leading-relaxed text-rose-700">
                        {row.weaknesses}
                      </td>
                      <td className="p-4 font-medium leading-relaxed text-blue-800 bg-blue-50/10">
                        {row.novelContributions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GAPS & FRONTIERS */}
        {activeTab === 'gaps' && gapAnalysis && (
          <div className="space-y-6">
            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Gaps */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs mb-3.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Identified Research Gaps</span>
                  </div>
                  <div className="space-y-3">
                    {gapAnalysis.researchGaps.map((item, idx) => (
                      <p key={idx} className="text-xs text-slate-600 font-medium leading-relaxed bg-rose-50/10 p-3 border border-rose-100/30 rounded-lg">
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Open Problems */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs mb-3.5">
                    <Compass className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Open Scientific Problems</span>
                  </div>
                  <div className="space-y-3">
                    {gapAnalysis.openProblems.map((item, idx) => (
                      <p key={idx} className="text-xs text-slate-600 font-medium leading-relaxed bg-blue-50/10 p-3 border border-blue-100/30 rounded-lg">
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3: Common Limitations */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-slate-600 font-bold text-xs mb-3.5">
                    <AlertTriangle className="w-4 h-4 text-slate-400" />
                    <span className="uppercase tracking-widest">Methodological Limitations</span>
                  </div>
                  <div className="space-y-3">
                    {gapAnalysis.commonLimitations.map((item, idx) => (
                      <p key={idx} className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 border border-slate-200/40 rounded-lg">
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Row: Conflicting results & Future Directions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                  Academic Discord & Conflicting Results
                </h4>
                <div className="space-y-3">
                  {gapAnalysis.conflictingResults.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3 bg-amber-50/20 border border-amber-100/40 p-4 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-6 border border-slate-850 shadow-sm">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
                  Unexplored High-Potential Frontiers
                </h4>
                <div className="space-y-3">
                  {gapAnalysis.futureDirections.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                      <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAPER TIMELINE & CITATION GRAPH */}
        {activeTab === 'timeline' && (
          <div className="space-y-8">
            <CitationGraph papers={papers} />
            <PaperTimeline papers={papers} />
          </div>
        )}

        {/* TAB 5: TECHNICAL GLOSSARY */}
        {activeTab === 'glossary' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-6 border-b border-slate-200 pb-3">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Scientific Domain Glossary</h3>
                <p className="text-xs text-slate-400 mt-1">Acquaint yourself with parsed jargon and scientific nomenclature</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {report.glossary.map((item, idx) => (
                <div key={idx} className="p-5 border border-slate-200 bg-slate-50/40 rounded-lg hover:bg-slate-50 transition duration-150">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                    <span>{item.term}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BIBLIOGRAPHY */}
        {activeTab === 'bibliography' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-6 border-b border-slate-200 pb-3">
              <Bookmark className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">APA Bibliography</h3>
                <p className="text-xs text-slate-400 mt-1">Export standard citations for your academic footnotes and references</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg relative font-mono text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {report.bibliography}
            </div>
          </div>
        )}

        {/* TAB 7: SECURITY POSTURE & SHIELD LOGS */}
        {activeTab === 'security' && (
          <SecurityDashboard project={project} />
        )}
      </div>
    </div>
  );
}
