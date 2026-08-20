import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Send, 
  ArrowRight
} from 'lucide-react';
import { askOfficerAssistantAPI } from '../utils/aiService';
import { UserProfile, LanguageCode } from '../types';
import { t, localizeDigitsInString, locDepartment } from '../utils/localization';

interface OfficerAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  currentLanguage?: LanguageCode;
}

export const OfficerAssistantDrawer: React.FC<OfficerAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentLanguage = 'en',
}) => {
  const PRESET_QUERIES = [
    'What are the most common complaints this week?',
    'Which area has the most unresolved complaints?',
    'Show high-priority overdue complaints.',
    'Summarize sanitation problems.',
  ];

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: `Hello Officer ${currentUser?.name || 'Officer'}! I am your Municipal AI Assistant powered by Gemini 3.7. I can analyze live grievance trends, detect civic risk hotspots, summarize backlogs, and highlight SLA breaches across ${currentUser?.department ? locDepartment(currentUser.department, currentLanguage) : 'all municipal departments'}.`,
      time: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendQuery = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isLoading) return;

    setInputQuery('');
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setIsLoading(true);

    try {
      const response = await askOfficerAssistantAPI({
        question: text,
        officerProfile: {
          id: currentUser.id,
          role: currentUser.role,
          department: currentUser.department,
          designation: currentUser.designation,
          state: currentUser.state,
          city: currentUser.city,
          assignedState: currentUser.assignedState,
        },
      });

      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: response.reply, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Error querying officer assistant.', time: 'now' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full shadow-2xl flex flex-col text-slate-800 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold border border-blue-200">
              <Bot className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0b2545] font-serif flex items-center gap-1.5">
                <span>{t('askAIChat', currentLanguage)}</span>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded border border-blue-200 font-bold">
                  Gemini 3.7
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">{t('officerConsole', currentLanguage)} Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-700" />
            {t('orUseSample', currentLanguage)}:
          </span>
          <div className="flex flex-col gap-1.5">
            {PRESET_QUERIES.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuery(q)}
                className="text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-[11px] text-slate-700 hover:text-blue-900 font-medium transition-colors flex items-center justify-between group cursor-pointer shadow-2xs"
              >
                <span className="truncate">{q}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-700 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user' ? 'bg-[#0b2545] text-white' : 'bg-blue-100 text-blue-900 border border-blue-200'
                }`}
              >
                {m.sender === 'user' ? 'You' : <Bot className="w-3.5 h-3.5 text-blue-700" />}
              </div>
              <div
                className={`p-3 rounded-xl text-xs max-w-[85%] ${
                  m.sender === 'user'
                    ? 'bg-[#0b2545] text-white'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap font-medium">{localizeDigitsInString(m.text, currentLanguage)}</p>
                <span className="text-[10px] opacity-70 block mt-1 text-right">{m.time}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-blue-900 pl-8 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-700 animate-spin" />
              <span>{t('aiProcessing', currentLanguage)}</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputQuery);
          }}
          className="p-3 border-t border-slate-200 bg-white flex gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t('searchPlaceholder', currentLanguage)}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-3.5 py-2 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
