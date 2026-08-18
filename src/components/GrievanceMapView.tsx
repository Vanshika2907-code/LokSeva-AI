import React, { useState } from 'react';
import { 
  MapPin, 
  Filter, 
  Eye, 
  Navigation,
  Compass
} from 'lucide-react';
import { Complaint, LanguageCode } from '../types';
import { t, locNum, localizeDigitsInString, locCategory, locDepartment, locPriority, locStatus } from '../utils/localization';

interface GrievanceMapViewProps {
  complaints: Complaint[];
  currentLanguage?: LanguageCode;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const GrievanceMapView: React.FC<GrievanceMapViewProps> = ({
  complaints,
  currentLanguage = 'en',
  onSelectComplaint,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(complaints[0] || null);

  // Filter complaints for map
  const filteredComplaints = complaints.filter((c) => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedPriority !== 'All' && c.priority !== selectedPriority) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
    return true;
  });

  // Calculate coordinates mapping for Bengaluru bounds (Lat: 12.85 to 13.15, Lng: 77.45 to 77.75)
  const minLat = 12.88;
  const maxLat = 13.12;
  const minLng = 77.50;
  const maxLng = 77.72;

  const getPositionPercent = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      left: `${Math.max(8, Math.min(92, x))}%`,
      top: `${Math.max(8, Math.min(92, y))}%`,
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Map Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                GIS Geospatial Grid
              </span>
              <span className="text-xs text-slate-500 font-medium">Municipal Corporation Wards</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2545] tracking-tight font-serif">
              {t('mapView', currentLanguage)} & Hotspots
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Real-time geolocation mapping of civic tickets across municipal wards with priority severity filters and localized cluster telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-bold">{locNum(filteredComplaints.length, currentLanguage)} {t('statsTotal', currentLanguage)}</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-bold flex items-center gap-1 uppercase tracking-wide">
            <Filter className="w-3.5 h-3.5 text-blue-600" /> Filters:
          </span>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="All">{t('filterAllCats', currentLanguage)}</option>
            <option value="Roads & Infrastructure">{locCategory('Roads & Infrastructure', currentLanguage)}</option>
            <option value="Water Supply">{locCategory('Water Supply', currentLanguage)}</option>
            <option value="Electricity">{locCategory('Electricity', currentLanguage)}</option>
            <option value="Waste Management">{locCategory('Waste Management', currentLanguage)}</option>
            <option value="Sanitation">{locCategory('Sanitation', currentLanguage)}</option>
            <option value="Street Lighting">{locCategory('Street Lighting', currentLanguage)}</option>
            <option value="Drainage">{locCategory('Drainage', currentLanguage)}</option>
            <option value="Public Health">{locCategory('Public Health', currentLanguage)}</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="All">{t('priority', currentLanguage)} (All)</option>
            <option value="HIGH">{locPriority('HIGH', currentLanguage)}</option>
            <option value="MEDIUM">{locPriority('MEDIUM', currentLanguage)}</option>
            <option value="LOW">{locPriority('LOW', currentLanguage)}</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="All">{t('filterAllStatuses', currentLanguage)}</option>
            <option value="In Progress">{locStatus('In Progress', currentLanguage)}</option>
            <option value="Assigned">{locStatus('Assigned', currentLanguage)}</option>
            <option value="Submitted">{locStatus('Submitted', currentLanguage)}</option>
            <option value="Resolved">{locStatus('Resolved', currentLanguage)}</option>
          </select>

          {(selectedCategory !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPriority('All');
                setSelectedStatus('All');
              }}
              className="text-[11px] text-blue-700 font-bold hover:underline ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Map Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Simulated GIS Map Canvas */}
        <div className="lg:col-span-2 relative min-h-[520px] bg-[#0b2545] rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          
          {/* Map Layer Overlay Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:24px_24px] opacity-80" />
          
          {/* Stylized Ward Boundaries & Roads Simulation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            {/* Outer Ring Road */}
            <path d="M 50 150 Q 250 80 500 120 T 800 250 T 600 450 T 200 400 Z" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 4" />
            {/* Major Arterial Roads */}
            <path d="M 0 250 L 900 250" fill="none" stroke="#1d4ed8" strokeWidth="2" />
            <path d="M 450 0 L 450 600" fill="none" stroke="#1d4ed8" strokeWidth="2" />
            <path d="M 150 100 L 750 500" fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
            <path d="M 150 500 L 750 100" fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
          </svg>

          {/* Map Watermark & Controls */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-slate-200 px-3.5 py-1.5 rounded-lg text-xs text-slate-800 shadow-sm flex items-center gap-2 font-bold">
            <Compass className="w-4 h-4 text-blue-700" />
            <span>Bengaluru Metro Region (BBMP Wards {locNum('01-198', currentLanguage)})</span>
          </div>

          <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm border border-slate-200 p-2.5 rounded-lg text-[10px] space-y-1.5 shadow-sm text-slate-700 font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>{locPriority('HIGH', currentLanguage)} ({locNum(48, currentLanguage)} {t('hours', currentLanguage)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{locPriority('MEDIUM', currentLanguage)} ({locNum(5, currentLanguage)} {t('days', currentLanguage)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>{locPriority('LOW', currentLanguage)} ({locNum(10, currentLanguage)} {t('days', currentLanguage)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>{locStatus('Resolved', currentLanguage)}</span>
            </div>
          </div>

          {/* Interactive Grievance Pin Markers */}
          <div className="relative flex-1 w-full h-full">
            {filteredComplaints.map((c) => {
              const pos = getPositionPercent(c.location.latitude, c.location.longitude);
              const isSelected = selectedComplaint?.id === c.id;
              const isResolved = c.status === 'Resolved';
              const isHigh = c.priority === 'HIGH';

              return (
                <div
                  key={c.id}
                  style={{ left: pos.left, top: pos.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                  onClick={() => setSelectedComplaint(c)}
                >
                  {/* Pulse ring for high priority or selected */}
                  {(isSelected || isHigh) && !isResolved && (
                    <span className="absolute -inset-2 rounded-full bg-rose-400/50 animate-ping" />
                  )}

                  {/* Marker Pin Head */}
                  <div
                    className={`relative p-1.5 rounded-full border-2 shadow-md transition-transform hover:scale-125 flex items-center justify-center ${
                      isResolved
                        ? 'bg-emerald-600 border-white text-white'
                        : isHigh
                        ? 'bg-rose-600 border-white text-white'
                        : c.priority === 'MEDIUM'
                        ? 'bg-amber-500 border-white text-white'
                        : 'bg-blue-600 border-white text-white'
                    } ${isSelected ? 'scale-125 ring-4 ring-white/60' : ''}`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>

                  {/* Marker Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                    <div className="bg-white border border-slate-200 text-slate-900 font-bold text-[11px] py-1.5 px-2.5 rounded-lg shadow-xl whitespace-nowrap">
                      <strong className="text-blue-900">{localizeDigitsInString(c.complaintNumber, currentLanguage)}</strong> • {locCategory(c.category, currentLanguage)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Bar */}
          <div className="p-3 bg-white/95 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between z-10 font-medium">
            <span>{t('searchPlaceholder', currentLanguage)}</span>
            <span className="text-[11px] font-mono text-slate-500">Live GPS Coordinates Synced</span>
          </div>

        </div>

        {/* Selected Incident Sidebar */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
            <span>{t('viewDetails', currentLanguage)}</span>
            {selectedComplaint && (
              <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                #{localizeDigitsInString(selectedComplaint.complaintNumber, currentLanguage)}
              </span>
            )}
          </div>

          {selectedComplaint ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{locCategory(selectedComplaint.category, currentLanguage)}</h3>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">{locDepartment(selectedComplaint.department, currentLanguage)}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    selectedComplaint.status === 'Resolved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : selectedComplaint.priority === 'HIGH'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {locStatus(selectedComplaint.status, currentLanguage)}
                </span>
              </div>

              {/* Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                  {t('aiSummary', currentLanguage)}:
                </span>
                {localizeDigitsInString(selectedComplaint.aiSummary || selectedComplaint.description, currentLanguage)}
              </div>

              {/* Location & Priority */}
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">{localizeDigitsInString(selectedComplaint.location.address, currentLanguage)}</span>
                    <span className="text-[11px] text-slate-500 block">{localizeDigitsInString(selectedComplaint.location.ward || 'Central Ward', currentLanguage)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                  <span className="text-slate-500 font-medium">{t('priority', currentLanguage)}:</span>
                  <span className="font-bold text-slate-900">{locPriority(selectedComplaint.priority, currentLanguage)} ({locNum(selectedComplaint.slaHours, currentLanguage)} {t('hours', currentLanguage)})</span>
                </div>
              </div>

              {/* Evidence Photo Preview */}
              {selectedComplaint.attachments.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600">{t('evidencePhoto', currentLanguage)}:</span>
                  <div className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={selectedComplaint.attachments[0].fileUrl}
                      alt="Evidence"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectComplaint(selectedComplaint)}
                  className="w-full py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('viewDetails', currentLanguage)}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs shadow-2xs">
              {t('searchPlaceholder', currentLanguage)}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
