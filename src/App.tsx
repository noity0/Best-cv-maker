import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { JobSelector } from './components/JobSelector';
import { ChatInterview } from './components/ChatInterview';
import { MemoryInspector } from './components/MemoryInspector';
import { CVPreview } from './components/CVPreview';
import { JOB_PRESETS } from './data/jobPresets';
import { ChatMessage, CVMemoryData, JobPreset, ContactInfo } from './types/cv';
import { sendChatMessageToAI, generateTailoredCVFromAI } from './services/gemini';

export default function App() {
  const [selectedJob, setSelectedJob] = useState<JobPreset>(JOB_PRESETS[0]);
  const [activeTab, setActiveTab] = useState<'job' | 'chat' | 'memory' | 'cv'>('chat');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [lastExtractedAlert, setLastExtractedAlert] = useState<string | null>(null);

  // Initial candidate memory with clean state (no dummy names or placeholder companies)
  const [cvMemory, setCvMemory] = useState<CVMemoryData>({
    contact: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    targetJobTitle: JOB_PRESETS[0].title,
    targetIndustry: JOB_PRESETS[0].category,
    professionalSummary: `Dedicated and results-oriented professional with strong competencies in ${JOB_PRESETS[0].atsKeywords.slice(0, 3).join(', ')}. Passionate about delivering high-performance work and driving measurable organizational impact.`,
    coreCompetencies: JOB_PRESETS[0].atsKeywords.slice(0, 8),
    experience: [],
    education: [],
    skills: {
      technical: JOB_PRESETS[0].atsKeywords.slice(0, 5),
      domain: JOB_PRESETS[0].atsKeywords.slice(5, 8),
      soft: ['Cross-Functional Leadership', 'Problem Solving', 'Clear Communication'],
      tools: ['Git', 'Jira', 'Productivity Suites']
    },
    projects: [],
    certifications: []
  });

  const [completenessScore, setCompletenessScore] = useState(25);
  const [missingCategories, setMissingCategories] = useState<string[]>([
    'Your Full Name & Contact Info',
    'Work Experience & Real Metrics',
    'Education & Degrees'
  ]);
  const [atsScore, setAtsScore] = useState(94);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>(JOB_PRESETS[0].atsKeywords.slice(0, 7));
  const [missingKeywords, setMissingKeywords] = useState<string[]>(JOB_PRESETS[0].atsKeywords.slice(7, 10));
  const [recruiterTips, setRecruiterTips] = useState<string[]>([
    `Quantify your accomplishments using the formula: Accomplished [X] as measured by [Y] by doing [Z].`,
    `Highlight hands-on proficiency with ${JOB_PRESETS[0].atsKeywords.slice(0, 2).join(' and ')}.`,
    `Focus on business outcomes and scale rather than just passive duties.`
  ]);

  // Initial chat conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Welcome! I'm your AI Career Coach & ATS Architect. Let's create your true, job-winning CV tailored specifically for **${JOB_PRESETS[0].title}** roles.\n\nTo ensure your CV has your exact and correct personal information, what is your **Full Name**, **Email Address**, and **City / Country**?`,
      timestamp: 'Just now',
      quickReplies: [
        `I will type my full name`,
        `Set my real contact info`,
        `Software Engineer with 2+ years experience`
      ]
    }
  ]);

  // Recalibrate when user picks a different job
  const handleSelectJob = (job: JobPreset) => {
    setSelectedJob(job);
    setCvMemory(prev => ({
      ...prev,
      targetJobTitle: job.title,
      targetIndustry: job.category,
      coreCompetencies: job.atsKeywords.slice(0, 8),
      skills: {
        ...prev.skills,
        technical: job.atsKeywords.slice(0, 5)
      }
    }));

    const updateMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `Target calibrated to: **${job.title}** (${job.level} - ${job.category}).\n\nTop ATS priorities for this role: ${job.atsKeywords.slice(0, 4).join(', ')}.\n\nLet's ensure your CV highlights these keywords. What experience or accomplishments do you have related to ${job.atsKeywords[0]} or ${job.atsKeywords[1]}?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: job.sampleQuestions.slice(0, 2)
    };

    setMessages(prev => [...prev, updateMsg]);
    setMatchedKeywords(job.atsKeywords.slice(0, 6));
    setMissingKeywords(job.atsKeywords.slice(6, 10));
  };

  // Send message in AI Interview
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Immediate client-side extraction of real candidate details
    const lowerText = text.toLowerCase().trim();
    let clientExtractedName = '';
    if (lowerText.startsWith('my name is ') || lowerText.startsWith("i am ") || lowerText.startsWith("i'm ")) {
      clientExtractedName = text.replace(/^(my name is|i am|i'm)\s+/i, '').split(/[,\.\n]/)[0].trim();
    } else if (!text.includes('@') && !text.includes('http') && text.split(/\s+/).length <= 4 && text.length > 2 && !lowerText.includes('work') && !lowerText.includes('job') && !lowerText.includes('engineer') && !lowerText.includes('manager') && !cvMemory.contact.fullName) {
      clientExtractedName = text.replace(/[,\.]/g, '').trim();
    }

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

    let updatedMemory = { ...cvMemory };
    if (clientExtractedName || emailMatch || phoneMatch) {
      updatedMemory = {
        ...updatedMemory,
        contact: {
          ...updatedMemory.contact,
          ...(clientExtractedName ? { fullName: clientExtractedName } : {}),
          ...(emailMatch ? { email: emailMatch[0] } : {}),
          ...(phoneMatch ? { phone: phoneMatch[0] } : {})
        }
      };
      setCvMemory(updatedMemory);
    }

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const apiResult = await sendChatMessageToAI(
        newHistory.map(m => ({ role: m.role, content: m.content })),
        updatedMemory,
        selectedJob
      );

      // Merge extracted data into CV memory, preserving candidate's real personal information
      if (apiResult.extractedData) {
        setCvMemory(prev => {
          const incomingContact: Partial<ContactInfo> = apiResult.extractedData?.contact || {};
          const finalName = prev.contact.fullName || incomingContact.fullName || clientExtractedName;
          const finalEmail = prev.contact.email || incomingContact.email || (emailMatch ? emailMatch[0] : '');
          const finalPhone = prev.contact.phone || incomingContact.phone || (phoneMatch ? phoneMatch[0] : '');
          const finalLocation = prev.contact.location || incomingContact.location || '';

          const updated: CVMemoryData = {
            ...prev,
            ...apiResult.extractedData,
            contact: {
              ...prev.contact,
              ...incomingContact,
              ...(finalName ? { fullName: finalName } : {}),
              ...(finalEmail ? { email: finalEmail } : {}),
              ...(finalPhone ? { phone: finalPhone } : {}),
              ...(finalLocation ? { location: finalLocation } : {})
            },
            skills: {
              ...prev.skills,
              ...(apiResult.extractedData.skills || {})
            },
            experience: apiResult.extractedData.experience && apiResult.extractedData.experience.length > 0
              ? apiResult.extractedData.experience
              : prev.experience
          };
          return updated;
        });

        // Show memory extraction feedback
        setLastExtractedAlert(`Captured real info & saved into AI memory for ${selectedJob.title}`);
        setTimeout(() => setLastExtractedAlert(null), 5000);
      }

      if (apiResult.completenessScore) {
        setCompletenessScore(apiResult.completenessScore);
      }
      if (apiResult.missingCategories) {
        setMissingCategories(apiResult.missingCategories);
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: apiResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: apiResult.quickReplies,
        actionRequired: apiResult.isReadyForGeneration ? 'view_cv' : null
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate full CV with optional custom AI guidance prompt
  const handleGenerateCV = async (customPrompt?: string) => {
    setIsGeneratingCV(true);
    try {
      const result = await generateTailoredCVFromAI(cvMemory, selectedJob, customPrompt);
      setCvMemory(result.cv);
      setAtsScore(result.atsScore || 96);
      if (result.matchedKeywords) setMatchedKeywords(result.matchedKeywords);
      if (result.missingKeywords) setMissingKeywords(result.missingKeywords);
      if (result.recruiterTips) setRecruiterTips(result.recruiterTips);

      setActiveTab('cv');
    } catch (e) {
      console.error('Failed to generate complete CV:', e);
      setActiveTab('cv');
    } finally {
      setIsGeneratingCV(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedJob={selectedJob}
        completenessScore={completenessScore}
        isPhoneFrame={isPhoneFrame}
        setIsPhoneFrame={setIsPhoneFrame}
      />

      {/* Main View Container */}
      <main className="flex-1 flex justify-center w-full">
        {/* If Phone Frame is toggled on wide screens, show simulated phone container */}
        {isPhoneFrame ? (
          <div className="py-4 px-2 w-full flex justify-center">
            <div className="w-full max-w-[420px] h-[850px] bg-slate-900 border-[8px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-700">
              {/* Phone Speaker Notch */}
              <div className="h-6 bg-slate-900 w-full flex justify-center items-center shrink-0 z-30">
                <div className="w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 bg-slate-950 rounded-full" />
                  <div className="w-10 h-1.5 bg-slate-950 rounded-full" />
                </div>
              </div>

              {/* View Content inside phone container */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'job' && (
                  <JobSelector
                    selectedJob={selectedJob}
                    onSelectJob={handleSelectJob}
                    onStartInterview={() => setActiveTab('chat')}
                  />
                )}
                {activeTab === 'chat' && (
                  <ChatInterview
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    selectedJob={selectedJob}
                    completenessScore={completenessScore}
                    missingCategories={missingCategories}
                    cvMemory={cvMemory}
                    onUpdateMemory={setCvMemory}
                    onGenerateCV={handleGenerateCV}
                    onOpenMemory={() => setActiveTab('memory')}
                    lastExtractedAlert={lastExtractedAlert}
                  />
                )}
                {activeTab === 'memory' && (
                  <MemoryInspector
                    memory={cvMemory}
                    onUpdateMemory={setCvMemory}
                    selectedJob={selectedJob}
                    completenessScore={completenessScore}
                    onGenerateCV={handleGenerateCV}
                    onBackToChat={() => setActiveTab('chat')}
                  />
                )}
                {activeTab === 'cv' && (
                  <CVPreview
                    cv={cvMemory}
                    onUpdateCV={setCvMemory}
                    selectedJob={selectedJob}
                    atsScore={atsScore}
                    matchedKeywords={matchedKeywords}
                    missingKeywords={missingKeywords}
                    recruiterTips={recruiterTips}
                    onRegenerate={handleGenerateCV}
                    onBackToChat={() => setActiveTab('chat')}
                    isGenerating={isGeneratingCV}
                  />
                )}
              </div>

              {/* Phone Home Bar */}
              <div className="h-4 bg-slate-900 flex items-center justify-center shrink-0">
                <div className="w-32 h-1 bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Native Full Responsive Layout (Perfect on Real Phones, Tablets, and Desktops) */
          <div className="w-full">
            {activeTab === 'job' && (
              <JobSelector
                selectedJob={selectedJob}
                onSelectJob={handleSelectJob}
                onStartInterview={() => setActiveTab('chat')}
              />
            )}
            {activeTab === 'chat' && (
              <ChatInterview
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                selectedJob={selectedJob}
                completenessScore={completenessScore}
                missingCategories={missingCategories}
                cvMemory={cvMemory}
                onUpdateMemory={setCvMemory}
                onGenerateCV={handleGenerateCV}
                onOpenMemory={() => setActiveTab('memory')}
                lastExtractedAlert={lastExtractedAlert}
              />
            )}
            {activeTab === 'memory' && (
              <MemoryInspector
                memory={cvMemory}
                onUpdateMemory={setCvMemory}
                selectedJob={selectedJob}
                completenessScore={completenessScore}
                onGenerateCV={handleGenerateCV}
                onBackToChat={() => setActiveTab('chat')}
              />
            )}
            {activeTab === 'cv' && (
              <CVPreview
                cv={cvMemory}
                onUpdateCV={setCvMemory}
                selectedJob={selectedJob}
                atsScore={atsScore}
                matchedKeywords={matchedKeywords}
                missingKeywords={missingKeywords}
                recruiterTips={recruiterTips}
                onRegenerate={handleGenerateCV}
                onBackToChat={() => setActiveTab('chat')}
                isGenerating={isGeneratingCV}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
