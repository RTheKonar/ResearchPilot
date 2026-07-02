import React, { useState } from 'react';
import { Calendar, Quote, ExternalLink, Bookmark } from 'lucide-react';
import { ResearchPaper } from '../types';

interface PaperTimelineProps {
  papers: ResearchPaper[];
}

export default function PaperTimeline({ papers }: PaperTimelineProps) {
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(papers[0] || null);

  // Sort papers chronologically
  const sortedPapers = [...papers].sort((a, b) => a.year - b.year);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center space-x-2.5 mb-6 border-b border-slate-100 pb-3">
        <Calendar className="w-5 h-5 text-indigo-600" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Literature Chronological Timeline</h3>
          <p className="text-xs text-slate-400 mt-1">Explore historical progression of scientific breakthroughs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Timeline visualization column */}
        <div className="lg:col-span-4 relative pl-6 border-l border-slate-200 py-2 space-y-8">
          {sortedPapers.map((paper, idx) => {
            const isSelected = selectedPaper?.id === paper.id;
            return (
              <div 
                key={paper.id} 
                onClick={() => setSelectedPaper(paper)}
                className="relative cursor-pointer group"
              >
                {/* Timeline Dot */}
                <span className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isSelected 
                    ? 'bg-indigo-600 border-indigo-200 scale-125 shadow-lg shadow-indigo-200' 
                    : 'bg-white border-slate-300 group-hover:border-indigo-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-transparent'}`}></span>
                </span>

                {/* Timeline Content card */}
                <div className={`p-3 rounded-xl border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' 
                    : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-600">
                    <span>{paper.year}</span>
                    <span className="bg-slate-200/60 text-slate-600 rounded px-1.5 py-0.5">
                      {paper.citationCount} Citations
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 truncate mt-1.5 group-hover:text-indigo-900 transition">
                    {paper.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-1">
                    {paper.authors.slice(0, 2).join(', ')}{paper.authors.length > 2 ? ' et al.' : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Paper details deep analysis panel */}
        <div className="lg:col-span-8 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 relative">
          {selectedPaper ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200/50 pb-3">
                <div className="space-y-1 pr-4">
                  <span className="inline-flex items-center px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded">
                    Published {selectedPaper.year}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {selectedPaper.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    By: {selectedPaper.authors.join(', ')}
                  </p>
                </div>
                <a 
                  href={selectedPaper.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm hover:shadow transition"
                >
                  <span>Publisher Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Citations and Reading stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200/50 flex flex-col justify-center">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Citations</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 flex items-center">
                    <Quote className="w-3.5 h-3.5 text-indigo-500 mr-1" />
                    {selectedPaper.citationCount}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/50 flex flex-col justify-center">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Reading Level</span>
                  <span className={`text-xs font-extrabold mt-1 ${
                    selectedPaper.difficulty === 'Beginner' ? 'text-emerald-600' :
                    selectedPaper.difficulty === 'Intermediate' ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {selectedPaper.difficulty || 'Intermediate'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/50 flex flex-col justify-center">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Reading Time</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1">
                    {selectedPaper.estReadingTime || 15} mins
                  </span>
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Abstract Context</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/40 max-h-40 overflow-y-auto">
                  {selectedPaper.abstract}
                </p>
              </div>

              {/* Structured AI Insights */}
              {selectedPaper.details && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                  <div className="bg-white/60 p-3 rounded-xl border border-slate-200/30">
                    <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>
                      Proposed Methodology
                    </h5>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                      {selectedPaper.details.methodology}
                    </p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl border border-slate-200/30">
                    <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>
                      Key Results & Findings
                    </h5>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                      {selectedPaper.details.keyResults}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Select a paper on the timeline to investigate deep scientific details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
