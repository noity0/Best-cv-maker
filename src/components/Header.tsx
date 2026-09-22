import React from 'react';
import { Target, MessageSquareCode, BrainCircuit, FileText, Smartphone, Monitor } from 'lucide-react';
import { JobPreset } from '../types/cv';

interface HeaderProps {
  activeTab: 'job' | 'chat' | 'memory' | 'cv';
  setActiveTab: (tab: 'job' | 'chat' | 'memory' | 'cv') => void;
  selectedJob: JobPreset;
  completenessScore: number;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedJob,
  completenessScore,
  isPhoneFrame,
  setIsPhoneFrame
}) => {
  return (
    <header className="no-print bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
            CV
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-white truncate tracking-tight">
                AI Job-Targeted CV Builder
              </h1>
              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ATS v2.5
              </span>
            </div>
            <button
              onClick={() => setActiveTab('job')}
              className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 truncate text-left transition-colors"
            >
              <span>Target:</span>
              <span className="text-indigo-400 font-medium truncate">{selectedJob.title}</span>
              <span className="text-slate-500 text-[11px] underline ml-1">Change</span>
            </button>
          </div>
        </div>

        {/* Right actions: Completeness Meter + Desktop/Phone View Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Completeness Badge */}
          <button
            onClick={() => setActiveTab('memory')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 transition-colors"
            title="Profile completeness based on job criteria"
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              <svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${completenessScore >= 80 ? 'text-emerald-500' : completenessScore >= 50 ? 'text-indigo-400' : 'text-amber-400'}`}
                  strokeDasharray={`${completenessScore}, 100`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
            <span className="font-semibold text-white">{completenessScore}%</span>
            <span className="hidden md:inline text-slate-400 text-[11px]">Ready</span>
          </button>

          {/* Device Mockup Toggle (visible on wide screens) */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
            title={isPhoneFrame ? "Switch to Wide Responsive View" : "Switch to Mobile Phone Shell"}
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span>Wide View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Phone Shell</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="border-t border-slate-800/80 max-w-6xl mx-auto px-2">
        <div className="grid grid-cols-4 gap-1 py-1 text-center">
          <button
            id="tab-job"
            onClick={() => setActiveTab('job')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'job'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Target className="w-4 h-4 shrink-0" />
            <span>Target Job</span>
          </button>

          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquareCode className="w-4 h-4 shrink-0" />
            <span>AI Interview</span>
            {completenessScore < 60 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            id="tab-memory"
            onClick={() => setActiveTab('memory')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'memory'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BrainCircuit className="w-4 h-4 shrink-0" />
            <span>AI Memory</span>
          </button>

          <button
            id="tab-cv"
            onClick={() => setActiveTab('cv')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'cv'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Preview CV</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
