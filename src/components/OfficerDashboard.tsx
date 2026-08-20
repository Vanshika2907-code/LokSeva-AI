import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  Edit3, 
  Eye, 
  Bot,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wrench,
  Truck,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Complaint, LanguageCode, UserProfile, DepartmentName } from '../types';
import { DEPARTMENTS_LIST } from '../data/seedData';
import { t, locNum, localizeDigitsInString, locCategory, locDepartment, locStatus, locPriority } from '../utils/localization';

interface OfficerDashboardProps {
  complaints: Complaint[];
  currentUser: UserProfile;
  currentLanguage: LanguageCode;
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenStatusUpdater: (complaint: Complaint) => void;
  onOpenOfficerAssistant: () => void;
  onSwitchDepartment?: (department: DepartmentName) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  complaints,
  currentUser,
  currentLanguage,
  onSelectComplaint,
  onOpenStatusUpdater,
  onOpenOfficerAssistant,
  onSwitchDepartment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const officerDepartment = currentUser.department || 'Public Works Department';

  // STRICT DEPARTMENT SCOPING: Officer sees complaints for their department only!
  const departmentComplaints = complaints.filter((c) => c.department === officerDepartment);

  // Filter complaints for officer view
  const filteredComplaints = departmentComplaints.filter((c) => {
    if (showOverdueOnly && !c.isSlaBreached) return false;
    if (selectedPriorityFilter !== 'All' && c.priority !== selectedPriorityFilter) return false;
    if (selectedStatusFilter !== 'All' && c.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const str = (
        c.complaintNumber +
        ' ' +
        c.category +
        ' ' +
        c.department +
        ' ' +
        c.userName +
        ' ' +
        c.location.address +
        ' ' +
        c.description
      ).toLowerCase();
      if (!str.includes(q)) return false;
    }
    return true;
  });

