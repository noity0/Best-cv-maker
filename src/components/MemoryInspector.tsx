import React, { useState, useRef } from 'react';
import { 
  BrainCircuit, User, Briefcase, GraduationCap, Wrench, Award, 
  Plus, Trash2, Edit2, Check, FileCheck, ArrowRight, Sparkles,
  BookOpen, Camera, Image as ImageIcon
} from 'lucide-react';
import { CVMemoryData, ExperienceItem, EducationItem, CourseItem, JobPreset } from '../types/cv';

interface MemoryInspectorProps {
  memory: CVMemoryData;
  onUpdateMemory: (newMemory: CVMemoryData) => void;
  selectedJob: JobPreset;
  completenessScore: number;
  onGenerateCV: () => void;
  onBackToChat: () => void;
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({
  memory,
  onUpdateMemory,
  selectedJob,
  completenessScore,
  onGenerateCV,
  onBackToChat
}) => {
  const [activeSection, setActiveSection] = useState<'contact' | 'experience' | 'skills' | 'education' | 'courses' | 'certifications'>('experience');

  // Quick form states for adding items manually
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpBullet, setNewExpBullet] = useState('');
  const [showAddExp, setShowAddExp] = useState(false);

  // Courses state
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseInst, setNewCourseInst] = useState('');
  const [newCourseYear, setNewCourseYear] = useState('2024');
  const [newCourseSkills, setNewCourseSkills] = useState('');

  const [newSkillText, setNewSkillText] = useState('');
  const [skillCategory, setSkillCategory] = useState<'technical' | 'tools' | 'soft'>('technical');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onUpdateMemory({
          ...memory,
          showPhoto: true,
          contact: {
            ...memory.contact,
            photoUrl: reader.result as string
          }
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim() || !newCourseInst.trim()) return;

    const skillsArray = newCourseSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newCourse: CourseItem = {
      id: `course-${Date.now()}`,
      name: newCourseName.trim(),
      institution: newCourseInst.trim(),
      completionYear: newCourseYear.trim() || undefined,
      skillsLearned: skillsArray.length > 0 ? skillsArray : undefined
    };

    onUpdateMemory({
      ...memory,
      courses: [newCourse, ...(memory.courses || [])]
    });

    setNewCourseName('');
    setNewCourseInst('');
    setNewCourseSkills('');
    setShowAddCourse(false);
  };

  const handleDeleteCourse = (id: string) => {
    onUpdateMemory({
      ...memory,
      courses: (memory.courses || []).filter(c => c.id !== id)
    });
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpRole || !newExpCompany) return;

    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: newExpRole,
      company: newExpCompany,
      startDate: '2022',
      endDate: 'Present',
      current: true,
      bullets: newExpBullet ? [newExpBullet] : [`Led ${newExpRole} initiatives improving operational efficiency by 25%.`],
      metricsHighlighted: ['25% efficiency improvement']
    };

    onUpdateMemory({
      ...memory,
      experience: [newItem, ...(memory.experience || [])]
    });

    setNewExpRole('');
    setNewExpCompany('');
    setNewExpBullet('');
    setShowAddExp(false);
  };

  const handleDeleteExperience = (id: string) => {
    onUpdateMemory({
      ...memory,
      experience: memory.experience.filter(e => e.id !== id)
    });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;
    const skill = newSkillText.trim();

    const currentSkills = memory.skills || { technical: [], domain: [], soft: [], tools: [] };
    const updatedCategory = Array.from(new Set([...(currentSkills[skillCategory] || []), skill]));

    onUpdateMemory({
      ...memory,
      skills: {
        ...currentSkills,
        [skillCategory]: updatedCategory
      }
    });

    setNewSkillText('');
  };

  const handleRemoveSkill = (cat: 'technical' | 'tools' | 'soft', skill: string) => {
    const currentSkills = memory.skills || { technical: [], domain: [], soft: [], tools: [] };
    onUpdateMemory({
      ...memory,
      skills: {
        ...currentSkills,
        [cat]: (currentSkills[cat] || []).filter(s => s !== skill)
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              AI Extracted Memory Profile
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            This is the live candidate memory stored from your conversation. The AI uses this data to synthesize 
            your complete, job-optimized CV.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onBackToChat}
            className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-colors"
          >
            ← Back to Chat
          </button>
          <button
            onClick={onGenerateCV}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
          >
            <FileCheck className="w-4 h-4" />
            <span>Generate Full CV</span>
          </button>
        </div>
      </div>

      {/* Target Job ATS Keywords Coverage Tracker */}
      <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-300">
            Target Job ATS Coverage: <span className="text-indigo-400">{selectedJob.title}</span>
          </span>
          <span className="text-xs font-semibold text-emerald-400">
            {completenessScore}% Ready
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {selectedJob.atsKeywords.map((kw, idx) => {
            const allSavedText = JSON.stringify(memory).toLowerCase();
            const isCovered = allSavedText.includes(kw.toLowerCase());
            return (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 border transition-all ${
                  isCovered
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 opacity-70'
                }`}
              >
                {isCovered && <Check className="w-3 h-3 text-emerald-400" />}
                <span>{kw}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
        <button
          onClick={() => setActiveSection('experience')}
          className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'experience'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Work Experience ({memory.experience?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSection('skills')}
          className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'skills'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Skills & Tools ({(memory.skills?.technical?.length || 0) + (memory.skills?.tools?.length || 0)})</span>
        </button>

        <button
          onClick={() => setActiveSection('contact')}
          className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'contact'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Contact Details</span>
        </button>

        <button
          onClick={() => setActiveSection('education')}
          className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'education'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Education ({memory.education?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSection('courses')}
          className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'courses'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Courses ({memory.courses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSection('certifications')}
          className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'certifications'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certifications ({memory.certifications?.length || 0})</span>
        </button>
      </div>

      {/* Section Content */}

      {/* 1. Work Experience Section */}
      {activeSection === 'experience' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Extracted Roles & Accomplishments
            </span>
            <button
              onClick={() => setShowAddExp(!showAddExp)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role Manually</span>
            </button>
          </div>

          {showAddExp && (
            <form onSubmit={handleAddExperience} className="bg-slate-800 border border-indigo-500/40 rounded-xl p-3 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={newExpRole}
                    onChange={(e) => setNewExpRole(e.target.value)}
                    placeholder={`e.g. Lead ${selectedJob.title}`}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Company *</label>
                  <input
                    type="text"
                    required
                    value={newExpCompany}
                    onChange={(e) => setNewExpCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">Key Metric / Bullet Point</label>
                <input
                  type="text"
                  value={newExpBullet}
                  onChange={(e) => setNewExpBullet(e.target.value)}
                  placeholder="e.g. Spearheaded system redesign reducing load latency by 35%."
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExp(false)}
                  className="px-2.5 py-1 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium"
                >
                  Save to Memory
                </button>
              </div>
            </form>
          )}

          {(!memory.experience || memory.experience.length === 0) ? (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
              <p className="text-xs text-slate-400">
                No work experience captured yet. Answer the AI chat questions or click "Add Role Manually" above!
              </p>
            </div>
          ) : (
            memory.experience.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.role}</h3>
                    <p className="text-xs text-indigo-400 font-medium">
                      {item.company} {item.location ? `• ${item.location}` : ''} ({item.startDate} - {item.endDate || 'Present'})
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteExperience(item.id)}
                    className="text-slate-400 hover:text-rose-400 p-1"
                    title="Remove from memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {item.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>

                {item.metricsHighlighted && item.metricsHighlighted.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-700/50">
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">Extracted Metrics:</span>
                    {item.metricsHighlighted.map((m, mIdx) => (
                      <span key={mIdx} className="px-1.5 py-0.2 rounded text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Skills Section */}
      {activeSection === 'skills' && (
        <div className="space-y-4">
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <select
              value={skillCategory}
              onChange={(e: any) => setSkillCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 outline-none"
            >
              <option value="technical">Technical Skill</option>
              <option value="tools">Tool / Software</option>
              <option value="soft">Soft / Leadership Skill</option>
            </select>
            <input
              type="text"
              value={newSkillText}
              onChange={(e) => setNewSkillText(e.target.value)}
              placeholder="Add skill or tool (e.g. React, Docker, P&L, Epic)..."
              className="flex-1 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
            >
              Add
            </button>
          </form>

          {/* Categorized Skills */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                Technical & Domain Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(memory.skills?.technical || []).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-xs bg-slate-800 text-indigo-300 border border-slate-700 flex items-center gap-1"
                  >
                    <span>{s}</span>
                    <button
                      onClick={() => handleRemoveSkill('technical', s)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                Tools & Platforms:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(memory.skills?.tools || []).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-xs bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1"
                  >
                    <span>{s}</span>
                    <button
                      onClick={() => handleRemoveSkill('tools', s)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                Leadership & Soft Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(memory.skills?.soft || []).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                  >
                    <span>{s}</span>
                    <button
                      onClick={() => handleRemoveSkill('soft', s)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Contact Section */}
      {activeSection === 'contact' && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <div>
              <h3 className="text-xs font-bold text-white">Candidate Verified Information</h3>
              <p className="text-[11px] text-slate-400">This exact personal info and optional photo will be rendered on your final CV.</p>
            </div>
            {memory.contact?.fullName && (
              <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified
              </span>
            )}
          </div>

          {/* Profile Photo Control */}
          <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>Profile Photo (Optional)</span>
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={memory.showPhoto ?? true}
                  onChange={(e) => onUpdateMemory({ ...memory, showPhoto: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Include photo on CV</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border-2 border-slate-700 shrink-0 flex items-center justify-center">
                {memory.contact?.photoUrl ? (
                  <img
                    src={memory.contact.photoUrl}
                    alt="Candidate Portrait"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-slate-500" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-medium flex items-center gap-1 transition-all"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{memory.contact?.photoUrl ? 'Replace Photo' : 'Upload Headshot'}</span>
                  </button>
                  {memory.contact?.photoUrl && (
                    <button
                      type="button"
                      onClick={() => onUpdateMemory({ ...memory, contact: { ...memory.contact, photoUrl: '' } })}
                      className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-medium transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Or paste image URL (https://...)"
                  value={memory.contact?.photoUrl || ''}
                  onChange={(e) => onUpdateMemory({
                    ...memory,
                    contact: { ...memory.contact, photoUrl: e.target.value }
                  })}
                  className="w-full px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-slate-300 placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={memory.contact?.fullName || ''}
                onChange={(e) => onUpdateMemory({
                  ...memory,
                  contact: { ...memory.contact, fullName: e.target.value }
                })}
                placeholder="e.g. Your Full Name"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Email</label>
              <input
                type="email"
                value={memory.contact?.email || ''}
                onChange={(e) => onUpdateMemory({
                  ...memory,
                  contact: { ...memory.contact, email: e.target.value }
                })}
                placeholder="e.g. your.email@example.com"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={memory.contact?.phone || ''}
                onChange={(e) => onUpdateMemory({
                  ...memory,
                  contact: { ...memory.contact, phone: e.target.value }
                })}
                placeholder="e.g. +1 (555) 000-0000"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Location</label>
              <input
                type="text"
                value={memory.contact?.location || ''}
                onChange={(e) => onUpdateMemory({
                  ...memory,
                  contact: { ...memory.contact, location: e.target.value }
                })}
                placeholder="e.g. City, Country"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={memory.contact?.linkedin || ''}
                onChange={(e) => onUpdateMemory({
                  ...memory,
                  contact: { ...memory.contact, linkedin: e.target.value }
                })}
                placeholder="e.g. linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">GitHub / Portfolio</label>
              <input
                type="text"
                value={memory.contact?.github || memory.contact?.portfolio || ''}
                onChange={(e) => onUpdateMemory({
                  ...memory,
                  contact: { ...memory.contact, github: e.target.value, portfolio: e.target.value }
                })}
                placeholder="e.g. github.com/alexmorgan"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Education Section */}
      {activeSection === 'education' && (
        <div className="space-y-3">
          {(memory.education || []).map((edu) => (
            <div key={edu.id} className="bg-slate-800 border border-slate-700 rounded-xl p-3">
              <h3 className="text-sm font-semibold text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
              <p className="text-xs text-slate-400">{edu.institution} • Class of {edu.graduationYear}</p>
            </div>
          ))}
          {(!memory.education || memory.education.length === 0) && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
              <p className="text-xs text-slate-400">
                No education recorded yet. Chat with the AI or add your university/degree details.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 5. Courses & Specialized Training Section */}
      {activeSection === 'courses' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Courses, Bootcamps & Online Specializations
            </span>
            <button
              onClick={() => setShowAddCourse(!showAddCourse)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>

          {showAddCourse && (
            <form onSubmit={handleAddCourse} className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-2.5">
              <h4 className="text-xs font-bold text-white">Add Course or Training</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Course / Specialization Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deep Learning Specialization"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Platform / Institution</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coursera / Stanford / Google"
                    value={newCourseInst}
                    onChange={(e) => setNewCourseInst(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Completion Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={newCourseYear}
                    onChange={(e) => setNewCourseYear(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Skills Learned (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. PyTorch, CNNs, Transformers"
                    value={newCourseSkills}
                    onChange={(e) => setNewCourseSkills(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-2.5 py-1 rounded text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Course
                </button>
              </div>
            </form>
          )}

          {(memory.courses || []).map((course) => (
            <div key={course.id} className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <h3 className="text-sm font-semibold text-white">{course.name}</h3>
                </div>
                <p className="text-xs text-slate-400">
                  {course.institution} {course.completionYear ? `• ${course.completionYear}` : ''}
                </p>
                {course.skillsLearned && course.skillsLearned.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {course.skillsLearned.map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-700/50 transition-colors"
                title="Remove course"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {(!memory.courses || memory.courses.length === 0) && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center space-y-1">
              <p className="text-xs text-slate-300 font-medium">No courses or bootcamps added yet.</p>
              <p className="text-[11px] text-slate-500">
                Adding relevant online courses (Coursera, Udemy, edX, LinkedIn Learning) boosts recruiter keyword match and shows ongoing skill growth!
              </p>
            </div>
          )}
        </div>
      )}

      {/* 6. Certifications Section */}
      {activeSection === 'certifications' && (
        <div className="space-y-3">
          {(memory.certifications || []).map((c) => (
            <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                <p className="text-xs text-slate-400">{c.issuer} {c.year ? `• ${c.year}` : ''}</p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                Verified ATS
              </span>
            </div>
          ))}
          {(!memory.certifications || memory.certifications.length === 0) && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
              <p className="text-xs text-slate-400">
                No certifications recorded yet. Mention certifications like {selectedJob.recommendedCertifications[0]} in the chat!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
