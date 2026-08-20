import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Search, 
  ArrowUpRight, 
  Eye, 
  SlidersHorizontal,
  Download,
  AlertTriangle,
  Send,
  Sparkles,
  Layers,
  Landmark,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { Complaint, LanguageCode, UserProfile, IndianState, DepartmentName } from '../types';
import { INDIAN_STATES, DEPARTMENTS_LIST, STATE_ADMINS } from '../data/seedData';
import { t, locNum, localizeDigitsInString, locDepartment, locStatus, locPriority, locCategory } from '../utils/localization';

interface StateAdminPortalProps {
  complaints: Complaint[];
  currentUser: UserProfile;
  currentLanguage?: LanguageCode;
  selectedState: IndianState;
  onSelectState: (state: IndianState) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const StateAdminPortal: React.FC<StateAdminPortalProps> = ({
  complaints,
  currentUser,
  currentLanguage = 'en',
  selectedState,
  onSelectState,
  onSelectComplaint,
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  // State metadata
  const stateMeta = INDIAN_STATES.find((s) => s.code === selectedState) || INDIAN_STATES[0];
  const stateAdminProfile = STATE_ADMINS.find((a) => a.assignedState === selectedState) || STATE_ADMINS[0];

  // Filter complaints strictly for the selected state (or all states if 'All States' selected)
  const stateComplaints = complaints.filter((c) => {
    if (selectedState !== 'All States' && c.state !== selectedState) {
      return false;
    }
    return true;
  });

  const filteredComplaints = stateComplaints.filter((c) => {
    if (showOverdueOnly && !c.isSlaBreached) return false;
    if (selectedDeptFilter !== 'All' && c.department !== selectedDeptFilter) return false;
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

  // Calculate State-Specific Metrics
  const totalStateGrievances = stateComplaints.length;
  const resolvedCount = stateComplaints.filter((c) => c.status === 'Resolved').length;
  const inProgressCount = stateComplaints.filter((c) => c.status === 'In Progress').length;
  const highPriorityCount = stateComplaints.filter((c) => c.priority === 'HIGH').length;
  const slaBreachesCount = stateComplaints.filter((c) => c.isSlaBreached).length;
  const stateResolvedRate = totalStateGrievances > 0 ? Math.round((resolvedCount / totalStateGrievances) * 100) : 100;

  // Department-wise distribution in this state
  const departmentCounts: Record<string, { total: number; resolved: number; overdue: number }> = {};
  DEPARTMENTS_LIST.forEach((d) => {
    departmentCounts[d] = { total: 0, resolved: 0, overdue: 0 };
  });
  stateComplaints.forEach((c) => {
    if (!departmentCounts[c.department]) {
      departmentCounts[c.department] = { total: 0, resolved: 0, overdue: 0 };
    }
    departmentCounts[c.department].total += 1;
    if (c.status === 'Resolved') departmentCounts[c.department].resolved += 1;
    if (c.isSlaBreached) departmentCounts[c.department].overdue += 1;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Official State Header & State Switcher Command Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        
        {/* Top State Badge & Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                {stateMeta.badge} • {t('adminDashboard', currentLanguage)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {t('roleAdmin', currentLanguage)}: <strong className="text-slate-800 font-bold">{stateAdminProfile.name}</strong> ({stateAdminProfile.designation})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2545] tracking-tight font-serif">
              {stateMeta.portalTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
              {t('adminMunicipalAnalytics', currentLanguage)}: {t('deptBreakdown', currentLanguage)} and {t('statsSlaRate', currentLanguage)} across {stateMeta.name}.
            </p>
          </div>

          {/* State Switcher Dropdown */}
          <div className="shrink-0 space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
              {t('switchRole', currentLanguage)}:
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => onSelectState(e.target.value as IndianState)}
                className="w-full sm:w-64 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer shadow-2xs"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.badge})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* State Performance KPI Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-6">
          
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-bold mb-1">{t('statsTotal', currentLanguage)}</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#0b2545]">{locNum(totalStateGrievances, currentLanguage)}</div>
            <div className="text-[10px] text-slate-500 font-medium">{stateMeta.name} Jurisdiction</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-emerald-800 font-bold mb-1">{t('statsSlaRate', currentLanguage)}</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">{locNum(stateResolvedRate, currentLanguage)}%</div>
            <div className="text-[10px] text-slate-500 font-medium">{locNum(resolvedCount, currentLanguage)} {locStatus('Resolved', currentLanguage)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-blue-800 font-bold mb-1">{t('statsInProgress', currentLanguage)}</div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-700">{locNum(inProgressCount, currentLanguage)}</div>
            <div className="text-[10px] text-slate-500 font-medium">{t('pendingActionQueue', currentLanguage)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-rose-800 font-bold mb-1">{t('highPriority', currentLanguage)}</div>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-700">{locNum(highPriorityCount, currentLanguage)}</div>
            <div className="text-[10px] text-slate-500 font-medium">{locNum(48, currentLanguage)}h SLA Window</div>
          </div>

          <div className={`p-3.5 rounded-xl border ${slaBreachesCount > 0 ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-xs text-amber-800 font-bold mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('statsEscalated', currentLanguage)}</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-700">{locNum(slaBreachesCount, currentLanguage)}</div>
            <div className="text-[10px] text-amber-800/80 font-medium">{t('pendingActionQueue', currentLanguage)}</div>
          </div>

        </div>

      </div>

      {/* State Department Performance Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0b2545] font-serif">
              {stateMeta.name} • {t('deptBreakdown', currentLanguage)}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t('adminMunicipalAnalytics', currentLanguage)}: {stateMeta.name}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {DEPARTMENTS_LIST.length} Municipal Divisions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {DEPARTMENTS_LIST.map((dept) => {
            const data = departmentCounts[dept] || { total: 0, resolved: 0, overdue: 0 };
            const percent = data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 100;
            return (
              <div
                key={dept}
                onClick={() => setSelectedDeptFilter(selectedDeptFilter === dept ? 'All' : dept)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedDeptFilter === dept
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {locDepartment(dept, currentLanguage)}
                  </span>
                  <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {locNum(data.total, currentLanguage)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>{t('statsSlaRate', currentLanguage)}</span>
                    <strong className="text-slate-800">{locNum(percent, currentLanguage)}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percent >= 80 ? 'bg-emerald-600' : percent >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {data.overdue > 0 && (
                    <div className="text-[10px] text-rose-700 font-bold flex items-center gap-1 pt-0.5">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>{locNum(data.overdue, currentLanguage)} {t('slaBreachedBadge', currentLanguage)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* State Complaints Registry Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        
        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#0b2545] font-serif">
              {stateMeta.name} • {t('allPublicGrievances', currentLanguage)}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {locNum(filteredComplaints.length, currentLanguage)} / {locNum(stateComplaints.length, currentLanguage)} • {stateMeta.name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('searchPlaceholder', currentLanguage)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">{t('filterAllDepts', currentLanguage)}</option>
              {DEPARTMENTS_LIST.map((d) => (
                <option key={d} value={d}>{locDepartment(d, currentLanguage)}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">{t('priority', currentLanguage)}: {t('filterAllDepts', currentLanguage)}</option>
              <option value="HIGH">{locPriority('HIGH', currentLanguage)}</option>
              <option value="MEDIUM">{locPriority('MEDIUM', currentLanguage)}</option>
              <option value="LOW">{locPriority('LOW', currentLanguage)}</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                showOverdueOnly
                  ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              ⚠️ {t('slaBreachedBadge', currentLanguage)}
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3">ID & Citizen</th>
                <th className="px-4 py-3">Category & Department</th>
                <th className="px-4 py-3">Location / Ward</th>
                <th className="px-4 py-3">Work Progress & Action</th>
                <th className="px-4 py-3">Priority / SLA</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No grievances match the specified filters in {stateMeta.name}.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* ID & Citizen */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-[#0b2545] font-mono">
                          {localizeDigitsInString(c.complaintNumber, currentLanguage)}
                        </div>
                        <div className="text-[11px] text-slate-500">{c.userName}</div>
                      </td>

                      {/* Category & Department */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{locCategory(c.category, currentLanguage)}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {locDepartment(c.department, currentLanguage)}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3">
                        <div className="text-slate-800 font-medium truncate max-w-xs">{c.location.address}</div>
                        <div className="text-[10px] text-blue-900 font-semibold">{c.location.ward || c.district}</div>
                      </td>

                      {/* Work Progress & Action */}
                      <td className="px-4 py-3">
                        <div className="space-y-1 max-w-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-slate-600 truncate">{c.currentWorkSummary || 'Assigned to field division'}</span>
                            <span className="font-bold text-blue-900 ml-1">{c.workProgressPercent || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all"
                              style={{ width: `${c.workProgressPercent || (c.status === 'Resolved' ? 100 : 15)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Priority / SLA */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          c.priority === 'HIGH'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : c.priority === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {locPriority(c.priority, currentLanguage)}
                        </span>
                        {c.isSlaBreached && (
                          <div className="text-[10px] text-rose-700 font-bold mt-0.5 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            <span>Overdue</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
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
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectComplaint(c)}
                          className="px-3 py-1.5 bg-[#0b2545] hover:bg-[#133966] text-white rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