  // Officer KPI Calculations
  const totalAssigned = departmentComplaints.length;
  const inProgressCount = departmentComplaints.filter((c) => c.status === 'In Progress').length;
  const highPriorityCount = departmentComplaints.filter((c) => c.priority === 'HIGH' && c.status !== 'Resolved').length;
  const overdueCount = departmentComplaints.filter((c) => c.isSlaBreached && c.status !== 'Resolved').length;
  const resolvedCount = departmentComplaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Officer Header Card (Formal Administrative Style) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                🏢 {t('officerWorkspaceTitle', currentLanguage)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {t('roleOfficer', currentLanguage)}: <strong className="text-slate-800 font-bold">{currentUser?.name || t('roleOfficer', currentLanguage)}</strong> • {t('assignedTo', currentLanguage)} <strong className="font-mono text-amber-900">{currentUser?.badgeId || 'OFF-SEC-4019'}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2545] tracking-tight font-serif">
              {locDepartment(officerDepartment, currentLanguage)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              {t('assignedDept', currentLanguage)}: <strong>{locDepartment(officerDepartment, currentLanguage)}</strong>. {t('pendingActionQueue', currentLanguage)}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="officer-ai-assistant-btn"
              onClick={onOpenOfficerAssistant}
              className="px-4 py-2.5 rounded-xl bg-[#0b2545] hover:bg-[#133966] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>{t('askAIChat', currentLanguage)}</span>
              <span className="px-1.5 py-0.5 bg-blue-900/60 text-blue-200 rounded text-[10px]">Gemini 3.7</span>
            </button>
          </div>
        </div>

        {/* Department Quick Switcher Chips */}
        {onSwitchDepartment && (
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                {t('switchRole', currentLanguage)}:
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{t('allDepartments', currentLanguage)}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DEPARTMENTS_LIST.map((dept) => {
                const isCurrent = dept === officerDepartment;
                return (
                  <button
                    key={dept}
                    onClick={() => onSwitchDepartment(dept)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      isCurrent
                        ? 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-400/20 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {locDepartment(dept, currentLanguage)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-6 pt-5 border-t border-slate-100">
          
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-bold mb-1">{t('statsTotal', currentLanguage)}</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#0b2545]">{locNum(totalAssigned, currentLanguage)}</div>
            <div className="text-[10px] text-slate-500 font-medium">{t('assignedDept', currentLanguage)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-blue-700 font-bold mb-1">{t('statsInProgress', currentLanguage)}</div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-600">{locNum(inProgressCount, currentLanguage)}</div>
            <div className="text-[10px] text-slate-500 font-medium">{locStatus('In Progress', currentLanguage)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-rose-700 font-bold mb-1">{locPriority('HIGH', currentLanguage)} Priority</div>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-600">{locNum(highPriorityCount, currentLanguage)}</div>
            <div className="text-[10px] text-slate-500 font-medium">{locNum(48, currentLanguage)}h SLA Target</div>
          </div>

          <div className={`p-3.5 rounded-xl border ${overdueCount > 0 ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-xs text-amber-800 font-bold mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-600" />
              <span>{locStatus('Escalated', currentLanguage)}</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-700">{locNum(overdueCount, currentLanguage)}</div>
            <div className="text-[10px] text-amber-800/80 font-medium">{t('slaBreachedBadge', currentLanguage)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-emerald-700 font-bold mb-1">{t('statsResolved', currentLanguage)}</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">{locNum(resolvedCount, currentLanguage)}</div>
            <div className="text-[10px] text-slate-500 font-medium">{locStatus('Closed', currentLanguage)}</div>
          </div>

        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchPlaceholder', currentLanguage)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">{t('priority', currentLanguage)}: {t('filterAllDepts', currentLanguage)}</option>
            <option value="HIGH">{locPriority('HIGH', currentLanguage)}</option>
            <option value="MEDIUM">{locPriority('MEDIUM', currentLanguage)}</option>
            <option value="LOW">{locPriority('LOW', currentLanguage)}</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">{t('status', currentLanguage)}: {t('filterAllDepts', currentLanguage)}</option>
            <option value="Submitted">{locStatus('Submitted', currentLanguage)}</option>
            <option value="Under Review">{locStatus('Under Review', currentLanguage)}</option>
            <option value="Assigned">{locStatus('Assigned', currentLanguage)}</option>
            <option value="In Progress">{locStatus('In Progress', currentLanguage)}</option>
            <option value="Resolved">{locStatus('Resolved', currentLanguage)}</option>
          </select>

          <button
            onClick={() => setShowOverdueOnly(!showOverdueOnly)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
              showOverdueOnly
                ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {t('slaBreachedBadge', currentLanguage)}
          </button>
        </div>
      </div>

      {/* Grievance Complaint Cards Grid */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
            <Building className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-700 text-sm">No grievances currently in this department queue.</p>
            <p className="text-xs text-slate-500 mt-1">Try changing search keywords or switch to another department.</p>
          </div>
        ) : (
          filteredComplaints.map((c) => {
            const isOverdue = c.isSlaBreached && c.status !== 'Resolved';
            const progress = c.workProgressPercent !== undefined ? c.workProgressPercent : (c.status === 'Resolved' ? 100 : 30);

            return (
              <div
                key={c.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                
                {/* Left details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0b2545] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {localizeDigitsInString(c.complaintNumber, currentLanguage)}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      c.priority === 'HIGH'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : c.priority === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {locPriority(c.priority, currentLanguage)}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      c.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-900'
                        : c.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-900'
                        : c.status === 'Escalated'
                        ? 'bg-rose-100 text-rose-900'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {locStatus(c.status, currentLanguage)}
                    </span>

                    {isOverdue && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded text-[10px] font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-amber-700" />
                        <span>SLA Breached</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {c.description}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{c.location.address}</span>
                      </span>
                      <span>• Citizen: <strong className="text-slate-700">{c.userName}</strong></span>
                      <span>• State: <strong className="text-slate-700">{c.state}</strong></span>
                    </div>
                  </div>

                  {/* Ongoing Work Status Banner */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-blue-700" />
                        <span>Current Work Log:</span>
                      </span>
                      <span className="font-bold font-mono text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded text-[10px]">
                        {progress}% Progress
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {c.currentWorkSummary || 'Inspection assigned. Awaiting field repair dispatch.'}
                    </p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-row md:flex-col items-center justify-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onOpenStatusUpdater(c)}
                    className="flex-1 md:flex-none w-full px-4 py-2.5 bg-[#0b2545] hover:bg-[#133966] text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Update Work / Status</span>
                  </button>

                  <button
                    onClick={() => onSelectComplaint(c)}
                    className="flex-1 md:flex-none w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Case File</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
