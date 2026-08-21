import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Star, 
  MapPin, 
  Users, 
  ChevronRight, 
  Sparkles, 
  FileText,
  Map,
  ShieldCheck,
  Building2,
  Wrench,
  UserCheck
} from 'lucide-react';
import { Complaint, LanguageCode, UserProfile } from '../types';
import { t, locNum, localizeDigitsInString, locCategory, locDepartment, locStatus, locPriority } from '../utils/localization';

interface CitizenDashboardProps {
  complaints: Complaint[];
  currentUser: UserProfile;
  currentLanguage: LanguageCode;
  onOpenNewGrievance: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenChat: (complaint: Complaint) => void;
  onOpenFeedback: (complaint: Complaint) => void;
  onSupportComplaint: (complaintId: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  complaints,
  currentUser,
  currentLanguage,
  onOpenNewGrievance,
  onSelectComplaint,
  onOpenChat,
  onOpenFeedback,
  onSupportComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<'my'>('my');

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (
        c.complaintNumber +
        ' ' +
        c.category +
        ' ' +
        c.department +
        ' ' +
        c.description +
        ' ' +
        c.location.address
      ).toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  // Calculate Metrics
  const totalCount = complaints.length;
  const myCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'Assigned').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress' || c.status === 'Escalated').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Formal Government Citizen Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                🇮🇳 {t('citizenPortal', currentLanguage)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {t('activeUser', currentLanguage)}: <strong className="text-slate-800 font-bold">{currentUser?.name || t('roleCitizen', currentLanguage)}</strong> ({currentUser?.city || 'Bengaluru'}, {currentUser?.state || 'Karnataka'})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2545] tracking-tight font-serif">
              {t('howCanWeHelp', currentLanguage, t('submitGrievance', currentLanguage))}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {t('speakOrType', currentLanguage)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          </div>
        </div>

        {/* Quick Service Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-slate-100">
          <div 
            onClick={onOpenNewGrievance}
            className="p-4 rounded-xl bg-slate-50/80 hover:bg-blue-50/50 border border-slate-200/80 transition-all hover:border-blue-300 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">{t('voiceInput', currentLanguage)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('multilingualCenter', currentLanguage)}</p>
          </div>

          <div 
            onClick={() => setFilterMode('my')}
            className={`p-4 rounded-xl border transition-all cursor-pointer group ${
              filterMode === 'my'
                ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-300/30'
                : 'bg-slate-50/80 hover:bg-amber-50/50 border-slate-200/80 hover:border-amber-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
              {t('myGrievances', currentLanguage)} ({locNum(myCount, currentLanguage)})
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('statsInProgress', currentLanguage)} & SLA</p>
          </div>

          <div 
            className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">{t('citizenPortal', currentLanguage)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Private account workspace</p>
          </div>

          <div 
            className="p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">{t('citizenHelpline', currentLanguage)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">1916 / 112 (24x7 Toll-Free)</p>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-4 pt-4 border-t border-slate-100">
          
          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
              <span>{t('statsTotal', currentLanguage)}</span>
              <FileText className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#0b2545]">{locNum(totalCount, currentLanguage)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('allPublicGrievances', currentLanguage)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center justify-between text-amber-700 text-xs mb-1 font-medium">
              <span>{t('status', currentLanguage)}</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-600">{locNum(pendingCount, currentLanguage)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{locStatus('Under Review', currentLanguage)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center justify-between text-blue-700 text-xs mb-1 font-medium">
              <span>{t('statsInProgress', currentLanguage)}</span>
              <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-600">{locNum(inProgressCount, currentLanguage)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{locStatus('In Progress', currentLanguage)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center justify-between text-emerald-700 text-xs mb-1 font-medium">
              <span>{t('statsResolved', currentLanguage)}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">{locNum(resolvedCount, currentLanguage)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{locStatus('Resolved', currentLanguage)}</div>
          </div>

        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div id="complaints-filter-bar" className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder', currentLanguage)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              className="px-3 py-1.5 rounded-md font-bold text-xs bg-[#0b2545] text-white shadow-xs cursor-default"
            >
              {t('myGrievances', currentLanguage)} ({locNum(myCount, currentLanguage)})
            </button>
          </div>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="All">{t('filterAllStatuses', currentLanguage)}</option>
            <option value="Submitted">{locStatus('Submitted', currentLanguage)}</option>
            <option value="Under Review">{locStatus('Under Review', currentLanguage)}</option>
            <option value="Assigned">{locStatus('Assigned', currentLanguage)}</option>
            <option value="In Progress">{locStatus('In Progress', currentLanguage)}</option>
            <option value="Resolved">{locStatus('Resolved', currentLanguage)}</option>
            <option value="Escalated">{locStatus('Escalated', currentLanguage)}</option>
          </select>

        </div>
      </div>

      {/* Complaints List Cards Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide px-1">
          <span>{locNum(filteredComplaints.length, currentLanguage)} Grievances Found</span>
          <span>{t('viewDetails', currentLanguage)}</span>
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Grievances Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {filterMode === 'my'
                ? "You haven't filed any grievances yet. Click 'Submit Grievance' to report a civic problem."
                : 'Try adjusting your search keywords or filter settings.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComplaints.map((c) => {
              const isResolved = c.status === 'Resolved';
              const isEscalated = c.status === 'Escalated' || c.isSlaBreached;
              const progress = c.workProgressPercent !== undefined ? c.workProgressPercent : (isResolved ? 100 : 25);

              return (
                <div
                  key={c.id}
                  id={`complaint-card-${c.complaintNumber}`}
                  className="bg-white border border-slate-200 hover:border-blue-400/80 hover:shadow-md rounded-xl p-5 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                  onClick={() => onSelectComplaint(c)}
                >
                  <div className="space-y-3">
                    
                    {/* Card Header: ID, Category, Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {localizeDigitsInString(c.complaintNumber, currentLanguage)}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                            {locCategory(c.category, currentLanguage)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate max-w-[240px]">{localizeDigitsInString(c.location.address, currentLanguage)}</span>
                        </p>
                      </div>

                      {/* Status Pill */}
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border shrink-0 ${
                          isResolved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isEscalated
                            ? 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
                            : c.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {locStatus(c.status, currentLanguage)}
                      </span>
                    </div>

                    {/* AI Structured Summary */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-150 text-xs text-slate-700 leading-relaxed font-normal">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-1">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        {t('aiSummary', currentLanguage)}:
                      </div>
                      <p className="line-clamp-2">{localizeDigitsInString(c.aiSummary || c.description, currentLanguage)}</p>
                    </div>

                    {/* Active Department Work Indicator */}
                    <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-150 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-blue-950 flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-blue-700" />
                          <span>Department Repair Status:</span>
                        </span>
                        <span className="font-bold text-blue-900">{progress}%</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium truncate">
                        {c.currentWorkSummary || 'Assigned to field division. Inspection scheduled.'}
                      </p>
                      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Department & Priority Pill */}
                    <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-1">
                      <div className="text-[11px] text-slate-600 truncate max-w-[200px] font-medium">
                        {t('department', currentLanguage)}: <span className="text-[#0b2545] font-bold">{locDepartment(c.department, currentLanguage)}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.priority === 'HIGH'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : c.priority === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {locPriority(c.priority, currentLanguage)}
                        </span>

                        <span className="text-[10px] font-mono text-slate-500 font-medium">
                          {locNum(c.slaHours, currentLanguage)} {t('hours', currentLanguage)} SLA
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Support count & Action */}
                    <button
                      type="button"
                      onClick={() => onSupportComplaint(c.id)}
                      className="text-slate-600 hover:text-blue-700 flex items-center gap-1 text-[11px] py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer font-medium"
                      title={t('supportThisIssue', currentLanguage)}
                    >
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>{locNum(c.supportersCount || 1, currentLanguage)} {t('supportedBy', currentLanguage)}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* AI Chatbot Button */}
                      <button
                        type="button"
                        onClick={() => onOpenChat(c)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 text-blue-600" />
                        <span>{t('askAIChat', currentLanguage)}</span>
                      </button>

                      {/* Feedback Button (if resolved) */}
                      {isResolved ? (
                        c.feedback ? (
                          <span className="flex items-center gap-1 text-[11px] text-amber-700 font-bold px-2 py-1 bg-amber-50 rounded-lg border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {locNum(c.feedback.rating, currentLanguage)}/{locNum(5, currentLanguage)} {t('rateResolution', currentLanguage)}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenFeedback(c)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <Star className="w-3 h-3 fill-white" />
                            <span>{t('rateResolution', currentLanguage)}</span>
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectComplaint(c)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-[11px] font-bold flex items-center gap-1 border border-blue-200 transition-colors cursor-pointer"
                        >
                          <span>{t('viewDetails', currentLanguage)}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
