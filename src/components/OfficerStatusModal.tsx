import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Edit3, 
  Wrench, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Send,
  AlertTriangle
} from 'lucide-react';
import { Complaint, ComplaintPriority, ComplaintStatus, DepartmentName, UserProfile, LanguageCode } from '../types';
import { updateComplaintStatusAPI } from '../utils/aiService';
import { t, locNum, localizeDigitsInString, locDepartment, locPriority, locStatus } from '../utils/localization';

interface OfficerStatusModalProps {
  complaint: Complaint | null;
  currentUser: UserProfile;
  currentLanguage?: LanguageCode;
  onClose: () => void;
  onStatusUpdated: (updatedComplaint: Complaint) => void;
}

const WORK_ACTION_PRESETS = [
  'Site Inspection & Damage Measurement',
  'Civil Masonry & Asphalt Laying',
  'Pipeline Welding & Pressure Testing',
  'Electrical MCB / Transformer Replacement',
  'Debris Removal & Chemical Sanitization',
  'Drain Super-Sucker Desilting & Jetting',
  'Vector Fogging & Larvicidal Spray',
  'Final Quality Testing & Clean-up',
];

export const OfficerStatusModal: React.FC<OfficerStatusModalProps> = ({
  complaint,
  currentUser,
  currentLanguage = 'en',
  onClose,
  onStatusUpdated,
}) => {
  if (!complaint) return null;

  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [workProgressPercent, setWorkProgressPercent] = useState<number>(
    complaint.workProgressPercent !== undefined ? complaint.workProgressPercent : (complaint.status === 'Resolved' ? 100 : 50)
  );
  const [actionCategory, setActionCategory] = useState<string>(
    WORK_ACTION_PRESETS[0]
  );
  const [actionTaken, setActionTaken] = useState<string>(
    complaint.currentWorkSummary || ''
  );
  const [crewLead, setCrewLead] = useState<string>(
    currentUser.name || 'Assistant Engineer'
  );
  const [equipmentUsed, setEquipmentUsed] = useState<string>('');
  const [estimatedCompletion, setEstimatedCompletion] = useState<string>('Within 24 Hours');
  const [updateMessage, setUpdateMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const summaryText = actionTaken.trim() || `${actionCategory}: Work updated to ${workProgressPercent}% progress by ${currentUser.name}.`;
    const messageText = updateMessage.trim() || `[${status}] ${summaryText}`;

    setIsSubmitting(true);
    try {
      const updated = await updateComplaintStatusAPI(complaint.id, {
        status,
        message: messageText,
        createdBy: `${currentUser.name || 'Officer'} (${currentUser.department || complaint.department})`,
        role: 'officer',
        workDetails: {
          actionCategory,
          actionTaken: summaryText,
          workProgressPercent: status === 'Resolved' ? 100 : workProgressPercent,
          crewLead: crewLead.trim(),
          equipmentUsed: equipmentUsed.trim(),
          estimatedCompletion: estimatedCompletion.trim(),
          officerBadgeId: currentUser.badgeId,
        },
      });

      onStatusUpdated(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 flex flex-col my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0b2545] text-white flex items-center justify-center shadow-xs">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0b2545] tracking-tight font-serif">
                Department Work Log & Status Update
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                #{localizeDigitsInString(complaint.complaintNumber, currentLanguage)} • {locDepartment(complaint.department, currentLanguage)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white overflow-y-auto max-h-[75vh]">
          
          {/* 1. Target Status Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
              <span>1. Update Grievance Status:</span>
              <span className="text-[11px] text-slate-500 font-medium font-normal">Citizen will receive live SMS/alert</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {(['Under Review', 'Assigned', 'In Progress', 'Resolved', 'Escalated', 'Rejected'] as ComplaintStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setStatus(st);
                      if (st === 'Resolved') setWorkProgressPercent(100);
                    }}
                    className={`py-2 px-2.5 rounded-lg font-bold transition-all border text-center cursor-pointer ${
                      status === st
                        ? st === 'Resolved'
                          ? 'bg-emerald-600 border-emerald-700 text-white shadow-2xs'
                          : st === 'Escalated'
                          ? 'bg-rose-600 border-rose-700 text-white shadow-2xs'
                          : 'bg-[#0b2545] border-[#0b2545] text-white shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {locStatus(st, currentLanguage)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 2. What work are you doing on this problem? */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-700" />
                <span>2. What work are you doing on this problem?</span>
              </span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                {workProgressPercent}% Complete
              </span>
            </div>

            {/* Work Progress Slider / Buttons */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                <span>Repair Completion Level:</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 25, 50, 75, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setWorkProgressPercent(val)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      workProgressPercent === val
                        ? 'bg-blue-600 border-blue-700 text-white shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            {/* Action Category Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase">
                Work Action Type:
              </label>
              <select
                value={actionCategory}
                onChange={(e) => setActionCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
              >
                {WORK_ACTION_PRESETS.map((act) => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>

            {/* Detailed Work Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase">
                Specific Work Performed / Ground Action Log:
              </label>
              <textarea
                rows={2}
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="e.g. Dispatched 4-man rapid repair crew with asphalt hauler. Excavated crater, laid crushed stone aggregate, and hot-mix bitumen."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* Crew Lead & Equipment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  Supervisor / Crew Lead:
                </label>
                <input
                  type="text"
                  value={crewLead}
                  onChange={(e) => setCrewLead(e.target.value)}
                  placeholder="Officer or Supervisor Name"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  Machinery / Equipment Deployed:
                </label>
                <input
                  type="text"
                  value={equipmentUsed}
                  onChange={(e) => setEquipmentUsed(e.target.value)}
                  placeholder="e.g. Roller, Super-Sucker, Ladder Truck"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Estimated Completion */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                <span>Estimated Target Completion:</span>
              </label>
              <input
                type="text"
                value={estimatedCompletion}
                onChange={(e) => setEstimatedCompletion(e.target.value)}
                placeholder="e.g. Today, 6:00 PM / Within 24 Hours"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>

          </div>

          {/* 3. Official Public Resolution Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              3. Official Public Resolution Note / Citizen Notification:
            </label>
            <textarea
              rows={2}
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
              placeholder="e.g. The repair work is in final stage. Road surface reopened for traffic."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t('cancel', currentLanguage)}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0b2545] hover:bg-[#133966] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing...' : 'Save & Publish Work Update'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
