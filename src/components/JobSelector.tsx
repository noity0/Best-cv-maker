import React, { useState } from 'react';
import { 
  Search, Check, Plus, Sparkles, Target, ArrowRight, 
  Code, Layout, BarChart3, HeartPulse, DollarSign, Headphones, Briefcase, Palette, TrendingUp, HelpCircle
} from 'lucide-react';
import { JobPreset } from '../types/cv';
import { JOB_PRESETS } from '../data/jobPresets';

interface JobSelectorProps {
  selectedJob: JobPreset;
  onSelectJob: (job: JobPreset) => void;
  onStartInterview: () => void;
}

export const JobSelector: React.FC<JobSelectorProps> = ({
  selectedJob,
  onSelectJob,
  onStartInterview
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customKeywords, setCustomKeywords] = useState('');

  const categories = [
    { id: 'all', label: 'All Roles' },
    { id: 'tech', label: 'Engineering & Tech' },
    { id: 'business', label: 'Product & Business' },
    { id: 'marketing', label: 'Marketing & Sales' },
    { id: 'finance', label: 'Finance & Banking' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'design', label: 'Design' },
    { id: 'operations', label: 'Operations' }
  ];

  const filteredPresets = JOB_PRESETS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.atsKeywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || job.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="w-5 h-5 text-indigo-400" />;
      case 'Layout': return <Layout className="w-5 h-5 text-cyan-400" />;
      case 'Target': return <Target className="w-5 h-5 text-amber-400" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-emerald-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'DollarSign': return <DollarSign className="w-5 h-5 text-yellow-400" />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-blue-400" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-slate-300" />;
      case 'Palette': return <Palette className="w-5 h-5 text-pink-400" />;
      default: return <Briefcase className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleCreateCustomJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const keywords = customKeywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const newCustomJob: JobPreset = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      category: 'general',
      level: 'Mid-Level',
      description: customDescription.trim() || `Specialized role focused on ${customTitle.trim()} excellence.`,
      atsKeywords: keywords.length > 0 ? keywords : [
        'Strategic Execution',
        'Process Optimization',
        'Performance Metrics',
        'Stakeholder Collaboration',
        customTitle.trim()
      ],
      mustHaveMetrics: ['Measurable outcome / efficiency gain (%)', 'Budget or scale impact ($)'],
      recommendedCertifications: ['Relevant Industry Certification'],
      sampleQuestions: [
        `What primary tools and systems do you use in ${customTitle}?`,
        `Can you share a specific achievement or metric you delivered in your recent role?`
      ],
      iconName: 'Target'
    };

    onSelectJob(newCustomJob);
    setIsCustomMode(false);
    onStartInterview();
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-4">
      {/* Top Banner: Purpose & Instructions */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-indigo-400 tracking-wide uppercase">
              Step 1 • Target Calibration
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Select the Job You Want to Land
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Every job has distinct ATS screening algorithms and recruiter checklists. 
              Our AI customizes every interview question to pull out the exact metrics, tools, 
              and achievements hiring managers look for.
            </p>
          </div>

          <button
            id="start-interview-top-btn"
            onClick={onStartInterview}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all shrink-0"
          >
            <span>Start AI Interview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active Selection Summary */}
        <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400">Selected Target:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
            {selectedJob.title}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">ATS Keywords:</span>
          <span className="text-slate-300 font-mono">
            {selectedJob.atsKeywords.slice(0, 3).join(', ')} +{selectedJob.atsKeywords.length - 3} more
          </span>
        </div>
      </div>

      {/* Search & Custom Job Trigger */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <input
            id="search-job-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles (e.g. Software Engineer, Marketing, Nurse, Finance)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-xs sm:text-sm placeholder-slate-400 outline-none transition-all"
          />
        </div>

        <button
          id="custom-job-btn"
          onClick={() => setIsCustomMode(!isCustomMode)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
            isCustomMode
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Custom Role / Paste Job Spec</span>
        </button>
      </div>

      {/* Custom Job Form Modal/Accordion */}
      {isCustomMode && (
        <form onSubmit={handleCreateCustomJob} className="bg-slate-800/90 border border-indigo-500/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Add Custom Job or Paste Description</h3>
          </div>
          <p className="text-xs text-slate-300">
            Targeting a specialized niche? Enter the title and paste bullet points from the job advertisement.
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Job Title *</label>
            <input
              type="text"
              required
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Senior Cybersecurity Architect"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Job Description / Key Requirements (Optional)
            </label>
            <textarea
              rows={3}
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="Paste responsibilities or requirements from the hiring company..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Priority ATS Keywords (comma-separated, optional)
            </label>
            <input
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              placeholder="e.g. Threat Modeling, SIEM, ISO 27001, Zero Trust"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCustomMode(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
            >
              Apply Target & Start Interview
            </button>
          </div>
        </form>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Job Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredPresets.map((job) => {
          const isSelected = selectedJob.id === job.id;
          return (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                  : 'bg-slate-800/70 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700">
                      {getIcon(job.iconName)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white leading-tight">
                        {job.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {job.level} • {job.category}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Priority Keywords Snippet */}
                <div className="mt-3">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    ATS Focus Keywords:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.atsKeywords.slice(0, 4).map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded text-[11px] bg-slate-900 text-indigo-300 border border-slate-700"
                      >
                        {kw}
                      </span>
                    ))}
                    {job.atsKeywords.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-900/50 text-slate-400 border border-slate-800">
                        +{job.atsKeywords.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bottom */}
              <div className="mt-4 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate">
                  Metrics: {job.mustHaveMetrics[0]}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectJob(job);
                    onStartInterview();
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'bg-slate-700 text-slate-200 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  <span>Select & Interview</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPresets.length === 0 && (
        <div className="text-center py-12 bg-slate-800/40 rounded-xl border border-slate-800 p-6">
          <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-medium">No preset roles matched "{searchTerm}"</p>
          <p className="text-xs text-slate-400 mt-1">
            You can create any custom target role using the "Custom Role" button above!
          </p>
          <button
            onClick={() => {
              setCustomTitle(searchTerm);
              setIsCustomMode(true);
            }}
            className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium"
          >
            Create "{searchTerm}" as Custom Target
          </button>
        </div>
      )}
    </div>
  );
};
