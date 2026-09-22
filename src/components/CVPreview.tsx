import React, { useState } from 'react';
import { 
  Printer, Copy, Sparkles, Check, Edit3, Eye, 
  RotateCcw, ShieldCheck, Award, Target, ChevronDown, ChevronUp,
  Camera, BookOpen, Send, Palette, User, Briefcase, GraduationCap, MapPin, Mail, Phone, Globe, Linkedin
} from 'lucide-react';
import { CVMemoryData, JobPreset, TemplateId, AccentColor, CourseItem } from '../types/cv';

interface CVPreviewProps {
  cv: CVMemoryData;
  onUpdateCV: (updated: CVMemoryData) => void;
  selectedJob: JobPreset;
  atsScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  recruiterTips?: string[];
  onRegenerate: (customPrompt?: string) => void | Promise<void>;
  onBackToChat: () => void;
  isGenerating?: boolean;
}

const ACCENT_COLORS: Array<{ id: AccentColor; label: string; primary: string; bgSoft: string; border: string }> = [
  { id: 'indigo', label: 'Indigo', primary: 'text-indigo-600 border-indigo-600', bgSoft: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-600' },
  { id: 'emerald', label: 'Emerald', primary: 'text-emerald-700 border-emerald-700', bgSoft: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-700' },
  { id: 'sapphire', label: 'Sapphire', primary: 'text-sky-700 border-sky-700', bgSoft: 'bg-sky-50 text-sky-800', border: 'border-sky-700' },
  { id: 'ruby', label: 'Ruby', primary: 'text-rose-700 border-rose-700', bgSoft: 'bg-rose-50 text-rose-800', border: 'border-rose-700' },
  { id: 'slate', label: 'Slate', primary: 'text-slate-800 border-slate-800', bgSoft: 'bg-slate-100 text-slate-800', border: 'border-slate-800' }
];

export const CVPreview: React.FC<CVPreviewProps> = ({
  cv,
  onUpdateCV,
  selectedJob,
  atsScore = 95,
  matchedKeywords = [],
  missingKeywords = [],
  recruiterTips = [],
  onRegenerate,
  onBackToChat,
  isGenerating = false
}) => {
  const [template, setTemplate] = useState<TemplateId>('creative_dual');
  const [accentColor, setAccentColor] = useState<AccentColor>('indigo');
  const [isEditMode, setIsEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAtsDetails, setShowAtsDetails] = useState(false);
  const [customPromptInput, setCustomPromptInput] = useState('');
  const [showCustomBar, setShowCustomBar] = useState(true);

  const showPhoto = cv.showPhoto ?? true;

  const handlePrint = () => {
    window.print();
  };

  const handleTogglePhoto = () => {
    onUpdateCV({
      ...cv,
      showPhoto: !showPhoto
    });
  };

  const handleApplyCustomPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPromptInput.trim() && !isGenerating) {
      onRegenerate();
      return;
    }
    onRegenerate(customPromptInput.trim());
  };

  const handleQuickPromptClick = (prompt: string) => {
    setCustomPromptInput(prompt);
    onRegenerate(prompt);
  };

  const handleCopyText = () => {
    const text = `
${cv.contact.fullName.toUpperCase()}
${cv.contact.email} | ${cv.contact.phone} | ${cv.contact.location}
${cv.contact.linkedin ? cv.contact.linkedin + ' | ' : ''}${cv.contact.portfolio || ''}

TARGET ROLE: ${cv.targetJobTitle || selectedJob.title}

PROFESSIONAL SUMMARY
${cv.professionalSummary}

CORE COMPETENCIES
${cv.coreCompetencies.join(' • ')}

PROFESSIONAL EXPERIENCE
${cv.experience.map(e => `
${e.role.toUpperCase()} | ${e.company} (${e.startDate} - ${e.endDate || 'Present'})
${e.bullets.map(b => `• ${b}`).join('\n')}
`).join('\n')}

${cv.courses && cv.courses.length > 0 ? `COURSES & TRAINING\n${cv.courses.map(c => `• ${c.name} - ${c.institution} (${c.completionYear || 'Completed'})`).join('\n')}\n` : ''}
EDUCATION
${cv.education.map(ed => `${ed.degree} in ${ed.fieldOfStudy}, ${ed.institution} (${ed.graduationYear})`).join('\n')}

SKILLS
Technical: ${cv.skills.technical.join(', ')}
Tools: ${cv.skills.tools.join(', ')}
Domain: ${cv.skills.domain.join(', ')}
Soft Skills: ${cv.skills.soft.join(', ')}

CERTIFICATIONS
${cv.certifications.map(c => `${c.name} - ${c.issuer}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTheme = ACCENT_COLORS.find(c => c.id === accentColor) || ACCENT_COLORS[0];

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3 space-y-3.5">
      {/* 1. Custom AI Prompt Transformer Bar (Directly addresses user intent) */}
      <div className="no-print bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/30 rounded-2xl p-3 sm:p-4 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>AI Custom CV Transformer</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Custom Prompts
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Instruct the AI to customize phrasing, tone, emphasis, or metrics to match any requirement
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomBar(!showCustomBar)}
            className="text-xs text-slate-400 hover:text-white"
          >
            {showCustomBar ? 'Hide' : 'Expand'}
          </button>
        </div>

        {showCustomBar && (
          <form onSubmit={handleApplyCustomPrompt} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g., 'Emphasize cloud architecture & distributed systems', 'Make summary more executive & bold', 'Highlight my online certifications'..."
                  value={customPromptInput}
                  onChange={(e) => setCustomPromptInput(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-700/90 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 pr-9"
                />
                {customPromptInput && (
                  <button
                    type="button"
                    onClick={() => setCustomPromptInput('')}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950 transition-all shrink-0"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Tailoring with AI...' : 'Apply Custom Prompt'}</span>
              </button>
            </div>

            {/* Quick Inspiration Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-[11px]">
              <span className="text-slate-400 shrink-0 font-medium">Quick Prompts:</span>
              {[
                'Spotlight my online courses & certificates',
                'Focus on executive leadership & metrics',
                'Tailor for high-velocity remote tech roles',
                'Emphasize cost-savings & operational efficiency',
                'Make phrasing concise & high-impact'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPromptClick(chip)}
                  className="px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-indigo-900/50 border border-slate-700/80 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-200 shrink-0 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {cv.customNotes && (
              <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Currently applied prompt: <strong className="text-white font-medium">"{cv.customNotes}"</strong></span>
              </div>
            )}
          </form>
        )}
      </div>

      {/* 2. Top Toolbar (Actions, Formats, Photo Toggle, Color Accents) */}
      <div className="no-print bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Targeted CV: {cv.targetJobTitle || selectedJob.title}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {atsScore}% ATS Match
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Candidate: <strong className="text-slate-200">{cv.contact.fullName || 'Not specified'}</strong>
                {cv.courses && cv.courses.length > 0 && ` • ${cv.courses.length} courses included`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Photo Toggle */}
            <button
              onClick={handleTogglePhoto}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                showPhoto
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle profile picture on/off"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo: {showPhoto ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                isEditMode
                  ? 'bg-amber-600 border-amber-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isEditMode ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{isEditMode ? 'Preview Mode' : 'Edit Text'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              id="print-cv-btn"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Template Format & Accent Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold shrink-0 mr-1">
              Template:
            </span>
            {[
              { id: 'creative_dual', label: 'Creative Dual-Column' },
              { id: 'executive', label: 'Executive Modern' },
              { id: 'modern_tech', label: 'Modern Technical' },
              { id: 'ats_clean', label: 'Classic ATS Minimal' },
              { id: 'minimal_compact', label: 'Single-Page Compact' }
            ].map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setTemplate(tmpl.id as TemplateId)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  template === tmpl.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>

          {/* Color Accent Picker */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
              <Palette className="w-3 h-3 text-slate-400" />
              <span>Accent:</span>
            </span>
            <div className="flex items-center gap-1">
              {ACCENT_COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setAccentColor(c.id)}
                  title={c.label}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    c.id === 'indigo' ? 'bg-indigo-600' :
                    c.id === 'emerald' ? 'bg-emerald-600' :
                    c.id === 'sapphire' ? 'bg-sky-600' :
                    c.id === 'ruby' ? 'bg-rose-600' : 'bg-slate-800'
                  } ${accentColor === c.id ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ATS Keywords Accordion */}
      <div className="no-print bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow">
        <button
          onClick={() => setShowAtsDetails(!showAtsDetails)}
          className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-white">
              ATS Keyword Match Analysis ({atsScore}%)
            </span>
          </div>
          {showAtsDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showAtsDetails && (
          <div className="px-3.5 pb-3 pt-1 space-y-2 border-t border-slate-800 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                Matched ATS Keywords:
              </span>
              <div className="flex flex-wrap gap-1">
                {(matchedKeywords.length > 0 ? matchedKeywords : selectedJob.atsKeywords.slice(0, 6)).map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{kw}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. RENDERED RESUME DOCUMENT (Printable & Screen) */}
      <div className="bg-slate-950/90 p-2 sm:p-6 rounded-2xl flex justify-center overflow-x-auto">
        <div
          id="printable-cv-document"
          className="cv-sheet bg-white text-slate-900 w-full max-w-[850px] min-h-[1100px] shadow-2xl rounded-sm p-6 sm:p-10 border border-slate-200 text-sm leading-relaxed"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          {/* ========================================================================= */}
          {/* TEMPLATE: CREATIVE DUAL-COLUMN (Modern aesthetic split layout with sidebar) */}
          {/* ========================================================================= */}
          {template === 'creative_dual' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Sidebar (md:col-span-4) */}
              <div className="md:col-span-4 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-5">
                {/* Photo Portrait */}
                {showPhoto && cv.contact.photoUrl && (
                  <div className="flex justify-center">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-slate-300 shadow-md">
                      <img
                        src={cv.contact.photoUrl}
                        alt={cv.contact.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Contact Details
                  </h2>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2 break-all">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{cv.contact.email}</span>
                    </div>
                    {cv.contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{cv.contact.phone}</span>
                      </div>
                    )}
                    {cv.contact.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{cv.contact.location}</span>
                      </div>
                    )}
                    {cv.contact.linkedin && (
                      <div className="flex items-center gap-2 break-all">
                        <Linkedin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{cv.contact.linkedin}</span>
                      </div>
                    )}
                    {cv.contact.portfolio && (
                      <div className="flex items-center gap-2 break-all">
                        <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{cv.contact.portfolio}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Education
                  </h2>
                  {cv.education.map((edu, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-slate-700">{edu.fieldOfStudy}</div>
                      <div className="text-slate-500 text-[11px]">{edu.institution} ({edu.graduationYear})</div>
                    </div>
                  ))}
                </div>

                {/* Courses & Training (Requested feature) */}
                {cv.courses && cv.courses.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                      <span>Courses & Training</span>
                    </h2>
                    <div className="space-y-2">
                      {cv.courses.map((course, idx) => (
                        <div key={idx} className="text-xs space-y-0.5">
                          <div className="font-semibold text-slate-900 leading-snug">{course.name}</div>
                          <div className="text-slate-600 text-[11px]">
                            {course.institution} {course.completionYear ? `(${course.completionYear})` : ''}
                          </div>
                          {course.skillsLearned && course.skillsLearned.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {course.skillsLearned.map((s, sIdx) => (
                                <span key={sIdx} className="px-1 py-0.2 rounded text-[10px] bg-slate-200 text-slate-800">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Breakdown */}
                <div className="space-y-2.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Skills & Tooling
                  </h2>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 block text-[11px]">Technical:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cv.skills.technical.map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[11px] bg-slate-200/80 text-slate-800 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    {cv.skills.tools && cv.skills.tools.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-800 block text-[11px]">Tools:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cv.skills.tools.map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded text-[11px] bg-slate-200/80 text-slate-800">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                {cv.certifications && cv.certifications.length > 0 && (
                  <div className="space-y-1.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                      Certifications
                    </h2>
                    {cv.certifications.map((c, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="font-medium text-slate-900">{c.name}</div>
                        <div className="text-slate-500 text-[11px]">{c.issuer}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Main Body (md:col-span-8) */}
              <div className="md:col-span-8 space-y-5">
                {/* Header Title */}
                <div className="border-b-2 border-slate-900 pb-3">
                  <h1
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateCV({
                      ...cv,
                      contact: { ...cv.contact, fullName: e.currentTarget.innerText }
                    })}
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 ${
                      isEditMode ? 'outline-dashed outline-1 outline-indigo-500 p-0.5 rounded' : ''
                    }`}
                  >
                    {cv.contact.fullName || 'Candidate Name'}
                  </h1>
                  <div className="mt-1">
                    <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => onUpdateCV({ ...cv, targetJobTitle: e.currentTarget.innerText })}
                      className={`inline-block text-xs sm:text-sm font-bold uppercase tracking-wider ${currentTheme.primary} ${
                        isEditMode ? 'outline-dashed outline-1 outline-indigo-500 p-0.5 rounded' : ''
                      }`}
                    >
                      {cv.targetJobTitle || selectedJob.title}
                    </span>
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Professional Profile
                  </h2>
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateCV({ ...cv, professionalSummary: e.currentTarget.innerText })}
                    className={`text-xs sm:text-[13px] text-slate-700 leading-relaxed ${
                      isEditMode ? 'outline-dashed outline-1 outline-indigo-500 p-1 rounded' : ''
                    }`}
                  >
                    {cv.professionalSummary}
                  </p>
                </div>

                {/* Core ATS Competencies Matrix */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Core Competencies & Keywords
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1 text-xs text-slate-800">
                    {cv.coreCompetencies.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.border} bg-current shrink-0`} />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Experience */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
                    Professional Experience
                  </h2>

                  <div className="space-y-4">
                    {cv.experience.map((exp, expIdx) => (
                      <div key={exp.id || expIdx} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                          <div className="font-bold text-slate-900 text-sm">
                            <span>{exp.role}</span>
                            <span className="text-slate-500 font-normal"> — {exp.company}</span>
                          </div>
                          <div className="text-xs font-semibold text-slate-600">
                            {exp.startDate} – {exp.endDate || 'Present'}
                          </div>
                        </div>

                        <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                          {exp.bullets.map((b, bIdx) => (
                            <li
                              key={bIdx}
                              contentEditable={isEditMode}
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                const newExp = [...cv.experience];
                                newExp[expIdx].bullets[bIdx] = e.currentTarget.innerText;
                                onUpdateCV({ ...cv, experience: newExp });
                              }}
                              className={`leading-relaxed ${
                                isEditMode ? 'outline-dashed outline-1 outline-indigo-500 p-0.5 rounded' : ''
                              }`}
                            >
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 1: EXECUTIVE MODERN */}
          {/* ========================================================================= */}
          {template === 'executive' && (
            <div className="space-y-5">
              {/* Header with optional photo */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h1
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => onUpdateCV({
                        ...cv,
                        contact: { ...cv.contact, fullName: e.currentTarget.innerText }
                      })}
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 ${
                        isEditMode ? 'outline-dashed outline-1 outline-indigo-500 p-0.5 rounded' : ''
                      }`}
                    >
                      {cv.contact.fullName || 'Candidate Name'}
                    </h1>

                    <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => onUpdateCV({ ...cv, targetJobTitle: e.currentTarget.innerText })}
                      className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${currentTheme.primary} ${
                        isEditMode ? 'outline-dashed outline-1 outline-indigo-500 p-0.5 rounded' : ''
                      }`}
                    >
                      {cv.targetJobTitle || selectedJob.title}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
                    <span>{cv.contact.email}</span>
                    <span>•</span>
                    <span>{cv.contact.phone}</span>
                    <span>•</span>
                    <span>{cv.contact.location}</span>
                    {cv.contact.linkedin && (
                      <>
                        <span>•</span>
                        <span>{cv.contact.linkedin}</span>
                      </>
                    )}
                    {cv.contact.portfolio && (
                      <>
                        <span>•</span>
                        <span>{cv.contact.portfolio}</span>
                      </>
                    )}
                  </div>
                </div>

                {showPhoto && cv.contact.photoUrl && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm shrink-0">
                    <img
                      src={cv.contact.photoUrl}
                      alt={cv.contact.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Professional Summary */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                  Executive Summary
                </h2>
                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateCV({ ...cv, professionalSummary: e.currentTarget.innerText })}
                  className={`text-xs sm:text-[13px] text-slate-700 leading-relaxed ${
                    isEditMode ? 'outline-dashed outline-1 outline-indigo-500 p-1 rounded' : ''
                  }`}
                >
                  {cv.professionalSummary}
                </p>
              </div>

              {/* Core Competencies (ATS Keyword Matrix) */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Core Competencies & ATS Keywords
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 text-xs text-slate-800">
                  {cv.coreCompetencies.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 font-medium">
                      <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.border} bg-current shrink-0`} />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Experience */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
                  Professional Experience
                </h2>

                <div className="space-y-4">
                  {cv.experience.map((exp, expIdx) => (
                    <div key={exp.id || expIdx} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                        <div className="font-bold text-slate-900 text-sm">
                          <span>{exp.role}</span>
                          <span className="text-slate-500 font-normal"> — {exp.company}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-600">
                          {exp.startDate} – {exp.endDate || 'Present'} {exp.location ? `| ${exp.location}` : ''}
                        </div>
                      </div>

                      <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                        {exp.bullets.map((b, bIdx) => (
                          <li
                            key={bIdx}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const newExp = [...cv.experience];
                              newExp[expIdx].bullets[bIdx] = e.currentTarget.innerText;
                              onUpdateCV({ ...cv, experience: newExp });
                            }}
                            className={`leading-relaxed ${
                              isEditMode ? 'outline-dashed outline-1 outline-indigo-500 p-0.5 rounded' : ''
                            }`}
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses & Training Section (if present) */}
              {cv.courses && cv.courses.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Courses & Professional Specializations
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {cv.courses.map((c, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-slate-600">{c.institution} {c.completionYear ? `(${c.completionYear})` : ''}</div>
                        {c.skillsLearned && (
                          <div className="text-[11px] text-slate-500">Skills: {c.skillsLearned.join(', ')}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Education
                  </h2>
                  {cv.education.map((edu, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</div>
                      <div className="text-slate-600">{edu.institution}, {edu.graduationYear}</div>
                      {edu.honors && <div className="text-slate-500 italic">{edu.honors}</div>}
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Certifications & Tools
                  </h2>
                  <div className="text-xs space-y-1 text-slate-700">
                    {cv.certifications.map((c, idx) => (
                      <div key={idx} className="font-medium">
                        • {c.name} ({c.issuer})
                      </div>
                    ))}
                    <div className="pt-1 text-slate-600">
                      <span className="font-semibold text-slate-800">Tools: </span>
                      {cv.skills.tools.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 2: CLASSIC ATS MINIMAL (Pure High-Precision ATS) */}
          {/* ========================================================================= */}
          {template === 'ats_clean' && (
            <div className="space-y-4 text-slate-950 font-serif">
              <div className="text-center border-b border-slate-900 pb-2 space-y-0.5">
                <h1 className="text-2xl font-bold uppercase tracking-wide">
                  {cv.contact.fullName}
                </h1>
                <div className="text-xs text-slate-700 space-x-2 font-sans">
                  <span>{cv.contact.phone}</span>
                  <span>|</span>
                  <span>{cv.contact.email}</span>
                  <span>|</span>
                  <span>{cv.contact.location}</span>
                </div>
                <div className="text-xs font-sans font-semibold text-slate-800 tracking-wider uppercase pt-0.5">
                  TARGET: {cv.targetJobTitle || selectedJob.title}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-sans font-bold uppercase border-b border-slate-900 pb-0.5 mb-1 tracking-wider">
                  Professional Summary
                </h2>
                <p className="text-xs leading-relaxed text-slate-800 font-sans">
                  {cv.professionalSummary}
                </p>
              </div>

              <div>
                <h2 className="text-xs font-sans font-bold uppercase border-b border-slate-900 pb-0.5 mb-1.5 tracking-wider">
                  Key Skills & ATS Competencies
                </h2>
                <p className="text-xs leading-relaxed text-slate-800 font-sans">
                  <span className="font-bold">Core Keywords: </span>
                  {cv.coreCompetencies.join(' • ')}
                </p>
                <p className="text-xs leading-relaxed text-slate-800 mt-1 font-sans">
                  <span className="font-bold">Technical & Tools: </span>
                  {[...cv.skills.technical, ...cv.skills.tools].join(', ')}
                </p>
              </div>

              <div>
                <h2 className="text-xs font-sans font-bold uppercase border-b border-slate-900 pb-0.5 mb-2 tracking-wider">
                  Work Experience
                </h2>
                <div className="space-y-3 font-sans">
                  {cv.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-bold">
                        <span>{exp.role} — {exp.company}</span>
                        <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-slate-800">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {cv.courses && cv.courses.length > 0 && (
                <div>
                  <h2 className="text-xs font-sans font-bold uppercase border-b border-slate-900 pb-0.5 mb-1.5 tracking-wider">
                    Courses & Training
                  </h2>
                  <div className="text-xs text-slate-800 font-sans space-y-1">
                    {cv.courses.map((c, idx) => (
                      <div key={idx}>
                        <span className="font-bold">{c.name}</span> — {c.institution} ({c.completionYear || 'Completed'})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xs font-sans font-bold uppercase border-b border-slate-900 pb-0.5 mb-1.5 tracking-wider">
                  Education & Credentials
                </h2>
                <div className="space-y-1 font-sans text-xs text-slate-800">
                  {cv.education.map((edu, idx) => (
                    <div key={idx}>
                      <span className="font-bold">{edu.degree} in {edu.fieldOfStudy}</span> — {edu.institution} ({edu.graduationYear})
                    </div>
                  ))}
                  {cv.certifications.map((c, idx) => (
                    <div key={idx}>
                      <span className="font-bold">Certification:</span> {c.name} ({c.issuer})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 3: MODERN TECHNICAL */}
          {/* ========================================================================= */}
          {template === 'modern_tech' && (
            <div className="space-y-5">
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    {cv.contact.fullName}
                  </h1>
                  <div className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wide mt-0.5">
                    {`> ${cv.targetJobTitle || selectedJob.title}`}
                  </div>
                  <div className="text-xs font-mono text-slate-600 mt-1 flex flex-wrap gap-2">
                    <span>{cv.contact.email}</span>
                    <span>|</span>
                    <span>{cv.contact.phone}</span>
                    <span>|</span>
                    <span>{cv.contact.location}</span>
                  </div>
                </div>
                {showPhoto && cv.contact.photoUrl && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-400 shrink-0">
                    <img src={cv.contact.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-1">
                  // Professional Overview
                </h2>
                <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                  {cv.professionalSummary}
                </p>
              </div>

              <div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  // Tech Stack & Competencies
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {cv.coreCompetencies.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs font-mono bg-slate-900 text-white rounded">
                      {k}
                    </span>
                  ))}
                  {cv.skills.technical.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs font-mono bg-slate-100 text-slate-800 border border-slate-300 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-2">
                  // Work History
                </h2>
                <div className="space-y-3.5">
                  {cv.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-900">
                        <span>{exp.role} @ {exp.company}</span>
                        <span className="font-mono font-normal text-slate-600">{exp.startDate} - {exp.endDate || 'Present'}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {cv.courses && cv.courses.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-1">
                    // Courses & Continuous Learning
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {cv.courses.map((c, idx) => (
                      <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-slate-600 text-[11px]">{c.institution} ({c.completionYear || 'Completed'})</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-1">
                  // Education & Credentials
                </h2>
                {cv.education.map((edu, idx) => (
                  <div key={idx} className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span> — {edu.institution} ({edu.graduationYear})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 4: MINIMAL COMPACT */}
          {/* ========================================================================= */}
          {template === 'minimal_compact' && (
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-end border-b border-slate-400 pb-2">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    {cv.contact.fullName}
                  </h1>
                  <span className="text-xs font-bold text-indigo-700">
                    {cv.targetJobTitle || selectedJob.title}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-600">
                  <div>{cv.contact.email} • {cv.contact.phone}</div>
                  <div>{cv.contact.location}</div>
                </div>
              </div>

              <div>
                <p className="text-slate-700 leading-normal text-[11.5px]">
                  {cv.professionalSummary}
                </p>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="font-bold text-slate-900">Core ATS Match: </span>
                <span className="text-slate-700">{cv.coreCompetencies.join(' • ')}</span>
              </div>

              <div>
                <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
                  Experience
                </h2>
                <div className="space-y-2.5">
                  {cv.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.role}, {exp.company}</span>
                        <span className="text-slate-500 font-normal">{exp.startDate} - {exp.endDate || 'Present'}</span>
                      </div>
                      <ul className="list-disc list-outside ml-3.5 mt-0.5 space-y-0.5 text-slate-700">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-snug">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {cv.courses && cv.courses.length > 0 && (
                <div>
                  <h2 className="font-bold uppercase text-slate-900 mb-0.5">Courses & Training</h2>
                  <div className="text-slate-700 text-[11px]">
                    {cv.courses.map(c => `${c.name} (${c.institution})`).join(' • ')}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <h2 className="font-bold uppercase text-slate-900 mb-0.5">Education</h2>
                  {cv.education.map((e, idx) => (
                    <div key={idx} className="text-slate-700">
                      {e.degree}, {e.institution} ({e.graduationYear})
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="font-bold uppercase text-slate-900 mb-0.5">Key Tools</h2>
                  <div className="text-slate-700">{cv.skills.tools.join(', ')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
