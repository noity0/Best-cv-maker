import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, BrainCircuit, CheckCircle2, AlertCircle, 
  Mic, MicOff, ArrowRight, RefreshCw, PlusCircle, HelpCircle, FileCheck,
  User, Edit3
} from 'lucide-react';
import { ChatMessage, CVMemoryData, JobPreset, CVContactInfo } from '../types/cv';
import { QuickContactModal } from './QuickContactModal';

interface ChatInterviewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  selectedJob: JobPreset;
  completenessScore: number;
  missingCategories: string[];
  cvMemory: CVMemoryData;
  onUpdateMemory: (updated: CVMemoryData) => void;
  onGenerateCV: () => void;
  onOpenMemory: () => void;
  lastExtractedAlert?: string | null;
}

export const ChatInterview: React.FC<ChatInterviewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  selectedJob,
  completenessScore,
  missingCategories,
  cvMemory,
  onUpdateMemory,
  onGenerateCV,
  onOpenMemory,
  lastExtractedAlert
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, lastExtractedAlert]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);
  };

  const handleQuickReply = (reply: string) => {
    if (isLoading) return;
    if (reply.toLowerCase().includes('generate') && completenessScore >= 40) {
      onGenerateCV();
    } else if (reply.toLowerCase().includes('personal') || reply.toLowerCase().includes('contact')) {
      setShowContactModal(true);
    } else {
      onSendMessage(reply);
    }
  };

  const handleSaveContact = (updatedContact: CVContactInfo, showPhoto?: boolean) => {
    onUpdateMemory({
      ...cvMemory,
      contact: updatedContact,
      showPhoto: showPhoto !== undefined ? showPhoto : cvMemory.showPhoto
    });
  };

  // Speech to text integration (Web Speech API)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported on this browser. You can type your response!');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const latestAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');

  return (
    <div className="flex flex-col h-[calc(100dvh-115px)] max-w-2xl mx-auto px-2 sm:px-4">
      {/* Top Floating Readiness & Job Header */}
      <div className="pt-2 pb-1.5 shrink-0">
        <div className="bg-slate-800/95 border border-slate-700/90 rounded-xl p-2.5 sm:p-3 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white truncate">
                    {selectedJob.title} Interview
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Live
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>ATS Match Readiness:</span>
                  <span className={`font-semibold ${completenessScore >= 80 ? 'text-emerald-400' : completenessScore >= 50 ? 'text-indigo-400' : 'text-amber-400'}`}>
                    {completenessScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Generate or View Memory Action */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onOpenMemory}
                className="px-2 py-1 rounded text-xs font-medium text-slate-300 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 transition-colors"
                title="View memory data captured by the AI"
              >
                Inspect Memory
              </button>

              <button
                type="button"
                onClick={onGenerateCV}
                className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                  completenessScore >= 50
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 animate-pulse'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Make Complete CV</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/60 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                completenessScore >= 80
                  ? 'bg-emerald-500'
                  : completenessScore >= 50
                  ? 'bg-indigo-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${completenessScore}%` }}
            />
          </div>

          {/* Missing items pill indicator */}
          {missingCategories.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 overflow-x-auto no-scrollbar">
              <span className="shrink-0 text-amber-400/90 font-medium">To Maximize Match:</span>
              {missingCategories.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="shrink-0 px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-700"
                >
                  +{item}
                </span>
              ))}
            </div>
          )}

          {/* Candidate True Details Bar */}
          <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              {cvMemory.contact.photoUrl ? (
                <img
                  src={cvMemory.contact.photoUrl}
                  alt="Candidate"
                  className="w-5 h-5 rounded-full object-cover border border-indigo-400/50 shrink-0"
                />
              ) : (
                <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              )}
              <span className="font-semibold text-white truncate">
                {cvMemory.contact.fullName ? cvMemory.contact.fullName : 'Name: Not Set Yet'}
              </span>
              {cvMemory.contact.email && (
                <span className="text-slate-400 truncate hidden sm:inline text-[11px]">
                  • {cvMemory.contact.email}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowContactModal(true)}
              className="px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11px] font-medium flex items-center gap-1 shrink-0 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>{cvMemory.contact.fullName ? 'Edit Info & Photo' : 'Set My True Name'}</span>
            </button>
          </div>
        </div>

        {/* Modal for direct contact editing */}
        <QuickContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          contact={cvMemory.contact}
          showPhoto={cvMemory.showPhoto ?? true}
          onSave={handleSaveContact}
        />

        {/* Live Extracted Notification Toast */}
        {lastExtractedAlert && (
          <div className="mt-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{lastExtractedAlert}</span>
            <button
              onClick={onOpenMemory}
              className="ml-auto underline text-[11px] text-emerald-200 hover:text-white shrink-0"
            >
              View in Memory
            </button>
          </div>
        )}
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-sm shadow-md'
                    : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-sm shadow-sm'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-1 pb-1 border-b border-slate-700/50 text-[11px] font-semibold text-indigo-300">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>AI Career Architect ({selectedJob.title})</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] mt-1 text-right ${
                    isUser ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Action buttons embedded in assistant response */}
              {!isUser && msg.actionRequired === 'view_cv' && (
                <div className="mt-2">
                  <button
                    onClick={onGenerateCV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md"
                  >
                    <span>Generate Full CV Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-slate-800/60 rounded-xl max-w-fit border border-slate-700/50">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span>AI analyzing responses & matching {selectedJob.title} criteria...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips (Contextual Tap-to-Answer for Mobile) */}
      {latestAssistantMessage?.quickReplies && latestAssistantMessage.quickReplies.length > 0 && !isLoading && (
        <div className="py-1.5 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] text-slate-400 shrink-0 uppercase tracking-wider font-semibold">
              Quick Tap:
            </span>
            {latestAssistantMessage.quickReplies.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickReply(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white text-xs whitespace-nowrap transition-colors shadow-sm shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Input Form (Mobile Optimized) */}
      <div className="pt-1.5 pb-2 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title={isListening ? "Listening... Tap to stop" : "Tap to speak your answer"}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id="chat-user-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Type your answer, numbers, or metrics..."}
              disabled={isLoading}
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs sm:text-sm placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Send Button */}
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white shadow-md transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1">
          <span>AI automatically extracts and saves data into your CV profile</span>
          {completenessScore >= 40 && (
            <button
              onClick={onGenerateCV}
              className="text-emerald-400 hover:underline font-medium"
            >
              Ready? Generate CV Now →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
