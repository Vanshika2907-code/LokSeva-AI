import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  User, 
  Sparkles, 
  Star, 
  Camera, 
  Volume2, 
  Send
} from 'lucide-react';
import { Complaint, UserRole, UserProfile, LanguageCode } from '../types';
import { askCitizenChatbotAPI } from '../utils/aiService';
import { t, locNum, localizeDigitsInString, locCategory, locDepartment, locPriority, locStatus } from '../utils/localization';

interface GrievanceDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  currentRole: UserRole;
  currentUser: UserProfile;
  currentLanguage?: LanguageCode;
  onOpenStatusUpdater: (complaint: Complaint) => void;
  onOpenFeedbackModal: (complaint: Complaint) => void;
}

export const GrievanceDetailModal: React.FC<GrievanceDetailModalProps> = ({
  complaint,
  onClose,
  currentRole,
  currentUser,
  currentLanguage = 'en',
  onOpenStatusUpdater,
  onOpenFeedbackModal,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'chat' | 'evidence'>('timeline');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  if (!complaint) return null;

  const isResolved = complaint.status === 'Resolved';
  const isOverdue = complaint.isSlaBreached && !isResolved;

  // Handle Grounded Citizen AI Chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setIsChatLoading(true);

    try {
      const reply = await askCitizenChatbotAPI({
        complaintId: complaint.id,
        message: userMsg,
      });

      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: reply, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Unable to reach assistant. Your complaint is tracked under the designated SLA.', time: 'now' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 border border-blue-200 flex items-center justify-center font-mono font-bold text-xs">
              GRV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#0b2545] font-mono">
                  {localizeDigitsInString(complaint.complaintNumber, currentLanguage)}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                    isResolved
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : isOverdue
                      ? 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
                      : complaint.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {locStatus(complaint.status, currentLanguage)}
                </span>
                {isOverdue && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white">
                    {t('slaEscalated', currentLanguage)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{locCategory(complaint.category, currentLanguage)} • {locDepartment(complaint.department, currentLanguage)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentRole === 'officer' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStatusUpdater(complaint);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                {t('updateStatusAction', currentLanguage)}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-white px-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-blue-700 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('timeline', currentLanguage)}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'border-blue-700 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('askAIChat', currentLanguage)}</span>
            <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px]">Live</span>
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'evidence'
                ? 'border-blue-700 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t('evidencePhoto', currentLanguage)} ({locNum(complaint.attachments.length, currentLanguage)})</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* TAB 1: TIMELINE & DETAILS */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              
              {/* Core Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left Card: Citizen Original Report */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-700" />
                      {t('citizenPortal', currentLanguage)} ({complaint.originalLanguage.toUpperCase()})
                    </span>
                    <button
                      onClick={() => handleSpeakText(complaint.description)}
                      className="text-blue-700 hover:text-blue-900 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{t('voicePlayback', currentLanguage)}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-lg border border-slate-200">
                    "{localizeDigitsInString(complaint.description, currentLanguage)}"
                  </p>
                  <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1 font-medium">
                    <span>By: <strong className="text-slate-800">{complaint.userName}</strong></span>
                    <span>Ph: {localizeDigitsInString(complaint.userPhone, currentLanguage)}</span>
                  </div>
                </div>

                {/* Right Card: AI Classification & Routing */}
                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                      {t('aiSummary', currentLanguage)}
                    </span>
                    <span className="text-[11px] text-blue-700">{t('aiConfidence', currentLanguage)}: {locNum(Math.round(complaint.aiConfidence * 100), currentLanguage)}%</span>
                  </div>
                  <div className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-blue-200 font-medium">
                    {localizeDigitsInString(complaint.aiSummary || complaint.description, currentLanguage)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-white border border-blue-200">
                      <span className="text-slate-500 block text-[10px] font-medium">{t('assignedOfficer', currentLanguage)}</span>
                      <span className="text-blue-900 font-bold">{complaint.assignedOfficerName || 'Ward Engineer'}</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-blue-200">
                      <span className="text-slate-500 block text-[10px] font-medium">{t('priority', currentLanguage)} / SLA</span>
                      <span className="text-rose-700 font-bold">{locPriority(complaint.priority, currentLanguage)} ({locNum(complaint.slaHours, currentLanguage)} {t('hours', currentLanguage)})</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Location Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">{localizeDigitsInString(complaint.location.address, currentLanguage)}</div>
                  <div className="text-slate-600 text-[11px] mt-0.5 font-medium">
                    {localizeDigitsInString(complaint.location.ward || 'Central Zone', currentLanguage)} • GPS: {locNum(complaint.location.latitude.toFixed(4), currentLanguage)}, {locNum(complaint.location.longitude.toFixed(4), currentLanguage)}
                  </div>
                </div>
              </div>

              {/* Action Timeline Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-700" />
                    {t('timeline', currentLanguage)}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">{locNum(complaint.updates.length, currentLanguage)} events</span>
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {complaint.updates.map((upd) => (
                    <div key={upd.id} className="relative group">
                      {/* Timeline node icon */}
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-700 ring-4 ring-white flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                      </div>

                      <div className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 space-y-1.5 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{locStatus(upd.status, currentLanguage)}</span>
                            <span className="text-[10px] text-blue-900 font-mono bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200">
                              {upd.createdBy}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {new Date(upd.createdAt).toLocaleString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">{localizeDigitsInString(upd.message, currentLanguage)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen Feedback Section (if resolved) */}
              {isResolved && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                      {t('rateResolution', currentLanguage)}
                    </span>
                    {!complaint.feedback && (
                      <button
                        onClick={() => onOpenFeedbackModal(complaint)}
                        className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                      >
                        {t('rateResolution', currentLanguage)}
                      </button>
                    )}
                  </div>

                  {complaint.feedback ? (
                    <div className="space-y-1.5 text-xs text-slate-800">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < complaint.feedback!.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-slate-700 font-bold">{locNum(complaint.feedback.rating, currentLanguage)}/{locNum(5, currentLanguage)} Stars</span>
                      </div>
                      <p className="italic text-slate-700 font-medium">"{localizeDigitsInString(complaint.feedback.comment, currentLanguage)}"</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 font-medium">
                      {t('rateResolution', currentLanguage)}
                    </p>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CITIZEN AI CHATBOT (Grounded in DB) */}
          {activeTab === 'chat' && (
            <div className="space-y-4 flex flex-col h-[400px]">
              
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 font-medium">
                <span className="font-bold">{t('askAIChat', currentLanguage)}:</span> #{localizeDigitsInString(complaint.complaintNumber, currentLanguage)}. Grounded official inquiry.
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#0b2545] text-amber-300 flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                    AI
                  </div>
                  <div className="p-3 rounded-xl bg-white text-xs text-slate-800 max-w-[85%] border border-slate-200 shadow-2xs font-medium">
                    Namaste! I am the LokSeva Grievance Assistant for <strong>#{localizeDigitsInString(complaint.complaintNumber, currentLanguage)}</strong>. How can I assist you with this ticket?
                  </div>
                </div>

                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.sender === 'user'
                          ? 'bg-[#0284c7] text-white'
                          : 'bg-[#0b2545] text-amber-300'
                      }`}
                    >
                      {msg.sender === 'user' ? 'You' : 'AI'}
                    </div>
                    <div
                      className={`p-3 rounded-xl text-xs max-w-[85%] font-medium ${
                        msg.sender === 'user'
                          ? 'bg-[#0284c7] text-white'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{localizeDigitsInString(msg.text, currentLanguage)}</p>
                      <span className="text-[10px] opacity-70 block mt-1 text-right">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 pl-8 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                    <span>{t('aiProcessing', currentLanguage)}</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t('searchPlaceholder', currentLanguage)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-medium"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="px-4 py-2 bg-[#0b2545] hover:bg-[#133966] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('askAIChat', currentLanguage)}</span>
                </button>
              </form>

            </div>
          )}

          {/* TAB 3: EVIDENCE PHOTOS */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              {complaint.attachments.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-medium">
                  {t('evidencePhoto', currentLanguage)}: None
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {complaint.attachments.map((att) => (
                    <div key={att.id} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 space-y-2 p-2.5">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={att.fileUrl}
                          alt="Evidence"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="px-1 text-xs text-slate-700 font-bold">
                        {att.description || 'Citizen hazard evidence photo'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
