import React, { useState } from 'react';
import { Network, FileText, ArrowRight, BookOpen } from 'lucide-react';
import { ResearchPaper } from '../types';

interface CitationGraphProps {
  papers: ResearchPaper[];
}

export default function CitationGraph({ papers }: CitationGraphProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(papers[0]?.id || null);

  const activePaper = papers.find(p => p.id === activeNodeId) || papers[0];

  // Mock node coordinates for layout spacing
  const positions = [
    { x: 120, y: 150 }, // central node 1
    { x: 380, y: 110 }, // right top node 2
    { x: 440, y: 260 }, // right bottom node 3
    { x: 220, y: 320 }, // central bottom node 4
    { x: 150, y: 410 }, // extra node 5
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center space-x-2.5 mb-6 border-b border-slate-100 pb-3">
        <Network className="w-5 h-5 text-indigo-600" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Interactive Concept Citation Graph</h3>
          <p className="text-xs text-slate-400 mt-1">Explore intellectual heritage and conceptual relations between papers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        {/* Interactive SVG canvas */}
        <div className="xl:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-900 min-h-[380px] relative overflow-hidden flex flex-col justify-between">
          {/* Subtle star or network mesh background details */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent)]"></div>
          
          <div className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900/60 px-3 py-1 border border-slate-800/80 rounded-md self-start">
            Vector Projection Canvas
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center">
            <svg viewBox="0 0 600 450" className="w-full max-w-lg h-auto">
              <defs>
                {/* Connection gradient */}
                <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Linking lines representing concept references */}
              {papers.map((p, idx) => {
                if (idx === 0) return null;
                const pSource = positions[0];
                const pTarget = positions[idx % positions.length];
                return (
                  <g key={`link-${idx}`}>
                    <line
                      x1={pSource.x}
                      y1={pSource.y}
                      x2={pTarget.x}
                      y2={pTarget.y}
                      stroke="url(#linkGrad)"
                      strokeWidth="2.5"
                      strokeDasharray={idx === 2 ? "5,5" : "0"}
                      className="transition-all duration-300 hover:stroke-indigo-400"
                    />
                    {/* Direction arrow bubble */}
                    <circle
                      cx={(pSource.x + pTarget.x) / 2}
                      cy={(pSource.y + pTarget.y) / 2}
                      r="4"
                      fill="#818cf8"
                    />
                  </g>
                );
              })}

              {/* Render paper nodes */}
              {papers.map((paper, idx) => {
                const pos = positions[idx % positions.length];
                const isActive = activeNodeId === paper.id;
                
                return (
                  <g 
                    key={paper.id}
                    className="cursor-pointer group"
                    onClick={() => setActiveNodeId(paper.id)}
                  >
                    {/* Ring glow */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? "28" : "22"}
                      fill={isActive ? "rgba(99, 102, 241, 0.2)" : "rgba(30, 41, 59, 0.5)"}
                      stroke={isActive ? "#6366f1" : "#475569"}
                      strokeWidth={isActive ? "3" : "1.5"}
                      className="transition-all duration-300 group-hover:stroke-indigo-400"
                    />

                    {/* Outer core circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? "18" : "14"}
                      fill={isActive ? "#4f46e5" : "#1e293b"}
                    />

                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + (isActive ? 42 : 36)}
                      textAnchor="middle"
                      fill={isActive ? "#e2e8f0" : "#94a3b8"}
                      fontSize={isActive ? "10" : "9"}
                      fontWeight={isActive ? "bold" : "medium"}
                      className="pointer-events-none select-none select-all"
                    >
                      {paper.title.length > 25 ? `${paper.title.substring(0, 22)}...` : paper.title}
                    </text>

                    {/* Numeric Citation Index */}
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="relative z-10 text-[10px] text-slate-400 flex justify-between items-center bg-slate-900/40 p-2.5 border border-slate-800/40 rounded-xl">
            <span>Nodes represent selected papers. Linked vectors map foundational citation trails.</span>
            <span className="font-semibold text-indigo-400">Click a node to read analysis</span>
          </div>
        </div>

        {/* Selected Paper summary card */}
        <div className="xl:col-span-5 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between">
          {activePaper ? (
            <div className="space-y-4">
              <div className="border-b border-slate-200/50 pb-3">
                <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Selected Citation Node</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1.5 leading-snug">
                  {activePaper.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  By {activePaper.authors.slice(0, 2).join(', ')}{activePaper.authors.length > 2 ? ' et al.' : ''} ({activePaper.year})
                </p>
              </div>

              {/* Quick dimension boxes */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem Statement</h4>
                  <p className="text-xs text-slate-700 font-semibold bg-white p-2.5 rounded-lg border border-slate-200/40 mt-1 leading-snug">
                    {activePaper.details?.problemStatement || 'Analyzing RNA structures or genetic representations.'}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Model & Architecture</h4>
                  <p className="text-xs text-indigo-900 bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-lg font-semibold mt-1 leading-snug">
                    {activePaper.details?.model || 'Algorithmic representation'}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Major Scientific Discovery</h4>
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/40 mt-1 leading-snug">
                    {activePaper.details?.keyResults || 'Demonstrated improved accuracy benchmarks and model convergence.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Select a visual citation node to view its detailed analytical parameters
            </div>
          )}

          {activePaper && (
            <a
              href={activePaper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-between w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm text-xs transition duration-200 cursor-pointer text-center"
            >
              <span className="flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 mr-1" />
                <span>Access Original Publication</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
